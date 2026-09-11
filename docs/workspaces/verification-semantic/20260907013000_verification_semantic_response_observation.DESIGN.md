# Semantic Gateway observation persistence design — non-executable

Status: **root-rejected as an executable migration**. This document intentionally contains no SQL transaction or DDL. It is a bounded design for a later DB-contract owner.

## Reuse boundary

The future implementation may reuse `orchestration.verification_provider_budget`, `orchestration.verification_provider_attempt`, its request/response artifact foreign keys, reservation/dispatch fencing, and reconciliation liability accounting. It must not reuse the existing structured-extraction scope by merely changing an operation-kind string: `20260906031300_verification_provider_operation_scope.sql` makes that scope extraction-profile and `extract_and_register` specific.

## Required atomic database work

A single reviewed migration must replace or factor the provider scope guard without weakening any current invariant. It must enumerate exactly two server-owned profiles:

| Profile artifact type | Operation kind | Step key |
|---|---|---|
| `verification_structured_extraction_profile` | `verification_structured_extraction` | `extract_and_register` |
| `verification_semantic_judge_profile` | `verification_semantic` | `verify_semantic_and_register` |

No caller supplied operation kind, step key, profile type, model, or provider identity is authoritative. On attempt insert/update, the trigger must lock the exact running operation and live unreleased lease, compare the claimed step ID/token/fencing token/holder, enforce the fixed profile tuple, require admitted request/response artifacts, and retain current reservation/dispatch state transitions and immutable scope fields.

The observation relation must be append-only and have a one-to-one provider-attempt key. Its trigger must use the same live claim and lock the exact attempt. It must require all of the following from registered immutable artifacts and the server-owned semantic profile rather than caller JSON:

- tenant, operation, step, profile digest, provider-attempt ID, and dispatch fence;
- request digest and raw response digest, each matching their registered artifacts and the attempt;
- blinded input artifact digest, bound to the immutable semantic input artifact;
- requested model bound to the profile, observed model constrained to the retained raw Gateway response envelope; `missing` has no observed model; `matched` means equality; `mismatch` requires inequality; and revalidation is exactly the inverse of `matched`;
- UTC server timestamp using `clock_timestamp()`;
- token fields as non-negative bounded integers and reported cost as non-negative integer micros;
- missing/BYOK cost represented as `cost_status='unknown'` and a null actual cost. It must never write zero as an unknown cost. Only the existing reconciliation authority may move an attempt to settled and update budget totals.

The relation needs tenant FKs to attempt, operation, step, profile, input, request, raw response, and observation artifact where applicable; artifact admission/type checks; immutable trigger rejecting update/delete; RLS with worker roles limited to insert/select and app reader limited to select; revocation from `public`, `anon`, `authenticated`, and no `service_role` membership grant. The migration must avoid `ON CONFLICT DO UPDATE` on artifact-type descriptions because that mutates historical vocabulary; require the exact existing description or fail on collision.

## Required validation before promotion

1. Run rollback-only DDL against the exact current schema and assert all replaced provider-attempt guard behavior still passes for structured extraction.
2. Prove semantic attempts reject wrong operation, step, profile type/digest, actor claim, expired lease, stale fence, request/raw/input digest, model status, revalidation flag, cost-state combination, duplicate observation, update, and delete.
3. Prove RLS role denial and absence of generic/self-granted role access.
4. Use a disposable local transaction to verify registered artifact/attempt/observation custody and unknown-cost liability; rollback it. No provider call, calibration, human label, or policy admission is part of this work.
