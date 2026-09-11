-- Rollback-only hostile assertions for R2 (run after candidate DDL, then ROLLBACK).
do $$
begin
  begin
    insert into orchestration.verification_semantic_response_observation(tenant_id,provider_attempt_id,operation_id,operation_step_id,profile_artifact_id,profile_sha256,dispatch_fencing_token,blinded_input_artifact_id,blinded_input_sha256,request_artifact_id,request_sha256,raw_response_artifact_id,raw_response_sha256,observation_artifact_id,observation_sha256,requested_model,observed_model,model_status,revalidation_required,reported_cost_status) values(gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),repeat('a',64),1,gen_random_uuid(),repeat('b',64),gen_random_uuid(),repeat('c',64),gen_random_uuid(),repeat('d',64),gen_random_uuid(),repeat('e',64),'model',null,'matched',false,'unknown');
    raise exception 'matched-null unexpectedly accepted';
  exception when check_violation then null; end;
end $$;
-- Family rejection requires a real extraction lease/attempt fixture: execute the
-- observation insert with an extraction operation/step and assert the guard
-- raises check_violation before artifact registration. This remains pending
-- because no disposable extraction lease fixture is created by this bounded R2.
rollback;
