# Knowledge model — final recommendation for the entity / temporal / source / vector migration

> **Superseded on 2026-09-11 by [FINAL-RECOMMENDATION.md](./FINAL-RECOMMENDATION.md).** That document keeps D1/D4/D6 from here, collapses the typed relationship tables into `corpus.relationship`, simplifies the temporal model to `[k_from,k_to)` rows, adds media / document types / summaries / repositories, and replaces §9's backfill plan with a destructive rebuild runbook. Read this file only for the evidence-based inventory in §1.

**2026-09-10 · Supersedes the design in `docs/temporal-provenance/` where the two differ.** Everything in this document was derived from the local migration chain (`supabase/migrations/`, latest state, working tree included), the `vector-backends` and `knowledge-contracts` packages in `ai-engineer-knowledge-services`, and the temporal-provenance planning package. Nothing here has been applied. Scope is intentionally limited to: entities and relationships, temporal intelligence, sources and source intelligence, unstructured→structured linkage, vector spaces and technical intelligence. Mission control, curriculum, and user/learner schema are out of scope.

Reading order: §0 decisions → §1 what exists → §2–§7 one section per decision → §8 schema placement → §9 migration plan → Appendix DDL.

---

## 0. The decisions in one page

| # | Decision | Replaces / fixes |
|---|---|---|
| D1 | Add **`corpus.entity`** — a typed *identity registry* (shared primary key, `kind` from `taxonomy.entity_kind`). Every typed corpus table's PK becomes an FK into it. | Four different soft-polymorphism hacks in the live schema: `retrieval.projection_target(regclass, uuid)`, `corpus.entity_merge(entity_kind, uuid)`, `ranking.feature_value/ranking_result(entity_kind, uuid)`, the 14-way exclusive arc on `retrieval.vector_item` and 15-way arc on `ranking.metric_observation`. |
| D2 | Add the missing **industry entities**: `technique`, `model_offering`, `model_artifact`, `compute_device`, `compute_offering`, `registry` + `registry_listing`, `ai_protocol_feature`, `benchmark_version` / `benchmark_run`, `dataset_version`, `license`, `security_advisory`, `funding_round`, `corporate_transaction`, `industry_event`, `story` (content-bridged). Plus the version-level model derivation and technique relationships. | Concept-as-technique overloading, model family-level lineage only, no pricing/economics, no hardware, no registries as entities, no protocol feature granularity (MCP UI, elicitation, tasks…). |
| D3 | **Temporal**: adopt the `temporal` foundational schema from the handoff (head / batch / stream / revision / segment / extent / event / event_revision / lineage). The canonical entity row is *identity + a derived current-state projection* stamped with `projection_knowledge_seq`; the truth is the stream. Two read coordinates: world time `V` and admitted knowledge `K`. | Six `*_fact` tables and 25 Pattern-A relationship tables whose `valid_from default now()` fabricates world time from ingestion time; pair/kind PKs that overwrite earlier episodes. |
| D4 | **Source intelligence**: split the provider layer from source identity. Add `evidence.search_provider`, `evidence.provider_result`, an append-only `evidence.source_encounter` ledger, a mutable `evidence.source_state` projection (first/last seen, last action, next revisit), `evidence.extraction_run` / `extraction_record` (typed, locator-anchored extractions), and `evidence.attribution` (who said it, distinct from what supports it). Conversions stay in `content.transformation_run` + `document_representation`; segmentations stay in `retrieval.chunk_set` + `chunking_procedure_version`, both with controlled vocabularies promoted out of JSON. | `source_retrieval.retrieved_at` conflating discovered/cached/captured; `provider` and `capture_method` as free text; no "last time we saw this source and what we did"; extraction living only inside `orchestration.verification_structured_extraction_*`. |
| D5 | **Unstructured→structured linkage** as four explicit layers with controlled verbs: mention (lexical) → semantic link (chunk↔claim, chunk↔relationship) → admitted support (temporal stream) → segment binding. Retarget `chunk_entity_mention` and `chunk_relationship_evidence` to `corpus.entity` / `temporal.stream`. | Free-text `mention_role`, `evidence_role`; mentions pointing at `projection_target` instead of the entity. |
| D6 | **Vector spaces**: keep the physical design (one `halfvec(1536)` table list-partitioned by space key, HNSW cosine, hybrid RRF, sealed publications). Seed the eight logical spaces in SQL (they exist only in TypeScript today), add one `entity_timeline` space, and add **filter facets** to `vector_item` (`entity_id`, `entity_kind`, `valid_during`, `knowledge_seq`, `assurance_rank`) so retrieval can be entity-anchored and temporally scoped. Structured technical intelligence stays in `knowledge.*`; vectors index *projections of* structured rows and chunks, never replace them. | Spaces unseeded in the DB, no entity/temporal filters on vector items, `VectorSearchRequest` in `vector-backends` accepts only `(space version, embedding, limit)`. |

The one-paragraph model: **a typed relational graph of industry entities whose relationships and properties are temporal streams (world time + knowledge time), fed by an evidence pipeline that remembers every provider answer, every source encounter, every conversion and segmentation, and every extraction; with vector spaces as filterable projections of that graph and its source text.**

---

## 1. What exists today (evidence-based inventory)

### 1.1 Entities (`corpus`) — already rich

Typed identity tables: `person`, `organization`, `product`, `product_family`, `product_version`, `product_feature`, `repository`, `library`, `paper`, `video`, `talk`, `concept`, `dataset`, `benchmark`, `ai_model`, `ai_model_version`, `ai_protocol`, `ai_protocol_version`, `mcp_server` (+ `_version`, `_tool`, `_resource`, `_prompt`), `agent_skill` (+ `_version`), `case_study`. Identifier side tables for person/organization; `repository_alias`, `concept_alias`; `distribution_kind` vocabulary; `entity_merge(entity_kind, winner_id, loser_id)`.

`taxonomy.entity_kind` registers 14 codes (no `talk`, `video`, `product_family`). Facets: `entity_subtype`, `modality`, `access_model`, `deployment_model`, `organization_sector`, `organization_role`, `person_role`, `architecture_role`, `domain`, `maturity`, etc.

Relationships come in two incompatible patterns:

- **Pattern A** (`20260826000500_corpus.sql`): surrogate `id`, endpoints, role vocabulary, `valid_from timestamptz default now()`, `valid_to`, `confidence`, `lifecycle_state`, `provenance_claim_id`. 25 tables (employment, maintainer, dependency, implements-protocol, built-on-model, appeared-in-video, …).
- **Pattern B** (`20260829192855_…`): composite PK on `(from, to, kind)`, optional `valid_from/valid_to date`, no confidence. 13 tables (organization_relationship, org↔product, model↔model, protocol↔protocol, benchmark↔model_version, case_study↔*, …).

Six temporal facts (`*_fact`): license, maintenance status, repo archival, model availability, MCP registry status, paper retraction — each `valid_from default now()` with a GiST exclusion on active rows.

**Structural problems:** ingestion time masquerades as world time; a pair/kind PK cannot hold a rehire or a second partnership; relationship history is overwritten in place; no identity supertype so every cross-cutting table reinvents polymorphism.

### 1.2 Sources, evidence, content (`evidence`, `content`)

