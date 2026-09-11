# Walkthrough — a deep-research agent ingests OpenAI and Anthropic releases, twice

> **Read with [FINAL-RECOMMENDATION.md](./FINAL-RECOMMENDATION.md) (2026-09-11).** The narrative holds; apply these renames while reading: `corpus.video` → `corpus.media_work`; every typed relationship table (`product_backed_by_repository`, `protocol_feature_support`, …) → one `corpus.relationship` row with `kind`/`qualifier`; `temporal.revision` / `event_revision` / `support_segment` → `[k_from, k_to)` columns on `segment`, `event_occurrence`, `segment_support`; `evidence.source_state` → projection columns on `evidence.source`; `seal_temporal_batch(manifest)` → `begin_batch` / `assert_*` / `commit_batch`.

**Companion to [RECOMMENDATION.md](./RECOMMENDATION.md).** This is a narrative trace of one research agent working against the *target* schema (after stages M1–M7), not the schema as applied today. Table names follow the recommendation; where a table already exists in the migration chain it is marked ✅, where it is proposed it is marked ➕.

**Every date, version label, price and quote below is a fixture.** Real product and company names are used so the story reads naturally, but nothing here is a researched claim about OpenAI, Anthropic, or any paper. In production the same rows are filled from admitted evidence.

Cast:

| Actor | Role |
|---|---|
| **Researcher** | A deep-research agent (Eve / Claude Code / Codex, it does not matter) running with the `pipeline_agent` role: may read corpus, may write staging/evidence/content, **cannot** write corpus or temporal directly. |
| **Admission** | `knowledge_service.seal_temporal_batch` — the bounded writer that turns verified proposals into a sealed knowledge batch. |
| **Verifier** | Independent verification run (different deployment) that assesses claim ↔ locator support. |
| **Projection worker** | Rebuilds current-state projections and vector items after each seal. |

Two research passes, both in 2026:

| Pass | World clock | Tenant knowledge head before → after | Mission |
|---|---|---|---|
| **Pass 1** | 2026-03-14 | K = 41 → **42** | "Map OpenAI and Anthropic agent-product releases since 2025-06, with the repos/SDKs that ship them." |
| **Pass 2** | 2026-09-08 | K = 56 → **57** | "Refresh the same map; capture deprecations, pricing changes, corrections." |

---

## Part I — Pass 1 (2026-03-14)

### 1. The mission starts

A `knowledge_service.operation` ✅ is opened with an idempotency key; every write below carries its `operation_id`, and the final seal references its `knowledge_service.receipt` ✅. The Researcher receives the mission text plus one instruction that matters for this document: *"You never insert into `corpus.*` or `temporal.*`. You propose; admission writes."*

### 2. Asking the providers

The Researcher fans out to search providers. Each call becomes one `evidence.source_query` ✅ (amended ➕ with `provider_code`, `query_kind`, `cost_usd`) and the raw response is retained as an `orchestration.artifact` ✅.

| `source_query` | provider_code | query_kind | query_text (abridged) | results |
|---|---|---|---|---|
| Q1 | `tavily` | `search` | "OpenAI Codex release 2026 changelog" | 10 |
| Q2 | `tavily` | `search` | "Anthropic Claude Code release notes 2026" | 10 |
| Q3 | `tavily` | `search` | "Claude Agent SDK MCP elicitation support" | 8 |
| Q4 | `firecrawl` | `extract` | `https://developers.openai.com/codex/changelog` | 1 |
| Q5 | `firecrawl` | `extract` | `https://docs.anthropic.com/.../claude-code/changelog` | 1 |
| Q6 | `github_api` | `lookup` | repos `openai/codex`, `openai/openai-agents-python`, `anthropics/claude-code`, `anthropics/claude-agent-sdk-python` | 4 |
| Q7 | `arxiv_api` | `search` | "deep research agent orchestration planner synthesizer" | 6 |
| Q8 | `npm_registry`, `pypi` | `lookup` | `@openai/codex`, `@anthropic-ai/claude-code`, `claude-agent-sdk`, `openai-agents` | 4 |

