# Temporal knowledge and change lineage — executable design prototype

**Date:** 2026-09-10 · **Status:** proposed architecture for discussion, not an accepted migration.

This proposal answers three different questions: **when did we encounter something, when do we believe it was true in the world, and what did our system believe at a particular point in its history?** Its additional purpose is to make corrections and transformations usable as learning evidence.

Recommendation: preserve typed entity identities; store immutable evidence and decisions; publish **versioned timelines of typed facts and relationships**. Reconstruct state with two coordinates: `world_at` and `knowledge_seq`. Keep discovery, source publication, capture, and evaluation clocks as separately named observations. An unknown time stays unknown.

The runnable [prototype.sql](./prototype.sql) demonstrates repository archival through a world change, a retroactive correction, a dispute, and a resolution. [verify.mjs](./verify.mjs) executes the schema and tests it in an isolated in-memory PostgreSQL runtime. The remaining entity schemas below are integration designs; the executable slice does not pretend to implement every domain.

**Proof result:** 32 checks passed on PostgreSQL 18.3 through PGlite 0.5.8. The shared contract targets PostgreSQL 17; a full PostgreSQL 17/Supabase migration proof remains required before adoption.

## 1. What the existing contract already says

This is based on the local migration sources, including working-tree files; it is **not a claim that these migrations have all been deployed**.

| Contract evidence | What exists | Consequence for this proposal |
|---|---|---|
| [Corpus foundation](../../supabase/migrations/20260826000500_corpus.sql) | Typed identities; six temporal fact tables; relationship tables; receipt references; GiST exclusions | Keep typed entities and real foreign keys. Extend temporal semantics rather than introducing an untyped entity/value store. |
| Same migration | Several `valid_from` fields default to `now()`; mutable profile fields and lifecycle states | Ingestion time can masquerade as world-valid time. Remove that default in a future migration; retain historical ambiguity when backfilling. |
| [Evidence core](../../supabase/migrations/20260826000300_evidence_core.sql) | Immutable captures and locators | Reuse captured bytes and selectors as evidence of temporal assertions. |
| [Discovery provenance](../../supabase/migrations/20260829181815_cloud_agent_parallel_source_provenance.sql) | Queries, retrievals, support roles | Retain every encounter; entity discovery also needs a typed resolution link from an encounter to an entity. |
| [Entity relationships](../../supabase/migrations/20260829192855_optimize_ai_entity_taxonomy_and_relationships.sql) | Product versions; organization ownership; model derivation; case-study links | Several relationship primary keys allow only one row per pair/kind, preventing repeated episodes. Version these relationships. |
| [Case studies](../../supabase/migrations/20260829012824_case_study_entity_contract.sql) | Publication date, summary, structured outcomes | Publication time, deployment time, and outcome measurement window must remain separate. |
| [Content contract](../../supabase/migrations/20260903010000_knowledge_content_contract.sql) | Document versions, artifact lineage, tenant-composite FKs | Reuse this custody infrastructure; extend its connection to fact decisions. |
| [Project provenance](../../supabase/migrations/20260831201650_project_provenance.sql) | `provenance` namespace explicitly scoped to design objects | Do not silently repurpose it into the universal temporal ledger. Name and approve that boundary separately. |

All future shared DDL belongs in this repository. This prototype lives under `docs/`, outside the migration chain, and does not change generated types or the shared database.

## 2. The temporal dimensions

Two dimensions determine historical state; the other clocks explain how evidence reached that state.

| Clock / coordinate | Concrete representation | Meaning |
|---|---|---|
| **World-valid time** | `valid_during tstzrange` or a domain-specific `daterange` | Interval over which an admitted assertion applies in the world. It is our evidenced assertion about reality, not omniscient truth. |
| **Knowledge time** | Tenant-scoped committed `knowledge_seq`; associated `recorded_at` | Which admitted knowledge revision was available. Used for historical replay and preventing future-information leakage. |
| **Discovery** | Immutable encounter `discovered_at` plus DB `registered_at` | When an agent/service encountered a lead. First discovery is derived within a tenant and identity-resolution snapshot. |
| **Source publication / update** | A sourced temporal assertion with precision | When the publisher says content was published or changed. A page's `Last-Modified` header is evidence, not automatically the effective date of its claims. |
| **Capture** | `evidence.source_capture.captured_at` | When specific source bytes were obtained. A later cache retrieval does not recapture or refresh them. |
| **Observation / measurement** | `observed_world_at` or `measurement_during` | When the source actually inspected a condition, or the period measured. Distinct from when we fetched the report. |
| **Evaluation / admission** | Evaluation receipt time; admission batch | When evidence was assessed and the resulting belief admitted. Verification completion and corpus admission are distinct. |
| **Execution** | Operation start/end and Mission execution refs | When our transformations ran. This explains production, not world validity. |
| **Freshness deadline** | Versioned policy + `revalidate_after` | When the evidence should be checked again. Expiry makes a belief stale; it does not make the proposition false. |

