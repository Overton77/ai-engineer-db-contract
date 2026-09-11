// Isolated SQL proof. Requires @electric-sql/pglite@0.5.8.
// Install it outside the contract, then set PGLITE_MODULE_ROOT to that directory.
// No network access or database connection is made by this script.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(process.env.PGLITE_MODULE_ROOT
  ? join(process.env.PGLITE_MODULE_ROOT, 'package.json') : import.meta.url);
const { PGlite } = require('@electric-sql/pglite');
const { btree_gist } = require('@electric-sql/pglite/contrib/btree_gist');
const db = new PGlite({ extensions: { btree_gist } });
const results = [];
const tenant = '00000000-0000-0000-0000-000000000001';
const repo = '00000000-0000-0000-0000-000000000101';
const rows = async (sql, params = []) => (await db.query(sql, params)).rows;
async function test(name, action) {
  await action();
  results.push({ name, status: 'passed' });
}
async function rejects(sql, pattern) {
  await db.exec('begin');
  let error;
  try { await db.exec(sql); await db.exec('set constraints all immediate'); }
  catch (e) { error = e; }
  finally { await db.exec('rollback'); }
  assert.ok(error, 'Expected SQL rejection');
  assert.match(error.message, pattern);
}
async function state(world, k, evaluate = '2026-06-25T00:00:00Z', t = tenant) {
  return (await rows('select * from temporal_demo.repository_state($1,$2,$3,$4,$5)',
    [t, repo, world, k, evaluate]))[0];
}
try {
  await db.exec("set timezone='UTC'");
  await db.exec(await readFile(new URL('./prototype.sql', import.meta.url), 'utf8'));
  const version = (await rows('select version() as version'))[0].version;
  await test('Schema and all five admission batches execute', async () => {
    assert.equal((await rows('select count(*)::int as n from temporal_demo.knowledge_batch'))[0].n, 5);
  });
  await test('Before first admission the system knows no value', async () => {
    const s = await state('2026-06-04', 0); assert.equal(s.belief, 'unknown'); assert.equal(s.archived, null);
  });
  await test('K2: June 4 was believed unarchived', async () => assert.equal((await state('2026-06-04', 2)).archived, false));
  await test('K3: correction changes June 4 interpretation to archived', async () => assert.equal((await state('2026-06-04', 3)).archived, true));
  await test('K4: contradictory evidence produces disputed, not false', async () => {
    const s = await state('2026-06-04', 4); assert.equal(s.belief, 'disputed'); assert.equal(s.archived, null);
  });
  await test('K5: resolution restores an accepted value', async () => {
    const s = await state('2026-06-04', 5); assert.equal(s.belief, 'accepted'); assert.equal(s.archived, true);
  });
  await test('Half-open boundary belongs to the new state', async () => {
    assert.equal((await state('2026-06-03T00:00:00Z', 3)).archived, true);
    assert.equal((await state('2026-06-02T23:59:59.999999Z', 3)).archived, false);
  });
  await test('No evidence before world-valid start returns unknown', async () => {
    assert.equal((await state('2026-04-15', 5)).belief, 'unknown');
  });
  await test('Expired freshness does not change accepted truth value', async () => {
    const s = await state('2026-07-10', 5, '2026-07-10');
    assert.equal(s.freshness, 'stale'); assert.equal(s.belief, 'accepted'); assert.equal(s.archived, true);
  });
  await test('Freshness is evaluated with the supplied clock', async () => {
    assert.equal((await state('2026-06-25', 5, '2026-06-25')).freshness, 'fresh');
    assert.equal((await state('2026-06-25', 5, '2026-07-02')).freshness, 'stale');
  });
  await test('Timeline clips to requested time1/time2', async () => {
    const r = await rows(`select archived, lower(valid_during)::text as lo,
      upper(valid_during)::text as hi from temporal_demo.repository_timeline($1,$2,$3,3)`,
      [tenant,repo,'[2026-06-01 00:00Z,2026-06-08 00:00Z)']);
    assert.deepEqual(r.map(x=>x.archived),[false,true]);
    assert.match(r[0].lo,/2026-06-01/); assert.match(r[0].hi,/2026-06-03/);
    assert.match(r[1].lo,/2026-06-03/); assert.match(r[1].hi,/2026-06-08/);
  });
  await test('Timeline emits unknown uncovered interval', async () => {
    const r = await rows('select belief from temporal_demo.repository_timeline($1,$2,$3,3)',
      [tenant,repo,'[2026-04-25 00:00Z,2026-05-05 00:00Z)']);
    assert.deepEqual(r.map(x=>x.belief),['unknown','accepted']);
  });
  await test('Empty historical snapshot returns one unknown span', async () => {
    const r = await rows('select belief from temporal_demo.repository_timeline($1,$2,$3,0)',
      [tenant,repo,'[2026-06-01 00:00Z,2026-06-08 00:00Z)']);
    assert.deepEqual(r.map(x=>x.belief),['unknown']);
  });
  await test('Tenant-scoped reads cannot find another tenant repository', async () => {
    assert.equal((await state('2026-06-04',5,'2026-06-25','00000000-0000-0000-0000-000000000002')).belief,'unknown');
  });
  await test('Historical K2 interpretation survives every later change', async () => assert.equal((await state('2026-06-04',2)).archived,false));
  await test('Correction lineage references the precise earlier segment', async () => {
    const r = await rows(`select parent_seq::int, parent_segment_no, relation_kind
      from temporal_demo.segment_lineage where child_seq=3 and child_segment_no=2`);
    assert.deepEqual(r,[{parent_seq:2,parent_segment_no:2,relation_kind:'corrects'}]);
  });
  await test('Mutating old world intervals is rejected', () => rejects(
    "update temporal_demo.repository_archival_segment set valid_during='[2026-01-01,)' where knowledge_seq=2",/immutable history/));
  await test('Deleting an admission is rejected', () => rejects(
    'delete from temporal_demo.knowledge_batch where knowledge_seq=2',/immutable history/));
  await test('Late evidence attachment to a sealed revision is rejected', () => rejects(
    `insert into temporal_demo.segment_evidence values ('${tenant}','${repo}',1,1,2,'supports')`,/batch already sealed/));
  await test('Retroactive segment insertion in a sealed batch is rejected', () => rejects(
    `insert into temporal_demo.repository_archival_segment values ('${tenant}','${repo}',1,99,'[2026-01-01,2026-02-01)','accepted',false,'explicit_interval',null)`,/batch already sealed/));
  await test('Stale admission head requires rebase', () => rejects(
    "select temporal_demo.fixture_publish(2,'2026-06-30','knowledge_correction','[]')",/rebase_required/));
  const publish = segments => `select temporal_demo.fixture_publish(5,'2026-06-30','knowledge_correction','${JSON.stringify(segments)}'::jsonb)`;
  const segment = {during:'[2026-06-01,)',belief:'accepted',archived:true,evidence:[{id:5}]};
  await test('Overlapping canonical states in one revision are rejected', () => rejects(publish([segment,segment]),/exclusion constraint/));
  await test('Empty state intervals are rejected', () => rejects(publish([{...segment,during:'empty'}]),/check constraint/));
  await test('Accepted belief requires a typed value', () => rejects(publish([{...segment,archived:null}]),/check constraint/));
  await test('Disputed belief cannot masquerade as Boolean false', () => rejects(publish([{...segment,belief:'disputed',archived:false,basis:'unresolved'}]),/check constraint/));
  await test('Evidence-free fixture admission is rejected', () => rejects(publish([{...segment,evidence:[]}]),/evidence required/));
  await test('Failed admission leaves committed head unchanged', async () => {
    assert.equal((await rows(`select knowledge_seq::int as k from temporal_demo.knowledge_head where tenant_id=$1`,[tenant]))[0].k,5);
  });
  await test('Uncertain change boundary is preserved as a window', async () => {
    await db.exec(`insert into temporal_demo.temporal_extent
      (tenant_id,id,kind,start_window,precision,original_text)
      values ('${tenant}',20,'uncertain_interval','(2026-05-03 00:00Z,2026-05-09 00:00Z]','day','Changed between two observations')`);
    const r = (await rows('select valid_during,lower_inc(start_window) as lo,upper_inc(start_window) as hi from temporal_demo.temporal_extent where id=20'))[0];
    assert.equal(r.valid_during,null); assert.equal(r.lo,false); assert.equal(r.hi,true);
  });
  await test('Point observation has no fabricated world-valid interval', async () => {
    await db.exec(`insert into temporal_demo.temporal_extent
      (tenant_id,id,kind,observed_world_at,precision,original_text)
      values ('${tenant}',21,'point_observation','2026-05-03 12:00Z','instant','Observed at this instant')`);
    assert.equal((await rows('select valid_during from temporal_demo.temporal_extent where id=21'))[0].valid_during,null);
  });
  await test('Unknown temporal extent does not become an infinite range', async () => {
    await db.exec(`insert into temporal_demo.temporal_extent
      (tenant_id,id,kind,precision,original_text) values ('${tenant}',22,'unknown','unknown','Date not supplied')`);
    assert.equal((await rows('select valid_during from temporal_demo.temporal_extent where id=22'))[0].valid_during,null);
  });
  await test('Mixed exact and uncertain representations are rejected', () => rejects(
    `insert into temporal_demo.temporal_extent (tenant_id,id,kind,valid_during,start_window,precision,original_text)
     values ('${tenant}',23,'uncertain_interval','[2026-05-01,)','[2026-05-01,2026-06-01)','month','May')`,/check constraint/));
  await test('Tenant-composite FK rejects foreign entity references', () => rejects(
    `insert into temporal_demo.repository_archival_revision values
      ('00000000-0000-0000-0000-000000000002','${repo}',1,null)`,/foreign key constraint/));
  const output = { status:'passed', executedAt:new Date().toISOString(), runtime:version,
    runtimePackage:'@electric-sql/pglite@0.5.8', testCount:results.length, tests:results,
    limitations:['Not a production migration-chain test','No concurrent-client proof','No production RLS or ingestion-service proof'] };
  await writeFile(new URL('./verification-results.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
  console.log(JSON.stringify({status:output.status,testCount:output.testCount,runtime:version},null,2));
} finally { await db.close(); }
