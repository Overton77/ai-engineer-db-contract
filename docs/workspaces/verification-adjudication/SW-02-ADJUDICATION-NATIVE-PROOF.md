# SW-02 adjudication ledger preflight and native-proof design

This accompanies the draft `20260907012000_verification_adjudication_ledger.sql`. The draft remains outside the migration directory pending root review and must not be applied with package `0.2.31`.

## Read-only preflight

Run `20260907012000_verification_adjudication_preflight.sql` with a read-only role after the normal migration ledger reaches the intended base. It makes no writes and deliberately reports zero adjudication rows before the migration. Packet and decision vocabularies should exist from `20260907010000`; `verification_policy_override` and the five new ledger tables should be absent.

## Disposable native transaction proof

This is intentionally post-implementation. It requires a server-side fixture writer that has already registered exact verification.v1 packet, decision and override artifact bytes through the canonical CAS and fenced registration path. SQL alone cannot manufacture those artifacts: admission validates available storage registration, immutable metadata and parent lineage. Do not bypass that boundary with direct artifact inserts.

Use unique fixture UUIDs and an isolated tenant. Use `BEGIN`/`ROLLBACK` only for relational writes. Object Storage is outside PostgreSQL transactions, so fixture objects need a separate, authorized cleanup record; do not claim rollback cleaned Storage.

The public request's bounded `evidencePacket` is the existing exact signed verification-run manifest handle, never an unavailable future adjudication packet. The worker first validates an assertion/evidence target against that signed bundle, then composes the new adjudication packet. Its metadata must have a normalized, duplicate-free parent closure exactly equal to the sealed run manifest, bundle, deterministic result, policy artifact and optional report gate. The decision metadata must have the packet as its only parent; the override metadata must have the decision artifact as its only parent. The actual proof script must use named `RETURNING` aliases (`grant_id`, `subject_id`, `decision_id`) and, only through a future dedicated authenticated server factory, provision and assume the NOLOGIN grant-administrator or adjudicator role with a transaction-scoped `app.tenant_id`. This migration grants neither role to `service_role` or any caller. Both request-subject and decision writes require their exact live step lease token and fencing token.

The proof must demonstrate all of the following before rollback:

1. A valid packet-bound subject, human-grant-bound decision and overturn-only override insert successfully. Override disposition is only `review_required`; admission-changing policy effects remain disabled.
2. `UPDATE` and `DELETE` on each new table fail for `control_plane` and `executor_service`; an executor cannot insert grants, decisions or overrides.
3. A service/model actor, missing/expired/revoked grant, wrong reviewer role, cross-tenant ID, altered manifest/packet/policy digest, wrong operation kind, mismatched authenticated decision actor, stale lease/fence, missing packet parent, wrong decision parent and non-`overturn` decision each fail.
4. A second differently identified human decision can coexist; an unchanged retry using the same decision operation ID is accepted only when the stored row matches exactly.
5. The override binds the same subject/run/policy/packet/scope, requires an unconflicted overturn quorum, and never changes `evidence.verification_run`, deterministic result artifacts or prior policy artifacts.
6. Rollback leaves no new rows. The proof receipt records fixture namespace, transaction result and Storage cleanup status, and explicitly says no human adjudication or human-gold label was created.

## Required future service boundary

The migration creates an empty immutable allowlist and isolated NOLOGIN `verification_adjudicator_grant_admin` and `verification_adjudicator` roles, with no default member. The future API/factory must derive the authenticated actor from `KNOWLEDGE_API_IDENTITIES`, require `Actor.kind === 'human'`, require the explicitly admitted `knowledge_admin`/decision-record transport capability, resolve an active matching grant by tenant, actor ID, role and authorization version, and only then use dedicated factory-provisioned narrow database authority. It must never accept a caller-provided reviewer identity, role, grant ID or `approved` field. No decision may feed an evaluation label unless separately bound to the existing expert-adjudication/human-gold contract.