Each hit becomes an `evidence.provider_result` ➕ row **exactly as the provider returned it** — rank, URL, title, snippet, provider score, and the provider's *claimed* `published_at`. The Researcher does not trust that date; it is stored as the provider's assertion.

```text
provider_result  Q1#1  url_as_returned = https://developers.openai.com/codex/changelog
                        provider_published_at = 2026-03-10  provider_score = 0.91
provider_result  Q7#2  url_as_returned = https://arxiv.org/abs/2602.xxxxx  (fixture id)
                        title = "Hierarchical Orchestration for Deep Research Agents"
```

### 3. Turning hits into sources, and remembering the encounter

For every distinct normalized URL the Researcher resolves an `evidence.source` ✅ (amended ➕ with `host`, `registrable_domain`, `publisher_organization_id`). Resolution order: exact `canonical_url` match → `logical_identity` match (`github:repo:openai/codex`, `arxiv:2602.xxxxx`, `npm:@openai/codex`) → insert new.

Then the ledger starts. Every touch is an `evidence.source_encounter` ➕:

| source | encounter_kind | discovered_at | refs |
|---|---|---|---|
| openai codex changelog | `provider_listed` | 2026-03-14 14:02Z | provider_result Q1#1 |
| openai codex changelog | `fetch_attempted` | 14:02Z | — |
| openai codex changelog | `captured` | 14:03Z | `source_capture` C-101 (sha `9f3a…`, `capture_method='firecrawl_scrape'` ➕ vocabulary) |
| anthropic claude code changelog | `captured` | 14:03Z | C-102 |
| github.com/openai/codex | `captured` | 14:04Z | C-103 (`api_json`) |
| arxiv 2602.xxxxx (abstract page) | `captured` | 14:05Z | C-104 |
| arxiv 2602.xxxxx (PDF) | `captured` | 14:05Z | C-105 (`pdf_download`) |
| some medium.com repost of the changelog | `skipped_policy` | 14:05Z | outcome_detail: `duplicate_of=C-101, policy=prefer_official` |
| a paywalled analyst note | `paywalled` | 14:06Z | http 402 |

`evidence.source_capture` ✅ stays immutable: bytes in `orchestration.artifact`, `content_sha256`, `captured_at`, HTTP metadata. After the pass, the projection worker rebuilds `evidence.source_state` ➕:

```text
source_state[openai codex changelog]
  first_seen_at = 2026-03-14 14:02Z   last_seen_at = 2026-03-14 14:03Z
  last_encounter = captured            last_capture_id = C-101   capture_count = 1
  revisit_policy = official_changelog_weekly   next_revisit_after = 2026-03-21
```

### 4. Conversion (what does the text look like?)

Each capture becomes a `content.document` ✅ / `content.document_version` ✅ (`manifest_sha256`, `correction_state='current'`) bound by `document_version_source_capture` ✅. Then a `content.transformation_run` ✅ (amended ➕ `transformation_kind` vocabulary, `converter_identity`) produces a `content.document_representation` ✅:

| capture | transformation_kind | converter_identity | representation_class | acceptance |
|---|---|---|---|---|
| C-101 (HTML) | `html_to_markdown` | `firecrawl@2026.02` | `faithful_normalization` | `accepted` after `conversion_evaluation` (coverage 0.98) |
| C-103 (JSON) | `structural_parse` | `github-api-normalizer@1.4` | `structural_extraction` | accepted |
| C-105 (PDF) | `pdf_to_markdown` | `marker@1.9` | `faithful_normalization` | accepted; two `conversion_finding` warnings on table 3 |

`document_node` ✅ rows record the heading tree with byte offsets. Encounter `converted` is appended per source.

### 5. Segmentation (how was it split?)

A `retrieval.chunking_procedure_version` ✅ (amended ➕ with `strategy_kind`, `window_tokens`, `overlap_tokens`, `parent_child`) is chosen per content class:

| representation | strategy_kind | window / overlap | parent_child |
|---|---|---|---|
| changelog markdown | `structural_heading` | ≤ 600 / 0 | true (release heading → bullet chunks) |
| repo README + release JSON | `structural_heading` | ≤ 500 / 0 | true |
| paper markdown | `semantic_boundary` | ≤ 450 / 60 | true (section → paragraph) |

