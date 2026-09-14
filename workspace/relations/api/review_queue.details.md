---
id: "rel:api.review_queue#details"
kind: details
schema: api
name: review_queue
of: "rel:api.review_queue"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# api.review_queue — details

Spill-over from [the main page](review_queue.md).

## Relationships

Outbound: none.
Inbound: none.

## Indexes

_None._

## Triggers

_None._

## Row-level security

Disabled.

## View definition

```sql
SELECT id,
    tenant_id,
    task_kind,
    state,
    priority,
    assignee,
    quorum_required,
    summary,
    detail,
    candidate_id,
    claim_id,
    claim_conflict_id,
    entity_merge_id,
    record_reconciliation_id,
    ranking_result_id,
    operation_intent_id,
    report_version_id,
    capability_version_id,
    vector_space_version_id,
    subject_kind,
    created_at,
    updated_at
   FROM evaluation.review_task;
```
