---
id: "rel:evidence.verification_adjudication_decision#details"
kind: details
schema: evidence
name: verification_adjudication_decision
of: "rel:evidence.verification_adjudication_decision"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_decision — details

Spill-over from [the main page](verification_adjudication_decision.md).

## Relationships

Outbound: `tenant_id,decision_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,decision_operation_id` → [`knowledge_service.operation`](../knowledge_service/operation.md)`.tenant_id,id` on delete restrict; `tenant_id,packet_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,decision_step_id` → [`knowledge_service.operation_step`](../knowledge_service/operation_step.md)`.tenant_id,id` on delete restrict; `tenant_id,subject_id` → [`evidence.verification_adjudication_subject`](verification_adjudication_subject.md)`.tenant_id,id` on delete restrict.
Inbound: none.

## Indexes

| Index | Definition |
| --- | --- |
| `verification_adjudication_dec_tenant_id_decision_operation__key` | `CREATE UNIQUE INDEX verification_adjudication_dec_tenant_id_decision_operation__key ON evidence.verification_adjudication_decision USING btree (tenant_id, decision_operation_id)` |
| `verification_adjudication_dec_tenant_id_subject_id_reviewer_key` | `CREATE UNIQUE INDEX verification_adjudication_dec_tenant_id_subject_id_reviewer_key ON evidence.verification_adjudication_decision USING btree (tenant_id, subject_id, reviewer_actor_id)` |
| `verification_adjudication_decision_subject_idx` | `CREATE INDEX verification_adjudication_decision_subject_idx ON evidence.verification_adjudication_decision USING btree (tenant_id, subject_id, created_at)` |
| `verification_adjudication_decision_tenant_id_id_key` | `CREATE UNIQUE INDEX verification_adjudication_decision_tenant_id_id_key ON evidence.verification_adjudication_decision USING btree (tenant_id, id)` |

## Triggers

- `artifact_retirement_2c21d61ad3d11fd7870ee592` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_2c21d61ad3d11fd7870ee592 BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_decision FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "decision_artifact_id", "parent": "id"}]')`
- `artifact_retirement_fed2c3515c601fca0e64a0cc` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_fed2c3515c601fca0e64a0cc BEFORE INSERT OR UPDATE ON evidence.verification_adjudication_decision FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "packet_artifact_id", "parent": "id"}]')`
- `evidence_verification_adjudication_decision_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md): `CREATE TRIGGER evidence_verification_adjudication_decision_immutable BEFORE DELETE OR UPDATE ON evidence.verification_adjudication_decision FOR EACH ROW EXECUTE FUNCTION util.reject_mutation()`
- `verification_adjudication_decision_validate` → [`evidence.validate_verification_adjudication_decision`](../../functions/evidence/validate_verification_adjudication_decision.md): `CREATE TRIGGER verification_adjudication_decision_validate BEFORE INSERT ON evidence.verification_adjudication_decision FOR EACH ROW EXECUTE FUNCTION evidence.validate_verification_adjudication_decision()`

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `control_plane`, `executor_service`: using `(tenant_id = util.current_tenant_id())`; with check `(tenant_id = util.current_tenant_id())`