Do not invent a total ordering across these clocks. A future retirement can be announced before it takes effect. A historical fact can be discovered years later. A capture can contain an earlier observation. Only impose causal ordering where the particular operation guarantees it.

### Knowledge time must have a precise contract

The prototype serializes admission batches per tenant using a locked head row. A committed head sequence is the **authoritative snapshot token**. Allocation and publication happen in one transaction; readers see either the old or new committed head. All timelines changed in a production batch share that token.

`recorded_at` is DB-assigned admission time under that lock, **not PostgreSQL commit time**. A timestamp generated inside a transaction cannot prove the exact instant another session could see the commit. Provide `known_at` as a documented convenience mapping to the ledger clock; save `knowledge_seq` on Missions, reports, and evaluations for exact reproduction. If exact wall-clock visibility is required, add a commit/WAL observation service with its own receipt and semantics. A bare sequence without serialization does not establish commit order.

The SQL fixture uses artificial historical batch timestamps. The production writer must never accept caller-supplied knowledge timestamps or sequence numbers. A per-tenant lock is a deliberately simple starting point; move to partitioned heads plus snapshot vectors only if measured contention justifies it.

## 3. Truth status and freshness are independent

Return three separate dimensions:

```json
{
  "world_at": "2026-09-10T00:00:00Z",
  "knowledge_seq": 5,
  "belief": "accepted",
  "value": true,
  "temporal_basis": "explicit_interval",
  "evidence_observed_at": "2026-09-05T10:00:00Z",
  "freshness": "stale",
  "revalidate_after": "2026-09-09T00:00:00Z",
  "timeline_revision": 5,
  "supporting_observation_ids": ["example-observation"]
}
```

*Illustrative response, not the exact fixture output.* `accepted`, `disputed`, and `unknown` describe belief. `true`/`false` is a value only for a Boolean predicate. `fresh`, `stale`, and `not_assessed` describe evidence freshness. A missing row returns **unknown**, never `false`. An open upper bound means no known end under this assertion; it does not prove continued truth forever.

For volatile properties, a point observation can justify an explicitly labelled **carry-forward inference** under a pinned policy. It cannot silently become an eternal interval. Historical queries must compute freshness relative to their supplied evaluation time and the policy known at their knowledge snapshot, never relative to an unqualified `now()`.

## 4. Dates, uncertain boundaries, and absence

Use half-open state intervals `[start, end)`: the new state owns the exact transition boundary. Keep domain dates as dates when the source only expresses calendar dates. For a cross-domain timestamp projection, preserve the original date, precision, timezone, and projection policy. “March 2026” is not “March 1 at 00:00 UTC.”

The executable schema includes a `temporal_extent` with four shapes:

```sql
-- Mutually exclusive representations, enforced by CHECK constraints.
kind text -- exact_interval | point_observation | uncertain_interval | unknown
valid_during tstzrange          -- only exact_interval
observed_world_at timestamptz   -- only point_observation
start_window tstzrange          -- possible start instants, not duration of truth
end_window tstzrange            -- possible end instants, not duration of truth
precision text                 -- instant | day | month | year | unknown
original_text text
timezone_name text
```

Example: a repo was observed unarchived on May 3 and archived on May 9. Record both observations; the transition is somewhere **after May 3 and at or before May 9**, unless other evidence narrows it. Do not manufacture May 9 as the exact archival time. If the boundary remains uncertain, timeline reads return an uncertainty span between the two known conditions. The executable exact-timeline slice deliberately does not promote uncertain extents into exact segments.

For uncertain intervals, a possible envelope and a definitely-valid interior can be derived under explicit boundary assumptions; they are different query modes. Empty or contradictory interiors mean “no definite interval established.” Unknown endpoints are not SQL range infinities. An unbounded range is reserved for an explicitly unbounded assertion or a labelled continuation policy.