- `evidence.source` (source_class vocabulary, `canonical_url`, `logical_identity`, publisher text, license/robots). **No** host/domain, no first/last seen.
- `evidence.source_capture` — immutable bytes via `orchestration.artifact`, `content_sha256`, `captured_at`, `capture_method` (free text), HTTP metadata, producer XOR (attempt | knowledge_service.operation).
- `evidence.locator` — selector JSON + `selected_content_sha256`, resolution state (v1).
- Provider layer: `source_query(provider text, query_text, request_parameters, response_artifact_id, query_sha256, queried_at)`, `source_retrieval(query_id, source_id, capture_id?, provider_result_id, result_rank, retrieval_status discovered|cache_hit|captured|failed|skipped, retrieved_at)`, `source_support(retrieval_id, support_role, statement, locator_id?)` — self-described as operational audit, *not* claims.
- Claims: `claim` (type, status, statement, structured), typed associations to 18 targets, `claim_evidence_link(role supports|contradicts|qualifies|context)`, append-only `claim_evidence_assessment(verdict …)`, `claim_conflict`, `conflict_reconciliation`, verification runs/findings/adjudication.
- Content: `document` → `document_version(correction_state)` → `document_representation(representation_class source_native|rendered_snapshot|faithful_normalization|structural_extraction|semantic_projection|retrieval_projection)`; `transformation_run(transformation_kind text)` with typed inputs/outputs; `document_node/_edge`; `conversion_evaluation/_finding`. All immutable.

### 1.3 Vectors and retrieval (`retrieval`)

Layering, in plain words:

| Object | What it is |
|---|---|
| `vector_space` | Logical family of projections (`slug`, `class canonical|exploratory`). **No rows seeded**; the eight keys live only in `knowledge-contracts/src/spaces.ts`. |
| `vector_space_version` | Immutable embedding configuration (`embedding_model`, `dims`, `precision`, `distance_operator`, projection procedure, publication lifecycle). |
| `vector_store` / `vector_store_space` | Tenant container (`store_class official|exploratory|user_managed`) and its binding to a space with the **active version pointer**. |
| `space_publication` + `publication_switch_receipt` | Sealed, gated release of a space version into a store-space; atomic publish/rollback. |
| `vector_item` | Catalog row: one of 14 typed sources (claim, nine `knowledge.*` records, report_version, video, talk, retrieval_chunk) + `search_projection_id`, `search_text`, `search_tsv`, lifecycle, authority, freshness. |
| `vector_item_embedding_1536` | The actual `halfvec(1536)`, list-partitioned by `vector_space_key`, HNSW `halfvec_cosine_ops`. |
| `search_projection` | The embedded text (source text + contextual prefix), pointing at `projection_target(regclass, record_id)`. |

The eight logical spaces: `engineering_claims`, `tool_capabilities`, `implementation_examples`, `paper_case_study_knowledge`, `entity_profiles`, `model_capabilities`, `benchmark_intelligence`, `source_native_sections`. Search: `api.search_knowledge_1536` (ANN only) and `api.hybrid_knowledge_search_1536` (exact + tsvector + trigram + ANN, RRF).

Chunks: `chunk_set(representation_id, procedure_version_id, frozen_config)` → `retrieval_chunk` → `chunk_span(locator_id)`; `chunk_edge`. Linkage: `chunk_entity_mention` → `projection_target`; `chunk_claim_link(states|supports|challenges|qualifies|summarizes|cites)`; `chunk_concept_link`; `chunk_citation_link`; `chunk_relationship_evidence` → `projection_target`.

### 1.4 Technical intelligence (`knowledge`) and measurements (`ranking`)

Nine verified record types (`technical_problem`, `solution_pattern`, `advanced_usage_pattern`, `implementation_example`, `failure_mode`, `benchmark_result`, `compatibility_constraint`, `operational_practice`, `security_consideration`) with assurance levels and revalidation, plus 11 link tables to corpus. `ranking.metric_definition(_version)` and immutable `metric_observation` with a 15-way typed subject arc.

---

## 2. D1 — `corpus.entity`: one typed identity registry

### Why this deviates from the handoff

The handoff forbids an "untyped universal entity table". Agreed — but a **shared-primary-key supertype** is not that. It is the standard class-table-inheritance pattern: the registry row carries `(tenant_id, id, kind)`, every typed table's PK is also an FK to `(tenant_id, id, kind)` with a constant checked `kind`, so a `person` row cannot register as an `organization`, and a registry row without its typed row is rejected at seal time. What it buys:

1. `retrieval.projection_target`, `chunk_entity_mention`, `chunk_concept_link`, `chunk_relationship_evidence`, `entity_merge`, `feature_value`, `ranking_result`, and the new `vector_item.entity_id` facet all become **one real FK**.
2. Cross-kind operations (alias search, timeline, "everything about X", merges, story subjects, attribution) need one join, not 15 arcs.
3. The exclusive arcs on `vector_item` and `metric_observation` (13–15 nullable FKs each, growing with every new kind) stop growing.

### Shape

```sql
create table corpus.entity (
  tenant_id uuid not null default util.default_tenant_id(),
  id        uuid not null default util.uuidv7(),
  kind      text not null references taxonomy.entity_kind(code),
  created_by_receipt_id uuid not null references orchestration.operation_receipt(id),
  created_at timestamptz not null default now(),
  primary key (tenant_id, id),
  unique (tenant_id, id, kind)
);
-- every typed identity table, e.g.:
alter table corpus.person
  add column kind text not null default 'person' check (kind = 'person'),
  add foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind)
    deferrable initially deferred;
```

Companions:

- `corpus.entity_alias (tenant_id, entity_id, alias, alias_kind synonym|acronym|former_name|handle|ticker|slug|misspelling, language, source_claim_id)` — unified lexical resolution across kinds; trigram index. `concept_alias` and `repository_alias` fold into it (repository path history additionally gets a temporal location stream, D3).
- `corpus.entity_identifier (tenant_id, entity_id, scheme, value)` — unify `person_identifier` / `organization_identifier` and add schemes: `wikidata`, `ror`, `orcid`, `github`, `huggingface`, `npm`, `pypi`, `crates`, `doi`, `arxiv`, `openreview`, `mcp_registry`, `cve`, `ghsa`, `spdx`, `crunchbase`, `linkedin`, `x`, `youtube_channel`, `domain`, `other`.
- `corpus.entity_merge` gains `(tenant_id, winner_entity_id)` / `loser_entity_id` FKs with a same-kind check; a snapshot-aware resolver reads it at `K`.
- Register `talk`, `video`, `product_family`, and all new kinds in `taxonomy.entity_kind`.

Version tables (`ai_model_version`, `product_version`, `library_release`, `mcp_server_version`, `agent_skill_version`, `ai_protocol_version`, `benchmark_version`, `dataset_version`) **also** register as entities (kind `*_version`). Claims, mentions, benchmark subjects and vector items usually point at versions, not families.

---

## 3. D2 — entities and relationships we are missing

Priorities: **P0** = needed for the first temporal migration and the current flywheel; **P1** = needed for industry/economic intelligence within the next phase; **P2** = when ingestion demand justifies.

### 3.1 New entity kinds

