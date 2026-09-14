---
id: "fn:retrieval.enforce_canonical_source()"
kind: function
schema: retrieval
name: enforce_canonical_source
domain: retrieval
overloads: ["fn:retrieval.enforce_canonical_source()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: ["embedding has % dimensions but space version expects %"]
touches: { reads: [evidence.claim, retrieval.vector_space, retrieval.vector_space_version], writes: [] }
tokens: [retrieval, enforce_canonical_source, retrieval.enforce_canonical_source]
defined_in: ["20260826001000_retrieval.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# retrieval.enforce_canonical_source

Domain `retrieval`.

## enforce_canonical_source() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `embedding has % dimensions but space version expects %`.

Touches (best effort): reads [`evidence.claim`](../../relations/evidence/claim.md), [`retrieval.vector_space`](../../relations/retrieval/vector_space.md), [`retrieval.vector_space_version`](../../relations/retrieval/vector_space_version.md); writes —; calls —.

Defined in: `20260826001000_retrieval.sql`.
