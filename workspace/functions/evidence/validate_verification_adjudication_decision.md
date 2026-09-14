---
id: "fn:evidence.validate_verification_adjudication_decision()"
kind: function
schema: evidence
name: validate_verification_adjudication_decision
domain: evidence
overloads: ["fn:evidence.validate_verification_adjudication_decision()"]
security: invoker
volatility: volatile
executors: []
raises: [adjudication decision artifact must have exactly the sealed packet as its sole parent, adjudication decision artifacts must be admitted with exact type and digest, adjudication decision must bind the subject exact packet artifact and digest, "adjudication decision requires exact admitted operation, current step lease, and fencing token", adjudication decision subject has expired, adjudication decision subject is not available in tenant, adjudication rationale digest differs from exact durable decision input, adjudication reviewer role is not eligible for subject, human adjudication decision requires an active explicit reviewer grant]
touches: { reads: [evidence.verification_adjudication_reviewer_grant, evidence.verification_adjudication_subject, knowledge_service.lease, knowledge_service.operation, knowledge_service.operation_step, orchestration.verification_artifact_metadata], writes: [] }
tokens: [evidence, validate_verification_adjudication_decision, evidence.validate_verification_adjudication_decision]
defined_in: ["20260908020000_verification_adjudication_packet_review.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.validate_verification_adjudication_decision

Domain `evidence`.

## validate_verification_adjudication_decision() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `adjudication decision artifact must have exactly the sealed packet as its sole parent`; `adjudication decision artifacts must be admitted with exact type and digest`; `adjudication decision must bind the subject exact packet artifact and digest`; `adjudication decision requires exact admitted operation, current step lease, and fencing token`; `adjudication decision subject has expired`; `adjudication decision subject is not available in tenant`; `adjudication rationale digest differs from exact durable decision input`; `adjudication reviewer role is not eligible for subject`; `human adjudication decision requires an active explicit reviewer grant`.

Touches (best effort): reads [`evidence.verification_adjudication_reviewer_grant`](../../relations/evidence/verification_adjudication_reviewer_grant.md), [`evidence.verification_adjudication_subject`](../../relations/evidence/verification_adjudication_subject.md), [`knowledge_service.lease`](../../relations/knowledge_service/lease.md), [`knowledge_service.operation`](../../relations/knowledge_service/operation.md), [`knowledge_service.operation_step`](../../relations/knowledge_service/operation_step.md), [`orchestration.verification_artifact_metadata`](../../relations/orchestration/verification_artifact_metadata.md); writes —; calls [`orchestration.verification_artifact_is_admitted`](../orchestration/verification_artifact_is_admitted.md).

Defined in: `20260908020000_verification_adjudication_packet_review.sql`.
