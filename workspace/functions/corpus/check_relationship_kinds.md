---
id: "fn:corpus.check_relationship_kinds()"
kind: function
schema: corpus
name: check_relationship_kinds
domain: identity
overloads: ["fn:corpus.check_relationship_kinds()"]
security: invoker
volatility: volatile
executors: []
raises: [invalid relationship endpoint kinds, invalid version pair]
touches: { reads: [corpus.entity, taxonomy.relationship_kind], writes: [] }
tokens: [corpus, check_relationship_kinds, corpus.check_relationship_kinds]
defined_in: ["20260912010300_km_03_relationship.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# corpus.check_relationship_kinds

Domain `identity`.

## check_relationship_kinds() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `invalid relationship endpoint kinds`; `invalid version pair`.

Touches (best effort): reads [`corpus.entity`](../../relations/corpus/entity.md), [`taxonomy.relationship_kind`](../../relations/taxonomy/relationship_kind.md); writes —; calls —.

Defined in: `20260912010300_km_03_relationship.sql`.