| Kind | Priority | Why | Key columns (identity + immutable descriptors only; everything that changes over time is a stream) |
|---|---|---|---|
| `technique` | P0 | "Optimized algorithms used in open-source models" (MLA, GRPO, DualPipe, FP8 training, speculative decoding, MoE routing, FlashAttention, RoPE scaling, RLHF/DPO/RLVR, late chunking, contextual retrieval, computer-use action spaces). Today these are `concept.concept_kind='technique'` with no structure. | `slug, name, technique_kind (architecture|attention|training_objective|optimizer|parallelism|inference_optimization|quantization|alignment|data_pipeline|agent_pattern|retrieval|safety|kernel_systems|evaluation_method), summary, introduced_by_paper_id?` |
| `model_offering` | P0 | A **served** model: provider × model_version × endpoint/region/channel. Pricing, rate limits, context limits, deprecation dates belong here, not on the immutable `ai_model_version`. Replaces `ai_model_availability_fact`. | `provider_organization_id, ai_model_version_id, endpoint_slug (e.g. anthropic:claude-sonnet-4, bedrock:us-east-1:…), channel (api|batch|realtime|fine_tuning|embeddings), region_scope, modality_scope` |
| `model_artifact` | P1 | Downloadable weights/tokenizer/config (HF repo + revision, GGUF/safetensors, quantization). Closed models have none; that absence is information. | `ai_model_version_id, host (huggingface|github|modelscope|other), external_id, revision, artifact_role (weights|tokenizer|config|adapter|quantized), format, quantization, digest, license_id` |
| `compute_device` | P1 | GPUs/TPUs/NPUs as identities: H100, B200, MI300X, Trainium2, TPU v6e, M4 Ultra. Needed for hardware requirements, benchmark configs, cost intelligence. | `vendor_organization_id, slug, name, device_kind (gpu|tpu|npu|asic|cpu|soc), architecture, memory_gb, memory_bandwidth_gbps, interconnect, announced_on/released_on (events)` |
| `compute_offering` | P1 | Cloud SKU: provider × device × count × region. Carries `$/hr` and availability streams. | `provider_organization_id, instance_type, compute_device_id, device_count, region_scope` |
| `registry` | P0 | npm, PyPI, crates.io, HF Hub, official MCP Registry, Smithery, VS Code Marketplace, Cursor directory, skills directories. `mcp_server_registry_status_fact` implies a registry without modelling one. | `slug, name, registry_kind (package|model|dataset|mcp|skill|extension|app_store), operator_organization_id, url` |
| `registry_listing` | P0 | Entity × registry × external id. Status stream (listed/delisted/flagged/verified/official). | `registry_id, entity_id (kind ∈ library|mcp_server|agent_skill|ai_model|dataset|product), external_id, url` |
| `ai_protocol_feature` | P0 | Protocol granularity below versions: MCP `tools`, `resources`, `prompts`, `sampling`, `elicitation`, `roots`, `tasks`, `apps/ui`, `oauth`; A2A `agent_card`, `tasks`, `streaming`, `push_notifications`. Products/libraries support *features* with independent timelines. | `ai_protocol_id, slug, name, introduced_in_version_id, deprecated_in_version_id, spec_locator_id` |
| `library_release` | P0 | Immutable release identity (registry version) with publish/yank events; `library.first_released_on` becomes a projection. | `library_id, version_label, registry_listing_id, released_on (event), license_id, source_repository_revision` |
| `benchmark_version` | P0 | Task set / scoring protocol digest; a methodology change is a new version. | `benchmark_id, version_label, protocol_artifact_id, dataset_version_id?, scoring_code_digest` |
| `benchmark_run` + `benchmark_configuration` | P0 | A measurement event: subject entity (model_version / product_version / library_release / agent harness), config manifest, hardware, judge model, date. Results are `ranking.metric_observation` rows (existing), grouped by run. | `benchmark_version_id, subject_entity_id, configuration_id, executed_by_organization_id, compute_device_id?, judge_model_offering_id?, run_at (event), reported_by_source_id` |
| `dataset_version` | P1 | Splits/revisions (HF revision, date). | `dataset_id, version_label, host_revision, size_rows, digest` |
| `license` | P1 | Controlled SPDX vocabulary + custom AI licenses (Llama Community, RAIL, Gemma ToU) instead of `license_spdx text` scattered on 5 tables. | `spdx_id?, slug, name, license_kind (osi|copyleft|permissive|source_available|model_license|proprietary|custom), url` |
| `security_advisory` | P1 | CVE/GHSA affecting libraries, MCP servers, products (MCP tool poisoning, prompt-injection incidents). `knowledge.security_consideration.cve_ids[]` becomes an FK set. | `advisory_scheme (cve|ghsa|vendor), advisory_id, severity, cvss_score, summary, published_on (event)` |
| `funding_round` | P1 | Economics: round × recipient × amount × valuation; investors via participation table. | `recipient_organization_id, round_kind (pre_seed|seed|a|b|c|d_plus|growth|debt|grant|strategic|secondary|ipo), amount, currency, valuation_pre/post, announced (event)` |
| `corporate_transaction` | P1 | Acquisition, merger, acquihire, spinout, licensing deal, minority stake — n-ary via participants; announced/closed/cancelled events. Replaces overloaded `organization_relationship.kind in (acquired|merged|spinout)`. | `transaction_kind, announced/closed/cancelled events, consideration_amount, currency` |
| `industry_event` | P1 | Conferences and launches (AI Engineer World's Fair 2026, DevDay, I/O). `talk.event_slug/event_name/event_edition` become an FK. | `slug, name, event_kind (conference|summit|hackathon|launch|workshop|meetup), series_slug, edition, starts_on, ends_on, location, organizer_organization_id` |
| `story` | P1 | Editorial work identity (news/blog post/announcement) with typed subjects and "reports event" links; text lives in `content.document_version` via a content-owned bridge (`content.story_version_binding`). | `publisher_organization_id, headline, story_kind (news|announcement|analysis|blog|release_notes|changelog|incident_report)` |
| `deployment` | P2 | Verified production use behind case studies (customer × product/model × configuration). | per RELATIONSHIP_CATALOG |
| `regulation` / `policy_instrument` | P2 | EU AI Act, export controls on compute — relevant to economics; defer. | — |

`concept` remains the pedagogical/taxonomic kind (phenomena, roles, metrics as ideas). Rows with `concept_kind='technique'` migrate to `technique` through `entity_merge`-style mapping rows recorded in the import manifest.

### 3.2 New / re-shaped relationships

All of these are **typed tables with real FKs**; those marked ⏱ are relationship *episodes* bound to a `temporal.stream` (D3); those marked ⚡ are events; others are immutable declarations.

| Relationship | Pri | Notes |
|---|---|---|
| `ai_model_version_uses_technique (role core|component|training|inference|alignment)` | P0 | Version-level. Evidence required; a paper citation is not proof a shipped model uses it. |
| `paper_introduces_technique`, `library_implements_technique`, `technique_relationship (builds_on|variant_of|replaces|combines_with|special_case_of)` | P0 | |
| `ai_model_version_derivation (parent_version_id, derivation_kind fine_tuned|distilled|merged|quantized|adapter|continued_pretraining|rl_post_training, operation_ref)` | P0 | Many parents; replaces family-level `ai_model_relationship` for lineage. Keep `ai_model_relationship` only for `supersedes|competes_with` at family level. |
| `ai_model_version_specification` (immutable spec revision: parameter_count_total/active, architecture_family dense|moe|ssm|hybrid|diffusion, context_window, training_tokens, knowledge_cutoff, modalities) + ⏱ assignment stream | P0 | Same pattern as `feature_specification`. Vendors revise published specs; keep every revision. |
| ⏱ `model_offering_availability (status announced|preview|ga|deprecated|retired)`, ⏱ `model_offering_price (amount, currency, unit per_1m_input_tokens|per_1m_output_tokens|per_1m_cached_input_tokens|per_hour|per_seat_month|per_request|per_image|per_minute_audio, tier)`, ⏱ `model_offering_limit (limit_kind context_tokens|max_output_tokens|rpm|tpm|batch_size, value)` | P0 | Economics + "what did this cost in March". |
| ⏱ `model_offering_alias_binding (alias e.g. "claude-sonnet-latest" → model_version)` | P1 | One resolved value per scope at (V, K). |
| `ai_model_version_trained_on_dataset_version (role pretraining|sft|rl|evaluation|calibration, claimed|verified)` | P1 | |
| `ai_model_version_hardware_requirement (compute_device_id?, min_memory_gb, precision, quantization, throughput_claim)` | P1 | |
| ⏱ `compute_offering_price (amount, currency, unit per_hour|per_month|spot)`, ⏱ `compute_offering_availability` | P1 | |
| `benchmark_run_subject` is a column on `benchmark_run` (entity FK restricted to version kinds); `benchmark_run_result → ranking.metric_observation` membership owned by `ranking` | P0 | Respects the DAG: ranking points at corpus, never the reverse. |
| ⏱ `product_supports_protocol_feature`, ⏱ `library_supports_protocol_feature (role client|server|both, conformance full|partial|experimental)` | P0 | Product/library × protocol *feature* over time — "when did Cursor ship MCP elicitation". |
| `mcp_server_version_declares_tool` already exists as `mcp_server_tool`; add `agent_skill_version_declares_tool_use (mcp_server_tool_id|cli|api)` | P1 | Skill → tool surface. |
| ⏱ `registry_listing_status (listed|delisted|flagged|verified|official|archived)` | P0 | Replaces `mcp_server_registry_status_fact`. |
| ⚡ `library_release_event (published|yanked|unyanked|deprecated)` | P0 | |
| `security_advisory_affects (entity_id kind∈library|mcp_server|product|ai_model, affected_range, fixed_in_release_id?)` | P1 | |
| ⚡ `funding_participation (round_id, participant_entity_id person|organization, role lead|participant|angel)` , ⚡ `transaction_participant (role acquirer|target|merging_party|seller|spinout_parent|licensor|licensee)`, `transaction_asset (product_id|repository_id|ai_model_id)` | P1 | |
| ⏱ `organization_ownership_stake`, ⏱ `organization_control_relationship`, ⏱ `organization_partnership` | P1 | Split from `organization_relationship` per RELATIONSHIP_CATALOG. |
| `talk_presented_at_event (industry_event_id)` (replaces text columns) | P1 | |
| `story_about_entity (entity_id, role subject|mention|context)`, `story_reports_event (temporal.event_id, role reports|announces|disputes|corrects)`, `story_asserts_claim` | P1 | Content-owned bridges pointing at corpus/temporal. |
| Existing Pattern-A/B relationships (employment, maintainer, dependency, built-on, implements, backed-by, appeared-in, org↔product, …) | P0 | Preserve IDs and endpoints; move `valid_from/valid_to` into streams (D3). Pair/kind PKs become surrogate-ID episodes so repeats are representable. |

---

## 4. D3 — temporal intelligence

### 4.1 Direct answer to the design question

> Does the canonical entity hold relationships to temporal snapshots, or is the canonical entity the most up-to-date and links to temporal states?

Neither, exactly. The clean split is:

- **Identity** is permanent and non-temporal: `corpus.entity` + the typed row's natural key and immutable descriptors (a person's ORCID, a repo's provider-native id, a model version's label).
- **Every fact that can change** — names, roles, employment, availability, price, archival, license, maintenance status, protocol support, registry status, ownership, spec assignment, support disposition — is a **stream** of admitted interpretations. Each interpretation (revision) is a set of non-overlapping world-time **segments** with a belief (`accepted|disputed|unknown`) and a `temporal_basis` (`explicit|carry_forward|unresolved`).
- The mutable descriptive columns that exist today on entity rows (`person.headline`, `person.primary_organization_id`, `library.first_released_on`, `ai_model_version.deprecation_state`, `organization.display_name`…) become **projections**: derived from the segments valid at `V = now()` under the latest `K`, stamped with `projection_knowledge_seq`, rebuilt by a projection worker, never written directly by ingestion.

