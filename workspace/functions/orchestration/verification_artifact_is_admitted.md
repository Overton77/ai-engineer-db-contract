---
id: "fn:orchestration.verification_artifact_is_admitted(uuid,uuid,text,text)"
kind: function
schema: orchestration
name: verification_artifact_is_admitted
domain: orchestration-ledger
overloads: ["fn:orchestration.verification_artifact_is_admitted(uuid,uuid,text,text)"]
security: invoker
volatility: stable
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: []
touches: { reads: [orchestration.artifact, orchestration.verification_artifact_metadata], writes: [] }
tokens: [orchestration, verification_artifact_is_admitted, orchestration.verification_artifact_is_admitted]
defined_in: ["20260906021000_verification_artifact_consumer_admission.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.verification_artifact_is_admitted

Domain `orchestration-ledger`.

## verification_artifact_is_admitted(uuid, uuid, text, text) → boolean

function, stable, security invoker, language sql, config `search_path=""`. True only for an available verification.v1 artifact with immutable same-tenant verification metadata and optional exact type/digest.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_tenant_id` | `uuid` | — | — |
| `p_artifact_id` | `uuid` | — | — |
| `p_artifact_type` | `text` | `NULL::text` | — |
| `p_sha256` | `text` | `NULL::text` | — |

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Touches (best effort): reads [`orchestration.artifact`](../../relations/orchestration/artifact.md), [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes —; calls —.

TypeScript: `Database["orchestration"]["Functions"]["verification_artifact_is_admitted"]`.

Defined in: `20260906021000_verification_artifact_consumer_admission.sql`.
