---
id: "fn:util.validate_predecessor()"
kind: function
schema: util
name: validate_predecessor
domain: api-surface
overloads: ["fn:util.validate_predecessor()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [supersession must point one-way to an older row, supersession predecessor must exist in the same tenant]
touches: { reads: [], writes: [] }
tokens: [util, validate_predecessor, util.validate_predecessor]
defined_in: ["20260903010200_knowledge_runtime_security.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# util.validate_predecessor

Domain `api-surface`.

## validate_predecessor() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `supersession must point one-way to an older row`; `supersession predecessor must exist in the same tenant`.

Defined in: `20260903010200_knowledge_runtime_security.sql`.
