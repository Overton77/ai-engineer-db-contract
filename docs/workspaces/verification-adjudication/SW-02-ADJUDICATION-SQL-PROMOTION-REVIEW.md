# SW-02 adjudication SQL promotion review

**Review date:** 2026-09-07  
**Scope:** Read-only review of the proposed adjudication ledger before it is promoted from the workspace draft to a canonical local migration. No migration, database record, package, or application source was modified.

## Reviewed inputs

| Input | SHA-256 |
| --- | --- |
| `20260907012000_verification_adjudication_ledger.sql` | `17531bfbacfab94eb7f3a5987272e4919d3bc1d36acf97abc3bb32e496d6eb19` |
| `SW-02-ADJUDICATION-NATIVE-PROOF.md` | `1e128887151b9f0fd9c5b16384cf55a941010942b37297bfa362b6c0776a7f03` |
| KS `SW-02-ADJUDICATION-IMPLEMENTATION-PLAN.md` | `4686f10f1a81c44fa09ffe00d96a01929ac105a60acb9b10d355522d034f02ec` |
| `internal/verification-adjudication-draft-ddl-check.mjs` | `a3c0b604c23b11cfb7eb1b58786ea14d141bd7dd56f3ab606bc6c9aa0fd8fb99` |

The review also compared current public contracts. They expose only `requestAdjudication` and `verification_adjudication`; there is no strict decision request or declared `verification_adjudication_decision`, grant-administration, or revocation operation kind.

## Rollback-only structural check

`node internal/verification-adjudication-draft-ddl-check.mjs` exited `0` on the verified loopback configuration. It wrote [the immutable receipt](../../../../internal/verification-adjudication-draft-ddl-1a3604c3-03d9-432a-916c-cd1c0052afa7.json), which records the reviewed draft digest, five tables created inside a transaction, no runtime/user authority membership, denied INSERT for seven ordinary/runtime roles, and rollback restoration of tables, roles, and vocabulary. It is expressly a DDL compilation check; it does not prove native adjudication behavior.

## Findings

### P1 — decision rows are not bound to the admitted decision request

The decision trigger at draft lines 266–299 verifies tenant, the subject packet digest, a matching human grant, operation kind/actor, and a live decision lease. It never compares the decision operation's request to `new.subject_id`, `new.packet_sha256`, `new.decision`, or `new.rationale`. A process holding the narrowly granted database role can therefore attach a row whose semantic decision inputs differ from the operation it claims to execute, while satisfying every current SQL predicate.

This cannot be repaired by assuming a future factory: the current contracts have no decision mutation schema or decision operation kind to bind, so no typed public/server operation establishes those fields. Do not promote the decision table/trigger until a strict, server-composed decision request and corresponding operation kind are designed, and the trigger compares every persisted decision input to that admitted request as well as the authenticated human identity and live lease.

### P1 — grant and override authority are factory assertions, not database custody

The grant trigger only requires an operation whose free-text kind is `verification_adjudicator_grant`; it does not bind the grant actor, role, authorization version, status, requester identity, request digest, or lease to an admitted administration request. The override table has no operation, step, lease, or actor columns at all. Its trigger permits the `verification_adjudicator` role to create an override from any qualifying historical decision.

The NOLOGIN roles and privilege revocations correctly prevent ordinary roles from writing these tables, but once a server factory assumes either role it supplies all authority facts itself. That falls short of the stated database boundary and has no current typed API/runtime authority to support it. The safer initial canonical migration is the request-subject and packet persistence slice only. Defer grant, revocation, decision, and override tables until dedicated server-owned operations, exact request bindings, and native handler/factory proofs exist.

### P2 — override expiry and conflict observation are not serialized

`validate_verification_policy_override` does not require `(s.expires_at is null or s.expires_at > new.created_at)`. It can create a later override from an otherwise valid historical decision after the subject expires. It also observes the no-conflict/quorum condition without serializing changes for the same subject. Two concurrent transactions can respectively observe an unconflicted overturn quorum and insert a non-overturn decision, leaving an override whose recorded prerequisite was not stable at commit.

For a future override slice, require active subject expiry at insertion and serialize decisions plus overrides by subject (for example, one subject-row lock acquired by both trigger paths). The current `review_required` disposition prevents an admission change, but the ledger must not record an override as having satisfied an unconflicted quorum when it did not.

### P2 — eligible reviewer roles admit blank elements

The trigger rejects null and duplicate elements through its cardinality comparison, but `ARRAY['']` passes. It does not currently grant access because reviewer-role values themselves reject blank strings, yet it creates a malformed immutable subject that no human can satisfy. Reject null/blank/overlength normalized role elements before writing the subject.

## Positive controls retained

