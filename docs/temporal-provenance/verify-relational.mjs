import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
const require = createRequire(process.env.PGLITE_MODULE_ROOT
  ? join(process.env.PGLITE_MODULE_ROOT,'package.json') : import.meta.url);
const { PGlite }=require('@electric-sql/pglite');
const { btree_gist }=require('@electric-sql/pglite/contrib/btree_gist');
const db=new PGlite({extensions:{btree_gist}});
const tests=[];
const rows=async(sql,args=[]) => (await db.query(sql,args)).rows;
async function test(name,fn){ await fn(); tests.push({name,status:'passed'}); }
async function rejected(sql,pattern){
 await db.exec('begin'); let err;
 try {await db.exec(sql); await db.exec('set constraints all immediate');} catch(e){err=e;}
 finally {await db.exec('rollback');}
 assert.ok(err,'Expected SQL rejection'); assert.match(err.message,pattern);
}
const features=(date,k=4,plan='pro')=>rows('select * from industry_demo.features_at(1,1,$1,$2,$3)',[plan,date,k]);
const employment=k=>rows('select * from industry_demo.employment_history(1,1,$1)',[k]);
try{
 await db.exec("set timezone='UTC'");
 await db.exec(await readFile(new URL('./relational-prototype.sql',import.meta.url),'utf8'));
 await test('Consolidated schema and four sealed snapshots execute',async()=>assert.equal((await rows('select count(*)::int n from industry_demo.batch'))[0].n,4));
 await test('Employment initially has no known end',async()=>assert.equal((await employment(1))[0].known_end,null));
 await test('Later discovery admits a departure',async()=>assert.equal((await employment(3))[0].known_end.toISOString(),'2026-05-01T00:00:00.000Z'));
 await test('Date correction retains the same engagement identity',async()=>{
  const e=await employment(4); assert.equal(e[0].engagement_id,1);assert.equal(e[0].known_end.toISOString(),'2026-04-25T00:00:00.000Z');
 });
 await test('Rehire is a second engagement with a preserved gap',async()=>{
  const e=await employment(4);assert.equal(e.length,2);assert.equal(e[1].engagement_id,2);
  assert.equal(e[1].known_start.toISOString(),'2026-08-01T00:00:00.000Z');assert.ok(e[0].known_end<e[1].known_start);
 });
 await test('Contemporaneous knowledge does not see later rehire',async()=>assert.equal((await employment(3)).length,1));
 await test('Actual leave event has corrected occurrence at latest K',async()=>{
  const r=await rows("select occurred_at from industry_demo.event_delays(1,4) where kind='left'");
  assert.equal(r[0].occurred_at.toISOString(),'2026-04-25T00:00:00.000Z');
 });
 await test('Repo made-public and hosted release remain separate events',async()=>{
  const r=await rows("select kind,occurred_at from industry_demo.event_delays(1,4) where event_id in(4,5)");
  assert.deepEqual(r.map(x=>x.kind),['made_public','release_published']);assert.notEqual(r[0].occurred_at.getTime(),r[1].occurred_at.getTime());
 });
 await test('Repo archival becomes true at its exact half-open boundary',async()=>{
  const r=await rows(`select p.archived from industry_demo.segments_at(1,4) s join industry_demo.repo_archival_segment p on p.tenant_id=s.tenant_id and p.segment_id=s.id where s.valid_during @> '2026-06-01 00:00Z'::timestamptz`);
  assert.deepEqual(r,[{archived:true}]);
 });
 await test('Archival discovery delay uses event encounter, not repo discovery',async()=>{
  const r=await rows('select extract(epoch from encounter_delay)::float8 seconds from industry_demo.event_delays(1,4) where event_id=6');
  assert.equal(r[0].seconds,8*86400);
 });
 await test('Advance discovery has negative delay and explicit scheduled mode',async()=>{
  const r=(await rows('select extract(epoch from encounter_delay)::float8 seconds,occurrence_mode from industry_demo.event_delays(1,4) where event_id=7'))[0];
  assert.equal(r.seconds,-11*86400);assert.equal(r.occurrence_mode,'scheduled');
 });
 await test('Uncertain occurrence yields bounded delay and no fabricated scalar',async()=>{
  const r=(await rows(`select encounter_delay,extract(epoch from minimum_delay)::float8 lo,
   extract(epoch from maximum_delay)::float8 hi from industry_demo.event_delays(1,4) where event_id=8`))[0];
  assert.equal(r.encounter_delay,null);assert.equal(r.lo,4*86400+60);assert.equal(r.hi,9*86400+60);
 });
 await test('One year ago features use immutable initial specification',async()=>{
  assert.deepEqual(await features('2025-09-10'),[{feature_name:'Terminal edits',availability:'available',specification_revision_id:1}]);
 });
 await test('Six months ago features include revised spec and search',async()=>{
  const r=await features('2026-03-10');assert.deepEqual(r.map(x=>x.specification_revision_id),[2,3]);
 });
 await test('Two months ago features include third scoped capability',async()=>{
  const r=await features('2026-07-10');assert.equal(r.length,3);assert.ok(r.some(x=>x.feature_name==='Team sessions'));
 });
 await test('Older knowledge snapshot never leaks later feature admissions',async()=>assert.equal((await features('2026-07-10',1)).length,1));
 await test('Pro plan does not imply features in an unknown free-plan scope',async()=>assert.equal((await features('2026-07-10',4,'free')).length,0));
 await test('Historical support is admitted at old K and withdrawn at new K',async()=>{
  async function disposition(k){return (await rows(`select p.disposition from industry_demo.segments_at(1,$1) s
   join industry_demo.support_segment p on p.tenant_id=s.tenant_id and p.segment_id=s.id`,[k]))[0].disposition;}
  assert.equal(await disposition(3),'admitted');assert.equal(await disposition(4),'withdrawn');
 });
 await test('Old packet retains original publication and unchanged chunk after withdrawal',async()=>{
  const r=(await rows(`select r.publication_id,c.text_content from industry_demo.retrieval_run r
   join industry_demo.packet_member m on m.tenant_id=r.tenant_id and m.run_id=r.id
   join industry_demo.chunk c on c.tenant_id=m.tenant_id and c.id=m.chunk_id where r.id=1`))[0];
  assert.equal(r.publication_id,1);assert.equal(r.text_content,'The original wording remains unchanged.');
 });
 await test('Cross-tenant history query returns no foreign segments',async()=>assert.equal((await rows('select * from industry_demo.segments_at(2,4)')).length,0));
 await test('Old segment mutation is rejected',()=>rejected("update industry_demo.segment set valid_during='[2025-01-01,)' where id=1",/immutable prototype history/));
 await test('Captured chunk mutation is rejected',()=>rejected("update industry_demo.chunk set text_content='replacement' where id=1",/immutable prototype history/));
 await test('Adding segment to sealed revision is rejected',()=>rejected("insert into industry_demo.segment values(1,99,1,1,'engagement','[2020-01-01,2021-01-01)','accepted','explicit')",/sealed batch/));
 await test('Adding publication member after seal is rejected',()=>rejected('insert into industry_demo.publication_member values(1,1,2)',/publication sealed/));
 await test('Adding packet member after recorded run is rejected',()=>rejected('insert into industry_demo.packet_member values(1,1,2,2)',/packet sealed/));
 await test('A feature cannot belong to a different product by ID accident',()=>rejected(`insert into industry_demo.stream values(1,99,'product_feature');
 insert into industry_demo.feature_scope values(1,99,2,1,99,'product_feature','desktop','pro','US','stable')`,/foreign key constraint/));
 await test('A feature cannot borrow another feature specification',()=>rejected(`insert into industry_demo.revision values(1,99,4,'product_feature',5,8);
 insert into industry_demo.segment values(1,99,99,4,'product_feature','[2026-01-01,)','accepted','explicit');
 insert into industry_demo.feature_segment values(1,99,4,1,1,'product_feature','available',3)`,/foreign key constraint/));
 await test('Typed payload cannot be attached to the wrong stream kind',()=>rejected(`insert into industry_demo.revision values(1,99,1,'engagement',5,3);
 insert into industry_demo.segment values(1,99,99,1,'engagement','[2026-01-01,)','accepted','explicit');
 insert into industry_demo.repo_archival_segment values(1,99,1,1,'repo_archival',true)`,/foreign key constraint/));
 await test('Payload from another engagement cannot attach to valid segment',()=>rejected(`insert into industry_demo.revision values(1,99,1,'engagement',5,3);
 insert into industry_demo.segment values(1,99,99,1,'engagement','[2026-01-01,)','accepted','explicit');
 insert into industry_demo.engagement_segment values(1,99,1,2,'engagement','employee')`,/foreign key constraint/));
 await test('Missing typed payload prevents batch seal',()=>rejected(`insert into industry_demo.revision values(1,99,1,'engagement',5,3);
 insert into industry_demo.segment values(1,99,99,1,'engagement','[2026-01-01,)','accepted','explicit');
 insert into industry_demo.batch values(1,5,'2026-09-11','receipt:invalid')`,/typed payload missing/));
 await test('Overlapping states within one revision are rejected',()=>rejected(`insert into industry_demo.revision values(1,99,1,'engagement',5,3);
 insert into industry_demo.segment values(1,99,99,1,'engagement','[2026-01-01,)','accepted','explicit'),(1,100,99,1,'engagement','[2026-02-01,)','accepted','explicit')`,/exclusion constraint/));
 await test('An empty replacement does not revive old accepted segments',async()=>{
  await db.exec('begin');
  try{
   await db.exec("insert into industry_demo.revision values(1,99,7,'support',5,12); insert into industry_demo.batch values(1,5,'2026-09-11','receipt:withdraw-all')");
   assert.equal((await rows("select * from industry_demo.segments_at(1,5) where kind='support'")).length,0);
  assert.equal((await rows("select * from industry_demo.segments_at(1,4) where kind='support'")).length,1);
  }finally{await db.exec('rollback');}
 });
 await test('NULL stream cannot bypass composite foreign-key enforcement',()=>rejected(
  "insert into industry_demo.revision values(1,99,null,'engagement',5,null)",/not-null constraint/));
 await test('NULL relationship endpoint cannot bypass typed identity enforcement',()=>rejected(
  "insert into industry_demo.stream values(1,99,'engagement'); insert into industry_demo.engagement values(1,99,null,1,99,'engagement')",/not-null constraint/));
 const runtime=(await rows('select version() as version'))[0].version;
 const report={status:'passed',executedAt:new Date().toISOString(),runtime,package:'@electric-sql/pglite@0.5.8',testCount:tests.length,tests,
  limitations:['Fictional data and simplified identities','No full PG17/Supabase migration-chain proof','No concurrent writer, production RLS, authorization, idempotency or full evidence admission proof','Current queries assume validated snapshot and scope; absence requires API coverage/unknown response']};
 await writeFile(new URL('./relational-verification-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,testCount:report.testCount,runtime},null,2));
}catch(error){
 console.error(JSON.stringify({status:'failed',message:error.message,detail:error.detail,position:error.position,code:error.code,completedTests:tests.length},null,2));
 process.exitCode=1;
}finally{await db.close();}