Each run writes a `retrieval.chunk_set` ✅ (`frozen_config`, `chunk_set_sha256`) with `retrieval_chunk` ✅ rows and a `chunk_span` ✅ per chunk pointing at an `evidence.locator` ✅ (selector + `selected_content_sha256`). Encounter `segmented` is appended.

### 6. Extraction (what did the text say?)

Now the Researcher reads. One `evidence.extraction_run` ➕ per representation × extraction kind, and one `evidence.extraction_record` ➕ per thing found, **always** anchored to a `locator_id` and, when a date is involved, to a `temporal.extent` ➕ carrying the source's own wording and precision.

From the Codex changelog (C-101), abridged:

| # | record_kind | payload (abridged) | extent | locator |
|---|---|---|---|---|
| R1 | `entity_mention` | OpenAI (organization) | — | L-1 |
| R2 | `entity_mention` | Codex (product), Codex CLI 2.0 (product_version) | — | L-2 |
| R3 | `temporal_assertion` | event `release_published`, subject product_version "Codex CLI 2.0" | `"February 18, 2026"` → exact day, `precision=day` | L-2 |
| R4 | `relationship_assertion` | `product_backed_by_repository(codex → github:openai/codex, kind=source, official)` | — | L-3 |
| R5 | `relationship_assertion` | `protocol_feature_support(product_version=Codex CLI 2.0 → MCP feature "elicitation", role=client, conformance=full)` | `"now supports"` → `carry_forward` from R3 date | L-4 |
| R6 | `claim` | "Codex CLI 2.0 runs sandboxed by default on macOS and Linux." claim_type `capability` | — | L-5 |
| R7 | `attribution` | claim R6 attributed_to OpenAI (organization), `official_statement` | — | L-5 |
| R8 | `relationship_assertion` | `product_built_on_model_version(codex → model_version "gpt-5.x-codex", usage_kind=default)` | — | L-6 |
| R9 | `measurement` | pricing table: `model_offering_price(offering=openai:gpt-5.x-codex:api, 2.50 USD per_1m_input_tokens, 10.00 USD per_1m_output_tokens)` | `"effective March 1, 2026"` | L-7 |

From the Claude Code changelog (C-102): analogous records for "Claude Code 2.4" (fixture), `product_backed_by_repository(claude_code → anthropics/claude-code)`, `library_release(@anthropic-ai/claude-code 2.4.0, npm)`, `protocol_feature_support(claude_code → MCP "tasks", role=client, conformance=experimental)`, and a `temporal_assertion` for a **scheduled** event: `"Claude Agent SDK 1.0 general availability planned for April"` → `occurrence_mode='scheduled'`, extent `precision=month`.

From the GitHub API (C-103): `repository_visibility=public`, `repository_archival=false` as **point observations** (`temporal_basis` will be `unresolved` at the boundary — the API says "public now", not "public since").

From the paper (C-104/C-105): see §9.

### 7. How the Researcher finds the right tables

The Researcher does not memorize DDL. It runs a fixed discovery procedure against the schema itself, using the generated types from `@aiengineer/database-contract` plus four catalog tables:

