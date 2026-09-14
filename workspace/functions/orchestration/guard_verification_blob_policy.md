---
id: "fn:orchestration.guard_verification_blob_policy()"
kind: function
schema: orchestration
name: guard_verification_blob_policy
domain: orchestration-ledger
overloads: ["fn:orchestration.guard_verification_blob_policy()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [artifact blob policy mismatch]
touches: { reads: [orchestration.artifact, orchestration.verification_artifact_metadata], writes: [] }
tokens: [orchestration, guard_verification_blob_policy, orchestration.guard_verification_blob_policy]
defined_in: ["20260914010000_artifact_logical_custody.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.guard_verification_blob_policy

Domain `orchestration-ledger`.

## guard_verification_blob_policy() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `artifact blob policy mismatch`.

Touches (best effort): reads [`orchestration.artifact`](../../relations/orchestration/artifact.md), [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes —; calls —.

Defined in: `20260914010000_artifact_logical_custody.sql`.
