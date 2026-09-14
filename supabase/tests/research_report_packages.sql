begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select plan(29);
grant usage on schema extensions to app_reader;
set local app.tenant_id='93000000-0000-7000-8000-000000000001';

insert into orchestration.artifact(id,tenant_id,artifact_type,sha256,bucket_class,storage_bucket,object_path,media_type,size_bytes)
select ('93000000-0000-7000-8000-'||lpad(n::text,12,'0'))::uuid,
 '93000000-0000-7000-8000-000000000001',
 case n when 10 then 'research_report_structure' when 11 then 'research_report_manifest' else 'research_report_verification' end,
 lpad(n::text,64,'0'),'candidate','research-reports','report-package-test/'||n,'application/json',10
from generate_series(10,13) n;
insert into orchestration.artifact(id,tenant_id,artifact_type,sha256,bucket_class,storage_bucket,object_path,size_bytes,storage_state,available_at)
values ('93000000-0000-7000-8000-000000000014','93000000-0000-7000-8000-000000000001','research_report_verification',lpad('14',64,'0'),'candidate','research-reports','report-package-test/14',10,'pending',null);
insert into orchestration.artifact(id,tenant_id,artifact_type,sha256,bucket_class,storage_bucket,object_path,size_bytes,storage_state,available_at)
values ('93000000-0000-7000-8000-000000000015','93000000-0000-7000-8000-000000000001','research_report_verification',lpad('15',64,'0'),'candidate','research-reports','report-package-test/15',10,'pending',null);
insert into research.report(id,tenant_id,slug,title) values
 ('94000000-0000-7000-8000-000000000001','94000000-0000-7000-8000-000000000001','other-report','Other tenant');

