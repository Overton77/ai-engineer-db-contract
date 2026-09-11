# AI Engineer database contract

This repository is the canonical contract for the shared AI Engineer Supabase database. It owns:

- ordered Supabase migrations;
- local Supabase configuration;
- generated TypeScript types for every application-relevant schema;
- stable type-only entry points for application consumers.

Applications consume this repository as a pinned dependency. They do not maintain independent generated copies.

The deployed knowledge model is documented in [Schema summary](docs/knowledge-model/SCHEMA-SUMMARY.md) and [Migration result](docs/knowledge-model/MIGRATION-RESULT.md). Contract 0.3.0 targets the cloud database; the populated local shared database was left unchanged. Use an explicit project ID when regenerating the cloud contract.

## Schema boundaries

- `public` contains the existing pre-research pipeline (`public.research_*`) and preserved factory tables.
- `api` is the application-facing Data API surface.
- `research`, `ranking`, `curriculum`, `corpus`, `evidence`, and the other bounded schemas are internal database namespaces.
- `research_private` contains the existing pre-research pipeline routines.

The generated contract includes internal schemas for server-side consumers. This does not expose those schemas through PostgREST; Data API exposure remains controlled by `supabase/config.toml`, grants, and RLS.

## Local workflow

Use the pinned Supabase CLI from this repository:

```sh
npm install
npm run db:start
npm run db:migrate
npm run types:generate
```

Commit each migration and its regenerated `src/database.generated.ts` in the same change.

`db:migrate` incrementally applies pending migrations to the local database. The shared `aiengineer` project contains accumulated source captures, provider receipts and accounting evidence; resetting it destroys those registrations even when physical Storage files survive. `db:reset` therefore refuses the shared project and all caller-supplied target arguments. Fresh-chain proofs belong in a separate workspace with an explicit `vfy-` or `disposable-` project identity. Preserve populated data before migration work, and retain isolated proof receipts and volumes. Do not change the shared project identity to bypass this guard.

CI can detect contract drift with:

```sh
npm run types:check
```

When local PostgreSQL is available but Docker management is unavailable, use the
pinned Node generator with an explicit `POSTGRES_URL` supplied by the local runtime:

```sh
corepack pnpm types:generate:native
corepack pnpm types:check:native
```

This opt-in mode accepts only `postgres` on loopback port `54322`, loads no `.env`,
and forces read-only database sessions with bounded queries. It uses the same
canonical schema list and writes the generated file only after successful
introspection. Linked/project targets are rejected. The pinned `postgres-meta`
0.95.2 output is structurally equivalent to the preceding generated contract;
formatting can differ from other CLI generator versions. The usual CLI commands
remain available for their configured environments.

## Consuming the contract

Install a pinned commit or release of this repository. Import only types:

```ts
import type { Database } from "@aiengineer/database-contract";
import type { PreResearchRun } from "@aiengineer/database-contract/pre-research";
```

Supabase-generated types describe rows, inserts, updates, enums, and functions. They do not validate arbitrary SQL strings passed to `pg` at compile time.
