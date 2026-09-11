# Temporal relational knowledge — implementation handoff

**2026-09-10 · Final design recommendation for migration planning.** This is a concrete proposed contract, not an applied migration or a claim of accepted architecture. It supersedes the table-per-stream scaffolding in [v1 notes](./v1-prototype-notes.md) wherever this document specifies a consolidated structure. The semantics of immutable interpretation and two-coordinate reads remain.

Read alongside the [relationship catalog](./RELATIONSHIP_CATALOG.md), [current-to-proposed migration map](./MIGRATION_MAP.md), and [executable relational prototype](./relational-prototype.sql). The prototype uses fictional data and simplified local identities; it demonstrates the design and queries, not production authorization or deployed Supabase compatibility.

## 1. Final recommendation

Model the industry as a **typed relational graph**:

```text
typed identity A -> typed relationship identity -> typed identity B
                         |
                  temporal stream
                         |
             immutable interpretation revisions
                         |
            time segments + typed relationship properties
                         |
        claims / evidence assessments / immutable source material
```

Keep foreign keys and normalized relationship columns. Consolidate common temporal metadata in a new foundational `temporal` schema. Keep domain values, relationship endpoints, and event participants in their owning typed tables. JSON is appropriate for original payloads and versioned configuration manifests; it is not the authoritative store for entity endpoints, effective dates, amounts/units, or query-critical relationship properties.

Adopt these decisions together:

1. Preserve stable typed identities; introduce relationship episode identities independent of dates.
2. Separate **events**, **states/relationships**, **measurements**, **technical derivations**, and **our knowledge corrections**.
3. Use world applicability plus committed tenant knowledge snapshot for every historical answer.
4. Use one shared stream/revision/segment envelope, with typed relationship/property extensions.
5. Preserve immutable document/chunk versions; version support and admission decisions separately.
6. Reuse existing metric observations, receipts, transformation records, source captures and publication receipts.
7. Treat uncertain times, unknown facts, contradictions, and coverage gaps as explicit results.

## 2. What belongs where

| Concept | Identity / properties | Time model | Example |
|---|---|---|---|
| Entity identity | Existing typed corpus row | Created/registered time only; descriptive fields become projections when historical | Person, organization, product, model family |
| Relationship episode | Typed endpoints and stable episode ID | Stream of interval interpretations | Person works for organization; a rehire is a new episode |
| Role assignment | Engagement + role identity | Separate stream from engagement | Engineer becomes director without leaving company |
| Unary state | Typed subject-bound stream | Interval interpretations | Repo archival, product service availability |
| Domain event | Typed event identity/participants | Correctable occurrence extent; knowledge revisions | Hire, leave, release published, acquisition closed |
| Measurement | Definition version, value/unit, run/context | Observation point/window; result correction lineage | Benchmark score, case-study latency |
| Technical derivation | Exact input/output versions and operation | Immutable production; discovery/admission can be revised | Package release built from commit; model distilled from versions |
| Knowledge decision | Receipt, evidence, policy, affected interpretations | Knowledge snapshot | Correcting hire date; retracting unsupported assertion |
| Publication | Frozen content or vector manifest | Publication/switch events and admission watermark | Report release, vector space activation |

An entity can participate in many events, relationships, and observations simultaneously. Inverse edges such as `owns` and `owned_by` are views over one authoritative edge. Never store two independently editable copies.

## 3. Consolidated temporal tables and field ownership

The new `temporal` schema is a foundational dependency, below corpus/content/evidence/retrieval consumers. Its tables contain metadata, not an untyped universal entity table. Add this permitted dependency explicitly to the database architecture rules. Preserve the existing prohibition on corpus→evaluation/retrieval/ranking dependencies; see [migration map](./MIGRATION_MAP.md).