set local role executor_service;
select lives_ok($q$insert into research.report(id,tenant_id,slug,title) values ('93000000-0000-7000-8000-000000000020','93000000-0000-7000-8000-000000000001','report-package-test','Report package test')$q$,'bounded executor creates report identity');
select lives_ok($q$insert into research.report_version(id,report_id,version,markdown_artifact_id,json_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000020',1,'93000000-0000-7000-8000-000000000012','93000000-0000-7000-8000-000000000010')$q$,'legacy version insertion remains supported');
select is((select count(*) from research.report_package where report_version_id='93000000-0000-7000-8000-000000000030'),0::bigint,'legacy versions do not require package envelopes');
select is((select count(*) from research.report where id='94000000-0000-7000-8000-000000000001'),0::bigint,'bounded role cannot read another tenant report');
select throws_ok($q$insert into research.report_version(report_id,version) values ('94000000-0000-7000-8000-000000000001',1)$q$,'23503',null,'cross-tenant report-version parent rejected');
select lives_ok($q$insert into research.report_package(report_version_id,report_id,authoring_mode,title,scope,as_of,producer_identity,producer_version) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000020','incremental','Test report','{}',now(),'test-producer','1')$q$,'bounded executor registers incremental package');
select throws_ok($q$insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011')$q$,'23514','REPORT_REQUIRED_ARTIFACTS_MISSING','seal rejects missing required files');
insert into research.report_artifact(report_version_id,artifact_id,role) values
 ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000010','structure'),
 ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011','manifest'),
 ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000012','markdown');
select throws_ok($q$
 insert into research.report_artifact(report_version_id,artifact_id,role) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000014','input');
 insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011');
$q$,'23514','REPORT_ARTIFACT_UNAVAILABLE','seal rejects pending package artifacts');
select throws_ok($q$insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000013')$q$,'23514','REPORT_MANIFEST_MISMATCH','seal binds the exact manifest');
select throws_ok($q$insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011')$q$,'23514','REPORT_SECTIONS_MISSING','seal requires readable sections');
insert into research.report_section(id,report_id,section_key) values ('93000000-0000-7000-8000-000000000040','93000000-0000-7000-8000-000000000020','findings');
insert into research.report_section_version(report_id,report_version_id,section_id,ordinal,heading,section_kind,content_pointer) values ('93000000-0000-7000-8000-000000000020','93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000040',0,'Findings','finding','/sections/0');
insert into research.report_assertion(id,report_version_id,section_id,assertion_key,statement_kind,proposition,artifact_id,start_utf16,end_utf16,block_pointer) values ('93000000-0000-7000-8000-000000000050','93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000040','a1','reported','A scoped finding.','93000000-0000-7000-8000-000000000012',0,10,'/sections/0/blocks/0');
select throws_ok($q$insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011')$q$,'23514','REPORT_ASSERTION_BINDING_MISSING','factual assertions require claim support');
insert into research.report_assertion_claim(report_version_id,assertion_id,run_id,claim_key,claim_digest,evidence_manifest_artifact_id,role) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000050','run-1','claim-1',repeat('a',64),'93000000-0000-7000-8000-000000000014','supports');
select throws_ok($q$insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011')$q$,'23514','REPORT_EVIDENCE_MANIFEST_UNAVAILABLE','pending evidence cannot be sealed');
reset role;
update orchestration.artifact set storage_state='available',available_at=now() where id='93000000-0000-7000-8000-000000000014';
select throws_ok($q$update research.report_section_version set heading='Rewritten' where report_version_id='93000000-0000-7000-8000-000000000030'$q$,'23001',null,'immutable section projection rejects owner update');
set local role executor_service;
select throws_ok($q$
 insert into research.report_question(report_version_id,question_key,question,coverage,explanation) values ('93000000-0000-7000-8000-000000000030','unmapped','Answered without section','answered','');
 insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011');
$q$,'23514','REPORT_QUESTION_SECTION_MISSING','answered question must identify answering sections');
select lives_ok($q$
 insert into research.report_version(id,report_id,version) values ('93000000-0000-7000-8000-000000000031','93000000-0000-7000-8000-000000000020',2);
 insert into research.report_package(report_version_id,report_id,predecessor_version_id,authoring_mode,title,scope,as_of,producer_identity,producer_version) values ('93000000-0000-7000-8000-000000000031','93000000-0000-7000-8000-000000000020','93000000-0000-7000-8000-000000000030','post_research','Follow-up report','{}',now(),'test-producer','1');
$q$,'post-research authoring uses the same versioned contract');
select throws_ok($q$
 insert into research.report_version(id,report_id,version) values ('93000000-0000-7000-8000-000000000032','93000000-0000-7000-8000-000000000020',3),('93000000-0000-7000-8000-000000000033','93000000-0000-7000-8000-000000000020',4);
 insert into research.report_package(report_version_id,report_id,predecessor_version_id,authoring_mode,title,scope,as_of,producer_identity,producer_version) values ('93000000-0000-7000-8000-000000000032','93000000-0000-7000-8000-000000000020','93000000-0000-7000-8000-000000000033','post_research','Invalid ancestry','{}',now(),'test-producer','1');
$q$,'23514','REPORT_PREDECESSOR_NOT_EARLIER','lineage rejects future predecessor versions');
select lives_ok($q$insert into research.report_package_seal(report_version_id,manifest_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000011')$q$,'bounded executor seals complete package');
select throws_ok($q$insert into research.report_question(report_version_id,question_key,question,coverage,explanation) values ('93000000-0000-7000-8000-000000000030','late','Late question','unanswered','Late insertion')$q$,'55000','REPORT_REVISION_SEALED','sealed coverage cannot be extended');
select throws_ok($q$insert into research.report_artifact(report_version_id,artifact_id,role) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000013','input')$q$,'55000','REPORT_REVISION_SEALED','sealed artifact manifest cannot be extended');
select throws_ok($q$insert into research.report_assertion_claim(report_version_id,assertion_id,run_id,claim_key,claim_digest,evidence_manifest_artifact_id,role) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000050','run-2','claim-2',repeat('b',64),'93000000-0000-7000-8000-000000000013','supports')$q$,'55000','REPORT_REVISION_SEALED','sealed claim bindings cannot be extended');
select throws_ok($q$insert into research.report_assessment(report_version_id,report_artifact_id,report_digest,result_artifact_id) values ('93000000-0000-7000-8000-000000000031','93000000-0000-7000-8000-000000000012',lpad('12',64,'0'),'93000000-0000-7000-8000-000000000013')$q$,'23514','REPORT_ASSESSMENT_REQUIRES_SEAL','assessment requires sealed revision');
select throws_ok($q$insert into research.report_assessment(report_version_id,report_artifact_id,report_digest,result_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000012',repeat('f',64),'93000000-0000-7000-8000-000000000013')$q$,'23514','REPORT_ASSESSMENT_DIGEST_MISMATCH','assessment rejects digest from different report bytes');
select throws_ok($q$insert into research.report_assessment(report_version_id,report_artifact_id,report_digest,result_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000012',lpad('12',64,'0'),'93000000-0000-7000-8000-000000000015')$q$,'23514','REPORT_ASSESSMENT_RESULT_UNAVAILABLE','assessment rejects pending verification result');
select lives_ok($q$insert into research.report_assessment(report_version_id,report_artifact_id,report_digest,result_artifact_id) values ('93000000-0000-7000-8000-000000000030','93000000-0000-7000-8000-000000000012',lpad('12',64,'0'),'93000000-0000-7000-8000-000000000013')$q$,'assessment appends after sealing without rewriting report content');
reset role;
select throws_ok($q$update research.report_assessment set report_digest=repeat('f',64) where report_version_id='93000000-0000-7000-8000-000000000030'$q$,'23001',null,'assessment is immutable even for owner');
select throws_ok($q$delete from research.report_package_seal where report_version_id='93000000-0000-7000-8000-000000000030'$q$,'23001',null,'owner cannot unseal registered revision');
select throws_ok($q$update research.report_version set version=2 where id='93000000-0000-7000-8000-000000000030'$q$,'23001',null,'legacy version immutability remains enforced');
set local role app_reader;
select is((select count(*) from research.report_package_seal where report_version_id='93000000-0000-7000-8000-000000000030'),1::bigint,'bounded reader resolves sealed report');
select throws_ok($q$insert into research.report_section(report_id,section_key) values ('93000000-0000-7000-8000-000000000020','reader-write')$q$,'42501',null,'reader cannot author report content');
reset role;
select * from finish();
rollback;

