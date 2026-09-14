---
id: "fn:curriculum.lesson_version_guard()"
kind: function
schema: curriculum
name: lesson_version_guard
domain: curriculum
overloads: ["fn:curriculum.lesson_version_guard()"]
security: invoker
volatility: volatile
executors: [anon, app_reader, authenticated, control_plane, executor_service, pipeline_agent, service_role, verifier_agent]
raises: [published lesson versions cannot be deleted]
touches: { reads: [], writes: [] }
tokens: [curriculum, lesson_version_guard, curriculum.lesson_version_guard]
defined_in: ["20260826001300_curriculum.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# curriculum.lesson_version_guard

Domain `curriculum`.

## lesson_version_guard() → trigger

function, volatile, security invoker, language plpgsql, config `search_path=""`.

No arguments.

Execute: `anon`, `app_reader`, `authenticated`, `control_plane`, `executor_service`, `pipeline_agent`, `service_role`, `verifier_agent`.

Raises (mechanically extracted): `published lesson versions cannot be deleted`.

Defined in: `20260826001300_curriculum.sql`.
