---
id: "sch:evidence"
kind: schema
name: evidence
domains: [evidence]
relations: 36
functions: 18
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence

Sources, captures, locators, signatures, claims, support, verification. PROVISIONAL until the attribution lab stabilizes it. Domains: [`evidence`](../../domains/evidence.md).

| Relation | Kind | Rows | Summary | Key edges |
| --- | --- | --- | --- | --- |
| [`attribution`](../../relations/evidence/attribution.md) | table | unknown | — | → `evidence.claim`, → `corpus.entity`, → `evidence.extraction_record`, → `evidence.locator` |
| [`capture_method`](../../relations/evidence/capture_method.md) | table | unknown | Vocabulary of how a source_capture was taken. | — |
| [`claim`](../../relations/evidence/claim.md) | table | small | Atomic statement with type, status, and creating receipt. | → `evidence.claim_type`, → `orchestration.operation_receipt`, → `orchestration.attempt`, → `corpus.relationship` |
| [`claim_conflict`](../../relations/evidence/claim_conflict.md) | table | unknown | — | → `evidence.claim` |
| [`claim_evidence_assessment`](../../relations/evidence/claim_evidence_assessment.md) | table | unknown | Append-only, run-scoped verifier assessment of one immutable claim/evidence link. | → `evidence.claim_evidence_link`, → `evidence.verification_run` |
| [`claim_evidence_link`](../../relations/evidence/claim_evidence_link.md) | table | unknown | — | → `evidence.claim`, → `evidence.locator`, → `evidence.verification_run` |
| [`claim_record`](../../relations/evidence/claim_record.md) | table | unknown | — | → `evidence.claim`, → `knowledge.record` |
| [`claim_subject`](../../relations/evidence/claim_subject.md) | table | small | Entity participation in a claim as subject, object, or context. | → `evidence.claim`, → `corpus.entity` |
| [`claim_type`](../../relations/evidence/claim_type.md) | table | unknown | — | — |
| [`conflict_reconciliation`](../../relations/evidence/conflict_reconciliation.md) | table | unknown | — | → `evidence.claim_conflict`, → `evaluation.review_task` |
| [`degraded_assurance`](../../relations/evidence/degraded_assurance.md) | table | unknown | — | → `evaluation.review_task`, → `evidence.source` |
| [`executable_verification`](../../relations/evidence/executable_verification.md) | table | unknown | — | → `orchestration.artifact` |
| [`extraction_record`](../../relations/evidence/extraction_record.md) | table | unknown | — | → `evidence.claim`, → `evidence.extraction_run`, → `evidence.locator` |
| [`extraction_run`](../../relations/evidence/extraction_run.md) | table | unknown | — | → `orchestration.attempt`, → `content.document_representation`, → `orchestration.artifact` |
| [`extraction_signature`](../../relations/evidence/extraction_signature.md) | table | unknown | — | → `evidence.locator`, → `orchestration.attempt` |
| [`locator`](../../relations/evidence/locator.md) | table | unknown | Precise selection inside a capture, with selected_content_sha256. | → `evidence.source_capture`, → `orchestration.artifact` |
| [`provider_result`](../../relations/evidence/provider_result.md) | table | small | One ranked hit from a source_query; query_id points at the discovery query. | → `orchestration.artifact`, → `evidence.source_query`, → `evidence.source`, → `evidence.source_provider_attempt` |
| [`revalidation_event`](../../relations/evidence/revalidation_event.md) | table | unknown | — | → `evidence.revalidation_policy`, → `orchestration.work_item` |
| [`revalidation_policy`](../../relations/evidence/revalidation_policy.md) | table | unknown | — | — |
| [`search_provider`](../../relations/evidence/search_provider.md) | table | unknown | — | — |
| [`segment_support`](../../relations/evidence/segment_support.md) | table | unknown | K-stamped link from a claim and locator to a segment or occurrence. | → `evidence.claim`, → `temporal.event_occurrence`, → `evidence.locator`, → `temporal.segment` |
| [`source`](../../relations/evidence/source.md) | table | small | Canonical source (URL/domain) with revisit and publisher pointers. | → `evidence.source_capture`, → `corpus.entity` |
| [`source_capture`](../../relations/evidence/source_capture.md) | table | small | One immutable capture of a source, hashed and stored as an artifact. | → `orchestration.artifact`, → `evidence.capture_method`, → `knowledge_service.operation`, → `orchestration.attempt` |
| [`source_encounter`](../../relations/evidence/source_encounter.md) | table | small | When a provider result was seen as a source, optionally with a capture. | → `evidence.source_capture`, → `evidence.provider_result`, → `orchestration.operation_receipt`, → `evidence.source` |
| [`source_provider_attempt`](../../relations/evidence/source_provider_attempt.md) | table | small | — | → `orchestration.artifact`, → `evidence.search_provider`, → `evidence.source_query` |
| [`source_query`](../../relations/evidence/source_query.md) | table | small | One provider query issued during discovery. | → `orchestration.attempt`, → `evidence.search_provider`, → `orchestration.artifact` |
| [`source_result_selection`](../../relations/evidence/source_result_selection.md) | table | unknown | Append-only research inclusion revisions per provider result; reads choose the latest rec… | → `evidence.source_provider_attempt`, → `evidence.source_selection_revision`, → `orchestration.artifact` |
| [`source_selection_revision`](../../relations/evidence/source_selection_revision.md) | table | unknown | — | → `evidence.source_provider_attempt`, → `orchestration.artifact` |
| [`verification_adjudication_decision`](../../relations/evidence/verification_adjudication_decision.md) | table | unknown | Immutable packet-bound reviewer decision. It records human-origin or synthetic-engineerin… | → `orchestration.artifact`, → `knowledge_service.operation`, → `knowledge_service.operation_step`, → `evidence.verification_adjudication_subject` |
| [`verification_adjudication_review_state`](../../relations/evidence/verification_adjudication_review_state.md) | view | unknown | Read-time review counts only. Synthetic records never count toward human quorum; rejectio… | — |
| [`verification_adjudication_reviewer_grant`](../../relations/evidence/verification_adjudication_reviewer_grant.md) | table | unknown | Reserved immutable explicit human reviewer grant. This migration grants no writer and doe… | → `evidence.verification_adjudication_subject` |
| [`verification_adjudication_subject`](../../relations/evidence/verification_adjudication_subject.md) | table | unknown | Immutable tenant-scoped requestAdjudication subject and server-composed packet binding. I… | → `orchestration.artifact`, → `knowledge_service.operation`, → `evidence.verification_run`, → `knowledge_service.operation_step` |
| [`verification_case_evidence`](../../relations/evidence/verification_case_evidence.md) | table | unknown | Immutable artifact-only evidence reference for a verification case. Finding, judgment, lo… | → `orchestration.artifact`, → `evidence.verification_case_run` |
| [`verification_case_run`](../../relations/evidence/verification_case_run.md) | table | unknown | Immutable artifact-backed verification case result. It does not alias evaluation score/ou… | → `orchestration.artifact`, → `evidence.verification_run` |
| [`verification_finding`](../../relations/evidence/verification_finding.md) | table | unknown | Append-only verification judgment observations. Multiple judge kinds may assess one claim… | → `evidence.claim`, → `evidence.verification_run` |
| [`verification_run`](../../relations/evidence/verification_run.md) | table | unknown | Sealed verification-run ledger that ingestion cites; unsealed runs are EVIDENCE_NOT_ELIGI… | → `orchestration.artifact`, → `orchestration.mission`, → `knowledge_service.operation`, → `orchestration.attempt` |

