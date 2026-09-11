# Knowledge model — final recommendation and migration runbook

**2026-09-11 · Supersedes [RECOMMENDATION.md](./RECOMMENDATION.md) (2026-09-10) and `docs/temporal-provenance/` where they differ.** This is the last design round before Mission Control. It (a) consolidates the previous six decisions into fewer tables, (b) adds the five areas that were missing — media, document types vs. vector spaces, summaries, repositories, temporal simplicity — and (c) gives the exact migration runbook against the current `ai-engineer-db-contract` chain (last file `20260908030000_verification_drift_revalidation_outbox.sql`).

**Premise that changes everything:** nothing in the shared database must be retained. Every "backfill / read-only view / legacy_unknown" step in the previous plan is deleted. The knowledge domain is **rebuilt** in one migration series; runtime schemas that Knowledge Services already depend on are **altered in place**; everything else is untouched.

Audience for the data: **investors** (who owns what, who funds whom, what does it cost, what shipped when, is it gaining traction) and **students/engineers** (how does it work, which technique, which repo/file, what breaks, what the benchmark says). Same graph, two lenses.

Reading order: §0 → §1 target schema map → §2–§8 one section per area → §9 access for agents → §10 runbook → Appendix A DDL → Appendix B vocabularies.

---

## 0. Decisions in one page

| # | Decision | Replaces |
|---|---|---|
| **D1** | `corpus.entity` typed identity registry with `display_name`, `slug`, `summary` projections. Every typed table's PK is an FK into it. | Retained from previous round, with the registry now carrying the three columns agents need most. |
| **D2** | **One edge table** `corpus.relationship(kind, from_entity_id, to_entity_id, qualifier, episode, properties)` constrained by `taxonomy.relationship_kind(from_kinds[], to_kinds[])`. N-ary facts (funding round, transaction, benchmark run) are entities. | 38 typed relationship tables (Pattern A + B), 4 `*_appeared_in_video`, 11 `knowledge.*_link` tables, 18 `evidence.claim_*` associations, 15-way arcs. |
| **D3** | **Temporal, simplified**: six tables (`knowledge_head`, `knowledge_batch`, `extent`, `stream`, `segment`, `event` + `event_occurrence`). Knowledge time is a `[k_from, k_to)` interval on each segment/occurrence row — no `revision`, `segment_lineage`, `event_segment_effect` tables. Segments carry **typed slots** (`status, amount, currency, unit, ref_entity_id`) + validated `payload`; no per-stream payload tables. Three write helpers, five read functions, K defaults to "now". | Handoff §3 (11 tables + one payload table per stream kind). |
| **D4** | Source intelligence retained: `search_provider`, `provider_result`, `source_encounter` (ledger), `extraction_run/record`, `attribution`. `source_state` folds into projection columns on `evidence.source`. | Previous D4 minus one table. |
| **D5** | Linkage collapses to three chunk-link tables (`chunk_entity_mention`, `chunk_claim_link`, `chunk_relationship_evidence`) plus one admitted-support table `evidence.segment_support(segment_id, claim_id, locator_id, role, k_from, k_to)`. | `chunk_concept_link`, `chunk_citation_link`, `support_relationship`, `support_segment`, `segment_claim_binding`. |
| **D6** | Vectors: keep physical design; seed **11 spaces** (8 existing + `entity_timeline`, `market_intelligence`, `document_summaries`); `vector_item` gets facets and loses the 13-way arc; `projection_target` becomes a 5-way FK (`entity | record | chunk | claim | summary`). | Previous D6 plus two spaces. |
| **D7 media** | Hierarchy `media_platform` (vocab) → `media_channel` → `media_series` → `media_work` (video/audio/image/slide_deck/livestream/screencast), plus `event_series` → `industry_event` (editions, sub-events) → `talk`; `media_work` replaces `corpus.video`. Transcripts, visual descriptions, OCR and keyframes are `document_representation`s; time/space coordinates live on `document_node` (`start_ms, end_ms, bbox`) and `evidence.locator` (`selector_kind, start_ms, end_ms`). Chunks inherit them through `chunk_span`, so **all media evidence flows through the same chunk/claim/segment linkage as text**. `corpus.media_appearance` records who/what appears when. | `corpus.video`, `talk.recording_video_id`, four `*_appeared_in_video` tables, untyped `locator.selector`. |
| **D8 document types ↔ spaces** | `content.document_type` is a **routing vocabulary** (family, default chunker, default extraction kinds, default spaces, summary kinds, `work_entity_kind`). Vector spaces stay *retrieval purposes*. A document has one type; a type routes into N spaces. `content.document.document_type_code` FK; `document.work_entity_id` says which entity this document *is a rendition of* (paper, media_work, story, advisory, filing); `document_about_entity` says what it is *about*. | Free-text `document_kind`; no link from documents to the entities they render. |
| **D9 summaries** | `content.document_summary` is a typed row over its own `document_representation(class='semantic_projection', kind='summary')`, produced by a `transformation_run(kind='summarize')` whose inputs are the faithful representation; `document_summary_source` lists the `document_node`s it covers. Summaries are chunked/embedded exactly like documents, into `document_summaries` (and domain spaces with `content_kind='summary'`). Summaries are never evidence; they resolve to nodes → chunks → locators. | Summaries scattered in `research_video_*`, `paper.abstract`, `report_version.assurance_summary`; no lineage between raw and summarized text. |
| **D10 repositories** | Store **structure as rows, trees as blobs, files on demand**: `repository_revision` (commit, tree manifest artifact), `repository_module` (top-level packages/apps, tens per repo), `repository_file` (only files captured or cited; each is a `content.document`), `library_release.source_revision_id`. `implementation_example` points at `repository_file` + symbol + lines. Traction (stars, forks, downloads) is `ranking.metric_observation`. | `repository_alias`, `implementation_example(commit_sha, path)` free text, no releases. |
| **D11 rebuild strategy** | Three tiers: **Rebuild** (`corpus`, `knowledge`, `staging`, `ranking`, provider layer, chunk links), **Alter** (`evidence.source/capture/locator/claim`, `content.*`, `retrieval.vector_item/vector_space/chunking_procedure_version`, `taxonomy.assignment`), **Untouched** (`foundation`, `util`, `orchestration`, `knowledge_service`, `evaluation`, `observability`, `research`, `curriculum`, `public.research_*`, all `verification_*`). 13 migration files, one disposable fresh-chain proof, then `supabase db push` to the shared project. No squash yet. | Previous M0–M8 with backfills. |

The model in one paragraph: **a registry of typed AI-industry entities, joined by one typed edge table, whose changing facts are time segments with two clocks (world time `valid_during`, knowledge time `[k_from,k_to)`); fed by an evidence pipeline that remembers every provider answer, encounter, capture, conversion, segmentation, summary and extraction; where text, audio, video and images all become time/space-addressed nodes and chunks; and where vectors are filterable projections of the graph, its documents and their summaries.**

---

## 1. Target schema map

Tables marked **R** are created by the rebuild, **A** altered in place, **K** kept as-is. Everything not listed in a Rebuild schema is dropped by `km_00`.

### `taxonomy` (vocabularies; A)
`facet`, `facet_version`, `term`, `term_relation` K · `entity_kind` A (full list, Appendix B.1) · **`relationship_kind`** R · `assignment` A (arc → `target_entity_id | target_record_id | lesson_id`).

### `corpus` (identity + immutable descriptors + projections; R)
`entity`, `entity_alias`, `entity_identifier`, `entity_merge` · `relationship` · typed identity tables (one per kind in B.1): `person`, `organization`, `product`, `product_version`, `product_feature`, `ai_model`, `ai_model_version`, `ai_model_version_spec`, `model_offering`, `technique`, `dataset`, `benchmark`, `benchmark_run`, `repository`, `repository_revision`, `repository_module`, `repository_file`, `library`, `library_release`, `mcp_server`, `mcp_server_surface`, `agent_skill`, `ai_protocol`, `ai_protocol_version`, `ai_protocol_feature`, `paper`, `media_channel`, `media_series`, `media_work`, `media_appearance`, `event_series`, `industry_event`, `talk`, `story`, `case_study`, `concept`, `funding_round`, `corporate_transaction`, `registry`, `registry_listing`, `security_advisory`, `compute_device`, `compute_offering` · vocab: `distribution_kind`, `license`, `media_platform`.

### `temporal` (new foundational; R)
`knowledge_head`, `knowledge_batch`, `extent`, `stream_kind`, `stream`, `segment`, `event_kind`, `event`, `event_occurrence`. Functions: `begin_batch`, `commit_batch`, `assert_state`, `assert_relationship`, `assert_event`, `close_segment`.

### `evidence` (A + R)
K: `source`(A: +host, +publisher_entity_id, +projection columns), `source_capture`(A: +capture_method FK), `locator`(A: +selector_kind, start_ms, end_ms, page_number), `claim`, `claim_type`, `claim_evidence_link`, `claim_evidence_assessment`, `claim_conflict`, `conflict_reconciliation`, `degraded_assurance`, `extraction_signature`, `executable_verification`, all `verification_*`, `revalidation_policy`.
R: `search_provider`, `capture_method`, `source_query`(rebuilt with FKs), `provider_result`, `source_encounter`, `extraction_run`, `extraction_record`, `attribution`, `claim_subject`, `claim_record`, `segment_support`.
Dropped: `source_retrieval`, `source_support`, `claim_technical_record`, `claim_case_study`, `claim_product_version`, and every other `claim_<kind>` association.

### `content` (A + R)
K/A: `document`(A: `document_kind`→`document_type_code` FK, +`work_entity_id`, +`repository_file_id`), `document_identifier`, `document_version`, `document_version_source_capture`, `transformation_run`(A: `transformation_kind` FK, +`converter_identity`, +`converter_version`), `transformation_input/output`, `document_representation`(A: `representation_kind` CHECK), `document_node`(A: +`start_ms`, `end_ms`, `speaker_entity_id`), `document_node_edge`, `conversion_evaluation/finding`, `representation_decision`.
R: `document_type`, `transformation_kind`, `document_about_entity`, `document_summary`, `document_summary_source`.

### `retrieval` (A + R)
K: stores, `vector_space_version`, `space_publication`, `publication_switch_receipt`, `chunking_procedure_version`(A: typed strategy columns), `chunk_set`, `retrieval_chunk`, `chunk_span`, `chunk_edge`, `search_projection`, `search_projection_chunk_support`, `embedding_run/item`, `vector_item_embedding_1536` (+ 11 partitions), promotion tables, retrieval runs, packets, policies.
A: `vector_space` (seed 11 rows), `vector_item` (drop 13 arc columns; add `projection_target_id`, facets).
R: `projection_target` (5-way: `entity_id | record_id | chunk_id | claim_id | summary_id`, see §8.3), `chunk_entity_mention`, `chunk_claim_link`, `chunk_relationship_evidence`.
Dropped: `chunk_concept_link`, `chunk_citation_link`.

### `knowledge` (R)
`record` registry + the nine typed records (`technical_problem`, `solution_pattern`, `advanced_usage_pattern`, `implementation_example`, `failure_mode`, `benchmark_result`, `compatibility_constraint`, `operational_practice`, `security_consideration`) + **`record_entity_link(record_id, entity_id, role)`**. Dropped: the 11 typed link tables.

### `ranking` (R)
`metric_definition`, `metric_definition_version`, `metric_observation(subject_entity_id, benchmark_run_id?, …)`, `feature_value`, `ranking_result` — all keyed on `corpus.entity`.

### `staging` (R)
`candidate(proposed_kind, proposed_payload, resolved_entity_id)`, `identity_match`, `resolution_decision`, `vetting_decision`. Dropped: typed `candidate_*` subtables.

