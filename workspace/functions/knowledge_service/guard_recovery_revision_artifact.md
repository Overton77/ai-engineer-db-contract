---
id: "fn:knowledge_service.guard_recovery_revision_artifact()"
kind: function
schema: knowledge_service
name: guard_recovery_revision_artifact
domain: knowledge-service-runtime
overloads: ["fn:knowledge_service.guard_recovery_revision_artifact()"]
security: definer
volatility: volatile
executors: []
raises: [recovery revision requires exact available artifact]
touches: { reads: [orchestration.artifact], writes: [] }
tokens: [knowledge_service, guard_recovery_revision_artifact, knowledge_service.guard_recovery_revision_artifact]
defined_in: ["20260914010700_durable_verification_recovery.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service.guard_recovery_revision_artifact

Domain `knowledge-service-runtime`.

## guard_recovery_revision_artifact() → trigger

function, volatile, security definer, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `recovery revision requires exact available artifact`.

Touches (best effort): reads [`orchestration.artifact`](../../relations/orchestration/artifact.md); writes —; calls —.

Defined in: `20260914010700_durable_verification_recovery.sql`.
