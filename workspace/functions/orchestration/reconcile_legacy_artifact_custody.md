---
id: "fn:orchestration.reconcile_legacy_artifact_custody(uuid,text,int8,text,uuid)"
kind: function
schema: orchestration
name: reconcile_legacy_artifact_custody
domain: orchestration-ledger
overloads: ["fn:orchestration.reconcile_legacy_artifact_custody(uuid,text,int8,text,uuid)"]
security: definer
volatility: volatile
executors: [executor_service, service_role]
raises: [artifact reconciliation identity mismatch, artifact reconciliation state invalid, artifact tenant mismatch]
touches: { reads: [], writes: [orchestration.artifact] }
tokens: [orchestration, reconcile_legacy_artifact_custody, orchestration.reconcile_legacy_artifact_custody]
defined_in: ["20260914010300_receipt_custody_reconciliation.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.reconcile_legacy_artifact_custody

Domain `orchestration-ledger`.

## reconcile_legacy_artifact_custody(uuid, text, bigint, text, uuid) → void

function, volatile, security definer, language plpgsql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_id` | `uuid` | — | — |
| `p_sha256` | `text` | — | — |
| `p_size` | `bigint` | — | — |
| `p_bucket` | `text` | — | — |
| `p_tenant` | `uuid` | — | — |

Execute: `executor_service`, `service_role`.

Raises (mechanically extracted): `artifact reconciliation identity mismatch`; `artifact reconciliation state invalid`; `artifact tenant mismatch`.

Touches (best effort): reads —; writes [`orchestration.artifact`](../../relations/orchestration/artifact.md); calls [`util.current_tenant_id`](../util/current_tenant_id.md).

TypeScript: `Database["orchestration"]["Functions"]["reconcile_legacy_artifact_custody"]`.

Defined in: `20260914010300_receipt_custody_reconciliation.sql`.
