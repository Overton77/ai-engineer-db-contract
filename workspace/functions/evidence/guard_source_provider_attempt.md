---
id: "fn:evidence.guard_source_provider_attempt()"
kind: function
schema: evidence
name: guard_source_provider_attempt
domain: evidence
overloads: ["fn:evidence.guard_source_provider_attempt()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [original source dispatch is immutable, source provider attempt identity is immutable, source provider attempt terminal state is immutable, source provider attempts are retained]
touches: { reads: [], writes: [] }
tokens: [evidence, guard_source_provider_attempt, evidence.guard_source_provider_attempt]
defined_in: ["20260914010200_source_attempt_accounting.sql", "20260914010400_source_attempt_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.guard_source_provider_attempt

Domain `evidence`.

## guard_source_provider_attempt() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `original source dispatch is immutable`; `source provider attempt identity is immutable`; `source provider attempt terminal state is immutable`; `source provider attempts are retained`.

Defined in: `20260914010200_source_attempt_accounting.sql`, `20260914010400_source_attempt_recovery.sql`.
