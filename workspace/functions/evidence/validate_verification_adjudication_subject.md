---
id: "fn:evidence.validate_verification_adjudication_subject()"
kind: function
schema: evidence
name: validate_verification_adjudication_subject
domain: evidence
overloads: ["fn:evidence.validate_verification_adjudication_subject()"]
security: invoker
volatility: volatile
executors: []
raises: [adjudication packet expected parent closure is not normalized, adjudication packet parent closure differs from exact sealed-run inputs, adjudication subject artifact is not admitted with its exact type and digest, adjudication subject expiry must be future, "adjudication subject requires its exact admitted request, step, and active lease", "adjudication subject reviewer roles must be nonempty, normalized, and distinct", adjudication subject run binding mismatch, run adjudication target must match sealed run]
touches: { reads: [evidence.verification_run, knowledge_service.lease, knowledge_service.operation, knowledge_service.operation_step, orchestration.verification_artifact_metadata], writes: [] }
tokens: [evidence, validate_verification_adjudication_subject, evidence.validate_verification_adjudication_subject]
defined_in: ["20260907012000_verification_adjudication_subject_ledger.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.validate_verification_adjudication_subject

Domain `evidence`.

## validate_verification_adjudication_subject() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `adjudication packet expected parent closure is not normalized`; `adjudication packet parent closure differs from exact sealed-run inputs`; `adjudication subject artifact is not admitted with its exact type and digest`; `adjudication subject expiry must be future`; `adjudication subject requires its exact admitted request, step, and active lease`; `adjudication subject reviewer roles must be nonempty, normalized, and distinct`; `adjudication subject run binding mismatch`; `run adjudication target must match sealed run`.

Touches (best effort): reads [`evidence.verification_run`](../../relations/evidence/verification_run.md), [`knowledge_service.lease`](../../relations/knowledge_service/lease.md), [`knowledge_service.operation`](../../relations/knowledge_service/operation.md), [`knowledge_service.operation_step`](../../relations/knowledge_service/operation_step.md), [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes —; calls [`orchestration.verification_artifact_is_admitted`](../orchestration/verification_artifact_is_admitted.md).

Defined in: `20260907012000_verification_adjudication_subject_ledger.sql`.
