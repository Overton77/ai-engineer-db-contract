---
id: "rel:evidence.verification_adjudication_review_state#details"
kind: details
schema: evidence
name: verification_adjudication_review_state
of: "rel:evidence.verification_adjudication_review_state"
workspace_fingerprint: "sha256:b0b1edb4bb695c5b199c50ded01dfd5e79e272140d5c133893b4a1a6f008c4c2"
---
# evidence.verification_adjudication_review_state — details

Spill-over from [the main page](verification_adjudication_review_state.md).

## Relationships

Outbound: none.
Inbound: none.

## Indexes

_None._

## Triggers

_None._

## Row-level security

Disabled.

## View definition

```sql
SELECT s.tenant_id,
    s.id AS subject_id,
    s.quorum_required,
    count(d.id) FILTER (WHERE d.reviewer_provenance = 'human_origin'::text AND d.decision = 'affirm'::text) AS human_affirmed,
    count(d.id) FILTER (WHERE d.reviewer_provenance = 'human_origin'::text AND d.decision = 'reject'::text) AS human_rejected,
    count(d.id) FILTER (WHERE d.reviewer_provenance = 'human_origin'::text AND d.decision = 'defer'::text) AS human_deferred,
    count(d.id) FILTER (WHERE d.reviewer_provenance = 'synthetic_engineering'::text) AS synthetic_recorded,
    count(d.id) FILTER (WHERE d.reviewer_provenance = 'human_origin'::text AND d.decision = 'affirm'::text) >= s.quorum_required AND count(d.id) FILTER (WHERE d.reviewer_provenance = 'human_origin'::text AND d.decision = 'reject'::text) = 0 AND (s.expires_at IS NULL OR s.expires_at > statement_timestamp()) AS quorum_reached
   FROM evidence.verification_adjudication_subject s
     LEFT JOIN evidence.verification_adjudication_decision d ON d.tenant_id = s.tenant_id AND d.subject_id = s.id
  GROUP BY s.tenant_id, s.id, s.quorum_required, s.expires_at;
```
