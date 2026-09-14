---
id: "fn:evidence.enforce_verification_run_lifecycle()"
kind: function
schema: evidence
name: enforce_verification_run_lifecycle
domain: evidence
overloads: ["fn:evidence.enforce_verification_run_lifecycle()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [legacy verification run permits only ended_at finalization, verification run permits one terminal status transition, verification runs are append-only]
touches: { reads: [], writes: [] }
tokens: [evidence, enforce_verification_run_lifecycle, evidence.enforce_verification_run_lifecycle]
defined_in: ["20260829195259_lock_verification_and_attempt_identity.sql", "20260905010000_verification_persistence_contract.sql", "20260905013000_verification_legacy_compatibility_and_isolation.sql", "20260905017000_verification_null_and_legacy_guards.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.enforce_verification_run_lifecycle

Domain `evidence`.

## enforce_verification_run_lifecycle() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`. Makes verifier identity/policy immutable and permits exactly one completion timestamp transition.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `legacy verification run permits only ended_at finalization`; `verification run permits one terminal status transition`; `verification runs are append-only`.

Defined in: `20260829195259_lock_verification_and_attempt_identity.sql`, `20260905010000_verification_persistence_contract.sql`, `20260905013000_verification_legacy_compatibility_and_isolation.sql`, `20260905017000_verification_null_and_legacy_guards.sql`.