The draft correctly uses tenant-qualified foreign keys, exact admitted artifact types/digests, normalized exact packet/decision/override parent closures, active request and decision lease/fence checks, insert-only triggers, RLS tenant policies, revoked public function execution, and no default service/control-plane membership in the two NOLOGIN authority roles. Subject creation also correctly binds the existing signed run-manifest input rather than assuming a caller-supplied future adjudication packet.

## Promotion conclusion

**Do not promote the complete draft.** The request-subject/packet slice may be reconsidered after its full request-to-row/packet field paths are agreed and include every sealed dependency. The current decision, grant/revocation, and override portions need the P1 custody work above; the P2 expiry/conflict and role normalization changes should accompany their future native slice. No human adjudication, policy override, admission outcome, or human-gold status is established by this review.
## Subject-only remediation draft

After the findings above, the original full draft remains unchanged as the rejected review input. The new separate draft [20260907012000_verification_adjudication_subject_ledger.sql](20260907012000_verification_adjudication_subject_ledger.sql) has SHA-256 `9c2ab4b0f0fb8397b8fa9173378287b9de42bf1a712fcd46791c832f2c36070b`. It contains only the request subject/packet persistence slice.

It records distinct operation-request and step-input SHA-256 values; compares the operation request's exact schema, kind, input, target, reason, evidence-packet handle, optional requester note, authenticated actor/context, and claimed-step identity; requires a live tenant-local lease/fence; adds recorded-policy-input and policy-decision artifact/digest fields; and uses the exact unique parent set `manifest, bundle, deterministic result, policy definition, recorded policy inputs, policy decision, [report gate]`. It also rejects null, blank, untrimmed, duplicate, and overlength reviewer roles. It deliberately creates no reviewer authority role, grant, revocation, human decision, or override table.

`node internal/verification-adjudication-subject-draft-ddl-check.mjs` exited `0` and wrote [the immutable rollback receipt](../../../../internal/verification-adjudication-subject-draft-ddl-4fceb9ce-d890-4a44-85dc-cd1bfb9b4578.json). The harness SHA-256 is `998cceb54536de15d4e041bc0aa9797aa6ef74efa9fbbc44ce1367ef2004b044`. It proves only a transaction-local table compilation, the expected constrained row, ordinary-role INSERT denials, designated server-writer privileges, and rollback restoration.

The local role graph has `service_role` inheriting `executor_service`; it therefore has the intentionally granted subject INSERT privilege. That is not a human-adjudicator authority grant. The trigger still requires the exact running operation, claimed step, and unreleased live lease/fence, so raw table privilege alone cannot manufacture a subject. Native packet byte/field parity and target-object resolution remain for the request handler proof before promotion.

## Subject-only correction and shape check

The subject-only draft was corrected against [the public packet contract](../../../../ai-engineer-knowledge-services/packages/contracts/src/verification/adjudication.ts): `original_policy_outcome` now permits all five canonical `PolicyOutcomeSchema` values (`pass`, `pass_with_warnings`, `review`, `fail`, `abstain`); reviewer roles use the contract's 1–16 bounded, normalized, unique `/^[A-Za-z0-9][A-Za-z0-9._:-]*$/` vocabulary; and quorum is 1–16 and no greater than the number of roles.

A guarded loopback `BEGIN READ ONLY` query over existing verification audit operations confirmed the durable shape used by the trigger: `request.schemaVersion = knowledge-operation-request/v1`, `authenticatedContext` and `expectedVersions` exist, and the claimed step has `operationInput`, `expectedVersions`, and `context` exactly equal to the corresponding durable request fields. The previous draft's `.v1` schema-version spelling was corrected to `/v1`. No request bodies, identities, credentials, or artifacts were printed.

The corrected subject-only draft SHA-256 is `53587cefc7112b30f3909b55938fe091d8fe364e4e43e8411f18071c85e7a733`; the current rollback-only check was rerun after correction as `internal/verification-adjudication-subject-draft-ddl-b2eb926a-e2e4-41d9-8501-05888c9249af.json`, passing with rollback restoration. Native requestAdjudication packet parity remains a separate future handler proof.

A subsequent bounded correction adds `run_manifest_payload_sha256` for the packet's distinct `auditProof.manifestDigest`; registered artifact digest and canonical manifest payload digest are not conflated. It also keeps quorum bounded at 1–16 without requiring it to be no greater than the number of reviewer roles, per the current intended meaning that quorum counts humans rather than roles. This differs from the present packet schema's role-count refinement and must be reconciled in the shared contract before native capability enablement. The corrected rollback-only receipt is [0d17ea90-1a7a-4c5d-8272-5485c898e1e3](../../../../internal/verification-adjudication-subject-draft-ddl-0d17ea90-1a7a-4c5d-8272-5485c898e1e3.json); it passed and rolled back.

The future worker must use one native `commitPendingSubject` transaction after CAS put, with the locked operation request SHA and claimed step input SHA. Separate artifact-registration and subject inserts can leave a registered orphan on cancellation. This is a required runtime proof condition, not established by this draft or DDL harness.

