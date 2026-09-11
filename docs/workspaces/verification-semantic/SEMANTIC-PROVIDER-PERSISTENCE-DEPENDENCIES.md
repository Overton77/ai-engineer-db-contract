# Semantic provider persistence contract dependencies

This accompanies `20260907013000_verification_semantic_provider_observation.DRAFT.sql`. Both files are **unapplied proposals**, outside `supabase/migrations`.

## Confirmed native operation scope

KS currently defines the only permitted integrated semantic hosts as:

| Operation kind | Step key | Current public use case |
| --- | --- | --- |
| `verification_claims` | `verify_claims_and_register` | `verifyClaims` |
| `verification_report` | `verify_report_and_register` | `verifyReport` |

A standalone `verification_semantic` operation is not current canonical shape and is intentionally absent from the draft.

## Missing required contracts before a migration may be promoted

1. **Server-owned semantic phase admission.** `VerifyClaimsRequest` and `VerifyReportRequest` contain only capture and assertion/report handles. Their application results are fixed to `mode: deterministic_only`. A private worker configuration/grant must define whether semantic execution is enabled, the exact profile artifact full handle, budget, provider deployment identity, and cross-family deployment. None may be carried in public request JSON.
2. **Blinded-input artifact contract.** A strict canonical schema and builder must bind assertion ID, proposition, authorized qualifiers/entity bindings/fragments, and its full source/capture closure. The Gateway adapter currently passes a digest only; production must require the full registered `verification_semantic_blinded_input` handle.
3. **Observation artifact contract.** A strict canonical artifact body must bind all observation-table identity fields and a deterministic transformation signature. Database rows alone cannot parse the private raw Storage body to prove `observed_model`; the registration builder and SQL signature comparison jointly provide that binding.
4. **Semantic result and terminal sealer.** Claims/report seals only deterministic result/policy inputs today. A semantic result artifact and exact inclusion in the signed run manifest/policy inputs are needed before semantic outcomes affect policy. Deterministic failure remains terminal and semantic must never run for it.
5. **Provider scope migration and adapter.** `PostgresVerificationProviderAccounting` and `PostgresVerificationProviderResponseCaptureStore` hard-code extraction. Their source and the DB scope guard need a closed tuple extension, plus a semantic observation persistence adapter and recovery read path. They must preserve extraction semantics unchanged.
6. **Configuration and transport.** Disabled-by-default server configuration must supply signing key, admitted profile/grant, provider budget, and independent primary/cross-family identities. No provider SDK type belongs in public contracts. Transport remains unavailable until this runtime is sealed.

## Validation required after implementation

Rollback-only DDL must show extraction behavior unchanged and semantic rows reject wrong host tuple, profile, lease, fence, request/raw/input parent, model-state tuple, usage/cost form, duplicate, update/delete, and RLS role. A disposable native semantic run must retain request/raw/observation/unknown-cost liability and a signed claims/report terminal manifest. Calibration, live provider conformance, and human labels remain separate acceptance gates.
