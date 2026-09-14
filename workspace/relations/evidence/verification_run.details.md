---
id: "rel:evidence.verification_run#details"
kind: details
schema: evidence
name: verification_run
of: "rel:evidence.verification_run"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_run — details

Spill-over from [the main page](verification_run.md).

## Relationships

Outbound: `tenant_id,bundle_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,run_manifest_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,policy_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,deterministic_result_artifact_id` → [`orchestration.artifact`](../orchestration/artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,mission_id` → [`orchestration.mission`](../orchestration/mission.md)`.tenant_id,id` on delete restrict; `tenant_id,operation_id` → [`knowledge_service.operation`](../knowledge_service/operation.md)`.tenant_id,id` on delete restrict; `tenant_id,producer_attempt_id` → [`orchestration.attempt`](../orchestration/attempt.md)`.tenant_id,id` on delete restrict; `verifier_attempt_id` → [`orchestration.attempt`](../orchestration/attempt.md)`.id` (+tenant); `work_item_id` → [`orchestration.work_item`](../orchestration/work_item.md)`.id` (+tenant).
Inbound: [`evidence.claim_evidence_assessment`](claim_evidence_assessment.md).run_id, [`evidence.claim_evidence_link`](claim_evidence_link.md).verified_by_run_id, [`evidence.verification_adjudication_subject`](verification_adjudication_subject.md).verification_run_id, [`evidence.verification_case_run`](verification_case_run.md).verification_run_id, [`evidence.verification_finding`](verification_finding.md).run_id, [`orchestration.verification_component_drift_observation`](../orchestration/verification_component_drift_observation.md).candidate_run_id|baseline_run_id, [`research.report_assessment`](../research/report_assessment.md).verification_run_id.

## Indexes

| Index | Definition |
| --- | --- |
| `verification_run_attempt_idx` | `CREATE INDEX verification_run_attempt_idx ON evidence.verification_run USING btree (verifier_attempt_id)` |
| `verification_run_tenant_id_uq` | `CREATE UNIQUE INDEX verification_run_tenant_id_uq ON evidence.verification_run USING btree (tenant_id, id)` |

## Triggers

- `artifact_retirement_3a11e5870245af56da41142e` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_3a11e5870245af56da41142e BEFORE INSERT OR UPDATE ON evidence.verification_run FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "deterministic_result_artifact_id", "parent": "id"}]')`
- `artifact_retirement_61294af1f424e16d1ededf5b` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_61294af1f424e16d1ededf5b BEFORE INSERT OR UPDATE ON evidence.verification_run FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "run_manifest_artifact_id", "parent": "id"}]')`
- `artifact_retirement_8c2f40673e0e177d06ff47e8` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_8c2f40673e0e177d06ff47e8 BEFORE INSERT OR UPDATE ON evidence.verification_run FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "policy_artifact_id", "parent": "id"}]')`
- `artifact_retirement_db5272a10a7e2f147377e35f` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_db5272a10a7e2f147377e35f BEFORE INSERT OR UPDATE ON evidence.verification_run FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "bundle_artifact_id", "parent": "id"}]')`
- `verification_run_identity_immutable` → [`evidence.enforce_verification_run_lifecycle`](../../functions/evidence/enforce_verification_run_lifecycle.md): `CREATE TRIGGER verification_run_identity_immutable BEFORE DELETE OR UPDATE ON evidence.verification_run FOR EACH ROW EXECUTE FUNCTION evidence.enforce_verification_run_lifecycle()`
- `verification_run_validate` → [`evidence.validate_verification_run`](../../functions/evidence/validate_verification_run.md): `CREATE TRIGGER verification_run_validate BEFORE INSERT ON evidence.verification_run FOR EACH ROW EXECUTE FUNCTION evidence.validate_verification_run()`

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: using `(tenant_id = util.current_tenant_id())`; with check `(tenant_id = util.current_tenant_id())`
