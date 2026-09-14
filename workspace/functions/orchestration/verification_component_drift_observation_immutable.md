---
id: "fn:orchestration.verification_component_drift_observation_immutable()"
kind: function
schema: orchestration
name: verification_component_drift_observation_immutable
domain: orchestration-ledger
overloads: ["fn:orchestration.verification_component_drift_observation_immutable()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [component drift observations are immutable]
touches: { reads: [], writes: [] }
tokens: [orchestration, verification_component_drift_observation_immutable, orchestration.verification_component_drift_observation_immutable]
defined_in: ["20260908030000_verification_drift_revalidation_outbox.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.verification_component_drift_observation_immutable

Domain `orchestration-ledger`.

## verification_component_drift_observation_immutable() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `component drift observations are immutable`.

Defined in: `20260908030000_verification_drift_revalidation_outbox.sql`.