### Untouched
`foundation`, `util`, `orchestration.*` (incl. `verification_structured_extraction_*`), `knowledge_service.*`, `evaluation.*`, `observability.*`, `research.*` (FKs re-pointed to `corpus.entity`), `curriculum.*` (same), `public.research_*`, `api` (functions rebuilt in `km_11`).

---

## 2. D3 — temporal intelligence, simplified

### 2.1 What a less-capable agent has to know

1. Every changing fact about an entity or a relationship is a **segment**: `valid_during` (world time, `[)`), one of a few typed slots, and `[k_from, k_to)` (when we believed it).
2. `k_to is null` means "what we believe now". Reading at an older K is `k_from <= K and (k_to is null or K < k_to)`.
3. A correction never updates a value: it **closes** the old row (`k_to := K`) and inserts a new one. World changes insert a new segment with a later `valid_during`.
4. Events are the same shape (`event` identity + `event_occurrence` rows with `[k_from,k_to)`).
5. Every date comes from a `temporal.extent` (the source's own words + precision), never from `now()`.

That is the whole model. Agents write through three helpers inside one batch and read through five `api.*` functions where `K` is optional and defaults to the current head.

### 2.2 Tables

```text
temporal.knowledge_head       tenant → current knowledge_seq (one row per tenant)
temporal.knowledge_batch      one sealed row per K: receipt, operation, idempotency, digest, summary
temporal.extent               a sourced time expression: source_text, precision, [earliest,latest], tz, locator
temporal.stream_kind          vocabulary + slot rules (status_values, requires_amount, unit_values, requires_ref_entity, payload_schema)
temporal.stream               (kind, subject_entity_id | subject_relationship_id, scope_key)  -- identity of one fact line
temporal.segment              stream_id, valid_during, belief, temporal_basis, status, amount, currency, unit, ref_entity_id, payload,
                              extent_id, caused_by_event_id, replaces_segment_id, primary_claim_id, k_from, k_to
temporal.event_kind           vocabulary (+ which stream kinds an event may start/end)
temporal.event                (kind, subject_entity_id, object_entity_id?, relationship_id?) stable identity
temporal.event_occurrence     event_id, occurred_during, occurrence_mode actual|scheduled|cancelled, belief, extent_id, primary_claim_id, payload, k_from, k_to
```

Integrity that stays in SQL: `[)` non-empty ranges; partial GiST exclusion `(stream_id =, valid_during &&) where k_to is null` (no two current segments overlap in one stream); one current occurrence per event; `k_from` stamped by trigger from the open batch; updates allowed only to set `k_to` from null to the open K; deletes rejected. Slot requirements from `stream_kind` are checked in `commit_batch`.

Why `scope_key`: a price stream is one per `offering × unit × tier` (`scope_key = 'per_1m_input_tokens|standard'`); feature availability is `feature × plan × region`. The scope is a string on the stream, not a table per scope.

### 2.3 Write API (admission role only)

```sql
select temporal.begin_batch(p_expected_head => 56);          -- locks head, opens K=57 in this transaction
select temporal.assert_state(
  p_entity => :offering, p_stream_kind => 'model_offering_price', p_scope_key => 'per_1m_input_tokens|standard',
  p_valid_during => tstzrange('2026-09-01','infinity','[)'), p_amount => 2.00, p_currency => 'USD', p_unit => 'per_1m_input_tokens',
  p_extent => temporal.make_extent('effective September 1, 2026','day',:locator), p_claim => :claim);
    -- closes the overlapping current segment at 2026-09-01 (split) and inserts the new one
select temporal.assert_relationship(
  p_kind => 'employed_by', p_from => :person, p_to => :org, p_qualifier => 'engineer', p_episode => 2,
  p_valid_during => tstzrange('2026-03-01','infinity','[)'), p_extent => :extent, p_claim => :claim);
    -- inserts corpus.relationship (or reuses the episode) + a 'relationship_active' segment
select temporal.assert_event(
  p_kind => 'release_published', p_subject => :product_version, p_occurred_during => tstzrange('2026-02-20','2026-02-21','[)'),
  p_mode => 'actual', p_extent => :extent, p_claim => :claim);
    -- closes the current occurrence if different, inserts the new one
select temporal.commit_batch(p_receipt => :receipt, p_idempotency_key => 'mission-42/pass-2', p_input_digest => :sha, p_summary => '{}');
```

`commit_batch` validates: every new row has `k_from = K`; slot rules per stream kind; relationship endpoint kinds; no segment without `extent_id` unless `temporal_basis in ('observation_bounded','unresolved')`; then inserts `knowledge_batch`, advances head, appends to `knowledge_service.outbox`. A rollback leaves nothing.

### 2.4 Read API (all roles; K optional)

```sql
api.resolve_entity(p_text)                                    -- alias trigram + identifier exact → (entity_id, kind, display_name, score)
api.entity_card(p_entity)                                     -- jsonb: identity, aliases, current facts by stream kind, current relationships, last 20 events, sources freshness
api.entity_at(p_entity, p_at default now(), p_k default null) -- segments covering V at K, joined to ref entity names
api.relationships(p_entity, p_kind default null, p_at default now(), p_k default null, p_direction default 'both')
api.entity_timeline(p_entity, p_from, p_to, p_k default null) -- events + segment change points in [from,to), gaps flagged unknown
api.what_changed(p_entity, p_k1, p_k2)                        -- belief changes (closed/opened rows), not world changes
```

Views for SQL-writing agents: `api.entities` (registry + kind + aliases), `api.current_facts` (segments with `k_to is null and valid_during @> now()`), `api.current_relationships` (edges whose `relationship_active` segment covers now, or non-temporal kinds), `api.events_current`.

### 2.5 Deviations from the handoff, and why

| Handoff | Here | Reason |
|---|---|---|
| `revision` replaces the whole interpretation of a stream | per-row `[k_from,k_to)` | One table fewer per read; corrections become "close + insert", which agents can reason about. Same replay guarantee. |
| One typed payload table per stream kind | five typed slots + `payload jsonb` validated by `stream_kind.payload_schema` | Prices, availability, status, roles, references cover >90% with typed columns; the rest is validated JSON, not a new table per fact. |
| `segment_lineage`, `event_segment_effect` | `replaces_segment_id`, `caused_by_event_id` | Single-parent lineage is all we have ever produced. |
| Seal from a manifest | `begin_batch` / helpers / `commit_batch` in one transaction | Agents write SQL they can read back; atomicity is the transaction. |

---

## 3. Entities and the single relationship table

### 3.1 `corpus.entity` and typed tables

`corpus.entity(id, tenant_id, kind, display_name, slug, summary, lifecycle, merged_into_id, projection_knowledge_seq, created_by_receipt_id)`. `display_name`, `slug`, `summary` are **projections**: rebuilt from the `entity_name` stream and the latest `entity_profile` summary. Typed tables hold **natural keys and immutable descriptors only** (Appendix A.2). Anything that changes is a stream (`entity_name`, `repository_archival`, `model_offering_price`, …).

Version tables (`product_version`, `ai_model_version`, `library_release`, `ai_protocol_version`) are entities (kind `*_version` / `library_release`); claims, benchmark runs and vector items point at versions, not families.

### 3.2 `corpus.relationship`

```sql
corpus.relationship(id, tenant_id, kind → taxonomy.relationship_kind, from_entity_id, to_entity_id,
                    qualifier text default '', episode int default 1, properties jsonb, primary_claim_id, k_from, k_to)
unique (tenant_id, kind, from_entity_id, to_entity_id, qualifier, episode) where k_to is null
```

`taxonomy.relationship_kind(code, from_kinds[], to_kinds[], temporal bool, symmetric bool, inverse_label, property_schema)` — a trigger rejects endpoint kinds not in the lists. Temporal kinds require a `relationship_active` stream (the helper creates it). `qualifier` is the role (`lead` investor, `core` technique, `runtime` dependency, `client` protocol role); `episode` makes rehires and second partnerships representable; `properties` holds immutable declaration details (`version_range`, `path_in_repo`, `usage_kind`).

Why this is not the "untyped universal table" the handoff rejected: both endpoints are real FKs to `corpus.entity`; kinds are constrained by vocabulary and trigger; n-ary facts are reified as entities (`funding_round`, `corporate_transaction`, `benchmark_run`, `industry_event`), so the edge table never needs a third endpoint. The 48 relationship kinds are in Appendix B.2.

---

## 4. D7 — media intelligence

### 4.1 The media hierarchy: platform → channel → series → work → transcript

```text
corpus.media_platform   (vocabulary)  youtube, vimeo, spotify, apple_podcasts, x, linkedin, twitch, bilibili, self_hosted, conference_platform, other
   └─ corpus.media_channel   (entity)   @aiDotEngineer, Matthew Berman, Latent Space  — owned by an organization or person
        └─ corpus.media_series (entity)   playlist / podcast show / conference recordings / course / recurring show
             └─ corpus.media_work (entity)   one video, episode, livestream, image or slide deck
                  └─ transcript = content.document(video_transcript) → representation(transcript) → nodes with start_ms/end_ms/speaker
```

| Table | Kind | Identity + immutable descriptors | Notes |
|---|---|---|---|
| `corpus.media_platform` | vocabulary | `code, name, media_url_template, channel_url_template, timecode_param, product_entity_id?` | A platform is where media is hosted; `timecode_param` (`t` for YouTube) is how packets build deep links. Optional link to the platform's `product` entity. |
| `corpus.media_channel` | entity | `platform_code, external_id, handle, title, url, owner_entity_id → entity(organization|person)` | Replaces the free-text `corpus.video.channel/channel_external_id`. `research_starter_channels` rows import 1:1. Subscriber/view counts are `ranking.metric_observation`. |
| `corpus.media_series` | entity | `series_kind ∈ playlist|podcast_show|recurring_show|conference_recordings|course|livestream_series, platform_code?, external_id?, title, primary_channel_id?, industry_event_id?` | A YouTube playlist, a podcast, "AI Engineer World's Fair 2026 talks". `industry_event_id` is set when the series is the recordings of one event edition. |
| `corpus.media_work` | entity | `media_kind ∈ video|audio|image|slide_deck|livestream|screencast, platform_code, external_id, url, title, channel_id → media_channel, published_at, duration_ms, width, height, language` | Replaces `corpus.video`. `research_starter_videos` rows import as `media_work(platform_code='youtube', channel_id = …)`. |
| membership | relationship `in_series` | `media_work → media_series`, `properties {ordinal, season, episode}` | A work can sit in several series (a talk in the conference playlist and in a "best of MCP" playlist). |

An image embedded in a paper is a `document_node(node_kind='figure', artifact_id)` — not a media work. Promote to `media_work(media_kind='image')` only when it is published and cited on its own.

**The transcript, explicitly.** One `content.document(document_type_code='video_transcript' | 'podcast_transcript' | 'livestream_transcript', work_entity_id = media_work)` per work. Each transcript acquisition is a `document_version` (platform captions today, ASR tomorrow — different bytes, same document). The representation chain is:

| Step | Row | Fields that matter |
|---|---|---|
| bytes | `evidence.source_capture(capture_method ∈ youtube_captions|apify_actor|yt_dlp|whisper_upload, media_type text/vtt | application/json)` | today's `ai-engineer-transcripts/<video_id>.txt` objects become `orchestration.artifact` rows behind a capture |
| faithful text | `document_representation(representation_class='faithful_normalization', representation_kind ∈ transcript|diarized_transcript, language)` produced by `transformation_run(kind ∈ platform_captions|asr_transcript|diarize, converter_identity = 'youtube_captions' | 'whisper-large-v3' | 'apify:starvibe/youtube-video-transcript')` | `transcript_source` is the transformation kind; `transcript_language` is `representation.language` |
| structure | `document_node(node_kind ∈ transcript_segment|chapter, start_ms, end_ms, speaker_entity_id?)` | chapters come from platform metadata; segments from the caption file |
| segmentation | `chunk_set(strategy_kind='transcript_window')` → `retrieval_chunk` → `chunk_span → node` | chunks carry time through the node |
| summaries | `document_summary(summary_kind ∈ abstract|timeline|entity_centric|key_claims)` per §6 | the existing `research_video_*` summaries map to these kinds |

The `sync-research-starter-videos` / `ingest-youtube-research-starters` skills keep writing `public.research_starter_*`; one import step (`km_12` worker `corpus.import_research_starter_catalog()`) mirrors channel → `media_channel`, video → `media_work` + transcript document, and playlist membership → `in_series`.

### 4.2 Bytes → representations → nodes with coordinates

| Layer | Table | Media specifics |
|---|---|---|
| bytes | `evidence.source_capture` | the video file / audio / image / caption file; `capture_method ∈ youtube_captions|apify_actor|yt_dlp|api_json|http_get…` |
| document | `content.document(document_type_code='video_transcript'|'podcast_transcript'|'image', work_entity_id = media_work)` | one document per media work |
| representation | `content.document_representation` | `representation_kind ∈ transcript|diarized_transcript|visual_description|ocr_text|keyframe_sheet|slide_text|thumbnail`; produced by `transformation_run(kind ∈ platform_captions|asr_transcript|diarize|vision_describe|ocr|keyframe_extract|slide_extract)` |
| structure | `content.document_node` (+`start_ms`, `end_ms`, `bbox`, `speaker_entity_id`) | `node_kind ∈ transcript_segment|chapter|scene|slide|figure|region|caption` |
| evidence anchor | `evidence.locator` (+`selector_kind ∈ media_timecode|media_region|…`, `start_ms`, `end_ms`) | the KS `media_timecode {startMs,endMs}` and `bounding_box` selectors become queryable columns |
| retrieval | `retrieval.chunk_set(strategy_kind='transcript_window')` → `retrieval_chunk` → `chunk_span → document_node` | chunks inherit time via the node; packets return `start_ms/end_ms` per member |

Because visual content becomes text (`visual_description`, `ocr_text`, `slide_text`) **the entity-mention, claim-link, relationship-evidence and segment-support tables need no media variants.** A claim supported by a slide at 12:30 is `claim_evidence_link → locator(selector_kind='media_timecode', start_ms=750000)`. A relationship evidenced in an interview is `chunk_relationship_evidence → relationship_id` with a chunk whose span has timecodes.

### 4.3 Structured presence: `corpus.media_appearance`

`(media_work_id, entity_id, role ∈ speaker|host|guest|interviewee|panelist|subject|demonstrated|depicted|logo|screen_recording|mentioned|sponsor, start_ms?, end_ms?, locator_id?, method ∈ platform_metadata|speaker_diarization|asr_ner|vision_model|ocr|manual|claim, confidence, primary_claim_id)`. Replaces the four `*_appeared_in_video` tables. `speaker` rows drive `document_node.speaker_entity_id` attribution; `demonstrated` rows are what "show me a demo of X" retrieves. For a recorded talk, `presented_by` (talk → person) is the billing; `media_appearance(role='speaker', start_ms, end_ms)` is where they actually speak in the recording — the two agree in the common case and differ for panels and Q&A.

### 4.4 The five ways a media work links to entities

| # | Link | Table | Granularity | Who writes |
|---|---|---|---|---|
| 1 | Provenance | `media_work.channel_id`, `in_series`, `published_by`, `recorded_as` (talk → work) | whole work | catalog import |
| 2 | Aboutness | `content.document_about_entity(document = transcript doc, role primary|secondary)` | whole work | extraction / summary pass |
| 3 | Presence | `corpus.media_appearance(role, start_ms, end_ms)` | time span | diarization, vision, platform metadata, manual |
| 4 | Lexical | `retrieval.chunk_entity_mention` on transcript / visual-description chunks | chunk (timecoded via `chunk_span → node`) | extraction |
| 5 | Evidence | `claim_evidence_link → locator(media_timecode)`, `chunk_relationship_evidence`, `segment_support` | quote-level, timecoded | verifier / admission |

Layers 1–3 answer "which videos are about X / feature X"; layers 4–5 answer "where exactly does the video say it" and feed temporal facts (a release date announced on stage becomes an `event_occurrence` whose `extent.locator_id` is a `media_timecode` locator).

### 4.5 Conferences, fairs, presentations

```text
corpus.event_series  (entity)  "AI Engineer World's Fair", "NeurIPS", "OpenAI DevDay", "Google I/O"   — the recurring brand
   └─ corpus.industry_event (entity)  one edition: "AI Engineer World's Fair 2026", starts_on/ends_on, city, venue, format
        ├─ corpus.industry_event (entity, parent_event_id)  sub-events: a track day, the hackathon, the expo, a workshop day
        ├─ corpus.talk (entity)  a presentation: keynote / talk / workshop / panel / lightning / demo / fireside / poster
        │     ├─ presented_by → person (qualifier speaker|moderator|panelist|host)
        │     ├─ presented_at → industry_event (properties {track, room, slot_start, slot_end})
        │     ├─ recorded_as → media_work   (the YouTube upload)
        │     └─ transcript, slides, mentions … via the media_work
        └─ corpus.media_series(series_kind='conference_recordings', industry_event_id)  the edition's playlist on the channel
```

| Table | Identity + immutable descriptors |
|---|---|
| `corpus.event_series` | `slug, name, series_kind ∈ conference|fair|summit|developer_conference|hackathon_series|meetup_series|workshop_series, organizer_entity_id?, website_url` |
| `corpus.industry_event` | `series_id?, slug, name, edition_label ('2026', 'Europe 2026'), event_kind ∈ conference|fair|summit|hackathon|launch_event|workshop|meetup|track|expo|social, starts_on, ends_on, timezone, city, country, venue, format ∈ in_person|virtual|hybrid, parent_event_id?, website_url` |
| `corpus.talk` | `title, talk_kind ∈ keynote|talk|workshop|panel|lightning|demo|fireside|poster|tutorial|announcement, abstract (source-provided), delivered_on, duration_minutes, language` — `event_slug/event_name/event_edition` text columns are gone |

Relationships (all in B.2): `edition_of` (industry_event → event_series), `organized_by`, `sponsors` (organization → industry_event, `qualifier` = tier), `presented_at`, `presented_by`, `recorded_as`, `records_event` (media_series → industry_event), `hosts` (person → media_channel | media_series, temporal). Events in the temporal sense: `talk_delivered`, `product_announced` with `object_entity_id = industry_event` when something is launched on stage.

**Worked example — AI Engineer World's Fair 2026.** `event_series(slug='ai-engineer-worlds-fair', organizer = organization 'AI Engineer')` → `industry_event(edition_label='2026', San Francisco, hybrid)` with child `industry_event(event_kind='track', name='MCP track')` and `industry_event(event_kind='hackathon')`. `media_channel(platform='youtube', handle='@aiDotEngineer', owner = 'AI Engineer')` → `media_series(series_kind='conference_recordings', title='AI Engineer World's Fair 2026', industry_event_id = the edition, primary_channel_id = the channel)`. Each recorded session is `talk —recorded_as→ media_work —in_series→ media_series`, `talk —presented_at→ track`, `talk —presented_by→ person`, `person —employed_by→ organization` (so "which companies spoke on the MCP track" is a two-hop query). The `aie-europe-2026` skill's REST data (speakers, sessions, schedule) is the first import fixture for `industry_event`/`talk`/`presented_by`/`presented_at`.

### 4.6 Queries this enables

- "Where does Anthropic explain MCP elicitation on video?" → `chunk_entity_mention(entity ∈ {mcp_feature:elicitation})` ∩ transcript chunks → `start_ms/end_ms` + `media_platform.timecode_param` → deep link `?t=`.
- "Every talk this person gave in 2026" → `presented_by` ⋈ `talk` ⋈ `presented_at` ⋈ `industry_event(starts_on in 2026)`; recordings via `recorded_as`.
- "All World's Fair talks that demoed an MCP server" → `media_series(records_event = edition)` ⋈ `in_series` ⋈ `media_appearance(role='demonstrated', entity.kind='mcp_server')`.
- "What did Matthew Berman cover this week" → `media_channel` ⋈ `media_work(published_at ≥ …)` ⋈ `document_about_entity`.
- "Which slide showed the pricing table" → `document_node(node_kind='slide')` ⋈ `extraction_record(record_kind='measurement')` locator.

---

## 5. D8 — document types and vector spaces, reconciled

**Document type** = what kind of artifact this is (SEC 10-K, arXiv paper, changelog). **Vector space** = what kind of question this index answers (engineering claims, market intelligence). They are different axes; one table connects them.

### 5.1 `content.document_type` (routing vocabulary)

```sql
content.document_type(code pk, family, description, is_primary_source bool,
  default_chunking_slug, default_extraction_kinds text[], default_spaces text[], default_summary_kinds text[],
  work_entity_kind → taxonomy.entity_kind?,   -- set when a document of this type IS a rendition of an entity
  published_at_is_world_time bool)
