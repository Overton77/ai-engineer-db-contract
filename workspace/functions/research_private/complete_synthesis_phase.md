---
id: "fn:research_private.complete_synthesis_phase(uuid,text,research_pre_research_run_status)"
kind: function
schema: research_private
name: complete_synthesis_phase
domain: research-starter-protected
overloads: ["fn:research_private.complete_synthesis_phase(uuid,text,research_pre_research_run_status)"]
security: definer
volatility: volatile
executors: [service_role]
raises: ["ILLEGAL_PHASE_TRANSITION: % %", "ILLEGAL_SYNTHESIS_NEXT_STATUS: %", "RUN_NOT_FOUND: %", "SESSION_BINDING_PENDING: %", "SESSION_MISMATCH: %", "TRANSCRIPT_HASH_MISMATCH: %"]
touches: { reads: [], writes: [public.research_pre_research_run, public.research_pre_research_session] }
tokens: [research_private, complete_synthesis_phase, research_private.complete_synthesis_phase]
defined_in: ["20260816205231_pre_research_v2_schema.sql", "20260822234000_allow_intent_review_reclassification.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research_private.complete_synthesis_phase

Domain `research-starter-protected`.

## complete_synthesis_phase(uuid, text, research_pre_research_run_status) → jsonb

function, volatile, security definer, language plpgsql, config `search_path=research_private, public, extensions`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_run_id` | `uuid` | — | — |
| `p_eve_session_id` | `text` | — | — |
| `p_next_status` | `research_pre_research_run_status` | — | — |

Execute: `service_role`.

Raises (mechanically extracted): `ILLEGAL_PHASE_TRANSITION: % %`; `ILLEGAL_SYNTHESIS_NEXT_STATUS: %`; `RUN_NOT_FOUND: %`; `SESSION_BINDING_PENDING: %`; `SESSION_MISMATCH: %`; `TRANSCRIPT_HASH_MISMATCH: %`.

Touches (best effort): reads —; writes [`public.research_pre_research_run`](../../relations/public/research_pre_research_run.md), [`public.research_pre_research_session`](../../relations/public/research_pre_research_session.md); calls [`research_private.current_transcript_hash`](current_transcript_hash.md), [`research_private.project_pre_research_video_state`](project_pre_research_video_state.md).

TypeScript: `Database["research_private"]["Functions"]["complete_synthesis_phase"]`.

Defined in: `20260816205231_pre_research_v2_schema.sql`, `20260822234000_allow_intent_review_reclassification.sql`.