So the canonical row *is* "the most up-to-date" for reads, but it is a cache of the stream, and anything historical is answered from the stream with two coordinates:

- `V` — the world instant or window you ask about ("features of Claude Code in March 2026").
- `K` — the tenant knowledge sequence you replay against ("what did we believe on 2026-06-10", or simply the current head).

This is the bitemporal design in `IMPLEMENTATION_HANDOFF.md` §3–§6; adopt it as written. The handoff's table list (`temporal.knowledge_head`, `knowledge_batch`, `stream_kind`, `stream`, `revision`, `segment`, `extent`, `segment_lineage`, `event`, `event_revision`, `event_segment_effect`) is the target. Two refinements:

1. **Bind streams to `corpus.entity`** where the subject is unary (archival, availability, maintenance): `temporal.stream.subject_entity_id` FK, nullable for relationship-bound streams, with seal-time "exactly one binding" check. This removes one join for every entity timeline query.
2. **Add `temporal.entity_timeline(V1, V2, K)` and `temporal.knowledge_changes(entity, K1, K2)`** as the two read functions from day one; product-specific `api.*_at` functions layer on them.

### 4.2 Temporally aware ingestion

Every extracted assertion (D4 `extraction_record`) carries a `temporal.extent` — the source's *own* date expression with precision (`"in early 2025"`, `"released Jan 20"`, `"since v0.3"`) — plus the clocks the handoff defines: `discovered_at`, `registered_at`, `captured_at`, `published_at`, `verified_at`. Admission turns extents + evidence into segments and event revisions inside one `knowledge_batch`. Rules that must hold:

- A `valid_from default now()` is **never** admitted as world time. Backfill of the current fact tables marks each segment `temporal_basis='carry_forward'` with `belief='accepted'` only if a source date exists; otherwise `legacy_unknown` (documented in the import manifest) and the segment lower bound is the *observation* time with `temporal_basis='unresolved'`.
- Point observations ("repo was archived when we looked on June 9") produce **uncertain transition windows** between the last contrary and first confirming observation, not a fabricated instant.
- Scheduled/announced future events (`occurrence_mode='scheduled'`) are representable and distinct from confirmed occurrences; negative discovery delay is normal for announcements.

### 4.3 First stream kinds (P0)

| Stream kind | Subject / edge | Segment payload |
|---|---|---|
| `entity_name` | entity | `display_name, legal_name?` — renames without identity change (Twitter→X, Bard→Gemini) |
| `person_engagement` | person↔organization episode | `arrangement, employment_status` (from `person_employed_by_organization`) |
| `engagement_role` | engagement | `title, department, seniority` |
| `organization_product_role` | org↔product episode | `role developer|vendor|owner|operator|distributor|customer, is_primary` |
| `repository_archival`, `repository_visibility`, `repository_location` | repository | `archived` / `visibility` / `host, owner, name` (replaces `repository_alias` uniqueness) |
| `library_maintenance`, `library_license` | library | status / `license_id` |
| `model_offering_availability`, `model_offering_price`, `model_offering_limit` | model_offering | see §3.2 |
| `model_version_spec_assignment` | model version | `specification_revision_id` |
| `registry_listing_status` | registry_listing | status |
| `protocol_feature_support` | product/library ↔ protocol feature | `role, conformance` |
| `product_feature_scope` | product×feature×scope | `availability, specification_revision_id` (handoff) |
| `paper_disposition` | paper | `state none|correction|expression_of_concern|retracted` |
| `source_disposition` | content.document_version | `active|corrected|retracted|withdrawn` |
| `support` | evidence.support_relationship | `verdict, assessment_id` (D5) |

P0 events: `hired, left, founded, renamed, made_public, archived, unarchived, release_published, release_yanked, model_version_released, offering_started, offering_deprecated, offering_retired, price_changed, protocol_version_published, benchmark_run_completed, transaction_announced/closed, funding_announced, advisory_published, story_published/corrected/retracted`.

### 4.4 Query surface (contract for MCP tools / CLI / A2A)

```text
entity_state(entity_id, V, K)           -> all accepted segments covering V, grouped by stream kind
entity_timeline(entity_id, V1, V2, K)   -> events + segment change points in [V1,V2), with gaps marked unknown
knowledge_changes(entity_id, K1, K2)    -> what we changed our mind about (belief changes ≠ world events)
relationship_at(kind, from, to?, V, K)  -> episodes covering V
delays(event_id, K)                     -> signed discovery / registration / capture / admission delays
```

Every response carries `knowledge_seq` and, when vectors were used, `publication_id` (D6), so agents can cite an exact replayable coordinate.

---

## 5. D4 — source intelligence and source cache

### 5.1 The layered vocabulary (fixing conflations)

```text
search_provider  (Tavily, Firecrawl, Exa, Apify, GitHub API, HF Hub API, arXiv, YouTube, npm/PyPI, MCP Registry)
   └─ source_query          what we asked, params, cost, response artifact (retained bytes + digest)
        └─ provider_result  each hit as the provider returned it (rank, url, title, snippet, score, claimed published_at)
             └─ source      canonical identity of the thing on the web (URL-normalized, host, publisher org)
                  ├─ source_encounter (append-only ledger: every time we touched it and what we did)
                  ├─ source_state     (mutable projection: first/last seen, last action, next revisit)
                  └─ source_capture   (immutable bytes)  ─► content.document_version
                       └─ representation (conversion)   ─► chunk_set (segmentation)
                            └─ locator ─► extraction_record ─► claim / attribution / temporal assertion / mention
```

