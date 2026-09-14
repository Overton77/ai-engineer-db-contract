---
id: "fn:orchestration.ack_verification_drift_revalidation(uuid,text,uuid)"
kind: function
schema: orchestration
name: ack_verification_drift_revalidation
domain: orchestration-ledger
overloads: ["fn:orchestration.ack_verification_drift_revalidation(uuid,text,uuid)"]
security: definer
volatility: volatile
executors: [control_plane, executor_service, service_role]
raises: [invalid drift outbox acknowledgement, stale or foreign drift outbox claim]
touches: { reads: [], writes: [orchestration.verification_drift_revalidation_outbox] }
tokens: [orchestration, ack_verification_drift_revalidation, orchestration.ack_verification_drift_revalidation]
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.ack_verification_drift_revalidation

Domain `orchestration-ledger`.

## ack_verification_drift_revalidation(uuid, text, uuid) → boolean

function, volatile, security definer, language plpgsql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_id` | `uuid` | — | — |
| `p_owner` | `text` | — | — |
| `p_token` | `uuid` | — | — |

Execute: `control_plane`, `executor_service`, `service_role`.

Raises (mechanically extracted): `invalid drift outbox acknowledgement`; `stale or foreign drift outbox claim`.

Touches (best effort): reads —; writes [`orchestration.verification_drift_revalidation_outbox`](../../relations/orchestration/verification_drift_revalidation_outbox.md); calls [`util.current_tenant_id`](../util/current_tenant_id.md).

TypeScript: `Database["orchestration"]["Functions"]["ack_verification_drift_revalidation"]`.

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
