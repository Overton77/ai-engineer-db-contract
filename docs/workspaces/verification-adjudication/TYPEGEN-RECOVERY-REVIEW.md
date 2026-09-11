# Type generation recovery review

Reviewed `../internal/tools/postgres-meta-0.99.0/generate-local-readonly.mjs` and its pinned package lock. The script extracts the canonical 19-schema list from the DB contract generator, accepts only loopback `54322`, forces `default_transaction_read_only=on` with a statement timeout, snapshots migration versions before/after introspection, verifies exactly the requested schema set, canonical-sorts metadata, invokes published `@supabase/postgrest-typegen` `0.2.1`, formats with Prettier, and writes a new candidate only. It does not modify canonical types.

The original receipt reported 137 migrations through `20260907011000`, 405 tables, and candidate SHA `272ad1a8f05272391b115aa983dbfac9c6e7a00c4084f11bbabafa792b45739d`. Independent execution:

```powershell
node ../internal/tools/postgres-meta-0.99.0/generate-local-readonly.mjs
```

exited `0`, run ID `2484e53b-eef9-4ad8-9b1a-33f223a65522`, with the same 19 schemas, migration count/latest migration, 405 tables, candidate SHA, existing canonical SHA `8e6fcee877e0c88a06c6807ea0ec0aa6fec5e1a173c6bd160bd99087505d2093`, and generator lock SHA `1330f0f9ac2b588ce4e852fb35c4b74e83b834ccce7b807b7743574f214b1eb0`. It emitted a Node/pg deprecation warning about concurrent `client.query`; this did not alter the read-only outcome, but should be resolved before treating the helper as a long-lived canonical workflow.

The mismatch with `src/database.generated.ts` is not formatting-only. The candidate narrows several non-null JSON database columns from `Json` to `NonNullable<Json>` and changes multiple generated `validity` insert/update fields from `unknown` to `never`; it also reformats a union. Those changes can affect application typechecking and insert/update call sites. The stable candidate hash across two independent read-only introspections supports inventory completeness for this local schema, but does not establish generator-version compatibility with the historical canonical generator or authorize replacement.

Recommendation: preserve the candidate as evidence, diff and classify all semantic type changes with DB-contract owners, pin this published toolchain explicitly, fix the pg warning, then run targeted DB-contract consumers before any canonical type update. No migration, canonical type file, or database record was changed by this review.

## Compatible 0.95.2 follow-up

`internal/tools/postgres-meta-0.95.2/generate-local-readonly.mjs` was independently run from the DB-contract workspace. It exited `0`, used the same 19 local schemas, 137 migrations through `20260907011000`, and 405 tables, and reproduced the expected candidate SHA `49bda6b3d8cf6ece57cfa1d73acb8be822d1fdfd9e3d0b340eec9a51e107dee0` (independent run `1dde74e4-7331-427d-915d-dc1e0a8be139`). This supports deterministic compatibility for this local inventory.

The candidate’s reported 104-line difference is limited to formatting/union layout in the inspected textual diff; it does not show the 0.99.0 `Json`/`NonNullable<Json>` or `unknown`/`never` semantic changes. An AST-parity attempt could not use the normal TypeScript compiler API because the installed TypeScript 7 package does not expose legacy `typescript.js`; no AST parity claim is made yet. The run also emitted a `MaxListenersExceededWarning` from published postgres-meta. Address that warning and perform AST/token parity with a pinned compatible parser before promoting this as canonical tooling.

Recommendation remains: add an explicit opt-in local Node generator mode (for example `--local-node`) that pins postgres-meta `0.95.2`, uses only the verified loopback read-only URL, and emits a candidate rather than overwriting `database.generated.ts`. Preserve the normal CLI mode unchanged. Do not replace canonical types until parser parity and targeted consumer checks pass.

## Canonical opt-in native-node review

Reviewed hashes: `scripts/generate-types.mjs` `e6233a5a67dd64557f98220d9e4feeeef2015315721310b2a21759dcfaf0e251`; `scripts/generate-types-native.mjs` `c46bc3c56ed9981157ef5003606a00f6fa515cf07170d42045d3f8770d805ee4`; package/lock pin postgres-meta `0.95.2`, TypeScript `5.9.3`, pnpm `10.34.5`.

The `--local-node` child is bounded: it strips its environment to an allowlist, requires an explicit `POSTGRES_URL`, rejects non-loopback/non-54322/non-`/postgres` URLs and query/hash input, then adds only read-only and timeout PostgreSQL options. The parent rejects linked/project modes and writes atomically only after child success. It preserves normal CLI behavior.

Actionable defect: `generate-types-native.mjs` sets `ended=true` after successful metadata introspection and only calls `meta.end()` when `!ended`; success therefore skips connection cleanup. Fix it before using the mode. I independently parsed canonical and compatible candidate with DB TypeScript `5.9.3`; the simple structural traversal returned false (lengths `1227286` and `1227381`). Therefore AST parity and a format-only conclusion remain unproven, despite stable candidate bytes. No canonical type output was generated or modified.

### Correction

The earlier native generator cleanup finding is withdrawn. Official postgres-meta `0.95.2` `getGeneratorMetadata` closes its own connection before successful return; the wrapper's `ended=true` prevents a double close. The reported cleanup defect was not valid.

## Native generator guard validation

Current reviewed source hashes remain `scripts/generate-types.mjs` `e6233a5a67dd64557f98220d9e4feeeef2015315721310b2a21759dcfaf0e251` and `scripts/generate-types-native.mjs` `c46bc3c56ed9981157ef5003606a00f6fa515cf07170d42045d3f8770d805ee4`. The canonical `src/database.generated.ts` now has SHA-256 `49bda6b3d8cf6ece57cfa1d73acb8be822d1fdfd9e3d0b340eec9a51e107dee0`, matching the retained compatible candidate.

Independent negative guard execution:

```powershell
node ..\internal\verify-canonical-native-typegen-guards.mjs
```

exited `0` and wrote `../internal/verification-canonical-native-typegen-guards-20260907.json` (SHA-256 `c99f26fb65b756b31c29ed4966a34c95c36a4163360fb539324ab2e9210cb916`). All eight rejected invocations exited `1`: missing `POSTGRES_URL`; remote hostname; wrong port; wrong database; URL query; URL fragment; `--linked`; and `--project-id`. The receipt proves the canonical file hash was identical before and after each rejected process. No rejected input reached a database connection.

A read-only TypeScript 5.9.3 AST comparison also passed:

```powershell
@'...AST reader...'@ | node --input-type=module
```

It wrote `../internal/verification-canonical-native-typegen-independent-ast-20260907.json` (SHA-256 `2e264ded032df892413b6b0fd5d88fc3418d7d5d2178ea4e0f5267fc94b958ce`). It excludes `SourceFile.text` and unwraps `ParenthesizedTypeNode`; canonical and retained candidate parse trees are equal. It performs no database access.

An attempted rerun of the root parity harness stopped with `EEXIST` at its immutable retained candidate path after its native read-only generation phase; it did not replace the canonical type file or write a new parity receipt. This is not used as validation evidence.

The earlier AST false result is withdrawn: it included `SourceFile.text` and retained parentheses, so it was not a valid structural comparison. The corrected root receipt (`../internal/verification-canonical-native-typegen-parity-20260907.json`) and the independent AST receipt above both establish format-only parity for the pinned compatible candidate.