| Proposed table | Owns | Critical fields / keys |
|---|---|---|
| `temporal.knowledge_head` | Mutable committed admission pointer | `(tenant_id PK, knowledge_seq)` |
| `temporal.knowledge_batch` | Immutable atomic admission seal | `(tenant_id, knowledge_seq) PK`, `recorded_at`, `decision_receipt_id`, `policy_artifact_id`, `input_manifest_artifact_id`, `idempotency_key`, `input_digest` |
| `temporal.stream_kind` | Versioned allowed fact-stream contracts | `code`, contract artifact/version, cardinality and precision policy refs |
| `temporal.stream` | Stable fact-stream identity | `(tenant_id,id)`, `kind`; exactly one typed subject/edge binding |
| `temporal.revision` | Complete interpretation of one stream at K | `(tenant_id,id)`, `stream_id`, `knowledge_seq`, `previous_revision_id`; unique `(tenant_id,stream_id,knowledge_seq)` |
| `temporal.segment` | Common interval envelope | `(tenant_id,id)`, `revision_id`, `stream_id`, `kind`, `valid_during`, `belief`, `temporal_basis`, `revalidate_after`; exactly one typed payload |
| `temporal.extent` | A sourced time expression | Shape, source text, precision/calendar/timezone, exact interval OR event point/window OR uncertain boundary windows OR unknown |
| `temporal.segment_lineage` | Interpretation ancestry | Typed segment FKs, `relation_kind`, admission batch; `corrects`, `split_from`, `carries_forward`, `reassesses` |
| `temporal.event` | Stable event identity | `(tenant_id,id)`, `kind`; exactly one typed event/participant binding |
| `temporal.event_revision` | Admitted interpretation of an event | `event_id`, `knowledge_seq`, `previous_revision_id`, `occurrence_extent_id`, `occurrence_mode = actual/scheduled`, `belief`; never change event identity when correcting date |
| `temporal.event_segment_effect` | Evidenced event/boundary association | Event-revision FK, segment FK, `effect = starts/ends/changes`; asserted cause requires separate evidence |

`decision_receipt_id` references existing `orchestration.operation_receipt`, using tenant-composite identity after adding required unique keys. Artifact references point to `orchestration.artifact`. `knowledge_service.batch_execution_link` points from KS to the batch and existing `knowledge_service.operation`/`knowledge_service.receipt`; **the actual KS receipt table is `knowledge_service.receipt`**. Do not introduce an invented `operation_receipt` table in KS. Evidence memberships point from evidence to temporal subjects, avoiding a temporal→evidence→temporal FK cycle.

Typed examples:

```text
corpus.person_organization_engagement
  tenant_id, id, person_id FK, organization_id FK, stream_id FK
corpus.engagement_segment
  tenant_id, segment_id FK, engagement_id FK,
  arrangement, employment_status

corpus.engagement_role_assignment
  tenant_id, id, engagement_id FK, stream_id FK
corpus.engagement_role_segment
  tenant_id, segment_id FK, assignment_id FK,
  role_definition_id FK, title, department, seniority

corpus.product_feature_scope
  tenant_id, id, product_id FK, feature_id FK,
  edition_id FK, plan_id FK, region_id FK, access_channel_id FK, stream_id FK
corpus.product_feature_segment
  tenant_id, segment_id FK, scope_id FK,
  availability, specification_revision_id FK
```

Do not duplicate `valid_from`, `valid_to`, `observed_at`, `recorded_at`, `system_from`, and `system_to` in every typed payload. The shared segment owns interval/belief metadata; revision owns the knowledge coordinate; evidence owns observation/discovery clocks; batch owns admission. Views may expose flattened fields for convenience.

### Relational integrity is part of the design

Use `(tenant_id,id)` FKs throughout. To prevent attaching a product payload to an employment segment, include a validated kind in composite references. To prevent attaching another engagement's segment, include `stream_id` in both payload→segment and payload→engagement binding FKs. A constant checked `kind` column is intentional constrained duplication, not arbitrary JSON type tagging.

Every required FK component must be `NOT NULL`: ordinary composite FKs otherwise permit null components to bypass their checks. Optional references need an explicit all-null-or-all-present constraint or `MATCH FULL` where applicable. Do not rely on CHECK expressions that evaluate to null to reject malformed rows.

