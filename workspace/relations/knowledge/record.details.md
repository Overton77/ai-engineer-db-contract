---
id: "rel:knowledge.record#details"
kind: details
schema: knowledge
name: record
of: "rel:knowledge.record"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# knowledge.record — details

Spill-over from [the main page](record.md).

## Relationships

Outbound: `assurance_level` → [`knowledge.assurance_level`](assurance_level.md)`.code`; `created_by_receipt_id` → [`orchestration.operation_receipt`](../orchestration/operation_receipt.md)`.id`; `provenance_claim_id` → [`evidence.claim`](../evidence/claim.md)`.id` (+tenant).
Inbound: [`evidence.claim_record`](../evidence/claim_record.md).record_id, [`knowledge.advanced_usage_pattern`](advanced_usage_pattern.md).id|id,kind, [`knowledge.benchmark_result`](benchmark_result.md).id|id,kind, [`knowledge.compatibility_constraint`](compatibility_constraint.md).id|id,kind, [`knowledge.failure_mode`](failure_mode.md).id|id,kind, [`knowledge.implementation_example`](implementation_example.md).id|id,kind, [`knowledge.operational_practice`](operational_practice.md).id|id,kind, [`knowledge.record_entity_link`](record_entity_link.md).record_id, [`knowledge.security_consideration`](security_consideration.md).id|id,kind, [`knowledge.solution_pattern`](solution_pattern.md).id|id,kind, [`knowledge.technical_problem`](technical_problem.md).id|id,kind, [`retrieval.projection_target`](../retrieval/projection_target.md).record_id, [`taxonomy.assignment`](../taxonomy/assignment.md).target_record_id.
Polymorphic target of: [`retrieval.projection_target`](../retrieval/projection_target.md) (check constraint projection_target_check), [`taxonomy.assignment`](../taxonomy/assignment.md) (check constraint assignment_check).

## Indexes

| Index | Definition |
| --- | --- |
| `record_tenant_id_id_key` | `CREATE UNIQUE INDEX record_tenant_id_id_key ON knowledge.record USING btree (tenant_id, id)` |
| `record_tenant_id_id_kind_key` | `CREATE UNIQUE INDEX record_tenant_id_id_kind_key ON knowledge.record USING btree (tenant_id, id, kind)` |

## Triggers

- `record_receipt_tenant` → [`corpus.check_receipt_tenant`](../../functions/corpus/check_receipt_tenant.md): `CREATE TRIGGER record_receipt_tenant BEFORE INSERT OR UPDATE ON knowledge.record FOR EACH ROW EXECUTE FUNCTION corpus.check_receipt_tenant()`

## Row-level security

Enabled.
- `km_tenant_access` (ALL) for `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: using `(tenant_id = util.current_tenant_id())`; with check `(tenant_id = util.current_tenant_id())`
