begin;
create extension if not exists pgtap with schema extensions;
select extensions.plan(23);

select extensions.has_table('evidence','verification_case_run','canonical verification case-run table exists');
select extensions.has_table('evidence','verification_case_evidence','canonical verification case-evidence table exists');
select extensions.trigger_is('evidence','verification_case_run','verification_case_run_immutable','util','reject_mutation','case runs are append-only');
select extensions.trigger_is('evidence','verification_case_evidence','verification_case_evidence_immutable','util','reject_mutation','case evidence is append-only');

insert into orchestration.mission(id,tenant_id,slug,goal) values
 ('89000000-0000-7000-8000-000000000001','89000000-0000-7000-8000-000000000010','case-evidence-read-test','contract fixture');
insert into orchestration.work_item(id,tenant_id,mission_id,kind,spec) values
 ('89000000-0000-7000-8000-000000000002','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000001','verify_claims','{}');
insert into orchestration.attempt(id,tenant_id,work_item_id,attempt_no,agent_deployment_id,started_at) values
 ('89000000-0000-7000-8000-000000000003','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000002',1,'case-evidence-producer',now()),
 ('89000000-0000-7000-8000-000000000004','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000002',2,'case-evidence-verifier',now());
insert into orchestration.mission(id,tenant_id,slug,goal) values
 ('89000000-0000-7000-8000-000000000011','89000000-0000-7000-8000-000000000020','case-evidence-read-test-foreign','contract fixture');
insert into orchestration.work_item(id,tenant_id,mission_id,kind,spec) values
 ('89000000-0000-7000-8000-000000000012','89000000-0000-7000-8000-000000000020','89000000-0000-7000-8000-000000000011','verify_claims','{}');
insert into orchestration.attempt(id,tenant_id,work_item_id,attempt_no,agent_deployment_id,started_at) values
 ('89000000-0000-7000-8000-000000000013','89000000-0000-7000-8000-000000000020','89000000-0000-7000-8000-000000000012',1,'case-evidence-foreign-producer',now()),
 ('89000000-0000-7000-8000-000000000014','89000000-0000-7000-8000-000000000020','89000000-0000-7000-8000-000000000012',2,'case-evidence-foreign-verifier',now());

insert into orchestration.artifact
 (id,tenant_id,artifact_type,sha256,bucket_class,storage_bucket,object_path,media_type,size_bytes,storage_state,available_at,verification_contract_version)
select id,tenant_id,artifact_type,sha256,'ledger','ai-engineer-cloud-bucket',tenant_id::text||'/'||left(sha256,2)||'/'||sha256,
 'application/json',1,storage_state,case when storage_state='available' then now() else null end,'verification.v1'
from (values
 ('89000000-0000-7000-8000-000000000101'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'verification_bundle',repeat('a',64),'available'),
 ('89000000-0000-7000-8000-000000000102'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'deterministic_verification_result',repeat('b',64),'available'),
 ('89000000-0000-7000-8000-000000000103'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'verification_policy',repeat('c',64),'available'),
 ('89000000-0000-7000-8000-000000000104'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'verification_run_manifest',repeat('d',64),'available'),
 ('89000000-0000-7000-8000-000000000105'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'source_capture',repeat('e',64),'available'),
 ('89000000-0000-7000-8000-000000000106'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'source_capture',repeat('f',64),'available'),
 ('89000000-0000-7000-8000-000000000107'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'source_capture',repeat('7',64),'pending'),
 ('89000000-0000-7000-8000-000000000108'::uuid,'89000000-0000-7000-8000-000000000010'::uuid,'source_capture',repeat('8',64),'available'),
 ('89000000-0000-7000-8000-000000000201'::uuid,'89000000-0000-7000-8000-000000000020'::uuid,'verification_bundle',repeat('1',64),'available'),
 ('89000000-0000-7000-8000-000000000202'::uuid,'89000000-0000-7000-8000-000000000020'::uuid,'deterministic_verification_result',repeat('2',64),'available'),
 ('89000000-0000-7000-8000-000000000203'::uuid,'89000000-0000-7000-8000-000000000020'::uuid,'verification_policy',repeat('3',64),'available'),
 ('89000000-0000-7000-8000-000000000204'::uuid,'89000000-0000-7000-8000-000000000020'::uuid,'verification_run_manifest',repeat('4',64),'available'),
 ('89000000-0000-7000-8000-000000000205'::uuid,'89000000-0000-7000-8000-000000000020'::uuid,'source_capture',repeat('5',64),'available')
) as fixture(id,tenant_id,artifact_type,sha256,storage_state);
insert into orchestration.verification_artifact_metadata
 (tenant_id,artifact_id,producer_activity_id,producer_version,encryption_class,retention_class,data_classification,parent_artifact_ids)