Absence from a source is not deletion. A missing staff-list entry, unavailable URL, or absent search result is an observation. End employment, retire a product, or retract a fact only through evidence and an admission decision. Preserve withdrawn claims and old captures.

## 5. The storage model: typed facts, immutable timeline revisions

The design has five layers:

1. **Identity:** existing `corpus.library`, `person`, `organization`, `product`, `repository`, `case_study`, `ai_model`, `benchmark` and version tables.
2. **Observations:** claims, temporal extents, encounters, captures, measurements. Conflicting observations coexist.
3. **Admission batches:** immutable policy/receipt/input references and ordered knowledge snapshots.
4. **Typed timeline revisions:** the admitted interpretation of a property or relationship set at that knowledge snapshot, including explicitly disputed intervals.
5. **Projections:** current profiles, search indexes, reports, and timeline responses. Rebuildable from admitted records.

A timeline revision is a complete replacement **for one bounded fact stream**, such as archival status of one repo. It does not copy every property of an entity. Each segment has a stable revision-local identity, typed value, world interval, basis, evidence links, and freshness metadata. New evidence creates a new revision. Existing revisions and their segments stay immutable.

This has a simple proof: select the latest revision at or before snapshot K, then select its segment containing world time V. No in-place edits to previous valid-time windows are required. Old and new interpretations may overlap across knowledge revisions; segments for a single-valued property cannot overlap **within one revision**.

At high volume, replace full timeline copying with persistent segment reuse plus immutable membership manifests. Keep the same read semantics. Conventional `system_from/system_to` bitemporal rows are also a possible projection, but their closure updates must never become the only correction history.

### Concrete typed schema pattern

The executable repository example uses these structures with real composite foreign keys:

```sql
knowledge_batch(tenant_id, knowledge_seq, recorded_at, change_kind,
                decision_receipt_ref, policy_ref, input_manifest_ref)

repository_archival_revision(tenant_id, repository_id, knowledge_seq,
                            previous_seq)

repository_archival_segment(tenant_id, repository_id, knowledge_seq,
                           segment_no, valid_during, belief, archived,
                           temporal_basis, revalidate_after)

segment_evidence(tenant_id, repository_id, knowledge_seq, segment_no,
                 observation_id, evidence_role)

segment_lineage(tenant_id, repository_id, child_seq, child_segment_no,
                parent_seq, parent_segment_no, relation_kind)
```

Admission revisions reference immutable decisions and evidence. The fixture's text receipt/artifact handles are deliberate integration stubs. In production, substitute tenant-composite FKs to the existing operation receipts, artifacts, claims, and verification records; connect through Knowledge Services operations to the eventual `mission_control` execution identities. Do not add a second artifact store.

Segments are provisional until the batch row seals them. Deferred foreign keys allow insertion of children before the seal, all within a single transaction. Mutation guards prevent changing history or attaching new children to a sealed batch. Production additionally requires a bounded executor write API, tenant authorization, RLS, policy validation, and atomic outbox writes; the demo is not that service.

## 6. Typed application across the eight entity families

These are **proposed table shapes**, extending the current typed design. Every temporal segment also carries the envelope from section 5: tenant, revision, segment identity, valid range, belief, evidence, and temporal basis. FK targets shown here are production targets; version tables marked new do not yet follow merely from this proposal.

