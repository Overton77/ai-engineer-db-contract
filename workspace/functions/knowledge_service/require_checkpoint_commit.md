---
id: "fn:knowledge_service.require_checkpoint_commit()"
kind: function
schema: knowledge_service
name: require_checkpoint_commit
domain: knowledge-service-runtime
overloads: ["fn:knowledge_service.require_checkpoint_commit()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [checkpoint requires manifest custody and committed head]
touches: { reads: [knowledge_service.checkpoint_artifact_reference, knowledge_service.checkpoint_scope], writes: [] }
tokens: [knowledge_service, require_checkpoint_commit, knowledge_service.require_checkpoint_commit]
defined_in: ["20260914010500_scoped_checkpoints.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.require_checkpoint_commit

Domain `knowledge-service-runtime`.

## require_checkpoint_commit() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `checkpoint requires manifest custody and committed head`.

Touches (best effort): reads [`knowledge_service.checkpoint_artifact_reference`](../../relations/knowledge_service/checkpoint_artifact_reference.md), [`knowledge_service.checkpoint_scope`](../../relations/knowledge_service/checkpoint_scope.md); writes —; calls —.

Defined in: `20260914010500_scoped_checkpoints.sql`.