```sql
-- Schematic production DDL; complete executable analogue is in relational-prototype.sql.
-- Required parent unique keys: stream(tenant_id,id,kind),
-- revision(tenant_id,id,stream_id,kind), segment(tenant_id,id,stream_id,kind).
create table corpus.engagement_segment (
  tenant_id uuid not null,
  segment_id uuid not null,
  stream_id uuid not null,
  kind text not null default 'person_engagement'
    check (kind = 'person_engagement'),
  engagement_id uuid not null,
  arrangement text check (arrangement in ('employee','contractor','intern','other')),
  employment_status text check (employment_status in ('engaged','on_leave','ended')),
  primary key (tenant_id, segment_id),
  foreign key (tenant_id, segment_id, stream_id, kind)
    references temporal.segment(tenant_id,id,stream_id,kind),
  foreign key (tenant_id, engagement_id, stream_id)
    references corpus.person_organization_engagement(tenant_id,id,stream_id)
);
```

At seal, validate exactly one typed binding per stream/event and one appropriate payload per segment, including unresolved segments with nullable domain values. Kind FKs alone only prevent the wrong type; they do not enforce the existence of a subtype. Implement completeness in a bounded `knowledge_service.seal_temporal_batch` integration routine, with direct unsealed-table writes unavailable to app/agent roles. This routine may read typed domains without creating prohibited upward FKs in corpus. Seal-time checks and grants are mandatory, not optional app conventions.

### Revision and interval law

A revision completely replaces the interpretation of **one bounded stream**. Use one stream per engagement, feature scope, alias scope, repo archival property, or support relationship. Different properties need not share revisions, but all changes from one admission share a knowledge batch.

Segments are nonempty `[)` intervals, with finite lower bounds for the exact timestamp state projection. Exclude overlaps **within the same revision/stream**. Gaps mean unknown. A complete empty revision means no admitted intervals remain, with a required withdrawal/retraction decision; never fall back to a previous revision merely because the new revision has no segments. Historical queries still see the old interpretation at earlier K.

Relationship-set cardinalities are additional constraints, not global rules: a person can have concurrent engagements; distinct ownership stakes can coexist; a single resolved model alias cannot map to two versions at the same concrete provider/region/channel scope. Admission locks all conflicting scope keys and checks cross-stream constraints in the same transaction. A single-stream GiST constraint does not enforce these global business rules.

## 4. Final clock vocabulary

| Field | Owner / rule |
|---|---|
| `valid_during` | Shared segment; admitted exact world applicability projection |
| `occurrence_extent_id` | Event revision; can represent uncertain event time |
| `observed_world_at` / `measurement_during` | Evidence/measurement; time actually observed or measured |
| `discovered_at` | Encounter; agent/provider reported encounter time, with clock source |
| `registered_at` | DB-stamped encounter arrival; no backdating from offline telemetry |
| `captured_at` | Existing immutable capture; cache hits never reset it |
| `published_at` | Source/story/document publication assertion with precision |
| `verified_at` | Evaluation result; not admission or world time |
| `knowledge_seq` | Committed tenant snapshot; exact replay coordinate |
| `recorded_at` | Batch admission clock under lock, not exact transaction-commit wall time |
| `revalidate_after` | Derived from a pinned policy and actual observation; not truth expiration |

Use UTC for observed instants. Preserve date-only source expressions and their calendar precision. Consolidate date uncertainty in `temporal.extent`, rather than adding guessed midnight timestamps everywhere. The exact segment projection is admitted only when a source or explicit domain policy supports it. An unknown timezone does not silently become UTC. Day/month/year expressions may be stored as date ranges inside the extent contract; converting them to timestamp windows requires a recorded timezone/projection policy.

An event window is the **possible time of an occurrence**. An interval is the **duration of a condition**. The two are not interchangeable. A point observation cannot prove a continuous state; a carry-forward inference must be labelled and policy-bound. Between last-unarchived and first-archived observations, return an uncertain transition window unless other evidence resolves it.

Keep `belief = accepted/disputed/unknown`, the typed value, freshness and provenance quality independent. `archived=false` is a value; absence is unknown. Retraction withdraws our endorsement; it is not the world's opposite value. Future announced availability is representable as future validity plus already-known announcement; it is not current availability.

### Delay queries

