---
id: "fn:orchestration.guard_structured_extraction_terminal_commit()"
kind: function
schema: orchestration
name: guard_structured_extraction_terminal_commit
domain: orchestration-ledger
overloads: ["fn:orchestration.guard_structured_extraction_terminal_commit()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [structured extraction terminal transaction requires exact receipt and operation]
touches: { reads: [knowledge_service.operation, knowledge_service.receipt], writes: [] }
tokens: [orchestration, guard_structured_extraction_terminal_commit, orchestration.guard_structured_extraction_terminal_commit]
defined_in: ["20260906032100_verification_structured_extraction_terminal.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.guard_structured_extraction_terminal_commit

Domain `orchestration-ledger`.

## guard_structured_extraction_terminal_commit() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `structured extraction terminal transaction requires exact receipt and operation`.

Touches (best effort): reads [`knowledge_service.operation`](../../relations/knowledge_service/operation.md), [`knowledge_service.receipt`](../../relations/knowledge_service/receipt.md); writes —; calls [`orchestration.structured_extraction_result_body`](structured_extraction_result_body.md).

Defined in: `20260906032100_verification_structured_extraction_terminal.sql`.
