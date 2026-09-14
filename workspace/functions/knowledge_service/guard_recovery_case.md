---
id: "fn:knowledge_service.guard_recovery_case()"
kind: function
schema: knowledge_service
name: guard_recovery_case
domain: knowledge-service-runtime
overloads: ["fn:knowledge_service.guard_recovery_case()"]
security: invoker
volatility: volatile
executors: []
raises: [recovery original authority is immutable]
touches: { reads: [], writes: [] }
tokens: [knowledge_service, guard_recovery_case, knowledge_service.guard_recovery_case]
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.guard_recovery_case

Domain `knowledge-service-runtime`.

## guard_recovery_case() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `recovery original authority is immutable`.

Defined in: `20260914010700_durable_verification_recovery.sql`.