| Question the Researcher asks | Where it looks | What it learns |
|---|---|---|
| "Is 'Codex' something we already know?" | `corpus.entity_alias` ➕ (trigram on `alias_normalized`) → `corpus.entity` ➕ → `taxonomy.entity_kind.canonical_table` ✅ | `codex` resolves to `corpus.entity{kind=product}` → `corpus.product` row `p-openai-codex`. `Codex CLI 2.0` has no alias → candidate for insert as `product_version`. |
| "Is 'OpenAI' the same OpenAI?" | `corpus.entity_identifier` ➕ `scheme='domain' value='openai.com'`, `scheme='github' value='openai'` | Exact identifier match → `identity_match.match_method='exact'`. |
| "Which stream kind holds 'supports MCP elicitation'?" | `temporal.stream_kind` ➕ catalog: `code, subject_kinds, edge_kinds, payload_table, contract_version` | `protocol_feature_support` → payload `corpus.protocol_feature_support_segment`, edge `corpus.protocol_feature_support (product_version_id | library_release_id, ai_protocol_feature_id)`. |
| "Which stream kind holds a price?" | same catalog | `model_offering_price` → payload `corpus.model_offering_price_segment`, requires `model_offering` subject; one stream per offering × unit × tier. |
| "Does the MCP feature 'elicitation' exist?" | `corpus.ai_protocol_feature` ➕ by `(ai_protocol='mcp', slug='elicitation')` | Exists; `introduced_in_version_id` = MCP 2025-06-18 spec (fixture). |
| "Is a release date an event or a segment?" | `temporal.stream_kind` vs `temporal.event_kind` ➕ catalog | `release_published` is an **event** with `event_revision.occurrence_extent`; the version's *availability* is a stream that the event may start (via `event_segment_effect`). |
| "Where does a pricing table go?" | `extraction_record.record_kind='measurement'` → admission maps to stream `model_offering_price` (not `ranking.metric_observation`, which is for measured metrics like benchmark scores) | Prices are asserted world facts with validity; metric observations are measurements at an instant. |
| "What columns does `corpus.product_version` have?" | `Database['corpus']['Tables']['product_version']['Insert']` from the pinned contract types | `product_id, version_label, release_channel ∈ preview|beta|stable|lts|deprecated|retired, released_on (projection), release_url, notes`. |
| "May I insert into corpus?" | grants: `pipeline_agent` has SELECT-only on `corpus` ✅ | No. Write `staging.candidate` + `extraction_record`; admission writes corpus. |

The output of this step is a **proposal manifest** (an `orchestration.artifact`) listing every intended row keyed by extraction record, with the resolved target table and the identity decision (`link` vs `insert`).

### 8. Staging and identity decisions

For every entity mention, a `staging.candidate` ✅ (+ typed subtype: `candidate_product`, `candidate_repository`, `candidate_library`, `candidate_paper`, …) with `capture_id`, `locator_id`, `mission_id`. Then:

| candidate | identity_match | resolution_decision.outcome |
|---|---|---|
| OpenAI (org) | exact → `corpus.organization` | `link` |
| Anthropic (org) | exact | `link` |
| Codex (product) | normalized alias | `link` |
| Codex CLI 2.0 (product_version) | none | `insert` |
| github:openai/codex (repository) | exact `logical_identity` | `link` |
| @openai/codex 2.0.0 (library_release) | none (library exists, release does not) | `insert` |
| Claude Code 2.4 (product_version) | none | `insert` |
| MCP "tasks" feature | exact | `link` |
| gpt-5.x-codex (ai_model_version) | none — and no vendor spec page captured | `review` (insufficient identity evidence; the built-on relationship is parked) |
| paper 2602.xxxxx | none | `insert` |
| technique "hierarchical research orchestration" | none; `concept_alias` has nothing close | `insert` as `corpus.technique` |

`vetting_decision` ✅ for sources: official changelogs and the GitHub API → `approved_for_research`; the medium repost → `rejected` (duplicate); the arXiv paper → `approved_for_research` **and** flagged as a promotion candidate (§9).

### 9. Verification, then admission — sealing K = 42

The Verifier (separate deployment) runs `evidence.verification_run` ✅ over the proposal: each `claim` gets `claim_evidence_link` ✅ rows to locators and append-only `claim_evidence_assessment` ✅ verdicts (`directly_supported` for R6; `supported_with_qualification` for the scheduled Agent SDK GA because the wording is "planned").

Admission then executes **one** `knowledge_service.seal_temporal_batch(expected_head=41, manifest)`:

