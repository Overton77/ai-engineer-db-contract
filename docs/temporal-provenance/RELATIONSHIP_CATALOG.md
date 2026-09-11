# Prioritized typed relationship and transformation catalog

**Proposed, 2026-09-10.** These names are target contracts, not assertions that all tables exist. [MIGRATION_MAP.md](./MIGRATION_MAP.md) cites current equivalents. Apply the shared temporal envelope in [IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md); the payload columns below omit that common metadata.

**P0** establishes the requested historical queries and proof chain. **P1** completes high-value corporate/technical industry analysis. **P2** adds specialized detail once ingestion and query demand justify it. Priorities sequence implementation; they do not flatten distinct concepts into generic edges temporarily.

Notation: **episode** = stable relationship ID + interval interpretation stream; **event** = typed occurrence + event revisions; **versioned declaration** = assertion about immutable technical versions, with admission/correction history; **observation** = measured or reported fact with definition/run/window. All endpoints use tenant-safe typed FKs. Registry/catalog keys below are controlled vocabulary FKs, not arbitrary labels.

## People

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Person → `person_organization_engagement` → organization | Arrangement, relationship category (employment/contract/etc.) | Episode per engagement; concurrent engagements allowed; rehire creates another ID |
| P0 | Engagement → `engagement_role_assignment` → role definition | Title, department, seniority, executive responsibility | Role episode; promotion does not imply termination/re-hire |
| P1 | Person → `person_board_membership` → organization | Seat kind, chair/observer role | Episode; independent of employment |
| P1 | Person → `person_advisory_membership` → organization | Advisory scope, compensated/unknown | Episode; do not label every advisor an employee |
| P1 | Person → `founding_participation` → organization founding event | Founder/cofounder attribution | Historical event participation; leaving the company does not erase it |
| P1 | Person → `library_maintainer_appointment` → library | Maintainer/core/triager/emeritus role | Repeatable episode; different maintainers may overlap |
| P1 | Person → `repository_maintainer_appointment` → repository | Maintainer/governance/committer role | Episode; host access and authorship are different evidence |
| P1 | Person → `model_version_contribution` → model version | Research/engineering/evaluation role, attribution source | Versioned declaration; do not infer training authorship from corporate employment |
| P1 | Person → `document_authorship` → document version | Author order, corresponding/editor role | Version-specific attribution; corrections create revised attribution |
| P1 | Person → `story_authorship` → story version | Bylined author/editor/contributor | Version-specific; byline is evidence, not automatic identity resolution |
| P2 | Person → `person_education` → organization | Degree/program, department | Episode; enrolled/graduated are different events |

Keep names/identifiers as separately historized properties where needed. Distinguish stable provider account IDs from recyclable handles. Identity resolution is a decision with knowledge history, not a world employment event.

## Organizations and corporate structure

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Organization → `organization_product_role` → product | Owner/developer/operator/vendor/distributor | Role episode; multiple roles and organizations coexist |
| P1 | Organization → `organization_ownership_stake` → organization | Equity fraction, voting fraction, share class | Episode; no single-owner assumption; unknown percentage is null, not zero |
| P1 | Organization → `organization_control_relationship` → organization | Control basis, effective jurisdiction | Episode; control is not synonymous with majority equity |
| P1 | Organization → `transaction_participant` → corporate transaction | Acquirer/target/merging party/spinout/seller | N-ary event object; announced, closed, cancelled occurrences separately versioned |
| P1 | Organization → `funding_participation` → funding round | Investor/recipient/lead role, instrument, amount/currency, valuation basis | N-ary event; distinguish announced commitment and completed funding; reported amounts retain evidence |
| P1 | Organization → `organization_partnership` → organization | Partnership kind, scope, exclusivity | Repeatable episode; canonical endpoint order for symmetric relation; directional contract roles explicit |
| P1 | Organization → `organization_membership` → consortium organization | Member/founding member/sponsor | Episode; exit and re-entry possible |
| P0 | Organization → `repository_stewardship` → repository | Host owner/maintainer/governance/sponsor | Role episodes; hosting owner and legal/IP owner are not interchangeable |
| P1 | Organization → `model_version_role` → model version | Developer/publisher/host/distributor/funder | Versioned declaration or offering episode, depending on role; separate role definitions |
| P1 | Organization → `deployment_participant` → deployment | Customer/operator/implementer/hosting partner | N-ary deployment; a news mention does not establish customer adoption |
| P2 | Organization → `organization_location` → location | Registered/headquarters/office kind | Episode; global organizations have many locations |

