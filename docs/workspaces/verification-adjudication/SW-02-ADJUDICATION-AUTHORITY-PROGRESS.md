# SW-02 adjudication authority-only candidate

## 2026-09-07 boundary

This review isolates authority from the rejected full adjudication draft. It preserves the accepted `evidence.verification_adjudication_subject` table and defines no decision or policy-override table. The candidate is outside `supabase/migrations`, has not been applied, and contains no administrator, reviewer grant, revocation, decision, override, or human label row.

The original specification requires separate adjudicate and policy-admin capabilities, append-only human judgments, exact evidence/run custody, immutable audit history, and human approval for policy changes. It leaves the initial human qualifications and promotion authority as explicit human decisions. The rejected full draft failed because a server factory could assert grant and override authority without a native authorization contract, grants were tenant/role-wide rather than bound to one subject, and expiry/conflict observations were not serialized.

The new candidate uses an empty migration-owner-controlled human policy-administrator root table and an isolated NOLOGIN writer role with no member. A reviewer grant binds one real human actor to one immutable subject, exact packet ID/digest, eligible role, authorization version, bounded expiry, authenticated human grantor, exact durable operation/step hashes, and a live lease/fence. It forbids self-grant. Revocation binds the exact active grant/subject/packet and a second exact human operation/step/lease. Revocation is prospective and append-only. No application role can populate the root table or write authority rows.

Quorum remains a property of a future decision ledger. That ledger must count distinct `reviewer_actor_id` values, never role categories or grant rows. This authority candidate records eligibility only; it does not claim a vote, resolution, gold label, override, or admission change.

Missing dependencies before any promotion are strict `grantAdjudicatorAuthority` and `revokeAdjudicatorAuthority` contracts, the `verification_adjudication_authority` operation and exact two step kinds, an authenticated human-only policy-admin service, a migration-owner enrollment/revocation ceremony for real human admins, native lease/recovery tests, and independent authorization review. Synthetic identities may test rejection and transaction rollback, but they cannot establish or stand in for a real human administrator or reviewer.

## 2026-09-07 executable rollback evidence

The authority candidate is `20260907013000_verification_adjudication_authority_only.sql`, SHA-256 `ba3c6c6e5dad2112bde582df28e10f8fba2cb44a3fcd4783920cb91c67791432`. It remains outside canonical migrations and has not been applied.

The compilation/privilege harness `internal/verification-adjudication-authority-draft-ddl-check.mjs` ran the complete candidate inside a transaction against the verified loopback PostgreSQL service. Receipt `internal/verification-adjudication-authority-draft-ddl-e8e79d5f-5154-4801-864e-79d68534dd26.json`, SHA-256 `f9f33cb90509250aef12311dee814f3e5e16b09e89f238eab58493b0269dd881`, records four empty tables, no residual table or role after rollback, INSERT only for the two subject-grant tables through the isolated writer, no admin-root INSERT for that writer, and no INSERT for ordinary application, service, executor, or control-plane roles.

The behavior harness `internal/verification-adjudication-authority-behavior-check.mjs`, SHA-256 `7cb0d2ac896ce4957d0b58ea45f5ba6a0f57498b1469b80cccd204a74cbe8386`, used one retained native pending subject and synthetic identities only inside the rollback transaction. Receipt `internal/verification-adjudication-authority-behavior-172f131b-1920-456d-9aec-cc550297b977.json`, SHA-256 `764ca65b3f382836b4333141c9c5f14e983c5b33f3f644e6bda5775999546a0c`, passed 14 controls:

- exact subject-bound human grant and prospective revocation;
- historical activity before revocation and inactivity at revocation;
- repeated reviewer revocation denial;
- wrong packet, ineligible role, human self-grant, service grantor, and model grantor denial;
- stale lease and overlong grant expiry denial;
- administrator revocation timestamp normalization, denial after admin revocation, and repeated admin revocation denial.

The behavior run inserted the proposed `verification_adjudication_authority` operation and exact grant/revoke steps through existing operation integrity triggers; it disabled no trigger. Admin revocation locks its enrollment row `FOR UPDATE` and assigns both timestamps from `clock_timestamp()`. Grant issuance takes a conflicting `FOR SHARE` lock, so an administrator revocation and grant cannot both observe the administrator as active concurrently. Reviewer revocation locks the exact grant `FOR UPDATE`. Every row and the isolated writer role were rolled back. The receipt explicitly records `humanAuthorityEstablished: false`, zero decisions, and zero overrides.

The time-indexed active-grant predicate has no EXECUTE grant. A future decision writer will need a narrowly reviewed grant or trigger-only use. No current runtime can enqueue the proposed authority operation, and no real administrator enrollment exists; the candidate is executable design evidence rather than production authority.