- A **provider answer** is retained twice: raw (`source_query.response_artifact_id`, existing) and normalized (`provider_result` rows). Providers' `published_at`, `score`, `snippet` are *claims by the provider*, stored as such, never copied onto `source`.
- **Encounter ≠ capture.** `cache_hit` never resets `captured_at`. `last_seen_at` on `source_state` is an encounter clock.
- **`source_retrieval`** is superseded by `provider_result` + `source_encounter`; keep it read-only for history and backfill rows into encounters (`discovered→provider_listed`, `cache_hit→cache_hit`, `captured→captured`, `failed→fetch_failed`, `skipped→skipped_policy`). **`source_support`** stays operational; canonical support is `claim_evidence_link` + the D5 support stream.

### 5.2 New tables (evidence schema)

| Table | Purpose | Key columns |
|---|---|---|
| `search_provider` | Controlled provider vocabulary | `code pk (tavily|firecrawl|exa|apify|github_api|huggingface_api|arxiv_api|youtube_api|npm_registry|pypi|crates_io|mcp_registry|openalex|semantic_scholar|manual|other), display_name, provider_kind (web_search|extract|crawl|api|transcript|registry|human), terms_url` |
| `source_query` (amend) | Add FK + typed query kind + accounting | `provider_code fk, query_kind (search|extract|crawl|map|lookup|transcript|feed_poll), response_sha256, result_count, cost_usd, latency_ms, knowledge_operation_id` |
| `provider_result` | One row per returned hit | `query_id, result_rank, url_as_returned, normalized_url, title, snippet, provider_score, provider_published_at, provider_metadata jsonb, resolved_source_id?, resolution_method` — unique `(query_id, result_rank)` |
| `source` (amend) | Identity enrichment | `host, registrable_domain, publisher_organization_id → corpus.organization?, source_kind refinement (official_docs|blog|news|paper|repo_file|registry_page|transcript|social_post|changelog|api_response|forum|other)` |
| `source_encounter` | Append-only ledger | `id, source_id, encounter_kind (provider_listed|link_discovered|fetch_attempted|captured|cache_hit|unchanged|converted|segmented|extracted|verified|cited_in_packet|revisit_scheduled|skipped_policy|blocked_robots|paywalled|rate_limited|fetch_failed|parse_failed), discovered_at, registered_at default now(), operation_id → knowledge_service.operation, provider_result_id?, capture_id?, representation_id?, chunk_set_id?, extraction_run_id?, retrieval_run_id?, outcome_detail jsonb` — check that the ref matching the kind is present |
| `source_state` | Mutable projection, one per source | `source_id pk, first_seen_at, last_seen_at, last_encounter_id, last_capture_id, last_capture_sha256, last_disposition, capture_count, failure_streak, revisit_policy_id → revalidation_policy, next_revisit_after, blocked_reason, projection_operation_id` — rebuilt from the ledger; never hand-written |
| `extraction_run` | One extractor pass over a representation | `id, representation_id → content.document_representation, extractor_identity (tool + version), extraction_kind (claims|entities|relationships|temporal_events|measurements|code_examples|tool_manifest|pricing_table), model_offering_id?, prompt_schema_version, operation_id, status, input_sha256, output_manifest_artifact_id, cost_usd` |
| `extraction_record` | Typed output, locator-anchored | `id, extraction_run_id, record_kind (claim|entity_mention|relationship_assertion|temporal_assertion|measurement|attribution|code_example), locator_id (required), extent_id → temporal.extent?, confidence, verification_state (pending|verified|rejected|superseded), claim_id?, staging_candidate_id?, entity_id?, stream_kind?, payload jsonb (schema-validated per record_kind)` — the *only* path from converted text into staging/claims |
| `attribution` | Who said it | `id, claim_id, locator_id, attributed_to_entity_id → corpus.entity (person|organization), attribution_kind (direct_quote|paraphrase|byline|official_statement|press_release|third_party_report|rumor), modality (asserted|hedged|denied|predicted|retracted), quoted_text_sha256` — distinct from `claim_evidence_link` (which is about *truth support*) and from `source.publisher_organization_id` (who *hosts* it) |
| `capture_method` (vocabulary) | Constrain `source_capture.capture_method` | `code pk (http_get|headless_render|firecrawl_scrape|tavily_extract|apify_actor|api_json|git_clone|youtube_captions|pdf_download|manual_upload|other)` |

### 5.3 Conversions and segmentations (keep, tighten)

- `content.transformation_run.transformation_kind` → controlled: `html_to_markdown|pdf_to_markdown|ocr|asr_transcript|code_extract|table_extract|normalize_whitespace|language_translate|summarize|structural_parse|render_snapshot`. Add `converter_identity` (`firecrawl@x`, `jina-reader`, `marker`, `pandoc`, `whisper-large-v3`, `youtube_captions`) and `converter_version`.
- `content.document_representation.representation_class` already distinguishes faithful vs. projected text. Require a `conversion_evaluation` before a representation is `accepted` (already the gate).
- `retrieval.chunking_procedure_version`: promote from `defaults jsonb` to columns: `strategy_kind (fixed_token|recursive_character|structural_heading|semantic_boundary|code_symbol|table_row|transcript_window|late_chunking|contextual_prefix|agentic_segmentation), window_tokens, overlap_tokens, parent_child bool, tokenizer` (exists). `chunk_set.frozen_config` remains the exact parameters.
- A "verified source capture" in the user's sense = `source_capture` (bytes) + accepted `document_representation` (conversion) + `extraction_run` with `extraction_record.verification_state='verified'`. No new "capture extraction" table is needed beyond `extraction_*`.

---

## 6. D5 — unstructured → structured linkage

Four layers, each with a controlled verb set, each immutable, each pointing at real FKs:

| Layer | Table | Verbs | Meaning |
|---|---|---|---|
| 1 Mention | `retrieval.chunk_entity_mention` (retarget `entity_target_id` → `corpus.entity`) | `mentions, is_about, defines, compares, demonstrates, quotes, cites, deprecates, recommends` | Lexical/NER-grade; cheap; many per chunk; drives entity-anchored retrieval. Also add `content.document_version_about_entity (entity_id, role primary|secondary|mention, method, confidence)` for document-level aboutness filters. |
| 2 Semantic | `retrieval.chunk_claim_link` (exists: `states|supports|challenges|qualifies|summarizes|cites`) and `retrieval.chunk_relationship_evidence` (retarget → `temporal.stream` + optional `segment_id`; verbs `supports|challenges|context|dates`) | Chunk text semantically bears on a claim or on a relationship episode. Not acceptance. |
| 3 Admitted support | `evidence.support_relationship (claim_id, locator_id, stream_id)` + `evidence.support_segment (segment_id, verdict, assessment_id, source_disposition_revision_id)` | Temporal: *for which world interval* does this locator support the claim, and *at which K* did we admit/withdraw it. A June claim stays supported for June after September contradicts "still true". |
| 4 Fact binding | `evidence.segment_claim_binding (target_segment_id, claim_id, role supports|challenges|context, support_segment_id)` | The proof chain for a specific temporal segment of a specific stream. |

Rule: layers 1–2 can be produced by models at ingestion; layers 3–4 only by the admission routine with verification evidence. Retrieval packets cite the layer they used.

---

## 7. D6 — vector spaces and technical intelligence

### 7.1 Keep the physical design, seed the logical one