Represent inverse ownership/parent views by joins. Do not write both parent and subsidiary records as independent truths. Transaction identities support more than two organizations and multiple assets/products; add typed `transaction_product_asset` and `transaction_organization_asset` membership rather than a generic unvalidated target UUID.

## Products, offerings, features and integrations

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Product → `product_family_membership` → product family | Edition/module/member role | Episode when membership changes; edition identity distinct from release version |
| P0 | Product → `product_release` → product version | Version label/channel, release identity | Immutable version identity + publication/withdrawal event revisions |
| P0 | Product offering → `offering_availability` → scope | Availability status, preview/GA channel | Stream per region/plan/channel scope; phased rollouts allowed |
| P0 | Product → `product_feature_scope` → feature | Edition/plan/region/channel scope | Stable scoped edge; stream contains availability and exact specification revision |
| P0 | Feature → `feature_specification_revision` → specification document/artifact | Immutable name/description/configuration; typed query-critical limits | Version identity; temporal assignment to scope determines applicability |
| P1 | Product offering → `offering_price` → pricing definition | Amount/currency, input/output/request/seat/time unit, tier | Scoped price assertions; normalized numeric/unit columns; tax/discount scope explicit |
| P0 | Product → `product_repository_relationship` → repository | Source/SDK/plugin/examples/docs/mirror, official status | Episode; repo release/commit provenance separately pinned |
| P1 | Product version/offering → `product_model_dependency` → model version/offering | Default/selectable/fallback/router component, configuration | Scoped episode/declaration; multiple simultaneous models valid |
| P1 | Product version → `product_library_dependency` → library release | Runtime/build/SDK role, optionality | Versioned declaration; unknown exact version remains explicitly unpinned |
| P1 | Product → `product_integration` → product | Integration kind, direction, auth/interface contract version | Episode by concrete interface/scope; reciprocal integration is not inferred |
| P1 | Product version → `product_protocol_support` → protocol version | Client/server role, conformance level | Versioned declaration with independent verification evidence |
| P1 | Product → `product_successor_relationship` → product | Replaces/renamed-as/migration-target | Evidenced episode/event; a rename may preserve identity instead of creating replacement |
| P2 | Product offering → `offering_platform_support` → platform version | Supported/preview/deprecated, architecture | Scoped interval; OS family support is not proof for every version |

Specification changes should be first-class history, not a JSON diff of today's product row. Explicit typed limits can coexist with a full immutable specification document. Reintroduction of the same feature creates another availability segment; a materially different feature needs an explicit version or new identity.

## Repositories and libraries

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Repository → `repository_host_identity` → host instance | Provider-native repo ID | Stable identity; host/owner/name are temporal locations |
| P0 | Repository → `repository_location` → host namespace | Owner/name/path | Interval assignment; recycled paths resolve with V and K |
| P0 | Repository → `repository_visibility` → visibility kind | Public/private/internal | State stream; made-public event is distinct from creation |
| P0 | Repository → `repository_archival` → archival state | Boolean archived | State stream + archived/unarchived events; does not imply package yanked |
| P0 | Repository → `repository_release` → release identity | Provider release ID, tag label, prerelease flag | Publication event history; pin captured release metadata/assets |
| P1 | Release → `release_asset_version` → artifact | Platform, asset name, digest, media type | Immutable captured asset revision; publisher may replace an asset under same name |
| P1 | Repository → `repository_ref_binding` → revision/commit | Ref kind/name | Scoped interval; tags may move; pin commit IDs for builds |
| P1 | Repository → `repository_fork_origin` → repository | Fork point commit, host evidence | Derivation declaration; do not treat mirror as fork |
| P0 | Library → `library_release` → release identity | Registry/native version, distribution kind | Version identity; publish/yank/unyank events |
| P1 | Library release → `release_distribution` → artifact | Platform/architecture, digest, package format | Immutable artifact custody with correction/admission history |
| P1 | Library → `library_repository_location` → repository | Source/mirror/docs, monorepo path | Episode; one repo can contain many libraries |
| P1 | Library release → `library_release_source` → repository revision | Commit/subdirectory/build receipt | Technical production declaration; source browsing URL alone is insufficient |
| P1 | Library release → `dependency_requirement` → library | Version constraint, dependency kind, platform marker, optional extra | Immutable declaration interpreted under package-manager rules |
| P1 | Dependency requirement → `dependency_resolution` → exact library release | Lockfile/environment/build artifact | Specific resolution; never overwrite declared constraint with today's resolution |
| P1 | Library release → `release_license` → license expression | SPDX expression, file scope | Supports compound/dual licensing; licensing observation distinct from legal judgment |
| P0 | Library → `library_maintenance` → maintenance state | Active/LTS/maintenance/deprecated/abandoned | Evidence-backed stream; no-commit period alone cannot establish abandonment |
| P1 | Library release → `library_model_support` → model version/offering | SDK/client/inference role, compatibility | Version/scope-specific claim |

