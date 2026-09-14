---
id: "rel:evidence.verification_adjudication_subject#details"
kind: details
schema: evidence
name: verification_adjudication_subject
of: "rel:evidence.verification_adjudication_subject"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_subject — details

Spill-over from [the main page](verification_adjudication_subject.md).

## Constraints
- PK (id)
- unique (tenant_id, request_operation_id)
- unique (tenant_id, id)
- check `verification_adjudication_su_recorded_policy_inputs_sha25_check`: `(recorded_policy_inputs_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_sub_deterministic_result_sha256_check`: `(deterministic_result_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_sub_run_manifest_payload_sha256_check`: `(run_manifest_payload_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subje_request_step_input_sha256_check`: `(request_step_input_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subjec_request_operation_sha256_check`: `(request_operation_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_audit_payload_sha256_check`: `(audit_payload_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_bundle_sha256_check`: `(bundle_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_check`: `((report_gate_artifact_id IS NULL) = (report_gate_sha256 IS NULL))`
- check `verification_adjudication_subject_check1`: `((run_kind = 'report'::text) = (report_gate_artifact_id IS NOT NULL))`
- check `verification_adjudication_subject_check2`: `((expires_at IS NULL) OR (expires_at > created_at))`
- check `verification_adjudication_subject_original_policy_outcome_check`: `(original_policy_outcome = ANY (ARRAY['pass'::text, 'pass_with_warnings'::text, 'review'::text, 'fail'::text, 'abstain'::text]))`
- check `verification_adjudication_subject_packet_sha256_check`: `(packet_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_policy_artifact_sha256_check`: `(policy_artifact_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_policy_decision_sha256_check`: `(policy_decision_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_quorum_required_check`: `((quorum_required > 0) AND (quorum_required <= 16))`
- check `verification_adjudication_subject_reason_check`: `(reason = ANY (ARRAY['ambiguous_evidence'::text, 'conflicting_evidence'::text, 'policy_review'::text, 'quality_failure'::text, 'appeal'::text]))`
- check `verification_adjudication_subject_report_gate_sha256_check`: `((report_gate_sha256 IS NULL) OR (report_gate_sha256 ~ '^[0-9a-f]{64}$'::text))`
- check `verification_adjudication_subject_request_fencing_token_check`: `(request_fencing_token > 0)`
- check `verification_adjudication_subject_request_payload_sha256_check`: `(request_payload_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_requester_actor_kind_check`: `(requester_actor_kind = ANY (ARRAY['human'::text, 'service'::text, 'model'::text]))`
- check `verification_adjudication_subject_requester_note_check`: `((requester_note IS NULL) OR (char_length(requester_note) <= 1000))`
- check `verification_adjudication_subject_run_kind_check`: `(run_kind = ANY (ARRAY['claims'::text, 'report'::text]))`
- check `verification_adjudication_subject_run_manifest_sha256_check`: `(run_manifest_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_adjudication_subject_target_id_check`: `((btrim(target_id) <> ''::text) AND (char_length(target_id) <= 255))`
- check `verification_adjudication_subject_target_kind_check`: `(target_kind = ANY (ARRAY['assertion'::text, 'evidence'::text, 'run'::text]))`
- check `verification_adjudication_subject_target_object_sha256_check`: `(target_object_sha256 ~ '^[0-9a-f]{64}$'::text)`

## Relationships

Outbound: `tenant_id,bundle_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,deterministic_result_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,packet_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,policy_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,policy_decision_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,recorded_policy_inputs_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,report_gate_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,request_operation_id` → [`knowledge_service.operation`](../knowledge_service/operation.md)`.tenant_id,id` on delete restrict; `tenant_id,run_manifest_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,verification_run_id` → [`evidence.verification_run`](verification_run.md)`.tenant_id,id` on delete restrict; `tenant_id,request_step_id` → [`knowledge_service.operation_step`](../knowledge_service/operation_step.md)`.tenant_id,id` on delete restrict.
Inbound: [`evidence.verification_adjudication_decision`](verification_adjudication_decision.md).subject_id, [`evidence.verification_adjudication_reviewer_grant`](verification_adjudication_reviewer_grant.md).subject_id.

## Indexes

| Index | Definition |
| --- | --- |
| `verification_adjudication_sub_tenant_id_request_operation_i_key` | `CREATE UNIQUE INDEX verification_adjudication_sub_tenant_id_request_operation_i_key ON evidence.verification_adjudication_subject USING btree (tenant_id, request_operation_id)` |
| `verification_adjudication_subject_queue_idx` | `CREATE INDEX verification_adjudication_subject_queue_idx ON evidence.verification_adjudication_subject USING btree (tenant_id, created_at) WHERE ((expires_at IS NULL) OR (expires_at > created_at))` |
| `verification_adjudication_subject_tenant_id_id_key` | `CREATE UNIQUE INDEX verification_adjudication_subject_tenant_id_id_key ON evidence.verification_adjudication_subject USING btree (tenant_id, id)` |

## Triggers

- `artifact_retirement_2de3da8e8158b8d1e0d723f2` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_2de3da8e8158b8d1e0d723f2 BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "recorded_policy_inputs_artifact_id", "parent": "id"}]')`
- `artifact_retirement_4532f2d0b69f63db33453db6` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_4532f2d0b69f63db33453db6 BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "packet_artifact_id", "parent": "id"}]')`
- `artifact_retirement_46b4994333d85dda47030e7f` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_46b4994333d85dda47030e7f BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "deterministic_result_artifact_id", "parent": "id"}]')`
- `artifact_retirement_7d8c87db0de37394f1e6c9c1` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_7d8c87db0de37394f1e6c9c1 BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "policy_decision_artifact_id", "parent": "id"}]')`
- `artifact_retirement_9fd542a3e897b0f457ef053f` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_9fd542a3e897b0f457ef053f BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "bundle_artifact_id", "parent": "id"}]')`
- `artifact_retirement_ab22d1fa548e5a9405dbcf8b` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_ab22d1fa548e5a9405dbcf8b BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "policy_artifact_id", "parent": "id"}]')`
- `artifact_retirement_b842420d35bd2faa48bfca97` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_b842420d35bd2faa48bfca97 BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "run_manifest_artifact_id", "parent": "id"}]')`
- `artifact_retirement_cb4b16ee6cc65fc2667d6c46` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_cb4b16ee6cc65fc2667d6c46 BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "report_gate_artifact_id", "parent": "id"}]')`
- `evidence_verification_adjudication_subject_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md): `CREATE TRIGGER evidence_verification_adjudication_subject_immutable BEFORE DELETE OR UPDATE ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION util.reject_mutation()`
- `verification_adjudication_subject_validate` → [`evidence.validate_verification_adjudication_subject`](../../functions/evidence/validate_verification_adjudication_subject.md): `CREATE TRIGGER verification_adjudication_subject_validate BEFORE INSERT ON evidence.verification_adjudication_subject FOR EACH ROW EXECUTE FUNCTION evidence.validate_verification_adjudication_subject()`

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `control_plane`, `executor_service`: using `(tenant_id = util.current_tenant_id())`; with check `(tenant_id = util.current_tenant_id())`
