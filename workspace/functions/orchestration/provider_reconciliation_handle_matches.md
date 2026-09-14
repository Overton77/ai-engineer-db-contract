---
id: "fn:orchestration.provider_reconciliation_handle_matches(uuid,jsonb)"
kind: function
schema: orchestration
name: provider_reconciliation_handle_matches
domain: orchestration-ledger
overloads: ["fn:orchestration.provider_reconciliation_handle_matches(uuid,jsonb)"]
security: invoker
volatility: stable
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: []
touches: { reads: [orchestration.artifact, orchestration.verification_artifact_metadata], writes: [] }
tokens: [orchestration, provider_reconciliation_handle_matches, orchestration.provider_reconciliation_handle_matches]
defined_in: ["20260906032800_verification_provider_reconciliation_ledger.sql", "20260914010000_artifact_logical_custody.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.provider_reconciliation_handle_matches

Domain `orchestration-ledger`.

## provider_reconciliation_handle_matches(uuid, jsonb) → boolean

function, stable, security invoker, language sql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `tenant` | `uuid` | — | — |
| `handle` | `jsonb` | — | — |

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Touches (best effort): reads [`orchestration.artifact`](../../relations/orchestration/artifact.md), [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes —; calls —.

TypeScript: `Database["orchestration"]["Functions"]["provider_reconciliation_handle_matches"]`.

Defined in: `20260906032800_verification_provider_reconciliation_ledger.sql`, `20260914010000_artifact_logical_custody.sql`.
