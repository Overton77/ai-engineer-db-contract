---
id: "fn:evidence.require_source_selection_decisions()"
kind: function
schema: evidence
name: require_source_selection_decisions
domain: evidence
overloads: ["fn:evidence.require_source_selection_decisions()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [selection revision requires at least one admitted decision]
touches: { reads: [evidence.source_result_selection], writes: [] }
tokens: [evidence, require_source_selection_decisions, evidence.require_source_selection_decisions]
defined_in: ["20260914010400_source_attempt_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.require_source_selection_decisions

Domain `evidence`.

## require_source_selection_decisions() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `selection revision requires at least one admitted decision`.

Touches (best effort): reads [`evidence.source_result_selection`](../../relations/evidence/source_result_selection.md); writes —; calls —.

Defined in: `20260914010400_source_attempt_recovery.sql`.
