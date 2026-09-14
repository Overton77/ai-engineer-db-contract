---
id: "fn:orchestration.plan_verification_drift_revalidation(uuid,text,uuid,text,text[],text,text)"
kind: function
schema: orchestration
name: plan_verification_drift_revalidation
domain: orchestration-ledger
overloads: ["fn:orchestration.plan_verification_drift_revalidation(uuid,text,uuid,text,text[],text,text)"]
security: definer
volatility: volatile
executors: [control_plane, executor_service, service_role]
raises: [drift plan observation lineage invalid, drift revalidation idempotency conflict, invalid drift plan input]
touches: { reads: [orchestration.verification_semantic_response_observation], writes: [orchestration.verification_drift_revalidation_outbox] }
tokens: [orchestration, plan_verification_drift_revalidation, orchestration.plan_verification_drift_revalidation]
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.plan_verification_drift_revalidation

Domain `orchestration-ledger`.

## plan_verification_drift_revalidation(uuid, text, uuid, text, text[], text, text) → boolean

function, volatile, security definer, language plpgsql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_observation` | `uuid` | — | — |
| `p_observation_sha256` | `text` | — | — |
| `p_source_operation` | `uuid` | — | — |
| `p_idempotency` | `text` | — | — |
| `p_dimensions` | `text[]` | — | — |
| `p_disposition` | `text` | — | — |
| `p_review_reason` | `text` | `NULL::text` | — |

Execute: `control_plane`, `executor_service`, `service_role`.

Raises (mechanically extracted): `drift plan observation lineage invalid`; `drift revalidation idempotency conflict`; `invalid drift plan input`.

Touches (best effort): reads [`orchestration.verification_semantic_response_observation`](../../relations/orchestration/verification_semantic_response_observation.md); writes [`orchestration.verification_drift_revalidation_outbox`](../../relations/orchestration/verification_drift_revalidation_outbox.md); calls [`util.current_tenant_id`](../util/current_tenant_id.md).

TypeScript: `Database["orchestration"]["Functions"]["plan_verification_drift_revalidation"]`.

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
