---
id: "fn:orchestration.guard_structured_extraction_source_custody()"
kind: function
schema: orchestration
name: guard_structured_extraction_source_custody
domain: orchestration-ledger
overloads: ["fn:orchestration.guard_structured_extraction_source_custody()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [structured extraction typed source custody required]
touches: { reads: [orchestration.verification_structured_extraction_execution], writes: [] }
tokens: [orchestration, guard_structured_extraction_source_custody, orchestration.guard_structured_extraction_source_custody]
defined_in: ["20260906032000_verification_structured_extraction_source_custody.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.guard_structured_extraction_source_custody

Domain `orchestration-ledger`.

## guard_structured_extraction_source_custody() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `structured extraction typed source custody required`.

Touches (best effort): reads [`orchestration.verification_structured_extraction_execution`](../../relations/orchestration/verification_structured_extraction_execution.md); writes —; calls [`orchestration.verification_artifact_is_admitted`](verification_artifact_is_admitted.md).

Defined in: `20260906032000_verification_structured_extraction_source_custody.sql`.