select tenant_id,id,'case-evidence-fixture','v1','managed','audit','restricted','{}'::uuid[]
from orchestration.artifact
where id in (
 '89000000-0000-7000-8000-000000000101','89000000-0000-7000-8000-000000000102',
 '89000000-0000-7000-8000-000000000103','89000000-0000-7000-8000-000000000104',
 '89000000-0000-7000-8000-000000000105','89000000-0000-7000-8000-000000000106',
 '89000000-0000-7000-8000-000000000107','89000000-0000-7000-8000-000000000201',
 '89000000-0000-7000-8000-000000000202','89000000-0000-7000-8000-000000000203',
 '89000000-0000-7000-8000-000000000204','89000000-0000-7000-8000-000000000205'
);

-- This v1 parent is inserted through its ordinary validator. Every artifact it
-- references is marked, metadata-backed, available, tenant-bound, and typed.
insert into evidence.verification_run
 (id,tenant_id,work_item_id,verifier_attempt_id,policy_version,started_at,ended_at,producer_attempt_id,mission_id,contract_version,bundle_artifact_id,deterministic_result_artifact_id,policy_artifact_id,policy_artifact_sha256,run_manifest_artifact_id,manifest_sha256,status)
 values
 ('89000000-0000-7000-8000-000000000301','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000002','89000000-0000-7000-8000-000000000004','case-evidence-policy',now(),now(),'89000000-0000-7000-8000-000000000003','89000000-0000-7000-8000-000000000001','verification.v1','89000000-0000-7000-8000-000000000101','89000000-0000-7000-8000-000000000102','89000000-0000-7000-8000-000000000103',repeat('c',64),'89000000-0000-7000-8000-000000000104',repeat('d',64),'succeeded'),
 ('89000000-0000-7000-8000-000000000302','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000002','89000000-0000-7000-8000-000000000004','legacy-case-evidence-policy',now(),null,null,null,null,null,null,null,null,null,null,null);
insert into evidence.verification_run
 (id,tenant_id,work_item_id,verifier_attempt_id,policy_version,started_at,ended_at,producer_attempt_id,mission_id,contract_version,bundle_artifact_id,deterministic_result_artifact_id,policy_artifact_id,policy_artifact_sha256,run_manifest_artifact_id,manifest_sha256,status)
 values
 ('89000000-0000-7000-8000-000000000303','89000000-0000-7000-8000-000000000020','89000000-0000-7000-8000-000000000012','89000000-0000-7000-8000-000000000014','case-evidence-foreign-policy',now(),now(),'89000000-0000-7000-8000-000000000013','89000000-0000-7000-8000-000000000011','verification.v1','89000000-0000-7000-8000-000000000201','89000000-0000-7000-8000-000000000202','89000000-0000-7000-8000-000000000203',repeat('3',64),'89000000-0000-7000-8000-000000000204',repeat('4',64),'succeeded');
insert into evidence.verification_case_run(id,tenant_id,verification_run_id,case_key,input_artifact_id,input_sha256,result_artifact_id,result_sha256)
 values('89000000-0000-7000-8000-000000000402','89000000-0000-7000-8000-000000000020','89000000-0000-7000-8000-000000000303','foreign-case-1','89000000-0000-7000-8000-000000000201',repeat('1',64),'89000000-0000-7000-8000-000000000202',repeat('2',64));
