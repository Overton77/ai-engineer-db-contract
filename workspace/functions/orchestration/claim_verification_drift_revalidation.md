---
id: "fn:orchestration.claim_verification_drift_revalidation(text,int4,int4)"
kind: function
schema: orchestration
name: claim_verification_drift_revalidation
domain: orchestration-ledger
overloads: ["fn:orchestration.claim_verification_drift_revalidation(text,int4,int4)"]
security: definer
volatility: volatile
executors: [control_plane, executor_service, service_role]
raises: [invalid drift outbox claim, valid app.tenant_id context is required]
touches: { reads: [], writes: [orchestration.verification_drift_revalidation_outbox] }
tokens: [orchestration, claim_verification_drift_revalidation, orchestration.claim_verification_drift_revalidation]
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.claim_verification_drift_revalidation

Domain `orchestration-ledger`.

## claim_verification_drift_revalidation(text, integer, integer) → SETOF orchestration.verification_drift_revalidation_outbox

function, volatile, security definer, language plpgsql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_owner` | `text` | — | — |
| `p_limit` | `integer` | `25` | — |
| `p_visibility_timeout_ms` | `integer` | `30000` | — |

Execute: `control_plane`, `executor_service`, `service_role`.

Raises (mechanically extracted): `invalid drift outbox claim`; `valid app.tenant_id context is required`.

Touches (best effort): reads —; writes [`orchestration.verification_drift_revalidation_outbox`](../../relations/orchestration/verification_drift_revalidation_outbox.md); calls [`util.current_tenant_id`](../util/current_tenant_id.md).

TypeScript: `Database["orchestration"]["Functions"]["claim_verification_drift_revalidation"]`.

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
