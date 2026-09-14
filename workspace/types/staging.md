---
id: "types:staging"
kind: types
schema: staging
enums: 3
domains: 0
composites: 0
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# Types in staging

## Enums
| Enum | Labels | TypeScript |
| --- | --- | --- |
| `candidate_status` | `discovered`, `enriched`, `matched`, `resolved`, `promoted`, `quarantined`, `rejected` | `Database["staging"]["Enums"]["candidate_status"]` |
| `resolution_outcome` | `insert`, `update`, `link`, `merge`, `supersede`, `no_op`, `quarantine`, `reject`, `review` | `Database["staging"]["Enums"]["resolution_outcome"]` |
| `vetting_outcome` | `approved_for_metrics`, `approved_for_research`, `approved_provisionally`, `deferred`, `insufficient_evidence`, `out_of_scope`, `rejected` | `Database["staging"]["Enums"]["vetting_outcome"]` |