Functions: [`enforce_assessment_producer_not_verifier`](../../functions/evidence/enforce_assessment_producer_not_verifier.md), [`enforce_claim_association_proposed`](../../functions/evidence/enforce_claim_association_proposed.md), [`enforce_claim_evidence_finalization`](../../functions/evidence/enforce_claim_evidence_finalization.md), [`enforce_producer_not_verifier`](../../functions/evidence/enforce_producer_not_verifier.md), [`enforce_verification_run_lifecycle`](../../functions/evidence/enforce_verification_run_lifecycle.md), [`enforce_verified_claim_gate`](../../functions/evidence/enforce_verified_claim_gate.md), [`guard_source_provider_attempt`](../../functions/evidence/guard_source_provider_attempt.md), [`guard_source_result_selection`](../../functions/evidence/guard_source_result_selection.md), [`rebuild_source_state`](../../functions/evidence/rebuild_source_state.md), [`require_source_selection_decisions`](../../functions/evidence/require_source_selection_decisions.md), [`validate_capture_artifact`](../../functions/evidence/validate_capture_artifact.md), [`validate_locator_capture_lineage`](../../functions/evidence/validate_locator_capture_lineage.md), [`validate_verification_adjudication_decision`](../../functions/evidence/validate_verification_adjudication_decision.md), [`validate_verification_adjudication_subject`](../../functions/evidence/validate_verification_adjudication_subject.md), [`validate_verification_case_evidence`](../../functions/evidence/validate_verification_case_evidence.md), [`validate_verification_case_run`](../../functions/evidence/validate_verification_case_run.md), [`validate_verification_run`](../../functions/evidence/validate_verification_run.md), [`verification_locator_artifacts_are_admitted`](../../functions/evidence/verification_locator_artifacts_are_admitted.md).

Types: [`types/evidence.md`](../../types/evidence.md).

Vocabularies: [`capture_method`](../../vocabularies/evidence.capture_method.md), [`search_provider`](../../vocabularies/evidence.search_provider.md).