| Family | Concrete proposed fact / relationship columns | Identity and temporal rules |
|---|---|---|
| **Libraries** | `library_maintenance_segment(library_id FK corpus.library, status)`; `library_release_license_segment(release_id FK new corpus.library_release, license_expression)`; `library_maintainer_segment(library_id, person_id FK corpus.person, role, appointment_id)` | Package identity and release identity differ. License is a release-scoped expression; dual licenses are not conflicting single values. Dependency edges pin releases/constraints. Multiple maintainers can overlap; repeated appointments remain distinct. |
| **People** | `person_name_segment(person_id FK corpus.person, display_name)`; `person_employment_segment(person_id, organization_id FK corpus.organization, engagement_id, title, employment_kind, is_primary)` | Changing name/employer preserves person identity. Multiple employments can coexist; exclusivity applies only to a policy-defined primary role/scope. Rejoining creates a new engagement. |
| **Organizations** | `organization_name_segment(organization_id, legal_name, display_name)`; `organization_ownership_segment(child_organization_id, parent_organization_id, stake_kind, ownership_fraction)` | Announcement, legal closing, and operational integration have different times. Ownership can be fractional or shared. “Organization merged” is a world event; “duplicate records merged” is identity resolution. |
| **Products** | `product_availability_segment(product_version_id FK corpus.product_version, region_code, channel, availability)`; `product_feature_segment(product_version_id, feature_id FK corpus.product_feature, enabled)` | Region, plan, channel and version form the relevant scope. An announcement or preview does not mean global availability. Price requires currency, unit, plan and validity; measured prices remain observations. |
| **Repositories** | `repository_archival_segment(repository_id FK corpus.repository, archived)`; `repository_location_segment(repository_id, host, owner, name)`; `repository_owner_segment(repository_id, organization_id)` | Prefer stable provider repo ID over mutable path. A rename/transfer preserves identity. Path reuse must be time-scoped. Commits pin content; branches and tags are time-varying references. |
| **Case studies** | `case_study_deployment_segment(case_study_id FK corpus.case_study, subject_organization_id, product_version_id, deployment_kind)`; `case_study_outcome_observation(case_study_id, measurement_during, metric_definition_version_id, numeric_value, unit, cohort_ref, method_ref)` | Keep publication date, intervention period, measurement window, and correction date separate. A reported result is an attributed measurement; a claimed improvement is not automatically established causation. Version the report artifact. |
| **Models** | `model_availability_segment(ai_model_version_id FK corpus.ai_model_version, provider_id, region_code, access_channel, availability)`; `model_alias_segment(provider_id, alias, region_code, resolved_version_id)`; `model_version_derivation(child_version_id, parent_version_id, derivation_kind, evidence_claim_id)` | Family, immutable version/weights, and mutable endpoint alias differ. Fine-tuning/distillation creates a derived version with evidenced lineage. Availability and pricing vary by access channel. A knowledge-cutoff date is model metadata, not system knowledge time. |
| **Benchmarks** | `benchmark_version(id, benchmark_id FK corpus.benchmark, task_set_digest, dataset_version_ref, scoring_code_digest, protocol_artifact_id)` (new); `benchmark_result_observation(benchmark_version_id, model_version_id, measured_during, score, unit, harness_digest, configuration_artifact_id, sample_count)` | A score belongs to a particular run and configuration. Pin benchmark, dataset, model, prompts/tools, evaluator, aggregation and hardware where material. A corrected score supersedes that observation; a new run is a new measurement. Rankings are derived snapshots. |

Example relationship DDL for a future production migration (the referenced timeline revision is a new typed table using the section 5 pattern):

```sql
create table corpus.person_employment_segment (
  tenant_id uuid not null,
  person_id uuid not null,
  knowledge_seq bigint not null,
  segment_no integer not null,
  organization_id uuid not null,
  engagement_id uuid not null,
  title text not null,
  employment_kind text not null,
  valid_during tstzrange not null,
  primary key (tenant_id, person_id, knowledge_seq, segment_no),
  foreign key (tenant_id, person_id, knowledge_seq)
    references corpus.person_employment_revision
      (tenant_id, person_id, knowledge_seq),
  foreign key (tenant_id, organization_id)
    references corpus.organization (tenant_id, id),
  exclude using gist (
    tenant_id with =, person_id with =, knowledge_seq with =,
    engagement_id with =, valid_during with &&
  )
);
```

This exclusivity is per engagement, not globally per person. Add the necessary `(tenant_id,id)` unique keys on production identity targets before these composite FKs; do not assume they already exist everywhere. Required temporal checks, evidence membership, immutability, grants and RLS follow the full executable pattern, not this abbreviated extension example.

**Do not use one universal non-overlap rule for every relationship.** Product ownership, licenses, employment, supported models, and maintainer memberships have different cardinalities. A retracted record is a knowledge decision; a discontinued product is a world state. Avoid putting both in a single `lifecycle_state` field.

## 7. Worked example: late discovery and correction

All names and dates below are fictional. The source explicitly states event times; these are not inferred from crawl times.

| Knowledge snapshot | System decision | Admitted world timeline |
|---|---|---|
| K1 · June 2 | First admitted state | Unarchived from May 1, no known end |
| K2 · June 10 | Discover archival effective June 5 | Unarchived `[May 1, June 5)`; archived `[June 5, ∞)` |
| K3 · June 20 | Correct archival date to June 3 | Unarchived `[May 1, June 3)`; archived `[June 3, ∞)` |
| K4 · June 22 | Conflicting evidence admitted as dispute | Unarchived `[May 1, June 3)`; disputed `[June 3, June 5)`; archived `[June 5, ∞)` |
| K5 · June 25 | Resolve dispute in favor of June 3 | Unarchived `[May 1, June 3)`; archived `[June 3, ∞)` |