```

`content.document.document_type_code → document_type(code)` replaces free-text `document_kind`. `document.work_entity_id → corpus.entity` is set when the type has `work_entity_kind` (a paper document → `paper`; a transcript → `media_work`; a news article → `story`; a CVE page → `security_advisory`; a 10-K → the filing is a `story`? No: filings get `work_entity_kind = null`; they are *about* an organization → `document_about_entity(role='primary')`).

Families and codes (full list B.5): `regulatory_filing` (`sec_10k, sec_10q, sec_8k, sec_s1, sec_form_d, patent`), `research` (`arxiv_paper, conference_paper, journal_article, tech_report, model_card, system_card, dataset_card`), `vendor` (`official_docs_page, api_reference, changelog, release_notes, pricing_page, product_page, press_release, official_blog_post, terms_of_service, status_incident, security_advisory_page`), `code` (`repository_readme, repository_file, package_manifest, mcp_server_manifest, agent_skill_manifest, notebook`), `media_transcript` (`video_transcript, podcast_transcript, earnings_call_transcript, webinar_transcript, livestream_transcript`), `editorial` (`news_article, analysis_post, newsletter_issue, thirdparty_blog_post, interview, social_post, forum_thread`), `market` (`funding_announcement, job_posting, investor_letter, market_report, earnings_release`), `registry` (`registry_listing_page, package_version_page, model_hub_page`), `system_generated` (`entity_profile, research_report, document_summary, timeline_digest`).

### 5.2 The 11 vector spaces

| Space | Question it answers | Fed by (document types / structured rows) |
|---|---|---|
| `engineering_claims` | verified how/why statements | promoted claims from research, vendor docs, transcripts |
| `tool_capabilities` | what tools/servers/skills/protocol features do | `mcp_server_manifest`, `agent_skill_manifest`, `api_reference`, `knowledge.*` records |
| `implementation_examples` | pinned code | `repository_file` documents, `knowledge.implementation_example` |
| `paper_case_study_knowledge` | findings | `research` family, `case_study` |
| `entity_profiles` | who/what is X | `entity_profile` documents (one per entity) |
| `model_capabilities` | what a model version can do / costs | `model_card`, `system_card`, `pricing_page`, `ai_model_version_spec`, offering segments |
| `benchmark_intelligence` | how it scores, comparability | `benchmark_run` + `metric_observation` projections |
| `entity_timeline` **(new)** | what happened when | projected sentences from `event_occurrence` and segment boundaries |
| `market_intelligence` **(new)** | funding, ownership, pricing, traction, filings | `regulatory_filing`, `market` families, `funding_round`, `corporate_transaction`, price/availability segments |
| `document_summaries` **(new)** | coarse-to-fine entry point | every `document_summary` with `scope='document'` |
| `source_native_sections` | faithful text (exploratory) | every accepted faithful representation's chunks |

`document_type.default_spaces` is the routing default; promotion decisions can override per document. Every `vector_item` carries `content_kind ∈ chunk|summary|claim|record|profile|timeline|measurement` so a space can hold raw and summarized items side by side and the packet can say which it used.

---

## 6. D9 — summaries as first-class, lineage explicit

### 6.1 The chain (this is the contract)

```text
evidence.source_capture (bytes, sha)
  └─ content.document_version
       ├─ representation[source_native]                          (bytes as seen)
       ├─ representation[faithful_normalization | structural_extraction]
       │      ◄─ transformation_run(kind = html_to_markdown | pdf_to_markdown | asr_transcript | ocr | structural_parse …)
       │      ├─ document_node …                                 (headings, paragraphs, transcript segments, figures)
       │      ├─ chunk_set[procedure v] → retrieval_chunk → chunk_span → document_node → locator     RAW SEGMENTATION
       │      │      └─ search_projection → embedding → vector_item[space ∈ default_spaces, content_kind='chunk']
       │      └─ extraction_run → extraction_record → claims / mentions / temporal assertions
       └─ representation[semantic_projection, kind='summary']
              ◄─ transformation_run(kind='summarize', model_identity, parameters{prompt_version, audience},
                                     transformation_input = the faithful representation [+ chunk_set])
              ├─ content.document_summary  (summary_kind, scope, focus_entity_id, audience, text, token_count, coverage_ratio)
              │      └─ document_summary_source → document_node (weight)          WHAT IT COVERS
              ├─ chunk_set (only if the summary exceeds one window) → chunks        SUMMARY SEGMENTATION
              └─ search_projection(target = summary) → vector_item[space='document_summaries' + domain space, content_kind='summary']
