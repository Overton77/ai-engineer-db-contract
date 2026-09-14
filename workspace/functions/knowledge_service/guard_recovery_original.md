---
id: "fn:knowledge_service.guard_recovery_original()"
kind: function
schema: knowledge_service
name: guard_recovery_original
domain: knowledge-service-runtime
overloads: ["fn:knowledge_service.guard_recovery_original()"]
security: invoker
volatility: volatile
executors: []
raises: [recovery original counters cannot reset]
touches: { reads: [], writes: [] }
tokens: [knowledge_service, guard_recovery_original, knowledge_service.guard_recovery_original]
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.guard_recovery_original

Domain `knowledge-service-runtime`.

## guard_recovery_original() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `recovery original counters cannot reset`.

Defined in: `20260914010700_durable_verification_recovery.sql`.
