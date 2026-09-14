---
id: "task:run-hybrid-search"
kind: task
domains: [retrieval]
queries: [retrieval.hybrid_search]
aliases: [search, rrf, vector]
provenance: model_assisted
reviewed: null
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# Run a hybrid search

Domains: [`retrieval`](../domains/retrieval.md). Queries: [`q:retrieval.hybrid_search`](../queries/README.md).

## Navigation

`domains/retrieval.md` → `q:retrieval.hybrid_search`

## Operation

```json
{
  "schemaVersion": "knowledge-read-intent.v1",
  "intentId": "search-pricing",
  "operations": [
    {
      "opId": "kb",
      "kind": "retrieval",
      "query": "retrieval.hybrid_search",
      "params": {
        "query_text": "OpenAI API pricing 2026",
        "vector_space_version_id": "0192b100-0000-7000-8000-000000000001",
        "filters": {}
      },
      "limit": 20
    }
  ]
}
```

## Expected shape

Up to `limit` rows fused by RRF from exact, fts, trigram, and ann channels. `channel_scores` shows per-channel rank and score.

## Pitfalls

The catalog entry is `execute: false` because it needs a halfvec embedding. Query text must be 1–4096 characters. Hard filters may only use language, visibility, classification, source_kind, authority_level, freshness_after.
