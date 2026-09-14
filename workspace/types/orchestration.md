---
id: "types:orchestration"
kind: types
schema: orchestration
enums: 4
domains: 0
composites: 0
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# Types in orchestration

## Enums
| Enum | Labels | TypeScript |
| --- | --- | --- |
| `attempt_outcome` | `succeeded`, `failed`, `timeout`, `cancelled`, `rejected` | `Database["orchestration"]["Enums"]["attempt_outcome"]` |
| `bucket_class` | `source_captures`, `candidate`, `accepted`, `ledger`, `published` | `Database["orchestration"]["Enums"]["bucket_class"]` |
| `mission_status` | `created`, `planning`, `running`, `paused`, `blocked`, `succeeded`, `failed`, `cancelled`, `superseded` | `Database["orchestration"]["Enums"]["mission_status"]` |
| `work_item_status` | `pending`, `ready`, `running`, `blocked`, `succeeded`, `failed`, `cancelled`, `skipped` | `Database["orchestration"]["Enums"]["work_item_status"]` |
