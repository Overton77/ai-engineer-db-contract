---
id: "fn:research_private.current_transcript_hash(text)"
kind: function
schema: research_private
name: current_transcript_hash
domain: research-starter-protected
overloads: ["fn:research_private.current_transcript_hash(text)"]
security: definer
volatility: stable
executors: [service_role]
raises: []
touches: { reads: [public.research_starter_videos], writes: [] }
tokens: [research_private, current_transcript_hash, research_private.current_transcript_hash]
defined_in: ["20260816205231_pre_research_v2_schema.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research_private.current_transcript_hash

Domain `research-starter-protected`.

## current_transcript_hash(text) → text

function, stable, security definer, language sql, config `search_path=research_private, public, extensions`.

| Argument | Type | Default | Mode |
| --- | --- | --- | --- |
| `p_video_id` | `text` | — | — |

Execute: `service_role`.

Touches (best effort): reads [`public.research_starter_videos`](../../relations/public/research_starter_videos.md); writes —; calls —.

TypeScript: `Database["research_private"]["Functions"]["current_transcript_hash"]`.

Defined in: `20260816205231_pre_research_v2_schema.sql`.
