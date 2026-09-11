# Temporal relational knowledge — migration planning package

**Updated 2026-09-10 · Design recommendation, ready for implementation planning.** No production migration has been applied. The current contract inventory is based on local migration files, including working-tree changes; applied database state must be reconciled in the implementation session.

**Superseded where they differ by [`../knowledge-model/RECOMMENDATION.md`](../knowledge-model/RECOMMENDATION.md)** (identity registry, missing entities, source intelligence, vector facets, revised staging). The temporal envelope below is adopted as-is.

**Start with [IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md).** It consolidates the temporal tables and fields and explains the normalized relational graph, entity-specific transformations, documents/chunks, evidence support, vector publication history, and required admission transaction.

## Reading order

| Document | Purpose |
|---|---|
| [Implementation handoff](./IMPLEMENTATION_HANDOFF.md) | Final recommended model and integrity rules; authoritative within this proposal |
| [Relationship catalog](./RELATIONSHIP_CATALOG.md) | Prioritized People, Organizations, Products, Repositories, Libraries, Models, Benchmarks, Case Studies, Stories, Documents and Chunks relationships, with properties and cardinality |
| [Migration map](./MIGRATION_MAP.md) | Existing schema citations, preserve/change/add decisions, dependencies, staged migrations, backfill and cutover requirements |
| [Consolidated SQL prototype](./relational-prototype.sql) | Executable typed bindings, shared temporal envelope, events, queries, support history and retained packets |
| [Consolidated verification](./relational-verification-results.json) | 34 passing checks for the expanded relational examples |
| [Original temporal SQL](./prototype.sql) and [verification](./verification-results.json) | 32 passing checks for uncertainty, disputes, late correction, unknown gaps and immutable history |
| [Original design notes](./v1-prototype-notes.md) | Preserved first-round explanation; its table-per-stream scaffolding is superseded by the consolidated handoff |

## The recommendation in one paragraph

Keep typed entity and relationship identities with real foreign keys. Put shared world-time and knowledge-revision metadata in a foundational `temporal` schema, and keep descriptive relationship properties in typed domain tables. Events, enduring states, measurements, technical derivations and knowledge corrections have distinct semantics. Historical reads use a world coordinate and an admitted knowledge snapshot. Source bytes and chunks stay immutable; support/disposition decisions and publication memberships retain their own history.

## Concrete examples included

- When a person joined, left, and rejoined an organization; correcting a departure date without erasing earlier beliefs.
- Repository made-public, hosted-release publication and archival as distinct events.
- Event-specific discovery delays, including advance announcements and uncertain occurrence windows.
- Product features and immutable specifications one year, six months and two months before the fixed 2026-09-10 anchor.
- Earlier document support versus later withdrawal, while the original retrieval packet retains the exact chunk used.
- Wrong-tenant, wrong-product, wrong-feature, wrong-stream, overlapping and incomplete records rejected by prototype constraints.

**Example Code is fictional.** It demonstrates the shape of a product such as Claude Code, not a researched history of Claude Code itself. Production queries use admitted evidence for the real product.

## Verification and scope

Both suites pass: **66 checks total**, using PostgreSQL 18.3 through PGlite 0.5.8. Tests instantiate independent in-memory databases. Neither suite connects to Supabase or alters the shared database.

The canonical project targets PostgreSQL 17. Full PostgreSQL 17/Supabase migration-chain, populated-upgrade, RLS/grants, concurrent admission, idempotent service delivery and production evidence-custody checks remain required before deployment. The SQL is a demonstrator with simplified identities and receipt references, not a migration to paste into production.

From the workspace root, reproduce in PowerShell:

```powershell
$temporalRuntime = Join-Path $env:TEMP 'aiengineer-temporal-runtime'
npm install --prefix $temporalRuntime --no-audit --no-fund --ignore-scripts @electric-sql/pglite@0.5.8
$env:PGLITE_MODULE_ROOT = $temporalRuntime
node ai-engineer-db-contract/docs/temporal-provenance/verify.mjs
node ai-engineer-db-contract/docs/temporal-provenance/verify-relational.mjs
```

Dependencies remain outside the contract's package files. Each verifier rewrites only its adjacent result JSON. Each run creates a new database; no cleanup of the shared project is involved.

## Prompt for the implementation session

> Implement the temporal relational knowledge design in `ai-engineer-db-contract`. Start by reading `docs/temporal-provenance/IMPLEMENTATION_HANDOFF.md`, `RELATIONSHIP_CATALOG.md`, and `MIGRATION_MAP.md`, plus `.cursor/rules/db-contract.mdc`. Reconcile local and applied migrations and preserve the current schema dependency rules. Use the consolidated SQL as an executable example, not as production DDL. Follow the staged migration plan, beginning with the temporal foundation and requested lifecycle slices. Preserve typed relationships, tenant-composite FKs, immutable evidence, exact knowledge snapshots and explicit uncertain/unknown times. Test fresh-chain and populated upgrades in a disposable PostgreSQL 17/Supabase target; never reset the populated shared project. Implement production authorization, sealing, idempotency, concurrency and outbox contracts, then regenerate canonical shared types and update consumers through pinned contract versions. Do not infer historical world dates from ingestion timestamps or overwrite retained provenance.