Compute delays against the first encounter evidencing the **specific event/assertion**, not the entity's first discovery. For exact event time E and encountered/registered time D:

```text
encounter_delay = discovered_at - E
registered_discovery_delay = registered_at - E
capture_delay = captured_at - E
admission_processing_delay = batch.recorded_at - registered_at
```

They are signed. Negative event-relative delay means advance knowledge, usually of an announcement/scheduled event; it is not an error. Distinguish scheduled occurrence from later confirmed actual occurrence. If E is bounded by `[earliest,latest]`, delay lies between `D-latest` and `D-earliest`, retaining open/closed boundary semantics. If E is unknown, scalar delay is null with an explicit reason.

To reproduce what was knowable, require encounter-resolution and admitted claims to be available at K. Client discovery timestamps received later cannot leak into earlier Missions. Revisited/merged identities can change today's earliest resolved discovery while old K answers remain stable.

## 5. Domain transformations: events cause boundaries only with evidence

| Domain | Events worth modelling | States / relationships they can change |
|---|---|---|
| Person | hired, left, role_started, role_ended, appointed, resigned | Engagement, role tenure, board/advisor membership; founding attribution persists after departure |
| Organization | founded, renamed, transaction_announced, transaction_closed, transaction_cancelled, dissolved | Name, ownership/control stake, operating status; acquisition announcement does not itself transfer control |
| Repository | created, made_public/private, renamed, transferred, archived, unarchived | Visibility, host location, host ownership, archival; separate hosted release publication |
| Library | release_published, release_yanked/unyanked, package_deprecated, maintainer_appointed/ended, registry_transfer | Release availability, package maintenance, appointments and registry identity |
| Product | announced, preview_started, generally_available, specification_changed, feature_enabled/disabled/restored, deprecated, discontinued | Scoped offering, feature specification, availability, integration and dependency histories |
| Model | version_released, offering_started/retired, alias_rebound | Version identity/derivation, provider offering, alias binding; endpoint limits differ from immutable model characteristics |
| Benchmark | protocol_version_published, run_completed, result_corrected, benchmark_retired | Protocol identity, measurements, result admission; a new run is not a correction |
| Case study | deployment_started, migration_started/completed, measurement_completed, report_published/corrected | Deployment technology episodes, outcome observations, report interpretation |
| Story | published, revised, corrected, retracted | Story-version identity and admissibility; reported world events have separate occurrences |

Event interpretation revisions are append-only. Stable typed event tables link participants and subjects; revisions carry occurrence and belief. A subsequent discovered notice can correct an event date without creating a second real-world hire. A rehire is a new engagement and hire event. An acquired company and a deduplicated company record have separate histories.

“When was the repo released?” must have named answers: repository created; repository made public; first commit; hosted release published; package release published. Expose these as separate columns/events, never one overloaded `released_at`. Archival does not imply a package was yanked or a product discontinued.

For product specifications use explicit typed definition tables where the value is important: model context limits, price amount/currency/unit, supported OS, protocol version, feature availability. A feature's immutable `specification_revision` can also point to a document/artifact for full detail. Its historical **assignment** is temporal. An edited title/description must not rewrite an old snapshot's meaning.

## 6. Product history and relationship queries

The [prototype query file](./relational-prototype.sql) supplies executable equivalents of these queries. Its product, **Example Code**, is fictional and shaped like an AI coding product. It makes no claims about actual Claude Code features or dates. In production, the same function accepts the canonical Claude Code product ID and admitted evidence.

```sql
-- Product features at three world dates using today's admitted interpretation.
-- Freeze anchor date and K on the request, rather than reevaluating now() per row.
with dates(label, world_at) as (values
  ('one year ago',    timestamptz '2025-09-10 00:00Z'),
  ('six months ago',  timestamptz '2026-03-10 00:00Z'),
  ('two months ago',  timestamptz '2026-07-10 00:00Z')
)
select d.label, f.feature_name, f.availability, f.specification_revision_id
from dates d cross join lateral api.product_features_at(
  :tenant_id, :product_id, :edition_id, :plan_id, :region_id,
  :channel_id, d.world_at, :knowledge_seq
) f;
```

