---
id: "rel:orchestration.operation_receipt#details"
kind: details
schema: orchestration
name: operation_receipt
of: "rel:orchestration.operation_receipt"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.operation_receipt — details

Spill-over from [the main page](operation_receipt.md).

## Relationships

Outbound: `intent_id` → [`orchestration.operation_intent`](operation_intent.md)`.id`.
Inbound: [`corpus.entity`](../corpus/entity.md).created_by_receipt_id, [`corpus.entity_merge`](../corpus/entity_merge.md).receipt_id, [`evidence.claim`](../evidence/claim.md).created_by_receipt_id, [`evidence.source_encounter`](../evidence/source_encounter.md).receipt_id, [`knowledge.record`](../knowledge/record.md).created_by_receipt_id, [`knowledge.record_reconciliation`](../knowledge/record_reconciliation.md).created_by_receipt_id, [`orchestration.artifact_lineage`](artifact_lineage.md).receipt_id, [`research.report_ingestion_link`](../research/report_ingestion_link.md).receipt_id, [`retrieval.vector_item`](../retrieval/vector_item.md).receipt_id, [`staging.resolution_decision`](../staging/resolution_decision.md).receipt_id, [`staging.vetting_decision`](../staging/vetting_decision.md).receipt_id, [`taxonomy.assignment`](../taxonomy/assignment.md).created_by_receipt_id, [`temporal.knowledge_batch`](../temporal/knowledge_batch.md).receipt_id.

## Indexes

| Index | Definition |
| --- | --- |
| `operation_receipt_applied_idx` | `CREATE INDEX operation_receipt_applied_idx ON orchestration.operation_receipt USING btree (applied_at DESC)` |
| `operation_receipt_intent_id_key` | `CREATE UNIQUE INDEX operation_receipt_intent_id_key ON orchestration.operation_receipt USING btree (intent_id)` |

## Triggers

- `operation_receipt_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md): `CREATE TRIGGER operation_receipt_immutable BEFORE DELETE OR UPDATE ON orchestration.operation_receipt FOR EACH ROW EXECUTE FUNCTION util.reject_mutation()`

## Row-level security

Enabled.
- `intent_tenant_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: using `(EXISTS ( SELECT 1    FROM orchestration.operation_intent i   WHERE ((i.id = operation_receipt.intent_id) AND (i.tenant_id = util.current_tenant_id()))))`; with check `(EXISTS ( SELECT 1    FROM orchestration.operation_intent i   WHERE ((i.id = operation_receipt.intent_id) AND (i.tenant_id = util.current_tenant_id()))))`