## Models and benchmarks

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Model family → `model_version_membership` → model version | Version label/release identity | Stable version; broad family is not a specific serving endpoint |
| P1 | Model version → `model_version_derivation` → parent model version | Fine-tuned/distilled/merged/quantized/adapter, operation ref | Multiple typed parents and roles; evidence of actual derivation required |
| P1 | Model version → `model_artifact` → artifact | Weights/tokenizer/config role, digest | Known artifacts only; closed models may lack observable weights |
| P1 | Provider organization → `model_offering` → model version | Endpoint, region, channel, modality | Scope identity with availability/limits/prices streams |
| P0 | Offering scope → `model_alias_binding` → model version | Alias string and provider endpoint | One resolved value per scope at V/K; unknown alias resolution is explicit |
| P1 | Model version → `model_dataset_use` → dataset version | Training/evaluation/calibration role, claimed/verified | Do not infer training membership from benchmark evaluation |
| P0 | Benchmark → `benchmark_version` → immutable protocol | Dataset/task digest, scoring code and protocol artifacts | New methodology/task set creates version |
| P1 | Benchmark version → `benchmark_dataset_binding` → dataset version/split | Evaluation/train/calibration role | Exact split and filtering protocol required for comparability |
| P0 | Benchmark run → `benchmark_run_subject` → model/library/product version | Evaluated/baseline/judge role | Typed subject tables or enforced exclusive typed arc; no free-form entity UUID |
| P0 | Benchmark run → `benchmark_configuration` → versioned configuration | Prompt/tool/sampling/judge/aggregation/hardware refs | Immutable input manifest; key join dimensions normalized |
| P0 | Benchmark result revision → `benchmark_result_metric` → existing metric observation | Metric role, population, aggregation | Reuse ranking definitions/observations; correction is new result revision |
| P1 | Benchmark result → `result_reproduction` → benchmark run | Reproduced/failed/disputed with method match | Evaluation of comparability and outcome, not overwriting original measurement |
| P1 | Ranking snapshot → `ranking_member` → result revision | Rank/tie/score, rule version | Derived publication at pinned knowledge and measurement cutoffs |

## Case studies, deployments and outcomes

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Case study → `case_study_deployment` → deployment | Reported/verified relationship, study role | A study may cover multiple deployments; one deployment may have multiple reports |
| P1 | Deployment → `deployment_product_use` → product offering/version | Production/pilot/evaluation, configuration | Episode; distinguish claimed adoption from verified use |
| P1 | Deployment → `deployment_model_use` → model version/offering | Primary/fallback/evaluator role | Episode with exact versions where known |
| P1 | Deployment → `deployment_library_use` → library release | Runtime/build/orchestration role | Episode/declaration; unpinned library use does not imply a release |
| P0 | Case study → `case_study_outcome` → metric observation | Population, unit, baseline/comparator, method, attribution | Measurement window separate from publication; no inferred causation |
| P1 | Deployment → `deployment_migration` → target deployment/configuration | Source/target, stages, acceptance criteria | N-ary activity with started/completed events |
| P1 | Case study → `case_study_benchmark_result` → result revision | Reports/compares/challenges | Exact result, not just benchmark name |
| P0 | Case study → `case_study_document` → document version | Primary/supplement/correction | Immutable authored version and separate disposition |

