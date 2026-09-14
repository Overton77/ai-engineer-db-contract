---
id: "sch:knowledge_service"
kind: schema
name: knowledge_service
domains: [knowledge-service-runtime]
relations: 20
functions: 14
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge_service

Restart-safe standalone operations, steps, events, leases, receipts, outbox and guarded review decisions. Domains: [`knowledge-service-runtime`](../../domains/knowledge-service-runtime.md).

| Relation | Kind | Rows | Summary | Key edges |
| --- | --- | --- | --- | --- |
| [`callback_delivery`](../../relations/knowledge_service/callback_delivery.md) | table | unknown | Append-only authenticated A2A callback receipt and cross-restart replay ledger; payloads … | → `knowledge_service.operation` |
| [`checkpoint_artifact_reference`](../../relations/knowledge_service/checkpoint_artifact_reference.md) | table | small | — | → `orchestration.artifact`, → `knowledge_service.scoped_checkpoint` |
| [`checkpoint_scope`](../../relations/knowledge_service/checkpoint_scope.md) | table | small | — | → `knowledge_service.scoped_checkpoint` |
| [`eve_operation_binding`](../../relations/knowledge_service/eve_operation_binding.md) | table | unknown | Immutable first-lineage binding for API-verified Eve verification requests. It grants no … | → `orchestration.attempt`, → `orchestration.mission`, → `orchestration.work_item` |
| [`eve_operation_invocation`](../../relations/knowledge_service/eve_operation_invocation.md) | table | unknown | Append-only full public Eve attestation envelopes, including signature, for offline autho… | → `knowledge_service.eve_operation_binding` |
| [`lease`](../../relations/knowledge_service/lease.md) | table | unknown | — | → `knowledge_service.operation_step` |
| [`operation`](../../relations/knowledge_service/operation.md) | table | small | Durable knowledge-service operation with ownership_mode and idempotency_key. | → `orchestration.capability_version`, → `orchestration.attempt`, → `orchestration.work_item` |
| [`operation_event`](../../relations/knowledge_service/operation_event.md) | table | small | — | → `knowledge_service.operation`, → `knowledge_service.operation_step` |
| [`operation_step`](../../relations/knowledge_service/operation_step.md) | table | unknown | — | → `knowledge_service.operation` |
| [`outbox`](../../relations/knowledge_service/outbox.md) | table | small | — | → `knowledge_service.operation_event`, → `knowledge_service.operation` |
| [`receipt`](../../relations/knowledge_service/receipt.md) | table | unknown | — | → `knowledge_service.operation`, → `knowledge_service.operation_step` |
| [`recovery_artifact_reference`](../../relations/knowledge_service/recovery_artifact_reference.md) | table | unknown | — | → `orchestration.artifact`, → `knowledge_service.recovery_case` |
| [`recovery_case`](../../relations/knowledge_service/recovery_case.md) | table | unknown | — | — |
| [`recovery_dependency_claim`](../../relations/knowledge_service/recovery_dependency_claim.md) | table | unknown | — | → `knowledge_service.recovery_case` |
| [`recovery_execution`](../../relations/knowledge_service/recovery_execution.md) | table | unknown | — | → `knowledge_service.recovery_original`, → `knowledge_service.operation` |
| [`recovery_original`](../../relations/knowledge_service/recovery_original.md) | table | unknown | — | → `knowledge_service.recovery_case`, → `knowledge_service.operation` |
| [`recovery_revision`](../../relations/knowledge_service/recovery_revision.md) | table | unknown | — | → `orchestration.artifact`, → `knowledge_service.recovery_case`, → `knowledge_service.scoped_checkpoint` |
| [`review_decision`](../../relations/knowledge_service/review_decision.md) | table | small | — | → `knowledge_service.operation`, → `knowledge_service.review_subject` |
| [`review_subject`](../../relations/knowledge_service/review_subject.md) | table | small | — | → `knowledge_service.operation` |
| [`scoped_checkpoint`](../../relations/knowledge_service/scoped_checkpoint.md) | table | small | Standalone KS durable workspace custody; no mission workflow acceptance or scheduler owne… | → `orchestration.artifact`, → `knowledge_service.checkpoint_scope` |

Functions: [`ack_outbox`](../../functions/knowledge_service/ack_outbox.md), [`claim_outbox`](../../functions/knowledge_service/claim_outbox.md), [`extend_outbox_claim`](../../functions/knowledge_service/extend_outbox_claim.md), [`guard_checkpoint_reference`](../../functions/knowledge_service/guard_checkpoint_reference.md), [`guard_checkpoint_scope`](../../functions/knowledge_service/guard_checkpoint_scope.md), [`guard_operation_terminal`](../../functions/knowledge_service/guard_operation_terminal.md), [`guard_outbox_mutation`](../../functions/knowledge_service/guard_outbox_mutation.md), [`guard_recovery_case`](../../functions/knowledge_service/guard_recovery_case.md), [`guard_recovery_execution`](../../functions/knowledge_service/guard_recovery_execution.md), [`guard_recovery_original`](../../functions/knowledge_service/guard_recovery_original.md), [`guard_recovery_revision_artifact`](../../functions/knowledge_service/guard_recovery_revision_artifact.md), [`guard_scoped_checkpoint`](../../functions/knowledge_service/guard_scoped_checkpoint.md), [`nack_outbox`](../../functions/knowledge_service/nack_outbox.md), [`require_checkpoint_commit`](../../functions/knowledge_service/require_checkpoint_commit.md).

Types: none.