`api.product_features_at` is a proposed production API, not an existing RPC. Return unknown coverage as well as known features; the absence of a catalog entry does not prove no feature existed. Different plans/regions are not unioned into a misleading universal product state. Exact version constraints and rollout cohort, where relevant, belong to explicit scope identities; define `all`, `not_applicable`, and `unknown` distinctly. Unknown scope cannot establish universal availability. Require non-null scope keys and a documented no-overlap/precedence policy instead of nullable uniqueness loopholes.

Two modes answer different questions:

- **Historical world reconstruction:** same latest K, different world dates.
- **Contemporaneous knowledge:** each date uses its saved then-committed K (or explicitly approximate ledger-clock mapping). Do not join the old snapshot to today's feature names, model aliases, owners, or spec revisions.

Employment queries select the latest engagement revision ≤ K, return its engaged intervals, then join roles under the same K with interval intersection. Hire/leave boundaries come from event revisions when established; an interval's known lower observation bound is not automatically a hire event. Include open/uncertain endpoints. Do not use `min(start),max(end)` across rehired episodes: that erases unemployment gaps.

For full entity life, union event interpretations with change points from its selected typed streams, preserving each fact's source, scope and uncertainty. Provide both `entity_timeline(V1,V2,K)` and `knowledge_changes(entity,K1,K2)`; changes of belief should not masquerade as world events.

## 7. Documents, chunks, evidence and vector spaces

Keep this graph and its distinct semantics:

```text
source -> immutable capture -> document version -> representation
    -> chunk set -> immutable chunk + selectors/spans
    -> semantic claim link -> evaluated support decision
    -> scoped factual assertion / temporal segment

chunk/projection -> embedding run -> vector item
    -> sealed publication membership -> publication switch receipt
    -> retrieval run -> exact returned evidence packet -> report/Mission
```

A document identity can acquire a new version. A chunk's bytes do not change; edits/rechunking produce new identities and derivation links. Do not relabel an old chunk ID with new text or reuse its offsets against a new capture. A document can support different claims over different world intervals, so **there is no single global document-validity range** that proves all of its contents.

Reuse `retrieval.chunk_claim_link` for immutable semantic associations (`states/supports/challenges/...`). These links are not acceptance. Add an admitted **support interpretation**:

```text
evidence.support_relationship
  tenant_id, id, claim_id FK, locator_id FK, stream_id FK
evidence.support_segment
  tenant_id, segment_id FK temporal.segment, support_relationship_id FK,
  verdict, assessment_id FK, source_disposition_revision_id FK
evidence.segment_claim_binding
  tenant_id, target_segment_id FK temporal.segment, claim_id FK,
  role (supports/challenges/context), support_segment_id FK
```

Bind optional chunk context from the **retrieval side** to the support relationship, with chunk and locator custody checks. Evidence need not depend on retrieval chunks: exact capture locators are the authoritative evidence anchor. A chunk→support bridge must prove its spans resolve to the same capture/selected content as the evidence locator. A single source can back several claims; use normalized membership rows, not one `provenance_claim_id` as the only proof link.

Support's world scope describes the assertion interval it substantiates; knowledge revision records when that support was admitted or withdrawn. Semantic entailment of immutable words does not spontaneously change because time passed. A claim about June can remain historically supported while a claim that it is still true in September becomes stale or contradicted. Reassessment and new context create new support decisions; preserve both.

Version document/source disposition (active/corrected/retracted/withdrawn) with new admitted streams. Retraction can suspend current downstream use and schedule reassessment; it does not automatically prove every fact false, especially when independent evidence remains. Preserve historical evidence packets as **what was used**, annotated through new correction/impact records. Do not silently rewrite past reports.

### Retrieval and spaces have an additional publication coordinate

Retain existing `space_publication` and immutable switch receipts. Add normalized, sealed **publication membership** if an existing manifest cannot be resolved by exact member identities. Each membership pins vector item/chunk/projection and admission proof. Add `knowledge_seq`, support-policy version, embedding/configuration digests and membership manifest digest to the relevant publication/run bindings.

