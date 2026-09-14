---
id: "fn:orchestration.publish_verification_component_drift_observation(uuid,text,text,uuid,uuid,text,uuid,uuid,text,text[],text)"
kind: function
schema: orchestration
name: publish_verification_component_drift_observation
domain: orchestration-ledger
overloads: ["fn:orchestration.publish_verification_component_drift_observation(uuid,text,text,uuid,uuid,text,uuid,uuid,text,text[],text)"]
security: definer
volatility: volatile
executors: [control_plane, executor_service, service_role]
raises: [component drift custody idempotency conflict, component drift dimensions are not canonical, component drift observation artifact lineage invalid, component drift outbox idempotency conflict, component drift signed run lineage invalid, invalid component drift publication input]
touches: { reads: [evidence.verification_run, knowledge_service.operation, orchestration.artifact, orchestration.artifact_lineage, orchestration.verification_artifact_metadata], writes: [orchestration.verification_component_drift_observation, orchestration.verification_drift_revalidation_outbox] }
tokens: [orchestration, publish_verification_component_drift_observation, orchestration.publish_verification_component_drift_observation]
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.publish_verification_component_drift_observation

Domain `orchestration-ledger`.

## publish_verification_component_drift_observation(uuid, text, text, uuid, uuid, text, uuid, uuid, text, text[], text) → boolean

function, volatile, security definer, language plpgsql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_observation` | `uuid` | — | — |
| `p_observation_sha256` | `text` | — | — |
| `p_payload_sha256` | `text` | — | — |
| `p_baseline_run` | `uuid` | — | — |
| `p_baseline_audit` | `uuid` | — | — |
| `p_baseline_audit_sha256` | `text` | — | — |
| `p_candidate_run` | `uuid` | — | — |
| `p_candidate_audit` | `uuid` | — | — |
| `p_candidate_audit_sha256` | `text` | — | — |
| `p_dimensions` | `text[]` | — | — |
| `p_idempotency` | `text` | — | — |

Execute: `control_plane`, `executor_service`, `service_role`.

Raises (mechanically extracted): `component drift custody idempotency conflict`; `component drift dimensions are not canonical`; `component drift observation artifact lineage invalid`; `component drift outbox idempotency conflict`; `component drift signed run lineage invalid`; `invalid component drift publication input`.

Touches (best effort): reads [`evidence.verification_run`](../../relations/evidence/verification_run.md), [`knowledge_service.operation`](../../relations/knowledge_service/operation.md), [`orchestration.artifact`](../../relations/orchestration/artifact.md), [`orchestration.artifact_lineage`](../../relations/orchestration/artifact_lineage.md), [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes [`orchestration.verification_component_drift_observation`](../../relations/orchestration/verification_component_drift_observation.md), [`orchestration.verification_drift_revalidation_outbox`](../../relations/orchestration/verification_drift_revalidation_outbox.md); calls [`orchestration.verification_artifact_is_admitted`](verification_artifact_is_admitted.md), [`util.current_tenant_id`](../util/current_tenant_id.md).

TypeScript: `Database["orchestration"]["Functions"]["publish_verification_component_drift_observation"]`.

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