- Keep `vector_item_embedding_1536` (list-partitioned `halfvec(1536)`, HNSW cosine per partition) and the publication/switch ledger. One partition per space key; create the eight partitions explicitly and add an FK `vector_space_key → retrieval.vector_space.slug`.
- **Seed `retrieval.vector_space`** with the eight keys from `knowledge-contracts` (`engineering_claims`, `tool_capabilities`, `implementation_examples`, `paper_case_study_knowledge`, `entity_profiles`, `model_capabilities`, `benchmark_intelligence`, `source_native_sections`) plus one new **`entity_timeline`** space (projected sentences of events/segments: "Anthropic made Claude Code generally available on 2025-05-22 [scope: …]"), which is how "what happened when" questions hit vectors.
- Add `protocol_and_agent_surfaces` only if `tool_capabilities` proves too coarse for MCP tool manifests, skill manifests, A2A agent cards; start by tagging those with `content_kind`.

### 7.2 Should technical intelligence be structured as well as vectorized? Yes — it already is; keep both

`knowledge.*` (nine record types) **is** the structured technical intelligence and `vector_item` already resolves each vector to one structured record or chunk. Keep that invariant: a vector hit is never the answer; it is a pointer to a structured row (or a chunk with locators), whose evidence, temporal validity, and relationships are read from the graph. Changes:

- Replace the 14-way arc on `vector_item` with `projection_target_id` (already present via `search_projection`) and make `projection_target` reference `corpus.entity` **or** a `knowledge.record` registry (same supertype trick for the nine record kinds) **or** `retrieval_chunk` / `evidence.claim` — four FKs, not fourteen.
- Add `technique` to `knowledge` links: `solution_pattern_applies_technique`, `failure_mode_relates_to_technique`.

### 7.3 Filter facets on vector items (the actual retrieval improvement)

Add to `retrieval.vector_item` (or a 1:1 `vector_item_facet`): `entity_id → corpus.entity` (primary anchor), `entity_kind`, `secondary_entity_ids uuid[]`, `valid_during tstzrange` (world applicability of the projected text; open-ended for timeless claims), `knowledge_seq bigint` (admission watermark), `assurance_rank smallint`, `authority_level`, `language`, `content_kind`. Index: btree on `(tenant_id, entity_id)`, GiST on `valid_during`, and rely on pgvector 0.8 iterative scans (`hnsw.iterative_scan = relaxed_order`) for filtered ANN. The hybrid RPC gains optional parameters: `p_entity_ids uuid[]`, `p_as_of timestamptz`, `p_knowledge_seq bigint`, `p_publication_id uuid`, `p_min_assurance smallint`.

### 7.4 Querying recommendations for entity and technical intelligence

1. **Entity-anchored retrieval** (default for "tell me about DeepSeek-V3 / MCP elicitation / GRPO"): resolve names through `corpus.entity_alias` (trigram) + `entity_profiles` ANN → expand one or two hops through typed relationships at `(V, K)` → filter `vector_item.entity_id ∈ set` → hybrid rank → packet. Graph expansion happens in SQL over typed tables; no graph DB.
2. **Temporal retrieval** ("as of March 2026", "before the acquisition"): `valid_during @> V` on items, plus `entity_timeline` space ANN, plus stream reads for the structured answer. Pin `publication_id` and `knowledge_seq` in the retrieval run.
3. **Technical questions** ("how do I mitigate MCP tool poisoning", "why does my KV cache blow up"): route to `engineering_claims`, `tool_capabilities`, `implementation_examples`, `benchmark_intelligence` first; fall back to `source_native_sections`; every returned item resolves to a `knowledge.*` record with assurance level, and `claim_conflict` overlays contradictions.
4. **Benchmarks/pricing**: never answer from vectors alone; vectors locate the `benchmark_run` / `model_offering`, structured `ranking.metric_observation` and price segments answer.
5. **Freshness**: the packet carries `knowledge_seq`, `publication_id`, per-item `valid_during`, and `source_state.last_seen_at` so an agent can say "last verified 2026-08-30".

### 7.5 `vector-backends` package impact

`VectorSearchRequest` grows optional `filters: { entityIds?, asOf?, knowledgeSeq?, publicationId?, minAssurance?, spaces? }`; `VectorSearchCandidate` returns `entityId?`, `chunkId?`, `claimId?`, `validDuring?`, `knowledgeSeq`. `PublicationManifests` stays. `ExploratoryPublicationCoordinator` is unchanged. `search_knowledge_1536` remains for backward compatibility; new code calls the hybrid RPC with filters.

---

## 8. Schema placement and dependency rules

Extend the existing Rule 1 (`20260826001600`): corpus/knowledge never reference staging, research, ranking, retrieval, curriculum, evaluation; they may reference `evidence.claim` and `orchestration.operation_receipt`.

Additions:

- New foundational schema **`temporal`** sits below corpus/content/evidence/retrieval. It references only `foundation`/`util`, `taxonomy`, `orchestration.operation_receipt/artifact`, and `corpus.entity` (identity only). corpus, evidence, content, retrieval **may** reference `temporal`.
- `evidence` may reference `corpus.entity` (attribution, extraction_record) and `temporal` (support streams, extents). This is already the direction in the live schema (typed claim associations).
- `content` owns story↔document and document↔entity bridges pointing at corpus.
- `ranking` owns benchmark run results; `retrieval` owns chunk↔entity/claim/stream links and publication memberships.
- `retrieval.projection_target` references `corpus.entity`, `knowledge.record`, `retrieval_chunk`, `evidence.claim` — downward only.

---

## 9. Migration plan (supersedes MIGRATION_MAP §"Migration sequence")

Each stage is one or more reviewed migration files in `ai-engineer-db-contract/supabase/migrations/`, followed by `npm run types:generate` and a pinned contract bump. Apply fresh-chain **and** populated-copy upgrades in a disposable PG17/Supabase target before touching the shared project. Never reset the shared project.

| Stage | Deliverable | Exit proof |
|---|---|---|
| **M0 reconcile** | Diff applied vs. local migrations (the working tree has ~70 uncommitted migration files). Enumerate tenant columns and single-column PKs that need `(tenant_id, id)` uniqueness. Record DAG amendment (§8). | Signed inventory; no data touched. |
| **M1 identity registry (D1)** | `corpus.entity`, `entity_alias`, `entity_identifier`; register missing `entity_kind` codes; backfill one registry row per existing typed row; add `kind` + composite FK to each typed table; retarget `projection_target`, `chunk_entity_mention`, `chunk_concept_link`, `entity_merge`, `feature_value`, `ranking_result`. | Count parity per kind; every mention/target resolves; old IDs unchanged. |
| **M2 temporal foundation (D3)** | `temporal` schema per handoff §3 with `subject_entity_id`; `knowledge_service.seal_temporal_batch`; immutable/seal guards; `entity_state`, `entity_timeline`, `knowledge_changes` functions; grants (no direct writes for app/agent roles). | Concurrency, idempotency, rebase, subtype-completeness, no-overlap, empty-revision tests (extend `verify-relational.mjs` scenarios to PG17). |
| **M3 P0 streams + events** | Stream kinds in §4.3; typed episode tables with `stream_id`; typed segment payload tables; typed event tables. Backfill the six `*_fact` tables and Pattern-A/B relationships into episodes with `temporal_basis`/`legacy_unknown` marking; keep old tables as read-only views until M7. | Rehire, archive/unarchive, release-vs-public, price history, scoped features, discovery-delay queries pass against fixtures **and** against backfilled real rows. |
| **M4 new entities (D2, P0)** | `technique`, `model_offering`, `registry`, `registry_listing`, `ai_protocol_feature`, `library_release`, `benchmark_version`, `benchmark_run` (+ ranking membership), version-level derivation, `ai_model_version_specification`, technique relationships. Migrate `concept(kind=technique)`. | Cardinality checks; DeepSeek-V3 / Claude Code / MCP fixtures round-trip. |
| **M5 source intelligence (D4)** | `search_provider`, `capture_method`, `provider_result`, `source_encounter`, `source_state`, `extraction_run`, `extraction_record`, `attribution`; amend `source`, `source_query`, `transformation_run`, `chunking_procedure_version`. Backfill `source_retrieval` → encounters; rebuild `source_state`. | Every existing capture has ≥1 encounter; `last_seen_at`/`next_revisit_after` populated; provider free-text values all mapped to codes. |
| **M6 linkage + support (D5)** | `support_relationship`, `support_segment`, `segment_claim_binding`, `document_version_about_entity`; controlled verbs on mention/relationship-evidence; retarget `chunk_relationship_evidence` → streams. | Old K retains old support after a withdrawal at new K; retracted source suspends downstream use without deleting packets. |
| **M7 vectors (D6)** | Seed spaces + partitions; `vector_item` facets; `projection_target` four-way FK; hybrid RPC filter params; `knowledge.record` registry; `entity_timeline` space. Regenerate types; update `vector-backends` request/candidate types and `knowledge-contracts` `VectorSpaceSchema`. | Filtered ANN plans use HNSW iterative scan; packet reconstruction ignores today's active pointer; contract consumers compile against pinned version. |
| **M8 P1 entities + cutover** | Hardware, artifacts, licenses, advisories, funding, transactions, industry events, stories, ownership/control/partnership streams. Drop legacy `*_fact` views, `source_retrieval` writes, `repository_alias`, text `license_spdx` columns. | Read comparisons old vs. new agree where evidence is equivalent; unknown dates remain unknown; projection rebuild checkpoints repeatable. |

