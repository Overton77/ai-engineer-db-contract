---
id: "fn:util.uuidv7()"
kind: function
schema: util
name: uuidv7
domain: api-surface
overloads: ["fn:util.uuidv7()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: []
touches: { reads: [], writes: [] }
tokens: [util, uuidv7, util.uuidv7]
defined_in: ["20260826000100_foundation.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# util.uuidv7

Domain `api-surface`.

## uuidv7() → uuid

function, volatile, security invoker, language sql, config `search_path=""`. Time-ordered UUID v7. Replace with the built-in uuidv7() on PostgreSQL 18+.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

TypeScript: `Database["util"]["Functions"]["uuidv7"]`.

Defined in: `20260826000100_foundation.sql`.
