# R6 body-to-row mapping

- `context.tenantId/operationId/operationStepId/providerAttemptId/fencingToken` map to identically scoped ledger columns.
- `context.producerAttemptId` maps to new `producer_attempt_id`, tenant-FK to orchestration attempt and must differ from provider attempt in the guard.
- profile/input/request/raw/envelope/observation full handles map to ID+SHA columns; full metadata remains verified by the application composer and native artifact admission.
- requested/observed model, status/revalidation, usage, cost state map directly; R6 raises token bounds to contract limits.
- `recorded_at` remains server `clock_timestamp()`; body schema has no caller timestamp.

Remaining: trigger must compare producer attempt and every response envelope field; R6 table is an exact schema increment pending that guard amendment.