1. Locks the tenant `temporal.knowledge_head` ➕; checks `41`.
2. Inserts corpus identities from `resolution_decision=insert`: `corpus.entity` rows + typed rows (`product_version` ×2, `library_release` ×2, `paper` ×1, `technique` ×1, `model_offering` ×1 for `openai:gpt-5.x-codex:api` — offering identity is allowed even while the model *version* identity is under review, because the offering's natural key is the provider endpoint slug).
3. Creates streams + first revisions + segments:

| stream_kind | subject / edge | segment `valid_during` | belief / basis | evidence |
|---|---|---|---|---|
| `protocol_feature_support` | Codex CLI 2.0 → MCP elicitation (client, full) | `[2026-02-18, ∞)` | accepted / `carry_forward` (start taken from R3 event) | L-4, L-2 |
| `protocol_feature_support` | Claude Code 2.4 → MCP tasks (client, experimental) | `[2026-03-05, ∞)` | accepted / carry_forward | … |
| `model_offering_price` | gpt-5.x-codex api, per_1m_input_tokens, standard | `[2026-03-01, ∞)` amount 2.50 USD | accepted / explicit | L-7 |
| `model_offering_price` | … per_1m_output_tokens | `[2026-03-01, ∞)` amount 10.00 USD | accepted / explicit | L-7 |
| `repository_visibility` | openai/codex | `[2026-03-14 14:04Z, ∞)` = public | accepted / **unresolved lower bound** (point observation) | C-103 |
| `repository_archival` | openai/codex | same | accepted / unresolved | C-103 |
| `organization_product_role` | OpenAI → Codex (developer, primary) | already existed; **no new revision** | — | — |

4. Creates events with `event_revision` ➕ at K=42:

| event | kind | occurrence | mode |
|---|---|---|---|
| E-501 | `release_published` (product_version Codex CLI 2.0) | `2026-02-18` (extent precision=day, tz unknown → date range, not midnight UTC) | actual |
| E-502 | `release_published` (library_release @openai/codex 2.0.0) | `2026-02-18` | actual |
| E-503 | `release_published` (Claude Code 2.4) | `2026-03-05` | actual |
| E-504 | `generally_available` (Claude Agent SDK 1.0) | `possible_during = [2026-04-01, 2026-05-01)` | **scheduled** |

`event_encounter` ➕ rows record `discovered_at = 2026-03-14 14:0x` for each, so `delays(E-501)` will later report a +24-day discovery delay and `delays(E-504)` a *negative* delay (advance knowledge).

5. Admits support: `evidence.support_relationship` ➕ (claim R6 ↔ L-5) with stream `support`, first `support_segment` `[2026-02-18, ∞) verdict=directly_supported`; `segment_claim_binding` ➕ ties the elicitation segment to R5/R3 evidence.
6. Seals: inserts `temporal.knowledge_batch(42, recorded_at, decision_receipt, policy_artifact, input_manifest)`, moves head to 42, appends outbox.

### 10. The paper — retrieval promotion, embedding, linkage

The arXiv paper is the one item that passes the **content promotion gate**:

1. `corpus.paper` ✅ inserted (arxiv_id, title, `published_on` fixture 2026-02-03), `paper_authored_by_person` ✅ for two resolved authors (ORCID matches) and one `review` candidate.
2. `corpus.technique` ➕ "hierarchical research orchestration" (kind `agent_pattern`), `paper_introduces_technique` ➕.
3. Extraction of `claims` from sections 3–5 yields 9 claims; 7 verified `directly_supported`. Two become `knowledge.solution_pattern` ✅ records ("planner–worker–synthesizer decomposition with evidence ledger", "budgeted breadth-then-depth search") with `assurance_level='source_inspection'`, `provenance_claim_id`, and `solution_pattern_applies_technique` ➕.
4. `retrieval.content_promotion_proposal` ✅ (target spaces `paper_case_study_knowledge`, `engineering_claims`; risks: single-source) → `content_promotion_decision.decision='accept'` with policy version and expiry.
5. `retrieval.search_projection` ✅ rows are generated per space by the projection procedure; `search_projection_chunk_support` ✅ ties each projection to the chunks/locators that back it.
6. `retrieval.embedding_run` ✅ (1536 dims, halfvec) → `embedding_item` ✅ → `retrieval.vector_item` ✅ with the new facets ➕: `entity_id = paper`, `secondary_entity_ids = {technique, OpenAI?no, …}`, `valid_during = [2026-02-03, ∞)`, `knowledge_seq = 42`, `assurance_rank = 20`.
7. Linkage rows: `chunk_claim_link(states)` ✅ for the 9 claims; `chunk_entity_mention(is_about → technique; mentions → "deep research" products)` ✅ retargeted ➕ to `corpus.entity`; `chunk_citation_link` ✅ for the 31 references (12 resolve to existing `corpus.paper`).
8. A new `space_publication` ✅ for `paper_case_study_knowledge` and `engineering_claims` in the official store: manifests, `expected_item_count`, eval gate → `publication_switch_receipt(action='publish')` ✅. The publication row pins `knowledge_seq = 42`.

Encounter `extracted`, `verified`, and later `cited_in_packet` are appended for the arXiv source.

### 11. What a reader sees after Pass 1

```text
entity_state('codex', V = 2026-03-14, K = 42)
  product_version   Codex CLI 2.0           released 2026-02-18 (day precision)
  protocol_support  MCP elicitation (client, full)   since 2026-02-18  [carry_forward]
  repository        github:openai/codex   public, not archived   [lower bound = observation]
  built_on_model    (pending review — no admitted segment)

entity_state('openai:gpt-5.x-codex:api', V = 2026-03-14, K = 42)
  price  2.50 USD / 1M input tokens   since 2026-03-01
  price 10.00 USD / 1M output tokens  since 2026-03-01
```

Retrieval: "how do deep research agents split planning from synthesis?" → alias/profile resolution finds `technique:hierarchical-research-orchestration` → graph hop to `paper` and the two `solution_pattern` records → filtered hybrid ANN over `paper_case_study_knowledge` + `engineering_claims` with `entity_id ∈ {paper, technique}` → `evidence_packet` ✅ with `publication_id`, `knowledge_seq=42`, per-member locators.

---

## Part II — Pass 2 (2026-09-08)

Between passes, other missions advanced the head to K = 56. Pass 2 opens a new operation and re-runs the same query plan, with one difference: `source_state.next_revisit_after` tells the Researcher which sources are due and which were seen recently by other missions.

### 12. Encounters, second time around

| source | encounter_kind | why |
|---|---|---|
| openai codex changelog | `captured` (C-201, sha `1b77…`) | content changed since C-101 → new `document_version` v2 (`supersedes_id = v1`) |
| anthropic claude code changelog | `captured` (C-202) | changed |
| github.com/openai/codex | `unchanged` | API ETag identical; `last_seen_at` moves, `captured_at` does not |
| arxiv 2602.xxxxx (abstract) | `captured` (C-204) | page now lists **v2** (fixture 2026-07-15) |
| arxiv 2602.xxxxx v2 PDF | `captured` (C-205) | new bytes |
| medium repost | `skipped_policy` | still a duplicate |

`source_state` after rebuild: `capture_count=2`, `last_capture_id=C-201`, `next_revisit_after=2026-09-15`.

### 13. What changed in the world (new extraction records)

| # | finding | target |
|---|---|---|
| S1 | "Codex CLI 2.3 released **July 22, 2026**" | new `product_version`, event `release_published` |
| S2 | "**Correction:** Codex CLI 2.0 shipped **February 20**, not February 18; the 18th was the blog post." (changelog errata line) | `event_revision` for E-501 at K=57 with `previous_revision_id`; identity of E-501 unchanged |
| S3 | "Effective **September 1, 2026**, gpt-5.x-codex input pricing is **2.00 USD / 1M**; output unchanged." | new revision of the input-price stream splitting the segment |
| S4 | "gpt-5.x-codex (api) is **deprecated** as of **August 15, 2026**; retirement **December 1, 2026**." | `model_offering_availability` revision: `[2026-08-15, 2026-12-01) = deprecated`, `[2026-12-01, ∞) = retired` (future validity, already-known announcement); events `offering_deprecated` (actual), `offering_retired` (scheduled) |
| S5 | "Claude Agent SDK 1.0 is **generally available** (**April 9, 2026**)." | E-504 gets a new `event_revision`: `occurrence_mode='actual'`, occurred 2026-04-09 — the scheduled window `[04-01, 05-01)` is preserved at K=42 |
| S6 | "Claude Code now supports MCP tasks (**stable**)." | `protocol_feature_support` revision: `[2026-03-05, 2026-06-30) experimental`, `[2026-06-30, ∞) full` — the split date comes from a dated changelog entry (extent precision=day) |
| S7 | Vendor spec page for gpt-5.x-codex captured | `ai_model_version` identity resolved → the parked `product_built_on_model_version` from Pass 1 is admitted now with `valid_during` lower bound `2026-02-20` (`carry_forward` from the corrected release event) |
| S8 | Paper v2 removed the claim "budgeted breadth-then-depth search improves recall by 18%" and replaced it with a weaker statement | see §14 |

### 14. Knowledge corrections vs. world changes

Admission at K = 57 distinguishes them explicitly:

| kind of change | how it lands | what K=42 still shows |
|---|---|---|
| **World change** (S1, S3, S4, S6): the world moved on | New segments/events; old segments get finite upper bounds | The old open-ended segments — correct for what was known then |
| **Knowledge correction** (S2): we were wrong about the date | New `event_revision` for the same event; `segment_lineage(relation_kind='corrects')` for the elicitation segment whose lower bound depended on it | Feb 18. Replaying K=42 reproduces the old belief exactly |
| **Scheduled → actual** (S5) | New `event_revision`, `occurrence_mode` flips | The scheduled window |
| **Support withdrawn** (S8) | `content.document_version` v2 for the paper; v1 gets a `source_disposition` stream segment `corrected`; the 18%-recall claim's `support_segment` gets a new revision `[2026-02-03, ∞) verdict=withdrawn` and the `knowledge.solution_pattern` "budgeted breadth-then-depth" is revalidated to `assurance_level='asserted'` with `revalidation_state='stale'` | The K=42 evidence packet that cited the 18% chunk still resolves — `packet_member` points at the immutable chunk; the packet is annotated, not rewritten |

`temporal.knowledge_batch(57)` is sealed with its receipt; the projection worker rebuilds current-state columns (`product_version.released_on = 2026-02-20`, `model_offering` availability projection = `deprecated`) and stamps `projection_knowledge_seq = 57`.

### 15. Vectors after Pass 2

- New `search_projection` + `vector_item` rows for Codex CLI 2.3, the deprecation, the price change, the Agent SDK GA — in `entity_timeline` ("OpenAI deprecated the gpt-5.x-codex API offering on 2026-08-15; retirement scheduled 2026-12-01"), `tool_capabilities` (MCP tasks stable), `model_capabilities`.
- Paper v2 gets new projections; v1 projections are `lifecycle='superseded'` (still queryable by old publications).
- New `space_publication` rows pin `knowledge_seq = 57`; `publication_switch_receipt(publish)` moves the active pointer. The K=42 publication remains resolvable for replay; nothing joins through today's pointer to answer a historical packet.

### 16. Reading with two coordinates

```sql
-- What is true about Codex CLI 2.0 today, as we know it now?
select * from temporal.entity_state(:codex_cli_2_0, V => now(), K => 57);
--   released 2026-02-20 · MCP elicitation client/full since 2026-02-20 · built on gpt-5.x-codex (default)

-- What did we believe on 2026-03-14?
select * from temporal.entity_state(:codex_cli_2_0, V => '2026-03-14', K => 42);
--   released 2026-02-18 · MCP elicitation since 2026-02-18 · built_on: unknown

-- What changed in our knowledge between the two passes (not in the world)?
select * from temporal.knowledge_changes(:codex_cli_2_0, K1 => 42, K2 => 57);
--   E-501 occurrence 2026-02-18 → 2026-02-20 (corrects; evidence L-2 → L-210)
--   protocol_feature_support lower bound 02-18 → 02-20 (corrects, via event_segment_effect)
--   product_built_on_model_version: none → admitted (new evidence L-230)

-- Price history of the offering, world time, latest knowledge
select * from temporal.entity_timeline(:gpt5x_codex_api, V1 => '2026-01-01', V2 => '2027-01-01', K => 57);
--   [2026-03-01, 2026-09-01)  input 2.50 USD/1M    [2026-09-01, ∞) input 2.00 USD/1M
--   [2026-03-01, ∞)           output 10.00 USD/1M
--   [2026-08-15, 2026-12-01)  deprecated           [2026-12-01, ∞) retired (scheduled)
--   gap before 2026-03-01: unknown  (we have no evidence of earlier pricing)

-- How late were we?
select * from temporal.delays(:E_501, K => 57);
--   discovery +22d (vs corrected date), registration +22d, admission +0d
--   at K=42 the same query said +24d — delays are computed against the admitted occurrence at K
```

---

## Part III — Cheat sheets

### Rows written, by table (illustrative counts)

| Schema.table | Pass 1 | Pass 2 | Who writes |
|---|---|---|---|
| `evidence.source_query` / `provider_result` | 8 / 44 | 8 / 47 | Researcher |
| `evidence.source` (new) / `source_encounter` | 21 / 63 | 3 / 58 | Researcher / ledger |
| `evidence.source_capture` | 19 | 9 | Researcher |
| `evidence.source_state` (rebuilt) | 21 | 24 | Projection worker |
| `content.document_version` / `document_representation` | 19 / 19 | 9 / 9 | Researcher |
| `retrieval.chunk_set` / `retrieval_chunk` | 19 / 412 | 9 / 236 | Researcher |
| `evidence.extraction_run` / `extraction_record` | 38 / 187 | 18 / 96 | Researcher |
| `staging.candidate` / `identity_match` / `resolution_decision` | 41 / 33 / 41 | 12 / 11 / 12 | Researcher |
| `evidence.claim` / `claim_evidence_link` / `claim_evidence_assessment` | 23 / 41 / 41 | 14 / 22 / 22 | Researcher / Verifier |
| `corpus.entity` + typed rows | 9 | 4 | **Admission** |
| `temporal.stream` / `revision` / `segment` / `event` / `event_revision` | 11 / 11 / 12 / 4 / 4 | 2 / 9 / 15 / 4 / 7 | **Admission** |
| `temporal.knowledge_batch` | 1 (K=42) | 1 (K=57) | **Admission** |
| `evidence.support_relationship` / `support_segment` | 7 / 7 | 0 / 3 | **Admission** |
| `knowledge.solution_pattern` | 2 | 0 (1 revalidated) | Admission (via promotion) |
| `retrieval.search_projection` / `vector_item` | 58 | 31 | Projection worker |
| `retrieval.space_publication` / `publication_switch_receipt` | 3 / 3 | 4 / 4 | Publication coordinator |

### The Researcher's schema-search procedure (fixed order)

1. **Kind** — `taxonomy.entity_kind` → `canonical_table`. If the kind is not registered, the finding becomes a `staging.candidate` with `review`, never an ad-hoc table.
2. **Identity** — `corpus.entity_identifier` (exact scheme/value) → `corpus.entity_alias` (normalized/trigram) → `entity_profiles` ANN → else `insert` candidate.
3. **Fact shape** — is it a *state* (stream), an *event* (occurrence), a *measurement* (`ranking.metric_observation`), a *technical derivation* (immutable declaration), or a *claim* (needs verification)? `temporal.stream_kind` and `temporal.event_kind` catalogs give the payload table and the required subject/edge kinds.
4. **Time** — capture the source's own wording into `temporal.extent` with precision; never invent a timestamp; carry-forward is a labelled inference.
5. **Evidence** — every record has a `locator_id`; every date has an `extent_id`; every claim will get `claim_evidence_link` rows.
6. **Columns** — `Database[schema]['Tables'][table]['Insert']` from the pinned contract; vocabularies are in `CHECK` constraints or vocabulary tables (`search_provider`, `capture_method`, `distribution_kind`, `license`).
7. **Authority** — check own grants; propose through `staging`/`evidence`/`content`, let `seal_temporal_batch` write `corpus`/`temporal`.

### Things the Researcher is not allowed to do (and the schema stops it)

- Write `corpus.*` or `temporal.*` directly — grants.
- Use `now()` as a world date — `temporal_basis` must be `explicit` or labelled `carry_forward`/`unresolved`; segments without an extent-backed basis are rejected at seal.
- Update a sealed segment or event revision — immutability triggers; corrections are new revisions.
- Attach a chunk to a claim as "support" — `chunk_claim_link` is semantic; support is admitted via `support_relationship` with a verifier assessment.
- Copy a provider's `published_at` onto `source` or into a segment — it stays in `provider_result` as the provider's assertion until a source-internal date is extracted.
- Answer a historical question from today's active publication pointer — retrieval runs pin `publication_id` and `knowledge_seq`.
