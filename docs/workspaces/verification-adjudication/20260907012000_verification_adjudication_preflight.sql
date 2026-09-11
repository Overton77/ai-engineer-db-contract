-- Read-only preflight for the draft verification adjudication ledger.
-- Run with psql -X -v ON_ERROR_STOP=1 -f this-file.sql against the intended database.
select version from supabase_migrations.schema_migrations order by version;

select n.nspname as schema_name, c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where (n.nspname,c.relname) in (
  ('knowledge_service','operation'), ('knowledge_service','operation_step'), ('knowledge_service','lease'),
  ('knowledge_service','review_subject'), ('knowledge_service','review_decision'), ('evidence','verification_run'),
  ('orchestration','artifact'), ('orchestration','verification_artifact_metadata')
) order by 1,2;

select conrelid::regclass as relation_name, conname, pg_get_constraintdef(oid) as definition
from pg_constraint where conrelid in (
  'knowledge_service.operation'::regclass, 'knowledge_service.operation_step'::regclass,
  'knowledge_service.lease'::regclass, 'evidence.verification_run'::regclass,
  'orchestration.artifact'::regclass
) order by 1,2;

select table_schema, table_name, grantee, privilege_type
from information_schema.role_table_grants
where (table_schema,table_name) in (
  ('knowledge_service','review_subject'), ('knowledge_service','review_decision'), ('evidence','verification_run')
) order by 1,2,3,4;

select code,description from orchestration.artifact_type
where code in ('verification_adjudication_packet','verification_adjudication_decision','verification_policy_override') order by code;

select table_schema,table_name from information_schema.tables
where (table_schema,table_name) in (
 ('knowledge_service','verification_adjudicator_grant'),
 ('knowledge_service','verification_adjudicator_grant_revocation'),
 ('evidence','verification_adjudication_subject'),
 ('evidence','verification_adjudication_decision'),
 ('evidence','verification_policy_override')
) order by 1,2;