insert into evidence.verification_case_evidence(id,tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000502','89000000-0000-7000-8000-000000000020','89000000-0000-7000-8000-000000000402','foreign-source-0',0,'89000000-0000-7000-8000-000000000205',repeat('5',64));

select extensions.lives_ok($test$
 insert into evidence.verification_case_run(id,tenant_id,verification_run_id,case_key,input_artifact_id,input_sha256,result_artifact_id,result_sha256)
 values('89000000-0000-7000-8000-000000000401','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000301','case-1','89000000-0000-7000-8000-000000000101',repeat('a',64),'89000000-0000-7000-8000-000000000102',repeat('b',64))
$test$,'same-tenant verification.v1 run and admitted exact artifacts create a case run');
select extensions.lives_ok($test$
 insert into evidence.verification_case_evidence(id,tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000501','89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401','source-0',0,'89000000-0000-7000-8000-000000000105',repeat('e',64))
$test$,'artifact-only evidence creates with an admitted exact digest');
select extensions.throws_ok($test$
 insert into evidence.verification_case_run(tenant_id,verification_run_id,case_key,input_artifact_id,input_sha256,result_artifact_id,result_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000303','foreign-parent','89000000-0000-7000-8000-000000000101',repeat('a',64),'89000000-0000-7000-8000-000000000102',repeat('b',64))
$test$,'23503',null,'a verification case cannot bind a parent run from another tenant');
select extensions.throws_ok($test$
 insert into evidence.verification_case_evidence(tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401','foreign-artifact',1,'89000000-0000-7000-8000-000000000205',repeat('5',64))
$test$,'23503',null,'case evidence cannot bind an artifact from another tenant');
select extensions.throws_ok($test$
 insert into evidence.verification_case_run(tenant_id,verification_run_id,case_key,input_artifact_id,input_sha256,result_artifact_id,result_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000301','bad-input-digest','89000000-0000-7000-8000-000000000101',repeat('0',64),'89000000-0000-7000-8000-000000000102',repeat('b',64))
$test$,'23503',null,'case input digest drift is rejected');
select extensions.throws_ok($test$
 insert into evidence.verification_case_run(tenant_id,verification_run_id,case_key,input_artifact_id,input_sha256,result_artifact_id,result_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000302','legacy-parent','89000000-0000-7000-8000-000000000101',repeat('a',64),'89000000-0000-7000-8000-000000000102',repeat('b',64))
$test$,'23503',null,'legacy verification runs cannot parent canonical case runs');
select extensions.throws_ok($test$
 insert into evidence.verification_case_evidence(tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401','bad-evidence-digest',1,'89000000-0000-7000-8000-000000000105',repeat('0',64))
$test$,'23503',null,'case evidence digest drift is rejected');
select extensions.throws_ok($test$
 insert into evidence.verification_case_evidence(tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401','pending-evidence',1,'89000000-0000-7000-8000-000000000107',repeat('7',64))
$test$,'23503',null,'unavailable case evidence artifacts are rejected');
select extensions.throws_ok($test$
 insert into evidence.verification_case_evidence(tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401','metadata-free-evidence',1,'89000000-0000-7000-8000-000000000108',repeat('8',64))
$test$,'23503',null,'metadata-free case evidence artifacts are rejected');
select extensions.throws_ok($test$
 insert into evidence.verification_case_evidence(tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401','source-1',256,'89000000-0000-7000-8000-000000000106',repeat('f',64))
$test$,'23514',null,'evidence ordinal is bounded to the public 0 through 255 range');
select extensions.throws_ok($test$
 insert into evidence.verification_case_run(tenant_id,verification_run_id,case_key,input_artifact_id,input_sha256,result_artifact_id,result_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000301',repeat(' ',256),'89000000-0000-7000-8000-000000000101',repeat('a',64),'89000000-0000-7000-8000-000000000102',repeat('b',64))
$test$,'23514',null,'raw case keys are bounded even when whitespace surrounds the content');
select extensions.throws_ok($test$
 insert into evidence.verification_case_evidence(tenant_id,case_run_id,evidence_key,ordinal,artifact_id,artifact_sha256)
 values('89000000-0000-7000-8000-000000000010','89000000-0000-7000-8000-000000000401',repeat(' ',256),1,'89000000-0000-7000-8000-000000000106',repeat('f',64))
$test$,'23514',null,'raw evidence keys are bounded even when whitespace surrounds the content');
select extensions.throws_ok($test$
 update evidence.verification_case_run set case_key='tampered' where id='89000000-0000-7000-8000-000000000401'
$test$,null,null,'case runs are immutable');
select extensions.throws_ok($test$
 delete from evidence.verification_case_evidence where id='89000000-0000-7000-8000-000000000501'
$test$,null,null,'case evidence is immutable');

set local role app_reader;
select set_config('app.tenant_id','89000000-0000-7000-8000-000000000010',true);
select count(*) as own_case_count from evidence.verification_case_run where id='89000000-0000-7000-8000-000000000401' \gset
select count(*) as own_evidence_count from evidence.verification_case_evidence where id='89000000-0000-7000-8000-000000000501' \gset
select set_config('app.tenant_id','89000000-0000-7000-8000-000000000020',true);
select count(*) as foreign_case_count from evidence.verification_case_run where id='89000000-0000-7000-8000-000000000401' \gset
select count(*) as foreign_evidence_count from evidence.verification_case_evidence where id='89000000-0000-7000-8000-000000000501' \gset
select has_table_privilege(current_user,'evidence.verification_case_run','INSERT') as app_reader_case_insert \gset
reset role;
select extensions.is(:'own_case_count'::bigint,1::bigint,'app_reader sees its tenant case run under an explicit tenant context');
select extensions.is(:'own_evidence_count'::bigint,1::bigint,'app_reader sees its tenant case evidence under an explicit tenant context');
select extensions.is(:'foreign_case_count'::bigint,0::bigint,'app_reader cannot see a case run after switching to another tenant context');
select extensions.is(:'foreign_evidence_count'::bigint,0::bigint,'app_reader cannot see case evidence after switching to another tenant context');
select extensions.is(:'app_reader_case_insert'::boolean,false,'app_reader has no case-run insert privilege');

select * from extensions.finish();
rollback;