For **June 4 in the world**, the answers are false at K2, true at K3, disputed at K4, and true at K5. Before K1 the answer is unknown. A stale K5 assertion remains accepted but flagged stale; no timestamp makes it automatically false.

The K2→K3 delta is a **knowledge correction** affecting the world interval `[June 3, June 5)`. It does not assert that the repo changed state on June 20. K3→K4 is a change in belief status, not a new repository event.

### Entity X from time1 to time2

Every timeline request supplies a knowledge snapshot:

The production API validates a finite nonempty request window, tenant access, entity existence, and `0 <= knowledge_seq <= committed_head`. The SQL demo functions assume those boundary checks. A future or invalid snapshot token must not silently be interpreted as the latest state. Distinguish an unknown entity (API not-found) from a known entity whose property is unknown in a historical interval.

```sql
select * from temporal_demo.repository_timeline(
  '00000000-0000-0000-0000-000000000001', -- tenant
  '00000000-0000-0000-0000-000000000101', -- repo
  '[2026-06-01 00:00Z,2026-06-08 00:00Z)'::tstzrange,
  3 -- interpretation known at K3
);
```

Expected: false `[June 1, June 3)` and true `[June 3, June 8)`. The function clips segments to the request interval and emits explicit unknown gaps. To ask “how did our understanding change?”, hold world time fixed and vary K. To ask “how did the entity change?”, hold K fixed and vary world time.

A full entity-state response combines its typed streams at the same K, sweeps the union of their valid-time boundaries, and produces a state vector per span. Preserve individual evidence/freshness per property; do not give the whole entity a single truth timestamp. Historical relationship joins must apply the same K and intersect valid intervals. Joining a historical fact to today's organization profile leaks future knowledge.

## 8. Three different kinds of lineage

| Kind | Examples | Required record |
|---|---|---|
| **World change** | Employment begins, repo transfers, model retires | Evidenced event/transition with temporal extent; old/new fact segments interpreted by an admission decision. Record `cause_unknown` unless a cause is actually supported. |
| **Knowledge change** | Late evidence, corrected date, contradiction, retraction, identity-resolution correction | Decision, previous/new interpretation, affected world interval, evidence, policy, receipt, and knowledge snapshot. |
| **Production transformation** | PDF→text, extraction→claim, claims→report, source→code patch | Versioned operation with ordered typed input/output roles, artifact/claim identities, implementation/configuration digests, execution refs, and receipts. |

Use distinct relations such as `corrects`, `carries_forward`, `reassesses`, `split_from`, `derived_from`, and `supersedes`. A relation is directional and typed. The demo requires segment parents to be in an earlier knowledge revision, preventing cycles for this relation family. Do not impose that rule on every domain relationship; ownership and dependencies have their own rules.

For transformations, reuse `content` transformation records and artifact lineage. A production association should look like:

```text
transformation_run
  operation receipt + implementation version + configuration artifact
  input members:  capture A / role source; capture B / role context
  output members: claim C / role extraction; report D / role synthesis
  execution: Mission Revision / Run / activation / attempt
  timing: started_at / completed_at / recorded knowledge snapshot
  decision links: verification assessment -> admission batch
```

An ordered pair of before/after values alone cannot explain why a transformation happened. Preserve input manifests and decisions. Identical output bytes from different parents retain distinct lineage identity.

Identity merges and splits need their own immutable decision membership records linking **typed** source and target identities with a knowledge snapshot. Do not destructively redirect all old fact FKs through today's `merged_into_id`. Historical queries resolve identity at K. A corporate acquisition and deduplication of two organization rows are separate operations with different meanings.

## 9. Discovery and learning without future leakage

“First discovered” has several scopes: first source encounter, first entity mention, first resolved identity, and first admitted fact. Preserve the encounter-to-entity resolution decision so deduplication can change today's interpretation of earliest discovery without changing old historical answers. Use server registration time alongside client-reported discovery time; delayed telemetry is not evidence that an earlier Mission had access to it.

Candidate discovery binding:

```text
repository_encounter_resolution
  tenant_id, repository_id FK, source_retrieval_id FK,
  resolution_decision_id FK, knowledge_seq,
  discovered_at, registered_at, discovery_clock_source
```