Backfill rules the implementer must not relax: no world validity from `created_at`/`now()`; overwritten pair/kind episodes are reported as gaps, not synthesized; cascade deletes on evidence/temporal history are replaced by restricted deletes or governed tombstones; imports land at a **new** K, never inside historical snapshots.

---

## 10. Open decisions (need the owner's call; defaults stated)

1. **Tenant model for corpus identities.** Most corpus tables carry `tenant_id`; version/child tables often don't. Default: add `tenant_id` everywhere and use `(tenant_id, id)` FKs, as the handoff requires. Alternative: keep public industry entities in a single system tenant and scope only evidence/retrieval. This changes M1 significantly.
2. **`concept` vs `technique`.** Default: migrate technique-kind concepts into `technique` and keep `concept` pedagogical. Alternative: keep one table with a richer kind vocabulary (loses typed technique relationships).
3. **Where `story` lives.** Default per catalog: `corpus.story` identity + `content` bridges. Alternative: `content.story` entirely (simpler, but then stories are not `corpus.entity` members for mentions/attribution).
4. **Embedding dimensionality.** Default: keep the single 1536/halfvec contract; add `vector_item_embedding_<dims>` tables only when a second embedding model is adopted. Alternative: Matryoshka truncation to 512 for the `entity_profiles` and `entity_timeline` spaces to speed graph-expansion lookups.

---

## Appendix A — DDL sketches for the new P0 tables

Schematic, PG17-compatible, omitting RLS/grants/indexes/receipt columns that follow existing conventions. Composite `(tenant_id, …)` FKs throughout.