## News stories and system reports

Introduce `corpus.news_story` as an editorial work identity. Link it to existing `content.document` from a **content-owned** `content.story_document` bridge; reuse `content.document_version` through `content.story_version_binding`. This avoids adding a corpus→content dependency or two independently versioned copies of the same text. Editorial correction metadata can be typed on story-version/disposition records. A story grouping/topic cluster is a separate optional concept; it is not the same identity as syndicated articles or the event being reported.

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Story → `story_publisher` → organization | Publication/edition, original/syndication role | Episode or attributed version membership; publisher ≠ organization being discussed |
| P1 | Story version → `story_author` → person | Bylined role/order | Versioned attribution |
| P0 | Story version → `story_about_person/organization/product/repository/library/model/benchmark/case_study` → typed entity | Subject/mention/context role, locator | Separate typed link tables; a mention does not support a fact |
| P0 | Story version → `story_reports_event` → temporal event | Reports/announces/disputes/corrects role, locator | Knowledge-versioned interpretation; publication time ≠ world occurrence |
| P0 | Story version → `story_asserts_claim` → claim | Attribution, quote/selector, modality | Qualified claim, independently verified before canonical admission |
| P0 | Story version → `story_version_relationship` → story version | Corrects/retracts/syndicates/translation | Direction and source evidence explicit; retraction disposition does not delete text |
| P0 | Existing research report version → `report_assertion_location` → claim | Sentence/table-cell selector and role | Pin exact version and knowledge snapshot; reuse research report identity/version tables |

## Documents, chunks and retrieval

| Priority | Node → relationship → node | Descriptive properties | Temporal / cardinality rule |
|---|---|---|---|
| P0 | Document version → existing source-capture membership → capture | Role, identity confidence | Immutable custody, existing table |
| P0 | Representation → existing transformation inputs/outputs → artifact/capture | Ordered role, method/configuration | Existing normalized production lineage |
| P0 | Chunk → existing span membership → node/locator | Offsets, selector, selected-content digest | Immutable spans; splits/merges use many-to-many derivation |
| P0 | Chunk → existing claim link → claim | States/supports/challenges/qualifies/cites | Immutable semantic relationship; not admission |
| P0 | Locator/claim → `support_relationship` → temporal support stream | Assessment and source disposition refs | Support world scope + knowledge history; retrieval-side chunk bridge |
| P0 | Temporal fact segment → `segment_claim_binding` → claim/support segment | Supports/challenges/context | Evidence for that exact fact interpretation and scope |
| P0 | Document version → disposition stream → disposition | Active/corrected/retracted/withdrawn with decision | Versioned interpretation; bytes unchanged |
| P0 | Publication → `publication_member` → vector item/projection | Membership manifest, embedding identity, admission proof | Immutable sealed membership; reuse publication/switch ledger |
| P0 | Retrieval run → `run_publication` → publication | Index generation and knowledge watermark | Multiple spaces may be queried; pin each one |
| P0 | Retrieval run → existing evidence packet → packet members | Returned order/scores/omissions/policy/context | Exact historical output; re-execution is a separate operation |

The typed graph can be exposed as a union read view for exploration (`from_kind/from_id/relation/to_kind/to_id/segment_id`). That view is a projection; it is not the write contract. Bound multi-hop queries by tenant, relation families, world interval, knowledge snapshot, and authorization. Use relational indexes and explain plans before introducing a separate graph database.

**Schema placement:** relation names in the catalog describe concepts; ownership follows the existing dependency DAG. Content owns authorship/story-version/typed-subject bridges that point to corpus. Research owns report-version bridges. Ranking owns benchmark-run/result/measurement and case-study-outcome bridges that point to corpus. Retrieval owns chunk/support and publication/run bridges. Corpus stores domain identities/relationships and permitted evidence/receipt references, not upward FKs into these integration schemas. Full specification bytes can be referenced through a permitted artifact pointer or a content-owned bridge.