```

Rules:
1. A summary is a `document_representation` (so it has a sha, an acceptance state, a transformation run, and can be superseded) **and** a `document_summary` row (so it has typed kind/scope/audience and coverage). Both are created together.
2. `document_summary_source` is required (≥1 node). `coverage_ratio` = covered nodes / nodes in the faithful representation. Retrieval hits on a summary expand to its nodes → chunks → locators; the packet cites chunks, never the summary.
3. `summary_kind ∈ abstract|executive|technical|key_claims|timeline|entity_centric|section|chunk_group|faq|investor_brief|learner_brief`; `scope ∈ document|section|chunk_group|entity_view`; `audience ∈ general|investor|engineer|learner`. `document_type.default_summary_kinds` decides which get generated.
4. Entity profiles are documents (`document_type_code='entity_profile'`, `work_entity_id=entity`, one new version per regeneration) whose `abstract` summary is copied into `corpus.entity.summary` by the projection worker with `projection_knowledge_seq`.
5. Existing summary-ish columns (`paper.abstract`, `talk.abstract`) stay as *source-provided* descriptors; system-generated summaries never overwrite them.

---

## 7. D10 — repositories and libraries

**Rows for structure, blobs for trees, rows for files only when read.**

| Table | Cardinality | Contents |
|---|---|---|
| `corpus.repository` | 1 per repo | `host, owner, name` (current, projected from `repository_location` stream), `provider_native_id`, `created_at_host`, `is_fork`, `fork_of_repository_id` |
| `corpus.repository_revision` | 1 per (repo, commit we looked at) | `commit_sha, ref_name, committed_at, tree_sha, tree_manifest_artifact_id` (gzip JSON `[{path,size,blob_sha,lang}]`, truncated flag past 50k files), `file_count, total_bytes, languages jsonb, capture_id` |
| `corpus.repository_module` | tens per repo, stable by path | `path, module_kind ∈ root|package|app|service|library|docs|examples|infra|tests|benchmarks|other, name, language, manifest_path, manifest_kind, library_id?` (published as), `first_seen_revision_id, last_seen_revision_id, description` |
| `corpus.repository_file` | only files captured or cited | `revision_id, path, blob_sha, size_bytes, language, file_role ∈ readme|manifest|license|changelog|docs|source|example|test|config|notebook|schema|workflow|other, module_id?, capture_id` → its text is `content.document(document_type_code ∈ repository_readme|repository_file|package_manifest…, repository_file_id)` |
| `corpus.library_release` | 1 per published version | `library_id, version_label, registry_id, source_revision_id?, license_code, released_on (projection)` |
| `knowledge.implementation_example` | | `repository_file_id, symbol, start_line, end_line` replace `repository_id, commit_sha, path` |
| `ranking.metric_observation` | | traction: `stars, forks, contributors_90d, releases_per_quarter, weekly_downloads` with `subject_entity_id = repository|library` |

Streams: `repository_location` (host/owner/name → `payload`), `repository_visibility`, `repository_archival`, `library_maintenance`, `library_license`. Events: `repo_created, repo_made_public, repo_renamed, repo_transferred, repo_archived, repo_unarchived, release_published, release_yanked`.

Relationships: `backed_by_repository` (product/library/mcp_server/agent_skill → repository, `qualifier ∈ source|mirror|fork|monorepo_path`, `properties.path_in_repo`), `depends_on` (library_release → library, `qualifier ∈ runtime|dev|peer|optional|build`, `properties.version_range`), `implements_technique`, `implements_protocol` (→ ai_protocol_version | ai_protocol_feature, `qualifier ∈ client|server|both`).

Why not the whole tree as rows: a monorepo has 10⁴–10⁵ files and we read a dozen. The manifest artifact keeps the complete tree replayable (path lookups by `jsonb_path_query` or a temp load); rows exist for what evidence points at. Code symbols stay text on `implementation_example` until demand justifies a `repository_symbol` table.

---

## 8. Evidence, linkage and retrieval (carried forward, trimmed)

### 8.1 Evidence (D4)
Unchanged from the previous round except: `source_state` becomes columns on `evidence.source` (`first_seen_at, last_seen_at, last_encounter_kind, last_capture_id, capture_count, failure_streak, next_revisit_after, blocked_reason, state_knowledge_seq`), rebuilt from `source_encounter`. `evidence.source` also gains `host, registrable_domain, publisher_entity_id → corpus.entity, source_kind`. Typed claim associations become `evidence.claim_subject(claim_id, entity_id, role ∈ subject|object|context)` and `evidence.claim_record(claim_id, record_id → knowledge.record)`; `claim.relationship_id → corpus.relationship` when the claim asserts an edge.

### 8.2 Linkage (D5)
`retrieval.chunk_entity_mention(chunk_id, entity_id, verb ∈ mentions|is_about|defines|compares|demonstrates|quotes|cites|deprecates|recommends, confidence, method)`, `retrieval.chunk_claim_link` (existing verbs), `retrieval.chunk_relationship_evidence(chunk_id, relationship_id, verb ∈ supports|challenges|context|dates)`. Admitted support: `evidence.segment_support(segment_id | event_occurrence_id, claim_id, locator_id, role ∈ supports|challenges|context, k_from, k_to)` — one table; withdrawal is `k_to := K`.

### 8.3 Retrieval (D6)
`retrieval.projection_target(id, target_kind ∈ entity|record|chunk|claim|summary, entity_id?, record_id?, chunk_id?, claim_id?, summary_id?)` with `num_nonnulls(...) = 1` and real FKs. `retrieval.vector_item` loses the 13 arc columns and gains `projection_target_id`, `entity_id`, `entity_kind`, `secondary_entity_ids uuid[]`, `document_type_code`, `content_kind`, `valid_during tstzrange`, `knowledge_seq`, `assurance_rank`, `start_ms`, `end_ms`. `api.hybrid_knowledge_search_1536` gains `p_spaces text[]`, `p_entity_ids uuid[]`, `p_document_types text[]`, `p_content_kinds text[]`, `p_as_of timestamptz`, `p_knowledge_seq bigint`, `p_min_assurance smallint`, `p_publication_id uuid`. `vector-backends` `VectorSearchRequest.filters` mirrors these; `knowledge-contracts` `VectorSpaceSchema` grows the three new keys.

---

## 9. Access model for agents

| Role (existing) | Reads | Writes |
|---|---|---|
| `pipeline_agent` | `api.*`, `corpus`, `knowledge`, `temporal` (select) | `staging`, `evidence` (sources, captures, locators, queries, results, encounters, extraction, claims), `content`, `retrieval` chunks/projections |
| `verifier_agent` | all knowledge schemas | `evidence.claim_evidence_assessment`, `verification_*` |
| `executor_service` (admission) | everything | `corpus`, `temporal` **only via** `temporal.begin_batch/assert_*/commit_batch`; `knowledge`; projections |
| `app_reader`, `authenticated` | `api.*` only | — |

Direct `insert` on `temporal.segment`/`corpus.relationship` is revoked from every role except the function owner; the helpers are `security definer`. That is what makes "agents propose, admission writes" a schema fact rather than a convention.

---

## 10. Migration runbook

### 10.1 Preconditions (do these before writing DDL)

1. **Commit the working tree.** ~70 migration files (`20260829012402` → `20260908030000`), `src/database.generated.ts`, `scripts/*`, `docs/` are uncommitted. Commit as "chain as applied on 2026-09-08" so the km series has a fixed base.
2. **Verify shared-project state:** `supabase link --project-ref <ref>` then `supabase migration list --linked`. Every local file up to `20260908030000` must show as applied. If any is missing, `supabase db push` first and stop.
3. **Inventory dependents** (this replaces the previous M0 and takes five minutes):

```sql
-- FKs from Untouched/Alter schemas into Rebuild schemas (each must be re-pointed in km_02/km_09)
select conrelid::regclass dependent, conname, confrelid::regclass target, pg_get_constraintdef(oid)
from pg_constraint
where contype = 'f'
  and confrelid::regclass::text ~ '^(corpus|knowledge|staging|ranking)\.'
  and conrelid::regclass::text !~ '^(corpus|knowledge|staging|ranking)\.'
order by 1, 2;
-- Views / functions referencing rebuilt tables
select distinct dependent_ns.nspname || '.' || dependent_view.relname
from pg_depend d join pg_rewrite r on r.oid = d.objid join pg_class dependent_view on dependent_view.oid = r.ev_class
join pg_class source on source.oid = d.refobjid join pg_namespace dependent_ns on dependent_ns.oid = dependent_view.relnamespace
join pg_namespace source_ns on source_ns.oid = source.relnamespace
where source_ns.nspname in ('corpus','knowledge','staging','ranking');
```

Known dependents from the chain today: `staging` (15 FKs), `ranking` (20), `retrieval.vector_item` (2: `video_id`, `talk_id`), `evaluation` (1), `curriculum` (5), `taxonomy.assignment` (14 arc legs), `research` (4, from `20260829012402`), `evidence.claim_*` (case_study, product_version, technical_record), `api.*` functions from `20260826001500`. Paste the query output into `km_00` as the explicit drop list — do not rely on `cascade` silently.

### 10.2 Migration files

All in `supabase/migrations/`, prefix `20260912` so they sort after the chain. Each file is one transaction. `km_00` is the only destructive file.

| File | Does | Depends on |
|---|---|---|
| `20260912010000_km_00_teardown.sql` | Drop every table in `corpus`, `knowledge`, `staging`, `ranking`; drop `evidence.source_query/source_retrieval/source_support`, all `evidence.claim_<kind>` associations; drop `retrieval.chunk_entity_mention/chunk_claim_link/chunk_concept_link/chunk_citation_link/chunk_relationship_evidence/projection_target`; drop `vector_item` arc columns (`claim_id` … `talk_id`, `source_kind`, `embedding`); drop `taxonomy.assignment` arc columns; drop `api.*` functions that reference dropped tables; drop dependent FKs listed by the inventory query (research, curriculum, evaluation). `truncate` `retrieval.vector_item`, `vector_item_embedding_1536`, `search_projection`, `embedding_*`, `space_publication`, `packet_*`, `retrieval_run*`, `content.*` (immutability triggers: `alter table … disable trigger all` inside the transaction, then re-enable). | chain |
| `20260912010100_km_01_vocabularies.sql` | `taxonomy.entity_kind` reseeded (B.1); `taxonomy.relationship_kind` (B.2); `temporal.stream_kind` (B.3), `temporal.event_kind` (B.4) — schema `temporal` created here; `content.document_type` (B.5); `content.transformation_kind`; `evidence.search_provider`, `evidence.capture_method`; `corpus.license`, `corpus.distribution_kind`. | km_00 |
| `20260912010200_km_02_corpus_identity.sql` | `corpus.entity`, `entity_alias`, `entity_identifier`, `entity_merge`; vocab `media_platform`; all typed identity tables (A.1/A.2) incl. `media_channel`, `media_series`, `media_work`, `event_series`, `industry_event` (with `parent_event_id`), `talk`, `repository_revision/module/file`, `library_release`, `funding_round`, `corporate_transaction`, `registry`, `registry_listing`, `security_advisory`, `compute_*`; re-point `research.*`, `curriculum.*`, `evaluation.*`, `taxonomy.assignment.target_entity_id` FKs to `corpus.entity`. | km_01 |
| `20260912010300_km_03_relationship.sql` | `corpus.relationship` + kind-check trigger + partial unique; `corpus.media_appearance`. | km_02 |
| `20260912010400_km_04_temporal.sql` | `temporal.knowledge_head/batch/extent/stream/segment/event/event_occurrence`; stamp/guard triggers; `begin_batch`, `commit_batch`, `make_extent`, `assert_state`, `assert_relationship`, `assert_event`, `close_segment`; `btree_gist` if absent. | km_03 |
| `20260912010500_km_05_evidence.sql` | Alter `evidence.source` (+host, registrable_domain, publisher_entity_id, source_kind, projection columns), `source_capture.capture_method` FK, `locator` (+selector_kind, start_ms, end_ms, page_number); create `source_query` (rebuilt), `provider_result`, `source_encounter`, `extraction_run`, `extraction_record`, `attribution`, `claim_subject`, `claim_record` (FK added in km_07), `claim.relationship_id`, `segment_support`. | km_04 |
| `20260912010600_km_06_content.sql` | `content.document`: rename `document_kind`→`document_type_code` + FK, +`work_entity_id`, +`repository_file_id`; `transformation_run.transformation_kind` FK, +`converter_identity/version`; `document_representation.representation_kind` CHECK; `document_node` +`start_ms/end_ms/speaker_entity_id`; create `document_about_entity`, `document_summary`, `document_summary_source`. Re-create immutability triggers for new tables. | km_05 |
| `20260912010700_km_07_knowledge.sql` | `knowledge.record` registry, nine typed records rebuilt (shared PK), `record_entity_link`; `implementation_example.repository_file_id`; `evidence.claim_record` FK; `taxonomy.assignment.target_record_id` FK. | km_06 |
| `20260912010800_km_08_retrieval.sql` | `chunking_procedure_version` typed columns; `projection_target` (5-way, needs `knowledge.record`); `vector_item` +`projection_target_id` + facets + indexes; seed 11 `vector_space` rows and 11 partitions of `vector_item_embedding_1536` (each with HNSW); `chunk_entity_mention`, `chunk_claim_link`, `chunk_relationship_evidence`; hybrid RPC replaced with filter parameters. | km_07 |
| `20260912010900_km_09_ranking_staging.sql` | `ranking.*` rebuilt on `subject_entity_id` (+`benchmark_run_id`); `staging.candidate/identity_match/resolution_decision/vetting_decision` rebuilt generic. | km_08 |
| `20260912011000_km_10_api.sql` | `api.resolve_entity`, `entity_card`, `entity_at`, `relationships`, `entity_timeline`, `what_changed`; views `api.entities`, `current_facts`, `current_relationships`, `events_current`; `api.hybrid_knowledge_search_1536` final signature; `api.evidence_packet` re-pointed. | km_09 |
| `20260912011100_km_11_grants_rls.sql` | Grants per §9; RLS on every new tenant table (copy the policy pattern from `20260826001550`); revoke direct DML on `temporal.*` and `corpus.relationship` from all roles; `security definer` on the helpers with `set search_path = ''`. | km_10 |
| `20260912011200_km_12_projection_workers.sql` | `corpus.rebuild_entity_projections(K)`, `evidence.rebuild_source_state()`, `retrieval.project_entity_timeline(K)`, `corpus.import_research_starter_catalog()` (`research_starter_channels` → `media_channel`, `research_starter_videos` → `media_work` + transcript `document`/`source_capture`, playlists → `in_series`); outbox topics `knowledge.batch_sealed`, `projection.rebuilt`. | km_11 |

Tests (pgTAP, `supabase/tests/`): `knowledge_model_temporal.sql` (rehire as episode 2; price split at a date; correction closes/reopens at new K; `entity_at` old K reproduces old belief; scheduled → actual event; no-overlap exclusion fires), `knowledge_model_media.sql` (transcript node → chunk_span → locator timecodes → packet member `start_ms`; `media_appearance` role query), `knowledge_model_summary.sql` (summary requires ≥1 source node; summary hit expands to chunks; superseding a summary keeps the old representation), `knowledge_model_repository.sql` (module/file/revision round-trip; `implementation_example` → file → document), `knowledge_model_relationship.sql` (kind-pair trigger rejects `person employed_by paper`; non-temporal kind rejects a stream), `knowledge_model_grants.sql` (`pipeline_agent` cannot insert into `temporal.segment`; helpers work for `executor_service`).

### 10.3 Commands, in order

```sh
# A. Fresh-chain proof in a disposable workspace (the reset guard requires a vfy-/disposable- project id)
git worktree add ../dbc-km-proof HEAD
cd ../dbc-km-proof
sed -i 's/^project_id = "aiengineer"/project_id = "disposable-km-v2"/' supabase/config.toml
npm ci && npm run db:start && npm run db:reset                 # applies chain + km_00..km_12 from zero
for t in supabase/tests/knowledge_model_*.sql; do npx supabase test db "$t"; done
npm run types:generate && npm run typecheck                    # writes src/database.generated.ts

# B. Populated-upgrade proof (same worktree): reset to the chain head, then apply only km_*
npx supabase db reset --version 20260908030000                 # chain without km files
npm run db:migrate                                             # applies km_00..km_12 on top → proves the teardown path
for t in supabase/tests/knowledge_model_*.sql; do npx supabase test db "$t"; done

# C. Shared project (destructive by design: km_00 drops and truncates the knowledge domain)
cd ../ai-engineer-db-contract
git checkout -- supabase/config.toml                           # project_id stays "aiengineer"
supabase link --project-ref <shared-ref>
supabase migration list --linked                               # expect: every file ≤ 20260908030000 applied, km_* pending
supabase db push                                               # applies km_00..km_12
supabase migration list --linked                               # expect: all applied

# D. Contract release
#   package.json version 0.2.38 → 0.3.0 ; copy src/database.generated.ts from step A ; update src/index.ts exports
npm run typecheck && npm pack                                   # → aiengineer-database-contract-0.3.0.tgz
git add supabase/migrations/20260912* supabase/tests/knowledge_model_* src/ package.json && git commit -m "knowledge model v2: rebuild corpus/temporal/media/documents/repos"
git tag contract-0.3.0 && git push --tags
```

Use `npm run types:generate:native` with `POSTGRES_URL` if Docker is unavailable; the output is structurally equivalent.

### 10.4 Consumers to update in the same change window

| Where | Change |
|---|---|
| `.cursor/rules/db-contract.mdc` | Pin to the new commit hash. |
| `ai-engineer-knowledge-services/packages/persistence/package.json` | `vendor/aiengineer-database-contract-0.3.0.tgz`. |
| `ai-engineer-knowledge-services/packages/contracts/src/spaces.ts` | `VectorSpaceSchema` += `entity_timeline`, `market_intelligence`, `document_summaries`. |
| `packages/contracts/src/verification/selectors.ts` | Add `media_region`; keep `media_timecode` shape (`startMs/endMs`) — now also written to `locator.start_ms/end_ms`. |
| `packages/vector-backends` | `VectorSearchRequest.filters { spaces?, entityIds?, documentTypes?, contentKinds?, asOf?, knowledgeSeq?, minAssurance?, publicationId? }`; `VectorSearchCandidate` += `entityId?, contentKind, validDuring?, knowledgeSeq, startMs?, endMs?`. |
| `packages/persistence` | Replace writes to dropped `vector_item` arc columns and `projection_target.canonical_table` with `projection_target(target_kind, …_id)`; write `content_kind`. `grep -rn "canonical_table\|video_id\|talk_id\|report_version_id" packages/` must return nothing. |
| `packages/conversion` | Emit `start_ms/end_ms/speaker_entity_id` on transcript nodes; `representation_kind` from the new CHECK list. |
| `packages/application/preparation.ts` | Map fixture kinds (`talk_transcript`, `paper_abstract`, …) to `document_type.code`. |
| Research-starter skills (`sync-research-starter-videos`, `ingest-youtube-research-starters`) | Unchanged (`public.research_starter_*`); `corpus.import_research_starter_catalog()` in km_12 mirrors them into `media_channel` / `media_work` / transcript documents. |
| `aie-europe-2026` skill / MCP (`list_speakers`, `list_sessions`, `get_schedule`) | First fixture for `event_series` → `industry_event` (edition + tracks) → `talk` → `presented_by` / `presented_at`, and the matching `media_series(conference_recordings)` on `@aiDotEngineer`. |
| `docs/knowledge-model/WALKTHROUGH-deep-research-ingestion.md` | Table renames: `corpus.video`→`media_work`; typed relationship tables → `corpus.relationship`; `revision`/`support_segment` → `[k_from,k_to)`; `source_state` → columns on `source`. Narrative otherwise holds. |

### 10.5 Exit criteria

- Fresh chain and populated upgrade both apply with zero warnings; all `knowledge_model_*` tests pass on PG17.
- `select count(*) from pg_constraint where contype='f' and confrelid::regclass::text like 'corpus.%' and conrelid::regclass::text !~ '^(corpus|temporal|evidence|content|retrieval|knowledge|ranking|staging|research|curriculum|evaluation|taxonomy)\.'` = 0 (no stray dependents).
- `retrieval.vector_item_embedding_1536` has exactly 11 partitions, each with an HNSW index; `explain` on the filtered hybrid RPC shows an index scan with `hnsw.iterative_scan`.
- `pipeline_agent` insert into `temporal.segment` fails with `permission denied`; the same fact through `assert_state` as `executor_service` succeeds and `api.entity_at` returns it.
- `npm run types:check` clean; KS `pnpm -r typecheck` clean against 0.3.0.

### 10.6 What is deliberately not done now

- **No squash** of the 150-file chain. Squash after Mission Control's first release, when the verification schema stops moving.
- **No P1 entity kinds beyond the list in B.1** (`model_artifact`, `dataset_version`, `benchmark_version`, `deployment`, `regulation`). Adding one later is: one row in `entity_kind`, one typed table, rows in `relationship_kind` — additive, no rebuild.
- **No second embedding dimensionality.** 1536/halfvec only.
- **No graph database.** One-hop and two-hop expansion is `corpus.relationship` self-joins with an index on `(from_entity_id, kind)` and `(to_entity_id, kind)`.

### 10.7 Decided open questions (from the previous round)

| Question | Decision |
|---|---|
| Tenant model for corpus | `tenant_id` on every table, defaulting to the system tenant; public industry entities live in the system tenant; FKs into `corpus.entity` use `(tenant_id, id)` where the referencing table is tenant-scoped, single-column `id` elsewhere. |
| `concept` vs `technique` | Split. `technique` is an entity with `technique_kind`; `concept` stays pedagogical. |
| Where `story` lives | `corpus.story` identity (so it can be mentioned, attributed, timelined) with its text as `content.document(work_entity_id=story)`. |
| Embedding dims | 1536 only. |
| `mcp_server_version`, `agent_skill_version`, `product_family` | Dropped. Server/skill versions are `library_release` rows when packaged, `registry_listing` otherwise; product lines are `product —variant_of→ product`. |
| `mcp_server_tool/resource/prompt` | One child table `corpus.mcp_server_surface(surface_kind ∈ tool|resource|prompt, name, schema_artifact_id)`. |

---

## Appendix A — DDL for the new core

Schematic but PG17-valid; RLS, grants, `created_by_receipt_id`, and indexes follow the conventions in `20260826000500_corpus.sql` and `20260903010000_knowledge_content_contract.sql`. `util.uuidv7()`, `util.default_tenant_id()`, `util.reject_mutation()` exist.

### A.1 Registry, relationship, media

```sql
create table corpus.entity (
  id uuid primary key default util.uuidv7(),
  tenant_id uuid not null default util.default_tenant_id(),
  kind text not null references taxonomy.entity_kind(code),
  display_name text not null,                        -- projection (entity_name stream)
  slug text not null,
  summary text,                                      -- projection (latest entity_profile abstract)
  lifecycle text not null default 'active' check (lifecycle in ('active','merged','retired')),
  merged_into_id uuid references corpus.entity(id),
  projection_knowledge_seq bigint,
  created_by_receipt_id uuid not null references orchestration.operation_receipt(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id), unique (tenant_id, id, kind), unique (tenant_id, kind, slug)
);
create index entity_name_trgm on corpus.entity using gin (display_name extensions.gin_trgm_ops);

create table corpus.entity_alias (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  entity_id uuid not null references corpus.entity(id),
  alias text not null check (btrim(alias) <> ''),
  alias_normalized text generated always as (lower(btrim(alias))) stored,
  alias_kind text not null check (alias_kind in ('synonym','acronym','former_name','handle','ticker','slug','misspelling','translation','model_alias')),
  language text, source_claim_id uuid references evidence.claim(id),
  unique (tenant_id, entity_id, alias_normalized, alias_kind)
);
create index entity_alias_trgm on corpus.entity_alias using gin (alias_normalized extensions.gin_trgm_ops);

create table corpus.entity_identifier (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  entity_id uuid not null references corpus.entity(id),
  scheme text not null check (scheme in ('wikidata','ror','orcid','github','huggingface','npm','pypi','crates','go_module','doi','arxiv','openreview',
    'mcp_registry','cve','ghsa','spdx','crunchbase','pitchbook','linkedin','x','youtube_channel','youtube_playlist','youtube_video','spotify','apple_podcasts','domain','sec_cik','lei','isin','other')),
  value text not null,
  unique (tenant_id, scheme, value)
);

-- Typed identity table pattern (repeat per kind; only natural keys + immutable descriptors)
create table corpus.person (
  id uuid primary key references corpus.entity(id),
  tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'person' check (kind = 'person'),
  given_name text, family_name text, orcid text,
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred
);

create table taxonomy.relationship_kind (
  code text primary key,
  from_kinds text[] not null, to_kinds text[] not null,
  temporal boolean not null, symmetric boolean not null default false,
  inverse_label text, description text not null,
  property_schema jsonb not null default '{}'::jsonb
);

create table corpus.relationship (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null references taxonomy.relationship_kind(code),
  from_entity_id uuid not null references corpus.entity(id),
  to_entity_id uuid not null references corpus.entity(id),
  qualifier text not null default '',
  episode integer not null default 1 check (episode >= 1),
  properties jsonb not null default '{}'::jsonb,
  primary_claim_id uuid references evidence.claim(id),
  k_from bigint not null, k_to bigint,
  created_at timestamptz not null default now(),
  check (from_entity_id <> to_entity_id), check (k_to is null or k_to > k_from)
);
create unique index relationship_current_uq on corpus.relationship (tenant_id, kind, from_entity_id, to_entity_id, qualifier, episode) where k_to is null;
create index relationship_from_idx on corpus.relationship (tenant_id, from_entity_id, kind) where k_to is null;
create index relationship_to_idx   on corpus.relationship (tenant_id, to_entity_id, kind)   where k_to is null;

create function corpus.check_relationship_kinds() returns trigger language plpgsql set search_path = '' as $$
declare fk text; tk text; rk record;
begin
  select * into rk from taxonomy.relationship_kind where code = new.kind;
  select kind into fk from corpus.entity where id = new.from_entity_id;
  select kind into tk from corpus.entity where id = new.to_entity_id;
  if not (fk = any(rk.from_kinds)) or not (tk = any(rk.to_kinds)) then
    raise exception 'relationship % does not admit % -> %', new.kind, fk, tk using errcode = 'check_violation';
  end if;
  return new;
end $$;
create trigger relationship_kinds before insert on corpus.relationship for each row execute function corpus.check_relationship_kinds();

create table corpus.media_platform (
  code text primary key check (code in ('youtube','vimeo','spotify','apple_podcasts','x','linkedin','twitch','bilibili','self_hosted','conference_platform','other')),
  name text not null,
  media_url_template text,     -- 'https://www.youtube.com/watch?v={external_id}'
  channel_url_template text,   -- 'https://www.youtube.com/{handle}'
  timecode_param text,         -- 't' → deep link '&t={seconds}s'
  product_entity_id uuid references corpus.entity(id)
);

create table corpus.media_channel (
  id uuid primary key references corpus.entity(id), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'media_channel' check (kind = 'media_channel'),
  platform_code text not null references corpus.media_platform(code),
  external_id text not null, handle text, title text not null, url text,
  owner_entity_id uuid references corpus.entity(id),          -- organization | person (checked at seal)
  created_at_platform timestamptz,
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred,
  unique (tenant_id, platform_code, external_id)
);

create table corpus.event_series (
  id uuid primary key references corpus.entity(id), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'event_series' check (kind = 'event_series'),
  slug text not null, name text not null,
  series_kind text not null check (series_kind in ('conference','fair','summit','developer_conference','hackathon_series','meetup_series','workshop_series')),
  organizer_entity_id uuid references corpus.entity(id), website_url text,
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred,
  unique (tenant_id, slug)
);

create table corpus.industry_event (
  id uuid primary key references corpus.entity(id), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'industry_event' check (kind = 'industry_event'),
  series_id uuid references corpus.event_series(id),
  parent_event_id uuid references corpus.industry_event(id),  -- tracks, hackathons, expo days inside an edition
  slug text not null, name text not null, edition_label text,
  event_kind text not null check (event_kind in ('conference','fair','summit','hackathon','launch_event','workshop','meetup','track','expo','social')),
  starts_on date, ends_on date, timezone text, city text, country text, venue text,
  format text check (format in ('in_person','virtual','hybrid')), website_url text,
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred,
  unique (tenant_id, slug), check (parent_event_id is null or parent_event_id <> id),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table corpus.media_series (
  id uuid primary key references corpus.entity(id), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'media_series' check (kind = 'media_series'),
  series_kind text not null check (series_kind in ('playlist','podcast_show','recurring_show','conference_recordings','course','livestream_series')),
  platform_code text references corpus.media_platform(code), external_id text,
  title text not null, description text,
  primary_channel_id uuid references corpus.media_channel(id),
  industry_event_id uuid references corpus.industry_event(id),  -- set for conference_recordings
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred
);
create unique index media_series_platform_uq on corpus.media_series (tenant_id, platform_code, external_id) where external_id is not null;

create table corpus.media_work (
  id uuid primary key references corpus.entity(id), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'media_work' check (kind = 'media_work'),
  media_kind text not null check (media_kind in ('video','audio','image','slide_deck','livestream','screencast')),
  platform_code text not null references corpus.media_platform(code),
  external_id text, url text, title text not null,
  channel_id uuid references corpus.media_channel(id),
  published_at timestamptz, duration_ms integer check (duration_ms is null or duration_ms >= 0),
  width integer, height integer, language text,
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred
);
create unique index media_work_platform_uq on corpus.media_work (tenant_id, platform_code, external_id) where external_id is not null;
create index media_work_channel_idx on corpus.media_work (tenant_id, channel_id, published_at desc);
-- series membership is corpus.relationship(kind='in_series', properties {ordinal, season, episode})

create table corpus.talk (
  id uuid primary key references corpus.entity(id), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null default 'talk' check (kind = 'talk'),
  title text not null,
  talk_kind text not null default 'talk' check (talk_kind in ('keynote','talk','workshop','panel','lightning','demo','fireside','poster','tutorial','announcement')),
  abstract text, delivered_on date, duration_minutes integer, language text,
  foreign key (tenant_id, id, kind) references corpus.entity (tenant_id, id, kind) deferrable initially deferred
);
-- presented_at / presented_by / recorded_as are corpus.relationship rows (B.2)

create table corpus.media_appearance (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  media_work_id uuid not null references corpus.media_work(id),
  entity_id uuid not null references corpus.entity(id),
  role text not null check (role in ('speaker','host','guest','interviewee','panelist','subject','demonstrated','depicted','logo','screen_recording','mentioned','sponsor')),
  start_ms integer, end_ms integer,
  locator_id uuid references evidence.locator(id),
  method text not null check (method in ('platform_metadata','speaker_diarization','asr_ner','vision_model','ocr','manual','claim')),
  confidence numeric(5,4) check (confidence between 0 and 1),
  primary_claim_id uuid references evidence.claim(id),
  created_at timestamptz not null default now(),
  check (end_ms is null or (start_ms is not null and end_ms >= start_ms))
);
create index media_appearance_entity_idx on corpus.media_appearance (tenant_id, entity_id, role);
```

### A.2 Temporal

```sql
create schema temporal;
create extension if not exists btree_gist with schema extensions;

create table temporal.knowledge_head (
  tenant_id uuid primary key default util.default_tenant_id(),
  knowledge_seq bigint not null default 0, updated_at timestamptz not null default now());

create table temporal.knowledge_batch (
  tenant_id uuid not null default util.default_tenant_id(), knowledge_seq bigint not null,
  recorded_at timestamptz not null default now(),
  receipt_id uuid not null references orchestration.operation_receipt(id),
  operation_id uuid references knowledge_service.operation(id),
  idempotency_key text not null, input_digest text not null check (input_digest ~ '^[0-9a-f]{64}$'),
  summary jsonb not null default '{}'::jsonb,
  primary key (tenant_id, knowledge_seq), unique (tenant_id, idempotency_key));

create table temporal.extent (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  source_text text, precision text not null check (precision in ('instant','day','month','quarter','year','relative','unknown')),
  earliest timestamptz, latest timestamptz, timezone text,
  locator_id uuid references evidence.locator(id),
  check (earliest is null or latest is null or latest >= earliest));

create table temporal.stream_kind (
  code text primary key,
  subject_mode text not null check (subject_mode in ('entity','relationship')),
  subject_kinds text[] not null default '{}',
  status_values text[], requires_amount boolean not null default false, unit_values text[],
  requires_ref_entity boolean not null default false, ref_entity_kinds text[],
  payload_schema jsonb not null default '{}'::jsonb, description text not null);

create table temporal.stream (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null references temporal.stream_kind(code),
  subject_entity_id uuid references corpus.entity(id),
  subject_relationship_id uuid references corpus.relationship(id),
  scope_key text not null default '',
  created_at timestamptz not null default now(),
  check (num_nonnulls(subject_entity_id, subject_relationship_id) = 1),
  unique nulls not distinct (tenant_id, kind, subject_entity_id, subject_relationship_id, scope_key));

create table temporal.event_kind (
  code text primary key, subject_kinds text[] not null, object_kinds text[],
  starts_stream_kind text references temporal.stream_kind(code), ends_stream_kind text references temporal.stream_kind(code),
  description text not null);

create table temporal.event (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  kind text not null references temporal.event_kind(code),
  subject_entity_id uuid not null references corpus.entity(id),
  object_entity_id uuid references corpus.entity(id),
  relationship_id uuid references corpus.relationship(id),
  dedupe_key text, created_at timestamptz not null default now(),
  unique nulls not distinct (tenant_id, kind, subject_entity_id, object_entity_id, relationship_id, dedupe_key));

create table temporal.event_occurrence (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  event_id uuid not null references temporal.event(id),
  occurred_during tstzrange not null check (not isempty(occurred_during)),
  occurrence_mode text not null check (occurrence_mode in ('actual','scheduled','cancelled')),
  belief text not null default 'accepted' check (belief in ('accepted','disputed','unknown')),
  extent_id uuid references temporal.extent(id), primary_claim_id uuid references evidence.claim(id),
  payload jsonb not null default '{}'::jsonb,
  k_from bigint not null, k_to bigint, created_at timestamptz not null default now(),
  check (k_to is null or k_to > k_from));
create unique index event_occurrence_current_uq on temporal.event_occurrence (event_id) where k_to is null;

create table temporal.segment (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  stream_id uuid not null references temporal.stream(id),
  valid_during tstzrange not null check (not isempty(valid_during) and lower_inc(valid_during) and not upper_inc(valid_during) and not lower_inf(valid_during)),
  belief text not null default 'accepted' check (belief in ('accepted','disputed','unknown')),
  temporal_basis text not null check (temporal_basis in ('explicit','carry_forward','observation_bounded','unresolved')),
  status text, amount numeric(20,6), currency char(3), unit text,
  ref_entity_id uuid references corpus.entity(id),
  payload jsonb not null default '{}'::jsonb,
  extent_id uuid references temporal.extent(id),
  caused_by_event_id uuid references temporal.event(id),
  replaces_segment_id uuid references temporal.segment(id),
  primary_claim_id uuid references evidence.claim(id),
  k_from bigint not null, k_to bigint, created_at timestamptz not null default now(),
  check (k_to is null or k_to > k_from), check (replaces_segment_id is null or replaces_segment_id <> id),
  check (temporal_basis in ('observation_bounded','unresolved') or extent_id is not null),
  exclude using gist (stream_id with =, valid_during with &&) where (k_to is null)
);
create index segment_stream_current_idx on temporal.segment (stream_id) where k_to is null;
create index segment_valid_gist on temporal.segment using gist (valid_during) where k_to is null;

-- Batch envelope: k stamped from a transaction-local GUC; only k_to may change, once.
create function temporal.current_k() returns bigint language sql stable set search_path = '' as
$$ select nullif(current_setting('temporal.k', true), '')::bigint $$;

create function temporal.stamp_k() returns trigger language plpgsql set search_path = '' as $$
begin
  if temporal.current_k() is null then raise exception 'no open knowledge batch' using errcode = 'invalid_transaction_state'; end if;
  new.k_from := temporal.current_k(); new.k_to := null; return new;
end $$;
create function temporal.guard_k() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'DELETE' then raise exception 'sealed history cannot be deleted' using errcode = 'restrict_violation'; end if;
  if old.k_to is not null or new.k_to is distinct from temporal.current_k()
     or to_jsonb(new) - 'k_to' <> to_jsonb(old) - 'k_to' then
    raise exception 'only k_to may be set, once, to the open batch' using errcode = 'restrict_violation';
  end if;
  return new;
end $$;
-- attach stamp_k (before insert) and guard_k (before update or delete) to segment, event_occurrence, corpus.relationship

create function temporal.begin_batch(p_expected_head bigint default null) returns bigint language plpgsql security definer set search_path = '' as $$
declare h bigint; t uuid := util.default_tenant_id();
begin
  insert into temporal.knowledge_head (tenant_id) values (t) on conflict do nothing;
  select knowledge_seq into h from temporal.knowledge_head where tenant_id = t for update;
  if p_expected_head is not null and h <> p_expected_head then
    raise exception 'rebase_required: head is %, expected %', h, p_expected_head using errcode = 'serialization_failure';
  end if;
  perform set_config('temporal.k', (h + 1)::text, true);
  return h + 1;
end $$;

create function temporal.commit_batch(p_receipt uuid, p_idempotency_key text, p_input_digest text, p_summary jsonb default '{}') returns bigint
language plpgsql security definer set search_path = '' as $$
declare k bigint := temporal.current_k(); t uuid := util.default_tenant_id(); bad record;
begin
  if k is null then raise exception 'no open knowledge batch'; end if;
  -- slot rules per stream kind
  for bad in
    select s.id, sk.code from temporal.segment s join temporal.stream st on st.id = s.stream_id join temporal.stream_kind sk on sk.code = st.kind
    where s.k_from = k and (
      (sk.status_values is not null and (s.status is null or not (s.status = any(sk.status_values)))) or
      (sk.requires_amount and (s.amount is null or s.currency is null or s.unit is null)) or
      (sk.unit_values is not null and s.unit is not null and not (s.unit = any(sk.unit_values))) or
      (sk.requires_ref_entity and s.ref_entity_id is null))
  loop raise exception 'segment % violates slot rules of stream kind %', bad.id, bad.code using errcode = 'check_violation'; end loop;
  insert into temporal.knowledge_batch (tenant_id, knowledge_seq, receipt_id, idempotency_key, input_digest, summary)
  values (t, k, p_receipt, p_idempotency_key, p_input_digest, p_summary);
  update temporal.knowledge_head set knowledge_seq = k, updated_at = now() where tenant_id = t;
  perform set_config('temporal.k', '', true);
  return k;
end $$;
-- assert_state / assert_relationship / assert_event / close_segment / make_extent: see km_04; each is security definer,
-- splits or closes the overlapping current segment(s) at the new lower bound, then inserts.
```

### A.3 Document types, summaries, repositories

```sql
create table content.document_type (
  code text primary key,
  family text not null check (family in ('regulatory_filing','research','vendor','code','media_transcript','editorial','market','registry','system_generated')),
  description text not null, is_primary_source boolean not null,
  default_chunking_slug text not null, default_extraction_kinds text[] not null, default_spaces text[] not null,
  default_summary_kinds text[] not null default '{abstract}',
  work_entity_kind text references taxonomy.entity_kind(code),
  published_at_is_world_time boolean not null default true);

alter table content.document rename column document_kind to document_type_code;
alter table content.document
  add constraint document_type_fk foreign key (document_type_code) references content.document_type(code),
  add column work_entity_id uuid references corpus.entity(id),
  add column repository_file_id uuid references corpus.repository_file(id);

create table content.document_about_entity (
  tenant_id uuid not null default util.default_tenant_id(),
  document_id uuid not null references content.document(id), entity_id uuid not null references corpus.entity(id),
  role text not null check (role in ('primary','secondary','mention')),
  method text not null check (method in ('extraction','manual','inherited','provider')), confidence numeric(5,4),
  primary key (tenant_id, document_id, entity_id));

alter table content.document_node add column start_ms integer, add column end_ms integer,
  add column speaker_entity_id uuid references corpus.entity(id),
  add constraint node_ms_check check (end_ms is null or (start_ms is not null and end_ms >= start_ms));

alter table evidence.locator
  add column selector_kind text not null default 'text_quote' check (selector_kind in ('text_quote','character_position','multi_fragment_text','json_pointer','html','pdf_text','bounding_box','table','repository','dataset','api_record','media_timecode','media_region')),
  add column start_ms integer, add column end_ms integer, add column page_number integer,
  add constraint locator_media_ms check (selector_kind not in ('media_timecode','media_region') or start_ms is not null);

create table content.document_summary (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  document_version_id uuid not null references content.document_version(id),
  representation_id uuid not null references content.document_representation(id),              -- class semantic_projection, kind summary
  derived_from_representation_id uuid not null references content.document_representation(id), -- the faithful text
  transformation_run_id uuid not null references content.transformation_run(id),              -- kind summarize
  summary_kind text not null check (summary_kind in ('abstract','executive','technical','key_claims','timeline','entity_centric','section','chunk_group','faq','investor_brief','learner_brief')),
  scope text not null check (scope in ('document','section','chunk_group','entity_view')),
  scope_node_id uuid references content.document_node(id),
  focus_entity_id uuid references corpus.entity(id),
  audience text not null default 'general' check (audience in ('general','investor','engineer','learner')),
  text text not null, language text, token_count integer not null check (token_count > 0),
  content_sha256 text not null check (content_sha256 ~ '^[0-9a-f]{64}$'),
  coverage_ratio numeric(5,4) check (coverage_ratio between 0 and 1),
  lifecycle text not null default 'active' check (lifecycle in ('active','superseded','withdrawn')),
  supersedes_id uuid references content.document_summary(id),
  created_at timestamptz not null default now(),
  check (scope <> 'section' or scope_node_id is not null), check (scope <> 'entity_view' or focus_entity_id is not null),
  unique (tenant_id, id));
create unique index document_summary_active_uq on content.document_summary
  (tenant_id, document_version_id, summary_kind, scope, coalesce(scope_node_id, '00000000-0000-0000-0000-000000000000'), coalesce(focus_entity_id, '00000000-0000-0000-0000-000000000000'), audience)
  where lifecycle = 'active';

create table content.document_summary_source (
  tenant_id uuid not null default util.default_tenant_id(),
  summary_id uuid not null references content.document_summary(id),
  node_id uuid not null references content.document_node(id),
  weight numeric(5,4) not null default 1 check (weight between 0 and 1),
  primary key (tenant_id, summary_id, node_id));

create table corpus.repository_revision (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  repository_id uuid not null references corpus.repository(id),
  commit_sha text not null check (commit_sha ~ '^[0-9a-f]{40}$|^[0-9a-f]{64}$'),
  ref_name text, committed_at timestamptz, tree_sha text,
  tree_manifest_artifact_id uuid references orchestration.artifact(id), manifest_truncated boolean not null default false,
  file_count integer, total_bytes bigint, languages jsonb not null default '{}'::jsonb,
  capture_id uuid references evidence.source_capture(id), created_at timestamptz not null default now(),
  unique (tenant_id, repository_id, commit_sha));

create table corpus.repository_module (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  repository_id uuid not null references corpus.repository(id), path text not null,
  module_kind text not null check (module_kind in ('root','package','app','service','library','docs','examples','infra','tests','benchmarks','other')),
  name text, language text, manifest_path text,
  manifest_kind text check (manifest_kind in ('package_json','pyproject','cargo_toml','go_mod','pom','gemspec','dockerfile','mcp_json','skill_md','other')),
  library_id uuid references corpus.library(id),
  first_seen_revision_id uuid references corpus.repository_revision(id), last_seen_revision_id uuid references corpus.repository_revision(id),
  description text, unique (tenant_id, repository_id, path));

create table corpus.repository_file (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  repository_id uuid not null references corpus.repository(id), revision_id uuid not null references corpus.repository_revision(id),
  path text not null, blob_sha text, size_bytes integer, language text,
  file_role text not null check (file_role in ('readme','manifest','license','changelog','docs','source','example','test','config','notebook','schema','workflow','other')),
  module_id uuid references corpus.repository_module(id), capture_id uuid references evidence.source_capture(id),
  created_at timestamptz not null default now(), unique (tenant_id, revision_id, path));
```

### A.4 Retrieval facets and projection target

```sql
create table retrieval.projection_target (
  id uuid primary key default util.uuidv7(), tenant_id uuid not null default util.default_tenant_id(),
  target_kind text not null check (target_kind in ('entity','record','chunk','claim','summary')),
  entity_id uuid references corpus.entity(id), record_id uuid references knowledge.record(id),
  chunk_id uuid references retrieval.retrieval_chunk(id), claim_id uuid references evidence.claim(id),
  summary_id uuid references content.document_summary(id),
  admitted_at timestamptz not null default now(), retired_at timestamptz,
  check (num_nonnulls(entity_id, record_id, chunk_id, claim_id, summary_id) = 1),
  unique (tenant_id, id),
  unique nulls not distinct (tenant_id, target_kind, entity_id, record_id, chunk_id, claim_id, summary_id));

alter table retrieval.vector_item
  add column projection_target_id uuid references retrieval.projection_target(id),
  add column entity_id uuid, add column entity_kind text, add column secondary_entity_ids uuid[] not null default '{}',
  add column document_type_code text references content.document_type(code),
  add column content_kind text not null default 'chunk' check (content_kind in ('chunk','summary','claim','record','profile','timeline','measurement')),
  add column valid_during tstzrange, add column knowledge_seq bigint, add column assurance_rank smallint,
  add column start_ms integer, add column end_ms integer,
  add foreign key (tenant_id, entity_id, entity_kind) references corpus.entity (tenant_id, id, kind);
create index vector_item_entity_idx on retrieval.vector_item (tenant_id, entity_id) where lifecycle = 'active';
create index vector_item_secondary_gin on retrieval.vector_item using gin (secondary_entity_ids) where lifecycle = 'active';
create index vector_item_valid_gist on retrieval.vector_item using gist (valid_during) where lifecycle = 'active';
create index vector_item_type_kind_idx on retrieval.vector_item (tenant_id, document_type_code, content_kind) where lifecycle = 'active';

-- one partition per space; repeat for the 11 slugs
create table retrieval.vector_item_embedding_1536_entity_timeline partition of retrieval.vector_item_embedding_1536 for values in ('entity_timeline');
create index on retrieval.vector_item_embedding_1536_entity_timeline using hnsw (embedding extensions.halfvec_cosine_ops);
```

---

## Appendix B — vocabularies to seed in `km_01`

### B.1 `taxonomy.entity_kind` (36)

`person, organization, product, product_version, product_feature, ai_model, ai_model_version, model_offering, technique, dataset, benchmark, benchmark_run, repository, library, library_release, mcp_server, agent_skill, ai_protocol, ai_protocol_version, ai_protocol_feature, paper, media_channel, media_series, media_work, event_series, industry_event, talk, story, case_study, concept, funding_round, corporate_transaction, registry, security_advisory, compute_device, compute_offering`.

### B.2 `taxonomy.relationship_kind` (56; `T` = temporal, needs `relationship_active` stream)

| code | from → to | T | qualifier values / properties |
|---|---|---|---|
| `employed_by` | person → organization | T | title in `properties`, `qualifier` = seniority band |
| `founded` | person → organization | | |
| `board_member_of`, `advisor_to`, `investor_in` (person) | person → organization | T | |
| `subsidiary_of` | organization → organization | T | |
| `owns_stake_in` | organization → organization | T | `properties.percent` via `ownership_stake` stream |
| `partner_of` | organization ↔ organization | T | symmetric |
| `develops`, `vends`, `operates`, `distributes`, `customer_of` | organization → product/ai_model/library/mcp_server/agent_skill | T | |
| `participates_in_round` | organization/person → funding_round | | `lead|participant|angel` |
| `recipient_of_round` | organization → funding_round | | |
| `party_to_transaction` | organization → corporate_transaction | | `acquirer|target|merging_party|seller|spinout_parent|licensor|licensee` |
| `transaction_asset` | corporate_transaction → product/repository/ai_model | | |
| `version_of` | product_version → product; ai_model_version → ai_model; library_release → library; ai_protocol_version → ai_protocol | | |
| `variant_of`, `supersedes`, `competes_with` | product ↔ product; ai_model ↔ ai_model | | |
| `has_feature` | product → product_feature | | |
| `built_on_model` | product/product_version → ai_model_version | T | `default|optional|fine_tuned_from` |
| `offered_as` | ai_model_version → model_offering | | |
| `offered_by` | model_offering → organization | | |
| `derived_from_model` | ai_model_version → ai_model_version | | `fine_tuned|distilled|merged|quantized|adapter|continued_pretraining|rl_post_training` |
| `uses_technique` | ai_model_version/product/library → technique | | `core|component|training|inference|alignment` |
| `introduces_technique` | paper → technique | | |
| `technique_relates_to` | technique → technique | | `builds_on|variant_of|replaces|combines_with|special_case_of` |
| `trained_on` | ai_model_version → dataset | | `pretraining|sft|rl|evaluation` |
| `evaluated_on` | benchmark_run → benchmark | | |
| `benchmark_subject` | benchmark_run → ai_model_version/product_version/library_release | | |
| `benchmark_executed_by` | benchmark_run → organization | | |
| `benchmark_uses_dataset` | benchmark → dataset | | |
| `backed_by_repository` | product/library/mcp_server/agent_skill → repository | | `source|mirror|fork|monorepo_path`, `properties.path_in_repo` |
| `depends_on` | library_release/product_version → library | | `runtime|dev|peer|optional|build`, `properties.version_range` |
| `maintains` | person/organization → library/repository/mcp_server/agent_skill | T | |
| `implements_protocol` | product/library/mcp_server → ai_protocol_version/ai_protocol_feature | T | `client|server|both`; conformance via `protocol_feature_support` stream |
| `feature_of_protocol` | ai_protocol_feature → ai_protocol | | |
| `listed_in` | library/mcp_server/agent_skill/ai_model/dataset → registry | T | `properties.external_id`; status via `registry_listing_status` stream |
| `affected_by_advisory` | library/mcp_server/product/ai_model → security_advisory | | `properties.affected_range, fixed_in` |
| `authored_by` | paper/story/agent_skill → person | | position in `qualifier` |
| `published_by` | paper/story/media_work → organization | | |
| `cites` | paper → paper | | |
| `appears_in` | *(replaced by `corpus.media_appearance`)* | | |
| `published_on` | media_work → media_channel | | cross-posts beyond `media_work.channel_id` |
| `in_series` | media_work → media_series | | `properties {ordinal, season, episode}` |
| `series_on_channel` | media_series → media_channel | | when a series spans channels/platforms |
| `channel_owned_by` | media_channel → organization/person | T | mirrors `media_channel.owner_entity_id`; temporal for ownership changes |
| `hosts` | person → media_channel/media_series | T | podcast/show hosts |
| `records_event` | media_series → industry_event | | conference recordings playlist |
| `edition_of` | industry_event → event_series | | |
| `organized_by` | industry_event/event_series → organization | | |
| `sponsors` | organization → industry_event | | `qualifier` = tier (`title|platinum|gold|silver|community`) |
| `presented_at` | talk → industry_event | | `properties {track, room, slot_start, slot_end}`; target may be a sub-event (track) |
| `presented_by` | talk → person | | `speaker|moderator|panelist|host`; `qualifier` order = billing order |
| `recorded_as` | talk → media_work | | |
| `announced_at` | product_version/ai_model_version/product → industry_event | | launched on stage; pairs with event `product_announced(object=industry_event)` |
| `about` | story/case_study → any | | `subject|mention|context` |
| `case_study_uses` | case_study → product/ai_model_version/library/technique | | |
| `runs_on` | model_offering/compute_offering → compute_device | | |
| `provides_compute` | organization → compute_offering | | |
| `manufactures` | organization → compute_device | | |
| `instance_of_concept` | any → concept | | pedagogical tagging |
| `hardware_requirement` | ai_model_version → compute_device | | `properties.min_memory_gb, precision` |

### B.3 `temporal.stream_kind` (P0, 20)

| code | subject | slots |
|---|---|---|
| `relationship_active` | relationship (any temporal kind) | `status ∈ active|suspended|ended` |
| `entity_name` | any entity | `payload {display_name, legal_name?}` |
| `engagement_role` | relationship `employed_by` | `payload {title, department, seniority}` |
| `ownership_stake` | relationship `owns_stake_in` | `amount` (percent), `unit='percent'` |
| `repository_location` | repository | `payload {host, owner, name}` |
| `repository_visibility` | repository | `status ∈ public|private` |
| `repository_archival` | repository | `status ∈ active|archived` |
| `library_maintenance` | library | `status ∈ active|maintenance_only|deprecated|abandoned` |
| `library_license` | library, library_release | `payload {license_code}` |
| `model_offering_availability` | model_offering | `status ∈ announced|preview|ga|deprecated|retired` |
| `model_offering_price` | model_offering; scope `unit|tier` | `amount, currency, unit ∈ per_1m_input_tokens|per_1m_output_tokens|per_1m_cached_input_tokens|per_hour|per_seat_month|per_request|per_image|per_minute_audio` |
| `model_offering_limit` | model_offering; scope `limit_kind` | `amount, unit ∈ context_tokens|max_output_tokens|rpm|tpm|batch_size` |
| `model_version_spec` | ai_model_version | `ref_entity_id → ai_model_version_spec` |
| `protocol_feature_support` | relationship `implements_protocol` | `status ∈ full|partial|experimental|removed` |
| `product_feature_availability` | product_feature; scope `plan|region` | `status ∈ announced|preview|ga|deprecated|removed` |
| `registry_listing_status` | relationship `listed_in` | `status ∈ listed|delisted|flagged|verified|official|archived` |
| `compute_offering_price` | compute_offering; scope `unit` | `amount, currency, unit ∈ per_hour|per_month|spot_per_hour` |
| `work_disposition` | paper, story, media_work | `status ∈ current|corrected|expression_of_concern|retracted|withdrawn` (document versions inherit it through `document.work_entity_id`) |
| `organization_status` | organization | `status ∈ operating|acquired|merged|dissolved|stealth` |
| `valuation` | organization | `amount, currency, unit ∈ post_money|pre_money|secondary` |

### B.4 `temporal.event_kind` (P0, 38)

`hired, left, founded, renamed, dissolved, event_announced, event_held, funding_announced, funding_closed, transaction_announced, transaction_closed, transaction_cancelled, repo_created, repo_made_public, repo_made_private, repo_renamed, repo_transferred, repo_archived, repo_unarchived, release_published, release_yanked, model_version_released, offering_started, offering_deprecated, offering_retired, price_changed, protocol_version_published, protocol_feature_introduced, benchmark_run_completed, advisory_published, story_published, story_corrected, story_retracted, talk_delivered, media_published, product_announced, product_generally_available, product_discontinued`.

### B.5 `content.document_type` (see §5.1 for codes)

Seed each with `default_chunking_slug` (`structural_heading` for docs/changelogs/readmes; `semantic_boundary` for papers/filings; `transcript_window` for transcripts; `code_symbol` for source files; `table_row` for pricing pages), `default_extraction_kinds`, `default_spaces` (§5.2), `default_summary_kinds` (`{abstract,key_claims}` for research; `{executive,investor_brief,timeline}` for filings and market; `{abstract,technical}` for vendor docs; `{abstract,timeline,entity_centric}` for transcripts), and `work_entity_kind` (`paper` for research codes; `media_work` for transcripts; `story` for editorial; `security_advisory` for advisory pages; null otherwise).

### B.6 `retrieval.vector_space` (11)

`engineering_claims, tool_capabilities, implementation_examples, paper_case_study_knowledge, entity_profiles, model_capabilities, benchmark_intelligence, entity_timeline, market_intelligence, document_summaries` (canonical) and `source_native_sections` (exploratory).
