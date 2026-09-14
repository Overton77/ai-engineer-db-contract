begin;
create extension if not exists pgtap with schema extensions;
set local search_path=public,extensions;
select plan(9);
select set_config('app.tenant_id','97000000-0000-4000-8000-000000000001',true);
insert into knowledge_service.recovery_case(tenant_id,case_id,initial_batch,authority_handle,authority_digest)
values(util.current_tenant_id(),'case',jsonb_build_object('tenantId',util.current_tenant_id(),'caseId','case'),'{}','sha256:'||repeat('a',64));
select throws_ok($q$update knowledge_service.recovery_case set initial_batch='{}' where case_id='case'$q$,'23514','recovery original authority is immutable','original denominator cannot be rewritten');
select throws_ok($q$insert into knowledge_service.recovery_case(tenant_id,case_id,initial_batch,authority_handle,authority_digest) values(util.current_tenant_id(),'missing','{}','{}','sha256:'||repeat('a',64))$q$,'23514',null,'NULL JSON identity cannot bypass tenant binding');
insert into knowledge_service.operation(id,tenant_id,operation_kind,idempotency_key,correlation_id,actor_identity,request,request_sha256)
values('97000000-0000-4000-8000-000000000002',util.current_tenant_id(),'recovery_fixture','original','97000000-0000-4000-8000-000000000002','fixture','{}',repeat('b',64));
insert into knowledge_service.recovery_original(tenant_id,case_id,original_id,original_operation_id,original_input_digest,used_rounds,attempted_input_digests)
values(util.current_tenant_id(),'case','original','97000000-0000-4000-8000-000000000002','sha256:'||repeat('b',64),1,'["prior"]');
select throws_ok($q$update knowledge_service.recovery_original set used_rounds=0 where case_id='case'$q$,'23514','recovery original counters cannot reset','rounds survive restart and regrouping');
select throws_ok($q$update knowledge_service.recovery_original set attempted_input_digests='[]' where case_id='case'$q$,'23514','recovery original counters cannot reset','attempt history cannot reset');
insert into knowledge_service.recovery_case(tenant_id,case_id,initial_batch,authority_handle,authority_digest)
values(util.current_tenant_id(),'other',jsonb_build_object('tenantId',util.current_tenant_id(),'caseId','other'),'{}','sha256:'||repeat('a',64));
select throws_ok($q$insert into knowledge_service.recovery_original(tenant_id,case_id,original_id,original_operation_id,original_input_digest,used_rounds) values(util.current_tenant_id(),'other','renamed','97000000-0000-4000-8000-000000000002','sha256:'||repeat('b',64),0)$q$,'23505',null,'new case cannot reset the same original');
insert into knowledge_service.recovery_execution(tenant_id,execution_id,case_id,original_id,plan_digest,repair_digest,input_digest,planned_operation_id,reservation_calls,reservation_cost_micros,state,authorization_token,claim_token,claim_fence)
values(util.current_tenant_id(),'97000000-0000-4000-8000-000000000003','case','original','sha256:'||repeat('c',64),'sha256:'||repeat('d',64),'sha256:'||repeat('e',64),'97000000-0000-4000-8000-000000000004',1,10,'authorized','97000000-0000-4000-8000-000000000005','97000000-0000-4000-8000-000000000006',1);
select throws_ok($q$update knowledge_service.recovery_execution set reservation_calls=0$q$,'23514','recovery execution authorization is immutable','reservation cannot disappear after worker death');
select throws_ok($q$update knowledge_service.recovery_execution set planned_operation_id='97000000-0000-4000-8000-000000000007'$q$,'23514','recovery execution authorization is immutable','operation identity cannot be replaced');
select throws_ok($q$delete from knowledge_service.recovery_original$q$,null,null,'original ledger cannot be deleted');
select throws_ok($q$insert into knowledge_service.recovery_revision(tenant_id,case_id,revision,kind,idempotency_key,artifact_id,artifact_handle,payload) values(util.current_tenant_id(),'case',2,'receipt','bad','97000000-0000-4000-8000-000000000099',jsonb_build_object('artifactId','97000000-0000-4000-8000-000000000099','tenantId',util.current_tenant_id()),'{}')$q$,'23514',null,'missing artifact cannot acknowledge durable receipt');
select * from finish();
rollback;