Provide analogous typed bindings for other entity kinds or reuse existing typed mention/identity tables after inspecting their admission contracts. Repeated encounters append observations; `first_discovered_at` is a projection, not an overwritten canonical timestamp.

Learning examples must pin the **knowledge snapshot actually available at decision time** and the exact retrieved input manifest. Later outcomes may be labels but cannot enter the historical input. Preserve evaluator/rubric versions and label revisions too. Compare:

- Discovery lag: first registered encounter minus a sufficiently precise world event time.
- Admission lag: admission minus first registered usable evidence.
- Correction frequency and affected downstream artifacts.
- Staleness exposure: decisions relying on evidence overdue under their then-active policy.
- Temporal extraction accuracy: correct effective date and uncertainty handling, separately from value accuracy.

Unknown event times produce unknown or bounded lag, not made-up scalar metrics. A new capture with identical bytes need not be independent confirmation, and a cache hit never resets freshness by itself. Training/evaluation splits should group shared source and transformation ancestry where it could leak answers across partitions.

## 10. Admission and rollout contract

The production transaction should:

1. Authenticate the executor and tenant; resolve the idempotency key and input digest.
2. Lock the relevant admission head; compare the caller's expected head. A stale proposal returns `rebase_required`.
3. Verify sealed claims, temporal interpretation, source/selector custody, and typed subject scope. Contradictions remain evidence even when not chosen as canonical values.
4. Write complete replacement timeline revisions for affected streams, with evidence membership and segment lineage. If splitting a range, explicitly preserve unaffected portions; disjoint gaps stay unknown.
5. Seal one batch with policy/receipt/input references, update its head, and write the outbox event atomically.
6. Return snapshot K. Build search/profile projections with an explicit watermark. A lagging projection must not claim to represent a newer K.

Do not regenerate production types for this documentation prototype. When accepted, implement migrations here, run them in an isolated disposable database, regenerate `src/database.generated.ts` with the repository's prescribed workflow, and commit DDL and generated types together.

Roll out: repository archival first; model availability and person employment next; other typed streams after their cardinality and temporal rules are written. Reuse existing metrics and benchmark records rather than relocating observations into entity profiles. Backfill only what retained evidence establishes. `created_at` is a registration bound, not proof of world validity or a complete historical admission log. Mark imported history `legacy_unknown` or equivalent explicit provenance quality.

## 11. What the executable proof covers

The verification script exercises the SQL schema, exact and uncertain extents, as-of reconstruction, half-open boundaries, unknown gaps, late correction, disputes, freshness, immutable sealing, tenant isolation through FKs, overlap rejection, and ordered correction lineage. It records the PostgreSQL runtime version in [verification-results.json](./verification-results.json).

Reproduce from the workspace root in PowerShell. Dependencies are installed in a temporary runtime directory, leaving the contract's package files unchanged:

```powershell
$temporalRuntime = Join-Path $env:TEMP 'aiengineer-temporal-runtime'
npm install --prefix $temporalRuntime --no-audit --no-fund --ignore-scripts @electric-sql/pglite@0.5.8
$env:PGLITE_MODULE_ROOT = $temporalRuntime
node ai-engineer-db-contract/docs/temporal-provenance/verify.mjs
```

The script always constructs a new in-memory database. It does not read `.env`, connect to Supabase, or run the repository migration chain. It rewrites only the adjacent verification result file.

It does **not** prove production RLS/grants, concurrent admission behavior, idempotent service delivery, compatibility with the complete Supabase migration chain, or a production writer. Those are explicit integration checks before promoting this design. The contract targets PostgreSQL 17; the embedded runtime's reported version is recorded so its test scope is visible.

## 12. Reference mechanics

PostgreSQL provides timestamp/date ranges, containment/intersection operators, and GiST exclusion constraints for rejecting overlaps. Scalar equality plus range exclusion uses `btree_gist`. This prototype uses those established primitives, without assuming newer temporal SQL syntax. [PostgreSQL range types and constraints](https://www.postgresql.org/docs/17/rangetypes.html)

The design extends the prior provenance recommendation with explicit temporal interpretation and admission history. W3C PROV supplies a compatible foundation for entities, activities, agents and derivation, while these domain-specific temporal and acceptance rules are our proposed contract. [W3C PROV overview](https://www.w3.org/TR/prov-overview/)
