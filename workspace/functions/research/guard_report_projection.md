---
id: "fn:research.guard_report_projection()"
kind: function
schema: research
name: guard_report_projection
domain: research
overloads: ["fn:research.guard_report_projection()"]
security: definer
volatility: volatile
executors: []
raises: [REPORT_PREDECESSOR_NOT_EARLIER, REPORT_REVISION_SEALED, REPORT_TENANT_MISMATCH]
touches: { reads: [research.report_package_seal, research.report_version], writes: [] }
tokens: [research, guard_report_projection, research.guard_report_projection]
defined_in: ["20260913010000_research_report_packages.sql"]
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# research.guard_report_projection

Domain `research`.

## guard_report_projection() → trigger

function, volatile, security definer, language plpgsql, config `search_path=""`.

No arguments.

Execute: no configured role.

Raises (mechanically extracted): `REPORT_PREDECESSOR_NOT_EARLIER`; `REPORT_REVISION_SEALED`; `REPORT_TENANT_MISMATCH`.

Touches (best effort): reads [`research.report_package_seal`](../../relations/research/report_package_seal.md), [`research.report_version`](../../relations/research/report_version.md); writes —; calls [`util.current_tenant_id`](../util/current_tenant_id.md).

Defined in: `20260913010000_research_report_packages.sql`.
