# Knowledge-service database migration design

The `20260903010000`–`20260903010200` migrations are additive and preserve the existing evidence, corpus, knowledge, retrieval, evaluation, and orchestration authorities. `content` owns authored-work identity and immutable processing lineage. `retrieval` owns stores, reconstructable chunks, purpose-specific projections, fixed-dimension embeddings, evaluation-gated publications, and retrieval policies. `knowledge_service` owns restart-safe standalone execution records; it does not become a second Mission Control.

Tenant integrity is structural: every new tenant-owned relation has `tenant_id NOT NULL`, stable records expose `(tenant_id, id)` uniqueness, and cross-boundary references use composite foreign keys. RLS is defense in depth. Missing or malformed `app.tenant_id` fails closed. Raw and derivative Storage buckets are private and have no client policy.

Canonical embeddings live in `retrieval.vector_item_embedding_1536` as `halfvec(1536)` with cosine HNSW. The old unconstrained `retrieval.vector_item.embedding` remains only for compatibility during cutover. Publications validate the accepted promotion decision, passing evaluation gate, 1,536-dimension half-precision space, and exact embedding count before reaching `published`.

Publication activation is authoritative and transactional. `retrieval.publish_vector_space` locks the candidate publication and store-space row, verifies the caller-supplied guarded decision digest, publishes the candidate, supersedes the previous publication, changes `vector_store_space.active_space_version_id`, updates version lifecycles, and appends an immutable `publication_switch_receipt` in one transaction. `retrieval.rollback_vector_space` requires a non-empty reason and idempotency key, revalidates the prior publication's guarded digest, creates a fresh publication record for that proven version, atomically restores the pointer, and preserves the rollback rationale in its receipt.

`api.hybrid_knowledge_search_1536` is the bounded server-side read path. It rejects missing tenant context, unknown filters, oversized queries, and out-of-range result/candidate/RRF limits. Exact text, full-text, trigram, and cosine ANN channels apply tenant and hard metadata filters before deterministic reciprocal-rank fusion; ties resolve by stable vector-item ID. Supporting exact, trigram, FTS, hard-filter, and HNSW indexes are part of the migration. The pgTAP fixture checks HNSW definition and ANN-versus-exact nearest-neighbor agreement on a deterministic bounded corpus. A representative production-scale `EXPLAIN (ANALYZE, BUFFERS)` remains a deployment/load-test gate because the two-row transaction-scoped fixture is intentionally too small for meaningful planner-cost evidence.

The transactional outbox uses short `FOR UPDATE SKIP LOCKED` claim transactions. Each delivery attempt receives a database-generated UUID claim token, consumer identity, claim time, and bounded visibility deadline. A different consumer skips live claims; an expired claim can be reclaimed with a new token. Acknowledgement, rejection/backoff, and visibility extension require the current owner and token and reject expired or replaced tokens. Delivery attempts are incremented exactly once per claim, bounded retry delays are recorded, and exhausted poison messages are archived. Bounded roles cannot update outbox rows directly. Tenant, event, operation, topic, payload, digest, creation time, and maximum-attempt policy are immutable, while a composite foreign key proves that the immutable event belongs to the same tenant and operation.

Evidence packets retain their immutable JSON wire envelope and now materialize its frequently used normalized fields and SHA-256 digest. Packet members can store matched vector/projection IDs, scores, channel explanations, graph paths, authority, assurance, freshness, coverage anchors, and artifact references. Parent, vector-item, and projection links are tenant-composite `RESTRICT` foreign keys; packet and member mutation guards remain authoritative.

## Backfill and cutover

No automatic legacy-vector promotion is performed. Backfill is intentionally explicit:

1. Create admitted chunking/projection procedures and a candidate 1,536-dimension vector-space version.
2. Resolve existing source/canonical records into `content` identities and accepted representations, preserving original artifacts and digests.
3. Build reconstructable chunk spans and immutable search projections.
4. Re-embed from projection text; do not cast or silently reuse unconstrained legacy vectors.
5. Run exact-versus-HNSW evaluation, create a promotion decision and passing gate result, then publish atomically.
6. Move readers to `api.search_knowledge_1536`; retain the legacy column through at least one verified rollback window.

Checkpoint each tenant/store/space by input and output manifest digest. A failed batch remains unpublished and can be retried with the same idempotency key.

## Rollback and compensation

These migrations must not be down-migrated after content is admitted. Operational rollback creates a new publication pointing to the previously proven vector-space version and marks the failed publication withdrawn/superseded through the guarded workflow. Legal deletion uses tombstones and removes publication eligibility while retaining the minimum permitted audit receipts.

Before data admission, a development-only rollback may drop the new schemas/tables in reverse dependency order and remove only the added columns/constraints. Never drop or rewrite canonical evidence/corpus/knowledge records. Estimated fresh-migration locks are brief metadata locks; adding and validating composite constraints against a populated production database should use staged `NOT VALID` constraints and a separately scheduled `VALIDATE CONSTRAINT` maintenance window.

## Verification

```powershell
npx supabase db reset
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -v ON_ERROR_STOP=1 -f supabase/tests/knowledge_service_contract.sql
npx supabase test db supabase/tests/knowledge_service_publication_retrieval.sql
npx supabase test db supabase/tests/knowledge_service_outbox_claiming.sql
npm run types:generate
npm run types:check
npm run typecheck
```
