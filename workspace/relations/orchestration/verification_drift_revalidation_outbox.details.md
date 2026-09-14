---
id: "rel:orchestration.verification_drift_revalidation_outbox#details"
kind: details
schema: orchestration
name: verification_drift_revalidation_outbox
of: "rel:orchestration.verification_drift_revalidation_outbox"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.verification_drift_revalidation_outbox — details

Spill-over from [the main page](verification_drift_revalidation_outbox.md).

## Constraints
- PK (id)
- unique (tenant_id, observation_artifact_id)
- unique (tenant_id, idempotency_key)
- unique (tenant_id, id)
- check `verification_drift_revalidation_outbox_check`: `(((disposition = 'revalidate'::text) AND (review_reason IS NULL)) OR ((disposition = 'review_required'::text) AND (review_reason IS NOT NULL)))`
- check `verification_drift_revalidation_outbox_check1`: `(((state = 'claimed'::text) AND (claim_owner IS NOT NULL) AND (claim_token IS NOT NULL) AND (claimed_at IS NOT NULL) AND (visibility_expires_at IS NOT NULL) AND (visibility_expires_at > claimed_at)) OR ((state <> 'claimed'::text) AND (claim_owner IS NULL) AND (claim_token IS NULL) AND (claimed_at IS NULL) AND (visibility_expires_at IS NULL)))`
- check `verification_drift_revalidation_outbox_check2`: `((published_at IS NULL) OR (state = 'published'::text))`
- check `verification_drift_revalidation_outbox_check3`: `((archived_at IS NULL) OR (state = 'archived'::text))`
- check `verification_drift_revalidation_outbox_delivery_attempts_check`: `((delivery_attempts >= 0) AND (delivery_attempts <= 1000))`
- check `verification_drift_revalidation_outbox_dimensions_check`: `(((cardinality(dimensions) >= 1) AND (cardinality(dimensions) <= 5)) AND (dimensions <@ ARRAY['provider'::text, 'model'::text, 'parser'::text, 'grader'::text, 'policy'::text]))`
- check `verification_drift_revalidation_outbox_disposition_check`: `(disposition = ANY (ARRAY['revalidate'::text, 'review_required'::text]))`
- check `verification_drift_revalidation_outbox_idempotency_key_check`: `((length(btrim(idempotency_key)) >= 1) AND (length(btrim(idempotency_key)) <= 256))`
- check `verification_drift_revalidation_outbox_last_error_check`: `((last_error IS NULL) OR (last_error ~ '^[A-Z0-9_]{1,128}$'::text))`
- check `verification_drift_revalidation_outbox_observation_sha256_check`: `(observation_sha256 ~ '^[0-9a-f]{64}$'::text)`
- check `verification_drift_revalidation_outbox_review_reason_check`: `((review_reason IS NULL) OR ((length(review_reason) >= 1) AND (length(review_reason) <= 256)))`
- check `verification_drift_revalidation_outbox_state_check`: `(state = ANY (ARRAY['pending'::text, 'claimed'::text, 'published'::text, 'archived'::text]))`

## Relationships

Outbound: `tenant_id,observation_artifact_id` → [`orchestration.artifact`](artifact.md)`.tenant_id,id` on delete restrict; `tenant_id,source_operation_id` → [`knowledge_service.operation`](../knowledge_service/operation.md)`.tenant_id,id` on delete restrict.
Inbound: none.

## Indexes

| Index | Definition |
| --- | --- |
| `verification_drift_revalidati_tenant_id_observation_artifac_key` | `CREATE UNIQUE INDEX verification_drift_revalidati_tenant_id_observation_artifac_key ON orchestration.verification_drift_revalidation_outbox USING btree (tenant_id, observation_artifact_id)` |
| `verification_drift_revalidation_claimable_idx` | `CREATE INDEX verification_drift_revalidation_claimable_idx ON orchestration.verification_drift_revalidation_outbox USING btree (tenant_id, available_at, created_at, id) WHERE (state = 'pending'::text)` |
| `verification_drift_revalidation_o_tenant_id_idempotency_key_key` | `CREATE UNIQUE INDEX verification_drift_revalidation_o_tenant_id_idempotency_key_key ON orchestration.verification_drift_revalidation_outbox USING btree (tenant_id, idempotency_key)` |
| `verification_drift_revalidation_outbox_tenant_id_id_key` | `CREATE UNIQUE INDEX verification_drift_revalidation_outbox_tenant_id_id_key ON orchestration.verification_drift_revalidation_outbox USING btree (tenant_id, id)` |

## Triggers

- `artifact_retirement_236f1f3d67fb904b4c5cac9e` → [`orchestration.guard_retired_artifact_reference`](../../functions/orchestration/guard_retired_artifact_reference.md): `CREATE TRIGGER artifact_retirement_236f1f3d67fb904b4c5cac9e BEFORE INSERT OR UPDATE ON orchestration.verification_drift_revalidation_outbox FOR EACH ROW EXECUTE FUNCTION orchestration.guard_retired_artifact_reference('[{"local": "tenant_id", "parent": "tenant_id"}, {"local": "observation_artifact_id", "parent": "id"}]')`

## Row-level security

Enabled.
- `verification_drift_revalidation_worker` (SELECT) for `control_plane`, `executor_service`: using `(tenant_id = util.current_tenant_id())`