```sql
-- D1 identity registry ---------------------------------------------------
create table corpus.entity (
  tenant_id uuid not null default util.default_tenant_id(),
  id uuid not null default util.uuidv7(),
  kind text not null references taxonomy.entity_kind(code),
  created_by_receipt_id uuid not null references orchestration.operation_receipt(id),
  created_at timestamptz not null default now(),
  primary key (tenant_id, id), unique (tenant_id, id, kind));

create table corpus.entity_alias (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), entity_id uuid not null,
  alias text not null check (btrim(alias) <> ''), alias_normalized text generated always as (lower(btrim(alias))) stored,
  alias_kind text not null check (alias_kind in ('synonym','acronym','former_name','handle','ticker','slug','misspelling','translation')),
  language text, source_claim_id uuid references evidence.claim(id),
  primary key (tenant_id, id), unique (tenant_id, entity_id, alias_normalized, alias_kind),
  foreign key (tenant_id, entity_id) references corpus.entity);
create index entity_alias_trgm on corpus.entity_alias using gin (alias_normalized extensions.gin_trgm_ops);

-- D2 technique / offering / registry / protocol feature ---------------------
create table corpus.technique (
  tenant_id uuid not null, id uuid not null, kind text not null default 'technique' check (kind='technique'),
  slug text not null, name text not null,
  technique_kind text not null check (technique_kind in ('architecture','attention','training_objective','optimizer','parallelism',
    'inference_optimization','quantization','alignment','data_pipeline','agent_pattern','retrieval','safety','kernel_systems','evaluation_method')),
  summary text, introduced_by_paper_id uuid references corpus.paper(id),
  primary key (tenant_id, id), unique (tenant_id, slug),
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred);

create table corpus.ai_model_version_uses_technique (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), ai_model_version_id uuid not null, technique_id uuid not null,
  role text not null check (role in ('core','component','training','inference','alignment')),
  provenance_claim_id uuid not null references evidence.claim(id),
  primary key (tenant_id, id), unique (tenant_id, ai_model_version_id, technique_id, role),
  foreign key (tenant_id, technique_id) references corpus.technique (tenant_id, id));

create table corpus.model_offering (
  tenant_id uuid not null, id uuid not null, kind text not null default 'model_offering' check (kind='model_offering'),
  provider_organization_id uuid not null references corpus.organization(id),
  ai_model_version_id uuid not null references corpus.ai_model_version(id),
  endpoint_slug text not null, channel text not null check (channel in ('api','batch','realtime','fine_tuning','embeddings','on_prem')),
  region_scope text not null default 'global',
  primary key (tenant_id, id), unique (tenant_id, provider_organization_id, endpoint_slug, channel, region_scope),
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred);

-- price is a temporal stream payload (see D3): one stream per offering × unit × tier
create table corpus.model_offering_price_segment (
  tenant_id uuid not null, segment_id uuid not null, stream_id uuid not null,
  kind text not null default 'model_offering_price' check (kind='model_offering_price'),
  model_offering_id uuid not null, amount numeric(18,8) not null check (amount >= 0), currency char(3) not null,
  unit text not null check (unit in ('per_1m_input_tokens','per_1m_output_tokens','per_1m_cached_input_tokens','per_hour','per_seat_month','per_request','per_image','per_minute_audio')),
  tier text not null default 'standard',
  primary key (tenant_id, segment_id),
  foreign key (tenant_id, segment_id, stream_id, kind) references temporal.segment (tenant_id, id, stream_id, kind),
  foreign key (tenant_id, model_offering_id) references corpus.model_offering (tenant_id, id));

create table corpus.registry (
  tenant_id uuid not null, id uuid not null, kind text not null default 'registry' check (kind='registry'),
  slug text not null, name text not null,
  registry_kind text not null check (registry_kind in ('package','model','dataset','mcp','skill','extension','app_store','other')),
  operator_organization_id uuid references corpus.organization(id), url text,
  primary key (tenant_id, id), unique (tenant_id, slug),
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred);

create table corpus.registry_listing (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), registry_id uuid not null,
  entity_id uuid not null, entity_kind text not null check (entity_kind in ('library','mcp_server','agent_skill','ai_model','dataset','product')),
  external_id text not null, url text,
  primary key (tenant_id, id), unique (tenant_id, registry_id, external_id),
  foreign key (tenant_id, registry_id) references corpus.registry (tenant_id, id),
  foreign key (tenant_id, entity_id, entity_kind) references corpus.entity (tenant_id, id, kind));

create table corpus.ai_protocol_feature (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), ai_protocol_id uuid not null references corpus.ai_protocol(id),
  slug text not null, name text not null, introduced_in_version_id uuid references corpus.ai_protocol_version(id),
  deprecated_in_version_id uuid references corpus.ai_protocol_version(id), spec_locator_id uuid references evidence.locator(id),
  primary key (tenant_id, id), unique (tenant_id, ai_protocol_id, slug));

-- D4 source intelligence ---------------------------------------------------
create table evidence.search_provider (
  code text primary key check (code in ('tavily','firecrawl','exa','apify','github_api','huggingface_api','arxiv_api','youtube_api',
    'npm_registry','pypi','crates_io','mcp_registry','openalex','semantic_scholar','manual','other')),
  display_name text not null, provider_kind text not null check (provider_kind in ('web_search','extract','crawl','api','transcript','registry','human')),
  terms_url text);

create table evidence.provider_result (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), query_id uuid not null,
  result_rank integer not null check (result_rank >= 0), url_as_returned text not null, normalized_url text,
  title text, snippet text, provider_score double precision, provider_published_at timestamptz, provider_metadata jsonb not null default '{}',
  resolved_source_id uuid, resolution_method text check (resolution_method in ('exact','normalized','redirect_followed','manual','unresolved')),
  created_at timestamptz not null default now(),
  primary key (tenant_id, id), unique (tenant_id, query_id, result_rank),
  foreign key (tenant_id, query_id) references evidence.source_query (tenant_id, id),
  foreign key (tenant_id, resolved_source_id) references evidence.source (tenant_id, id));

create table evidence.source_encounter (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), source_id uuid not null,
  encounter_kind text not null check (encounter_kind in ('provider_listed','link_discovered','fetch_attempted','captured','cache_hit','unchanged',
    'converted','segmented','extracted','verified','cited_in_packet','revisit_scheduled','skipped_policy','blocked_robots','paywalled','rate_limited','fetch_failed','parse_failed')),
  discovered_at timestamptz not null, registered_at timestamptz not null default now(),
  operation_id uuid references knowledge_service.operation(id),
  provider_result_id uuid, capture_id uuid, representation_id uuid, chunk_set_id uuid, extraction_run_id uuid, retrieval_run_id uuid,
  outcome_detail jsonb not null default '{}',
  primary key (tenant_id, id),
  foreign key (tenant_id, source_id) references evidence.source (tenant_id, id),
  check (registered_at >= discovered_at),
  check (case encounter_kind when 'provider_listed' then provider_result_id is not null
                             when 'captured' then capture_id is not null when 'cache_hit' then capture_id is not null
                             when 'converted' then representation_id is not null when 'segmented' then chunk_set_id is not null
                             when 'extracted' then extraction_run_id is not null when 'cited_in_packet' then retrieval_run_id is not null else true end));

create table evidence.source_state (
  tenant_id uuid not null, source_id uuid not null,
  first_seen_at timestamptz not null, last_seen_at timestamptz not null, last_encounter_id uuid not null,
  last_capture_id uuid, last_capture_sha256 text, last_disposition text, capture_count integer not null default 0,
  failure_streak integer not null default 0, revisit_policy_id uuid references evidence.revalidation_policy(id),
  next_revisit_after timestamptz, blocked_reason text, projection_operation_id uuid, updated_at timestamptz not null default now(),
  primary key (tenant_id, source_id),
  foreign key (tenant_id, source_id) references evidence.source (tenant_id, id),
  foreign key (tenant_id, last_encounter_id) references evidence.source_encounter (tenant_id, id));

create table evidence.extraction_run (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), representation_id uuid not null,
  extractor_identity text not null, extractor_version text not null,
  extraction_kind text not null check (extraction_kind in ('claims','entities','relationships','temporal_events','measurements','code_examples','tool_manifest','pricing_table')),
  model_offering_id uuid, prompt_schema_version text, operation_id uuid references knowledge_service.operation(id),
  status text not null check (status in ('running','succeeded','failed','superseded')),
  input_sha256 text not null, output_manifest_artifact_id uuid references orchestration.artifact(id), cost_usd numeric(12,6),
  created_at timestamptz not null default now(), completed_at timestamptz,
  primary key (tenant_id, id),
  foreign key (tenant_id, representation_id) references content.document_representation (tenant_id, id));

create table evidence.extraction_record (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), extraction_run_id uuid not null,
  record_kind text not null check (record_kind in ('claim','entity_mention','relationship_assertion','temporal_assertion','measurement','attribution','code_example')),
  locator_id uuid not null references evidence.locator(id), extent_id uuid,
  confidence numeric(5,4) check (confidence between 0 and 1),
  verification_state text not null default 'pending' check (verification_state in ('pending','verified','rejected','superseded')),
  claim_id uuid references evidence.claim(id), staging_candidate_id uuid references staging.candidate(id),
  entity_id uuid, stream_kind text, payload jsonb not null,
  primary key (tenant_id, id),
  foreign key (tenant_id, extraction_run_id) references evidence.extraction_run (tenant_id, id),
  foreign key (tenant_id, entity_id) references corpus.entity (tenant_id, id),
  foreign key (tenant_id, extent_id) references temporal.extent (tenant_id, id));

create table evidence.attribution (
  tenant_id uuid not null, id uuid not null default util.uuidv7(), claim_id uuid not null references evidence.claim(id),
  locator_id uuid not null references evidence.locator(id), attributed_to_entity_id uuid not null, attributed_to_kind text not null check (attributed_to_kind in ('person','organization')),
  attribution_kind text not null check (attribution_kind in ('direct_quote','paraphrase','byline','official_statement','press_release','third_party_report','rumor')),
  modality text not null check (modality in ('asserted','hedged','denied','predicted','retracted')),
  quoted_text_sha256 text, created_at timestamptz not null default now(),
  primary key (tenant_id, id),
  foreign key (tenant_id, attributed_to_entity_id, attributed_to_kind) references corpus.entity (tenant_id, id, kind));

-- D6 vector facets -----------------------------------------------------------
alter table retrieval.vector_item
  add column entity_id uuid, add column entity_kind text, add column secondary_entity_ids uuid[] not null default '{}',
  add column valid_during tstzrange, add column knowledge_seq bigint, add column assurance_rank smallint,
  add foreign key (tenant_id, entity_id, entity_kind) references corpus.entity (tenant_id, id, kind);
create index vector_item_entity_idx on retrieval.vector_item (tenant_id, entity_id) where lifecycle = 'active';
create index vector_item_valid_gist on retrieval.vector_item using gist (valid_during) where lifecycle = 'active';

insert into retrieval.vector_space (tenant_id, slug, purpose, class) values
  (util.default_tenant_id(),'engineering_claims','Verified engineering claims with attribution and limitations','canonical'),
  (util.default_tenant_id(),'tool_capabilities','Tool, MCP server, skill and protocol surface capabilities','canonical'),
  (util.default_tenant_id(),'implementation_examples','Pinned code examples (repo, commit, path, symbol)','canonical'),
  (util.default_tenant_id(),'paper_case_study_knowledge','Paper and case-study findings','canonical'),
  (util.default_tenant_id(),'entity_profiles','Entity identity profiles for resolution and anchoring','canonical'),
  (util.default_tenant_id(),'model_capabilities','Model version capabilities, constraints and observed behaviour','canonical'),
  (util.default_tenant_id(),'benchmark_intelligence','Benchmark versions, protocols, results and comparability warnings','canonical'),
  (util.default_tenant_id(),'entity_timeline','Projected temporal events and state changes per entity','canonical'),
  (util.default_tenant_id(),'source_native_sections','Faithful source sections (exploratory, not canonical knowledge)','exploratory');
```

## Appendix B — what this supersedes in `docs/temporal-provenance/`

- `IMPLEMENTATION_HANDOFF.md` §1–§4, §8: **adopted** with the two refinements in §4.1 (entity-bound streams; timeline/changes functions) and the D1 registry replacing "no untyped endpoint" with "typed registry with checked kind".
- `RELATIONSHIP_CATALOG.md`: **extended** by §3 (techniques, offerings/prices, hardware, registries, protocol features, advisories, funding/transactions, industry events).
- `MIGRATION_MAP.md` staging: **replaced** by §9 (adds M1 identity registry and M5 source intelligence before vectors).
- `prototype.sql`, `relational-prototype.sql`: still valid executable demonstrators of the temporal envelope; not production DDL.
