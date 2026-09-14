---
id: "fn:api.submit_intent(text,jsonb,text,uuid,uuid,jsonb)"
kind: function
schema: api
name: submit_intent
domain: orchestration-ledger
overloads: ["fn:api.submit_intent(text,jsonb,text,uuid,uuid,jsonb)"]
security: definer
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [idempotency_key is required, payload must be a JSON object, "unknown intent_type %"]
touches: { reads: [orchestration.intent_type], writes: [orchestration.operation_intent] }
tokens: [api, submit_intent, api.submit_intent]
defined_in: ["20260826001500_api_and_grants.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# api.submit_intent

Domain `orchestration-ledger`.

## submit_intent(text, jsonb, text, uuid, uuid, jsonb) → uuid

function, volatile, security definer, language plpgsql, config `search_path=""`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_intent_type` | `text` | — | — |
| `p_payload` | `jsonb` | — | — |
| `p_idempotency_key` | `text` | — | — |
| `p_mission_id` | `uuid` | `NULL::uuid` | — |
| `p_attempt_id` | `uuid` | `NULL::uuid` | — |
| `p_preconditions` | `jsonb` | `'{}'::jsonb` | — |

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `idempotency_key is required`; `payload must be a JSON object`; `unknown intent_type %`.

Touches (best effort): reads [`orchestration.intent_type`](../../relations/orchestration/intent_type.md); writes [`orchestration.operation_intent`](../../relations/orchestration/operation_intent.md); calls —.

TypeScript: `Database["api"]["Functions"]["submit_intent"]`.

Defined in: `20260826001500_api_and_grants.sql`.
