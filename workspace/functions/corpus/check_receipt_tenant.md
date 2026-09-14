---
id: "fn:corpus.check_receipt_tenant()"
kind: function
schema: corpus
name: check_receipt_tenant
domain: identity
overloads: ["fn:corpus.check_receipt_tenant()"]
security: invoker
volatility: volatile
executors: []
raises: [entity/record receipt tenant mismatch]
touches: { reads: [orchestration.operation_intent, orchestration.operation_receipt], writes: [] }
tokens: [corpus, check_receipt_tenant, corpus.check_receipt_tenant]
defined_in: ["20260912011100_km_11_grants_rls.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# corpus.check_receipt_tenant

Domain `identity`.

## check_receipt_tenant() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `entity/record receipt tenant mismatch`.

Touches (best effort): reads [`orchestration.operation_intent`](../../relations/orchestration/operation_intent.md), [`orchestration.operation_receipt`](../../relations/orchestration/operation_receipt.md); writes —; calls —.

Defined in: `20260912011100_km_11_grants_rls.sql`.
