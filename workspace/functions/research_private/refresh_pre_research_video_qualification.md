---
id: "fn:research_private.refresh_pre_research_video_qualification(text)"
kind: function
schema: research_private
name: refresh_pre_research_video_qualification
domain: research-starter-protected
overloads: ["fn:research_private.refresh_pre_research_video_qualification(text)"]
security: definer
volatility: volatile
executors: [service_role]
raises: []
touches: { reads: [public.research_pre_research_video_state, public.research_starter_videos], writes: [] }
tokens: [research_private, refresh_pre_research_video_qualification, research_private.refresh_pre_research_video_qualification]
defined_in: ["20260816205231_pre_research_v2_schema.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research_private.refresh_pre_research_video_qualification

Domain `research-starter-protected`.

## refresh_pre_research_video_qualification(text) → jsonb

function, volatile, security definer, language plpgsql, config `search_path=research_private, public, extensions`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_video_id` | `text` | `NULL::text` | — |

Execute: `service_role`.

Touches (best effort): reads [`public.research_pre_research_video_state`](../../relations/public/research_pre_research_video_state.md), [`public.research_starter_videos`](../../relations/public/research_starter_videos.md); writes —; calls [`research_private.project_pre_research_video_state`](project_pre_research_video_state.md).

TypeScript: `Database["research_private"]["Functions"]["refresh_pre_research_video_qualification"]`.

Defined in: `20260816205231_pre_research_v2_schema.sql`.