`K` alone cannot reproduce a live vector index. A retrieval run must pin `publication_id` (or one per selected space), backend/index generation, filter/policy version, query embedding identity, ranking configuration, candidate/result IDs/scores/order, and actual evidence packet. Keep physical activation receipts distinct from knowledge admission; publication may lag K. A watermark proves the admitted corpus snapshot used to build that publication, not universal completeness of every domain.

Never join old membership through today's mutable `active_publication_id`. Withdrawal removes future eligibility through new decisions/switches, without deleting historical membership. A current retrieval can overlay newly admitted retractions while an index rebuild is pending; persist that overlay cutoff/policy in the run. Exact replay uses its original overlay and memberships; a corrected replay is a new run. Re-running approximate search may differ, so retained outputs are the authoritative record of what was returned.

Historical content reads still enforce today's authorization. Old permission snapshots are audit evidence, not permission to disclose now. If required retained bytes have been removed under a retention/erasure policy, keep permitted lineage tombstones and return `replay_content_unavailable`; a surviving digest does not make the content reconstructible.

## 8. Transaction, integrity and migration requirements

Production admission algorithm:

1. Authenticate tenant and bounded service identity. Resolve idempotency before writes: same key+digest returns original receipt/K; same key+different digest is a conflict.
2. Lock tenant knowledge head and any business scope locks in a deterministic order. Check expected head/stream revisions; stale input returns `rebase_required`.
3. Validate input manifest and sealed evidence, temporal precision, typed endpoint membership, permitted stream kinds, and cardinality. Agent-authored JSON is an intent, never direct DML authority.
4. Insert provisional revisions, segments, typed payloads, event interpretations, evidence memberships and lineage. Ensure parent revisions are earlier and same stream; segment derivation across streams is a distinct explicitly allowed relation.
5. Validate complete subtype coverage, world bounds, cross-stream exclusivity, no missing evidence, all revised stream memberships, and required receipt/artifact custody. Empty replacements require explicit disposition. Reject unresolved future evidence and cross-tenant edges.
6. Insert immutable batch seal last, update head and append outbox atomically. Prevent updates/deletes and late membership additions to sealed history, including through `TRUNCATE` or cascades for writer roles.
7. Return committed K. Projection workers publish their own watermark and failure state. They cannot claim a partially applied K.

`recorded_at` is DB-assigned under serialization, with sequence the ordering authority even if wall clock moves backward. Do not backdate admissions for imports. Exact visibility is the saved committed snapshot token; transaction timestamps alone cannot establish external commit-time visibility.

The migration session must implement RLS/grants, restricted search paths, ownership and trigger permissions, subtype completeness, receipt immutability checks, sequence allocation, conflict retries, and concurrent-client tests. Existing mutable identity descriptions become projections, with `projection_knowledge_seq`; obsolete mutation APIs must be retired or routed through admission. No two independent authoritative write paths.

## 9. Definition of done for migration sessions

Use the staged [migration map](./MIGRATION_MAP.md). The session must establish:

- Repository code inventory reconciled to applied migrations; no assumptions from local filenames alone.
- Explicit foundational-schema dependency amendment; corpus still has no upward evaluation/retrieval FKs.
- Shared envelope plus typed bindings/payloads and normalized support/encounter mappings.
- Atomic admission for multiple streams; duplicate key behavior; stale proposals; rollback; concurrent readers and writers.
- Query proofs for hiring/leaving/rehire, repository publication and archival, signed/bounded discovery delays, scoped product features at three dates, and document-support change with old packet retention.
- PostgreSQL 17/Supabase fresh-chain and populated-upgrade tests in a disposable target, tenant/RLS tests, type regeneration using this repository's workflow, and coherent DDL+types changes.
- Backfill report marking exact/source-derived, observation-bounded, and `legacy_unknown` history. No invented effective dates from `created_at`/default `now()`.
- Consumer cutover, projection rebuild checkpoints, repeatable forward recovery, and retained audit history. Do not reset the populated shared database or hard-delete old provenance.

The existing and extended embedded proofs are useful design checks. They do not substitute for those production integration proofs. All future migrations and generated shared types remain exclusively in `ai-engineer-db-contract`.
