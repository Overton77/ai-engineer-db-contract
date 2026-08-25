# AI Engineer database contract

This repository is the canonical contract for the shared AI Engineer Supabase database. It owns:

- ordered Supabase migrations;
- local Supabase configuration;
- generated TypeScript types for every application-relevant schema;
- stable type-only entry points for application consumers.

Applications consume this repository as a pinned dependency. They do not maintain independent generated copies.

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
npm run db:reset
npm run types:generate
```

Commit each migration and its regenerated `src/database.generated.ts` in the same change.

CI can detect contract drift with:

```sh
npm run types:check
```

## Consuming the contract

Install a pinned commit or release of this repository. Import only types:

```ts
import type { Database } from "@aiengineer/database-contract";
import type { PreResearchRun } from "@aiengineer/database-contract/pre-research";
```

Supabase-generated types describe rows, inserts, updates, enums, and functions. They do not validate arbitrary SQL strings passed to `pg` at compile time.
