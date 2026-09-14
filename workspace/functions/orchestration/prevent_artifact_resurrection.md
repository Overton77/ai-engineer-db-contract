---
id: "fn:orchestration.prevent_artifact_resurrection()"
kind: function
schema: orchestration
name: prevent_artifact_resurrection
domain: orchestration-ledger
overloads: ["fn:orchestration.prevent_artifact_resurrection()"]
security: definer
volatility: volatile
executors: []
raises: [retired artifact cannot regain custody]
touches: { reads: [orchestration.artifact_tombstone], writes: [] }
tokens: [orchestration, prevent_artifact_resurrection, orchestration.prevent_artifact_resurrection]
defined_in: ["20260914010500_scoped_checkpoints.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# orchestration.prevent_artifact_resurrection

Domain `orchestration-ledger`.

## prevent_artifact_resurrection() → trigger

function, volatile, security definer, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `retired artifact cannot regain custody`.

Touches (best effort): reads [`orchestration.artifact_tombstone`](../../relations/orchestration/artifact_tombstone.md); writes —; calls —.

Defined in: `20260914010500_scoped_checkpoints.sql`.
