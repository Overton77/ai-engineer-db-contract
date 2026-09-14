---
id: "rel:evidence.verification_finding#details"
kind: details
schema: evidence
name: verification_finding
of: "rel:evidence.verification_finding"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_finding — details

Spill-over from [the main page](verification_finding.md).

## Relationships

Outbound: `claim_id` → [`evidence.claim`](claim.md)`.id` (+tenant) on delete cascade; `run_id` → [`evidence.verification_run`](verification_run.md)`.id` (+tenant) on delete cascade.
Inbound: none.

## Indexes

| Index | Definition |
| --- | --- |
| `verification_finding_tenant_id_uq` | `CREATE UNIQUE INDEX verification_finding_tenant_id_uq ON evidence.verification_finding USING btree (tenant_id, id)` |
| `verification_finding_tenant_run_judgment_uq` | `CREATE UNIQUE INDEX verification_finding_tenant_run_judgment_uq ON evidence.verification_finding USING btree (tenant_id, run_id, judgment_id)` |

## Triggers

- `verification_finding_immutable` → [`util.reject_mutation`](../../functions/util/reject_mutation.md): `CREATE TRIGGER verification_finding_immutable BEFORE DELETE OR UPDATE ON evidence.verification_finding FOR EACH ROW EXECUTE FUNCTION util.reject_mutation()`
- `verification_finding_independence` → [`evidence.enforce_producer_not_verifier`](../../functions/evidence/enforce_producer_not_verifier.md): `CREATE TRIGGER verification_finding_independence BEFORE INSERT OR UPDATE ON evidence.verification_finding FOR EACH ROW EXECUTE FUNCTION evidence.enforce_producer_not_verifier()`

## Row-level security

Enabled.
- `bounded_role_access` (ALL) for `app_reader`, `control_plane`, `executor_service`, `pipeline_agent`, `verifier_agent`: using `(tenant_id = util.current_tenant_id())`; with check `(tenant_id = util.current_tenant_id())`
