---
id: "fn:orchestration.verification_provider_budget_guard()"
kind: function
schema: orchestration
name: verification_provider_budget_guard
domain: orchestration-ledger
overloads: ["fn:orchestration.verification_provider_budget_guard()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [verification provider budget immutable identity, verification provider budgets are append-only]
touches: { reads: [], writes: [] }
tokens: [orchestration, verification_provider_budget_guard, orchestration.verification_provider_budget_guard]
defined_in: ["20260906012000_harden_verification_provider_accounting.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.verification_provider_budget_guard

Domain `orchestration-ledger`.

## verification_provider_budget_guard() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `verification provider budget immutable identity`; `verification provider budgets are append-only`.

Defined in: `20260906012000_harden_verification_provider_accounting.sql`.
