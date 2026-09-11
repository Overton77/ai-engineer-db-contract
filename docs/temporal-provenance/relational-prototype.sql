-- Consolidated relational graph prototype. EMPTY DISPOSABLE DATABASE ONLY.
-- Fictional Example Code product; no actual Claude Code historical claims.
-- PG17-compatible primitives; embedded runtime validation is separately reported.
begin;
create extension if not exists btree_gist;
create schema industry_demo;
revoke all on schema industry_demo from public;

create table industry_demo.tenant(id integer primary key);
create table industry_demo.person(tenant_id integer references industry_demo.tenant,id integer,name text,primary key(tenant_id,id));
create table industry_demo.organization(tenant_id integer references industry_demo.tenant,id integer,name text,primary key(tenant_id,id));
create table industry_demo.repository(tenant_id integer references industry_demo.tenant,id integer,provider_id text,primary key(tenant_id,id));
create table industry_demo.product(tenant_id integer references industry_demo.tenant,id integer,name text,primary key(tenant_id,id));
create table industry_demo.feature(
 tenant_id integer,product_id integer,id integer,primary key(tenant_id,id),
 unique(tenant_id,product_id,id),foreign key(tenant_id,product_id) references industry_demo.product);
create table industry_demo.feature_specification(
 tenant_id integer,feature_id integer,id integer,name text not null,description text not null,
 primary key(tenant_id,id),unique(tenant_id,feature_id,id),
 foreign key(tenant_id,feature_id) references industry_demo.feature);

-- Shared temporal metadata. No untyped entity endpoint or EAV value columns.
create table industry_demo.batch(
 tenant_id integer references industry_demo.tenant,knowledge_seq bigint,recorded_at timestamptz not null,
 receipt_ref text not null,primary key(tenant_id,knowledge_seq));
create table industry_demo.stream(
 tenant_id integer references industry_demo.tenant,id integer,
 kind text not null check(kind in('engagement','repo_archival','product_feature','support')),
 primary key(tenant_id,id),unique(tenant_id,id,kind));
create table industry_demo.revision(
 tenant_id integer,id integer,stream_id integer,kind text,knowledge_seq bigint,previous_revision_id integer,
 primary key(tenant_id,id),unique(tenant_id,stream_id,knowledge_seq),
 unique(tenant_id,id,stream_id,kind),unique(tenant_id,id,stream_id),
 foreign key(tenant_id,stream_id,kind) references industry_demo.stream(tenant_id,id,kind),
 foreign key(tenant_id,knowledge_seq) references industry_demo.batch deferrable initially deferred,
 foreign key(tenant_id,previous_revision_id,stream_id) references industry_demo.revision(tenant_id,id,stream_id));
create table industry_demo.segment(
 tenant_id integer,id integer,revision_id integer,stream_id integer,kind text,
 valid_during tstzrange not null,belief text not null check(belief in('accepted','disputed','unknown')),
 temporal_basis text not null check(temporal_basis in('explicit','carry_forward','unresolved')),
 primary key(tenant_id,id),unique(tenant_id,id,stream_id,kind),
 foreign key(tenant_id,revision_id,stream_id,kind) references industry_demo.revision(tenant_id,id,stream_id,kind),
 check(not isempty(valid_during) and not lower_inf(valid_during)
   and lower_inc(valid_during) and not upper_inc(valid_during)
   and isfinite(lower(valid_during)) and (upper_inf(valid_during) or isfinite(upper(valid_during)))),
 exclude using gist(tenant_id with =,revision_id with =,valid_during with &&));

-- Typed stable relationship endpoints and typed payloads.
create table industry_demo.engagement(
 tenant_id integer,id integer,person_id integer,organization_id integer,stream_id integer not null,
 kind text not null default 'engagement' check(kind='engagement'),
 primary key(tenant_id,id),unique(tenant_id,id,stream_id),unique(tenant_id,stream_id),
 foreign key(tenant_id,person_id) references industry_demo.person,
 foreign key(tenant_id,organization_id) references industry_demo.organization,
 foreign key(tenant_id,stream_id,kind) references industry_demo.stream(tenant_id,id,kind));
create table industry_demo.engagement_segment(
 tenant_id integer,segment_id integer,stream_id integer,engagement_id integer,
 kind text not null default 'engagement' check(kind='engagement'),
 arrangement text not null check(arrangement in('employee','contractor','intern')),
 primary key(tenant_id,segment_id),
 foreign key(tenant_id,segment_id,stream_id,kind) references industry_demo.segment(tenant_id,id,stream_id,kind),
 foreign key(tenant_id,engagement_id,stream_id) references industry_demo.engagement(tenant_id,id,stream_id));
create table industry_demo.repo_archival_stream(
 tenant_id integer,repository_id integer,stream_id integer,kind text not null default 'repo_archival' check(kind='repo_archival'),
 primary key(tenant_id,repository_id),unique(tenant_id,stream_id),unique(tenant_id,repository_id,stream_id),
 foreign key(tenant_id,repository_id) references industry_demo.repository,
 foreign key(tenant_id,stream_id,kind) references industry_demo.stream(tenant_id,id,kind));
create table industry_demo.repo_archival_segment(
 tenant_id integer,segment_id integer,stream_id integer,repository_id integer,
 kind text not null default 'repo_archival' check(kind='repo_archival'),archived boolean not null,
 primary key(tenant_id,segment_id),
 foreign key(tenant_id,segment_id,stream_id,kind) references industry_demo.segment(tenant_id,id,stream_id,kind),
 foreign key(tenant_id,repository_id,stream_id) references industry_demo.repo_archival_stream(tenant_id,repository_id,stream_id));
create table industry_demo.feature_scope(
 tenant_id integer,id integer,product_id integer,feature_id integer,stream_id integer,
 kind text not null default 'product_feature' check(kind='product_feature'),
 -- Demo strings stand in for explicit production edition/plan/region/channel FKs.
 edition text not null,plan text not null,region text not null,channel text not null,
 primary key(tenant_id,id),unique(tenant_id,stream_id),unique(tenant_id,id,stream_id,feature_id),
 unique(tenant_id,product_id,feature_id,edition,plan,region,channel),
 foreign key(tenant_id,product_id,feature_id) references industry_demo.feature(tenant_id,product_id,id),
 foreign key(tenant_id,stream_id,kind) references industry_demo.stream(tenant_id,id,kind));
create table industry_demo.feature_segment(
 tenant_id integer,segment_id integer,stream_id integer,scope_id integer,feature_id integer,
 kind text not null default 'product_feature' check(kind='product_feature'),
 availability text not null check(availability in('preview','available','disabled','discontinued')),
 specification_revision_id integer not null,
 primary key(tenant_id,segment_id),
 foreign key(tenant_id,segment_id,stream_id,kind) references industry_demo.segment(tenant_id,id,stream_id,kind),
 foreign key(tenant_id,scope_id,stream_id,feature_id) references industry_demo.feature_scope(tenant_id,id,stream_id,feature_id),
 foreign key(tenant_id,feature_id,specification_revision_id) references industry_demo.feature_specification(tenant_id,feature_id,id));

-- Minimal immutable source/claim stubs: production REUSES evidence/content/retrieval.
create table industry_demo.document_version(tenant_id integer,id integer,content_ref text not null,primary key(tenant_id,id));
create table industry_demo.chunk(
 tenant_id integer,id integer,document_version_id integer,text_content text not null,
 primary key(tenant_id,id),foreign key(tenant_id,document_version_id) references industry_demo.document_version);
create table industry_demo.claim(tenant_id integer,id integer,statement text not null,primary key(tenant_id,id));
create table industry_demo.support_relationship(
 tenant_id integer,id integer,stream_id integer,chunk_id integer,claim_id integer,
 kind text not null default 'support' check(kind='support'),
 primary key(tenant_id,id),unique(tenant_id,stream_id),unique(tenant_id,id,stream_id),
 foreign key(tenant_id,stream_id,kind) references industry_demo.stream(tenant_id,id,kind),
 foreign key(tenant_id,chunk_id) references industry_demo.chunk,
 foreign key(tenant_id,claim_id) references industry_demo.claim);
-- For compactness demo support binds a chunk directly. Production authoritative
-- support anchors evidence.locator; a retrieval-side bridge validates chunk custody.
create table industry_demo.support_segment(
 tenant_id integer,segment_id integer,stream_id integer,support_id integer,
 kind text not null default 'support' check(kind='support'),
 disposition text not null check(disposition in('admitted','withdrawn','disputed')),
 assessment_ref text not null,
 primary key(tenant_id,segment_id),
 foreign key(tenant_id,segment_id,stream_id,kind) references industry_demo.segment(tenant_id,id,stream_id,kind),
 foreign key(tenant_id,support_id,stream_id) references industry_demo.support_relationship(tenant_id,id,stream_id));

-- Events have stable IDs and correctable occurrence interpretations.
create table industry_demo.event(
 tenant_id integer,id integer,kind text not null check(kind in('hired','left','made_public','release_published','archived')),
 primary key(tenant_id,id),unique(tenant_id,id,kind));
create table industry_demo.employment_event(
 tenant_id integer,event_id integer,kind text check(kind in('hired','left')),engagement_id integer,
 primary key(tenant_id,event_id),foreign key(tenant_id,event_id,kind) references industry_demo.event(tenant_id,id,kind),
 foreign key(tenant_id,engagement_id) references industry_demo.engagement);
create table industry_demo.repository_release(
 tenant_id integer,id integer,repository_id integer,release_label text not null,
 primary key(tenant_id,id),unique(tenant_id,id,repository_id),
 foreign key(tenant_id,repository_id) references industry_demo.repository);
create table industry_demo.repository_event(
 tenant_id integer,event_id integer,kind text check(kind in('made_public','release_published','archived')),
 repository_id integer,release_id integer,
 primary key(tenant_id,event_id),foreign key(tenant_id,event_id,kind) references industry_demo.event(tenant_id,id,kind),
 foreign key(tenant_id,repository_id) references industry_demo.repository,
 foreign key(tenant_id,release_id,repository_id) references industry_demo.repository_release(tenant_id,id,repository_id),
 check((kind='release_published')=(release_id is not null)));
create table industry_demo.event_revision(
 tenant_id integer,event_id integer,knowledge_seq bigint,
 occurred_at timestamptz,possible_during tstzrange, -- compact analogue of extent FK
 occurrence_mode text not null check(occurrence_mode in('actual','scheduled')),
 primary key(tenant_id,event_id,knowledge_seq),
 foreign key(tenant_id,event_id) references industry_demo.event,
 foreign key(tenant_id,knowledge_seq) references industry_demo.batch deferrable initially deferred,
 check(num_nonnulls(occurred_at,possible_during)<=1),
 check(possible_during is null or (not isempty(possible_during) and not lower_inf(possible_during) and not upper_inf(possible_during))));
create table industry_demo.event_encounter(
 tenant_id integer,id integer,event_id integer,knowledge_seq bigint,
 discovered_at timestamptz not null,registered_at timestamptz not null,
 primary key(tenant_id,id),foreign key(tenant_id,event_id) references industry_demo.event,
 foreign key(tenant_id,knowledge_seq) references industry_demo.batch deferrable initially deferred,
 check(registered_at>=discovered_at));

create table industry_demo.publication(tenant_id integer,id integer,knowledge_seq bigint,manifest_ref text not null,
 primary key(tenant_id,id),foreign key(tenant_id,knowledge_seq) references industry_demo.batch deferrable initially deferred);
create table industry_demo.publication_member(tenant_id integer,publication_id integer,chunk_id integer,
 primary key(tenant_id,publication_id,chunk_id),foreign key(tenant_id,publication_id) references industry_demo.publication deferrable initially deferred,
 foreign key(tenant_id,chunk_id) references industry_demo.chunk);
create table industry_demo.retrieval_run(tenant_id integer,id integer,knowledge_seq bigint,publication_id integer,
 primary key(tenant_id,id),foreign key(tenant_id,knowledge_seq) references industry_demo.batch deferrable initially deferred,
 foreign key(tenant_id,publication_id) references industry_demo.publication);
create table industry_demo.packet_member(tenant_id integer,run_id integer,ordinal integer,chunk_id integer,
 primary key(tenant_id,run_id,ordinal),foreign key(tenant_id,run_id) references industry_demo.retrieval_run deferrable initially deferred,
 foreign key(tenant_id,chunk_id) references industry_demo.chunk);

-- Required composite-FK components may not bypass integrity through NULL.
alter table industry_demo.feature alter product_id set not null;
alter table industry_demo.feature_specification alter feature_id set not null;
alter table industry_demo.revision alter stream_id set not null,alter kind set not null,alter knowledge_seq set not null;
alter table industry_demo.segment alter revision_id set not null,alter stream_id set not null,alter kind set not null;
alter table industry_demo.engagement alter person_id set not null,alter organization_id set not null;
alter table industry_demo.engagement_segment alter stream_id set not null,alter engagement_id set not null;
alter table industry_demo.repo_archival_stream alter stream_id set not null;
alter table industry_demo.repo_archival_segment alter stream_id set not null,alter repository_id set not null;
alter table industry_demo.feature_scope alter product_id set not null,alter feature_id set not null,alter stream_id set not null;
alter table industry_demo.feature_segment alter stream_id set not null,alter scope_id set not null,alter feature_id set not null;
alter table industry_demo.chunk alter document_version_id set not null;
alter table industry_demo.support_relationship alter stream_id set not null,alter chunk_id set not null,alter claim_id set not null;
alter table industry_demo.support_segment alter stream_id set not null,alter support_id set not null;
alter table industry_demo.employment_event alter kind set not null,alter engagement_id set not null;
alter table industry_demo.repository_release alter repository_id set not null;
alter table industry_demo.repository_event alter kind set not null,alter repository_id set not null;
alter table industry_demo.event_encounter alter event_id set not null,alter knowledge_seq set not null;
alter table industry_demo.publication alter knowledge_seq set not null;
alter table industry_demo.retrieval_run alter knowledge_seq set not null,alter publication_id set not null;
alter table industry_demo.packet_member alter chunk_id set not null;

create function industry_demo.reject_mutation() returns trigger language plpgsql as $$
begin raise exception 'immutable prototype history: %',tg_table_name; end $$;
do $$ declare n text; begin
 for n in select tablename from pg_tables where schemaname='industry_demo' loop
  execute format('create trigger immutable before update or delete on industry_demo.%I for each row execute function industry_demo.reject_mutation()',n);
 end loop;
end $$;

create function industry_demo.reject_sealed_insert() returns trigger language plpgsql as $$
declare k bigint; x jsonb:=to_jsonb(new);
begin
 if x ? 'knowledge_seq' then k:=(x->>'knowledge_seq')::bigint;
 elsif x ? 'revision_id' then select knowledge_seq into k from industry_demo.revision where tenant_id=new.tenant_id and id=(x->>'revision_id')::integer;
 elsif x ? 'segment_id' then
  select r.knowledge_seq into k from industry_demo.segment s join industry_demo.revision r on r.tenant_id=s.tenant_id and r.id=s.revision_id
   where s.tenant_id=new.tenant_id and s.id=(x->>'segment_id')::integer;
 end if;
 if exists(select 1 from industry_demo.batch where tenant_id=new.tenant_id and knowledge_seq=k) then raise exception 'sealed batch'; end if;
 return new;
end $$;
do $$ declare n text; begin
 foreach n in array array['revision','segment','engagement_segment','repo_archival_segment','feature_segment','support_segment','event_revision','event_encounter'] loop
  execute format('create trigger seal_guard before insert on industry_demo.%I for each row execute function industry_demo.reject_sealed_insert()',n);
 end loop;
end $$;

-- Demo seal proof: production integrates equivalent validation with receipt/evidence,
-- authorization, head locks, idempotency and outbox in a bounded writer API.
create function industry_demo.check_batch() returns trigger language plpgsql as $$
declare s record; n integer;
begin
 for s in select x.* from industry_demo.segment x join industry_demo.revision r
  on r.tenant_id=x.tenant_id and r.id=x.revision_id
  where r.tenant_id=new.tenant_id and r.knowledge_seq=new.knowledge_seq loop
  case s.kind
   when 'engagement' then select count(*) into n from industry_demo.engagement_segment where tenant_id=s.tenant_id and segment_id=s.id;
   when 'repo_archival' then select count(*) into n from industry_demo.repo_archival_segment where tenant_id=s.tenant_id and segment_id=s.id;
   when 'product_feature' then select count(*) into n from industry_demo.feature_segment where tenant_id=s.tenant_id and segment_id=s.id;
   when 'support' then select count(*) into n from industry_demo.support_segment where tenant_id=s.tenant_id and segment_id=s.id;
  end case;
  if n<>1 then raise exception 'typed payload missing'; end if;
 end loop;
 if exists(select 1 from industry_demo.revision c join industry_demo.revision p on p.tenant_id=c.tenant_id and p.id=c.previous_revision_id
   where c.tenant_id=new.tenant_id and c.knowledge_seq=new.knowledge_seq and p.knowledge_seq>=c.knowledge_seq) then raise exception 'parent must precede child'; end if;
 return new;
end $$;
create trigger validate_seal before insert on industry_demo.batch for each row execute function industry_demo.check_batch();

create function industry_demo.reject_late_member() returns trigger language plpgsql as $$
begin
 if tg_table_name='publication_member' then
  if exists(select 1 from industry_demo.publication where tenant_id=new.tenant_id and id=new.publication_id) then raise exception 'publication sealed'; end if;
 else
  if exists(select 1 from industry_demo.retrieval_run where tenant_id=new.tenant_id and id=new.run_id) then raise exception 'packet sealed'; end if;
 end if;
 return new;
end $$;
create trigger publication_seal before insert on industry_demo.publication_member for each row execute function industry_demo.reject_late_member();
create trigger packet_seal before insert on industry_demo.packet_member for each row execute function industry_demo.reject_late_member();

-- Query coordinate primitive: select revision first, then its segments.
create function industry_demo.segments_at(p_tenant integer,p_k bigint)
returns setof industry_demo.segment language sql stable as $$
 with chosen as(select distinct on(stream_id) id from industry_demo.revision
 where tenant_id=p_tenant and knowledge_seq<=p_k order by stream_id,knowledge_seq desc)
 select s.* from industry_demo.segment s join chosen c on c.id=s.revision_id where s.tenant_id=p_tenant
$$;
create function industry_demo.employment_history(p_tenant integer,p_person integer,p_k bigint)
returns table(engagement_id integer,organization_id integer,known_start timestamptz,known_end timestamptz)
language sql stable as $$
 select e.id,e.organization_id,lower(s.valid_during) as known_start,upper(s.valid_during) as known_end
 from industry_demo.engagement e join industry_demo.engagement_segment v on v.tenant_id=e.tenant_id and v.engagement_id=e.id
 join industry_demo.segments_at(p_tenant,p_k) s on s.id=v.segment_id
 where e.tenant_id=p_tenant and e.person_id=p_person and s.belief='accepted' order by known_start
$$;
create function industry_demo.features_at(p_tenant integer,p_product integer,p_plan text,p_world timestamptz,p_k bigint)
returns table(feature_name text,availability text,specification_revision_id integer)
language sql stable as $$
 select spec.name,v.availability,spec.id from industry_demo.feature_scope f
 join industry_demo.feature_segment v on v.tenant_id=f.tenant_id and v.scope_id=f.id
 join industry_demo.segments_at(p_tenant,p_k) s on s.id=v.segment_id
 join industry_demo.feature_specification spec on spec.tenant_id=v.tenant_id and spec.id=v.specification_revision_id
 where f.tenant_id=p_tenant and f.product_id=p_product and f.plan=p_plan
 and f.edition='desktop' and f.region='US' and f.channel='stable'
 and s.valid_during @> p_world and s.belief='accepted' order by spec.name
$$;
create function industry_demo.event_delays(p_tenant integer,p_k bigint)
returns table(event_id integer,kind text,occurred_at timestamptz,encounter_delay interval,registered_delay interval,
 minimum_delay interval,maximum_delay interval,knowledge_seq bigint,occurrence_mode text)
language sql stable as $$
 with v as(select distinct on(event_id) * from industry_demo.event_revision
  where tenant_id=p_tenant and knowledge_seq<=p_k order by event_id,knowledge_seq desc),
 first_encounter as(select event_id,min(discovered_at) discovered_at,min(registered_at) registered_at
  from industry_demo.event_encounter where tenant_id=p_tenant and knowledge_seq<=p_k group by event_id)
 select v.event_id,e.kind,v.occurred_at,c.discovered_at-v.occurred_at,c.registered_at-v.occurred_at,
 c.registered_at-upper(v.possible_during),c.registered_at-lower(v.possible_during),v.knowledge_seq,v.occurrence_mode
 from v join industry_demo.event e on e.tenant_id=v.tenant_id and e.id=v.event_id
 left join first_encounter c on c.event_id=v.event_id order by v.event_id
$$;

-- Fictional data, entered before immutable batch seals.
insert into industry_demo.tenant values(1),(2);
insert into industry_demo.person values(1,1,'Alex Example');
insert into industry_demo.organization values(1,1,'Example Labs');
insert into industry_demo.repository values(1,1,'provider:repo:123');
insert into industry_demo.product values(1,1,'Example Code'),(1,2,'Other Product');
insert into industry_demo.feature values(1,1,1),(1,1,2),(1,1,3),(1,2,4);
insert into industry_demo.feature_specification values
 (1,1,1,'Terminal edits','Initial immutable specification'),
 (1,1,2,'Terminal edits','Revised limits; preserves previous specification'),
 (1,2,3,'Workspace search','Fictional search feature'),
 (1,3,4,'Team sessions','Fictional collaboration feature');
insert into industry_demo.stream values(1,1,'engagement'),(1,2,'engagement'),(1,3,'repo_archival'),
 (1,4,'product_feature'),(1,5,'product_feature'),(1,6,'product_feature'),(1,7,'support');
insert into industry_demo.engagement values(1,1,1,1,1,'engagement'),(1,2,1,1,2,'engagement');
insert into industry_demo.repo_archival_stream values(1,1,3,'repo_archival');
insert into industry_demo.feature_scope values
 (1,1,1,1,4,'product_feature','desktop','pro','US','stable'),
 (1,2,1,2,5,'product_feature','desktop','pro','US','stable'),
 (1,3,1,3,6,'product_feature','desktop','pro','US','stable');
insert into industry_demo.document_version values(1,1,'immutable:document:v1'),(1,2,'immutable:document:v2');
insert into industry_demo.chunk values(1,1,1,'The original wording remains unchanged.'),(1,2,2,'Corrected wording creates a new chunk.');
insert into industry_demo.claim values(1,1,'Fictional claim scoped to June 2026');
insert into industry_demo.support_relationship values(1,1,7,1,1,'support');
insert into industry_demo.revision values
 (1,1,1,'engagement',1,null),(1,2,1,'engagement',3,1),(1,3,1,'engagement',4,2),
 (1,4,2,'engagement',4,null),(1,5,3,'repo_archival',1,null),(1,6,3,'repo_archival',3,5),
 (1,7,4,'product_feature',1,null),(1,8,4,'product_feature',2,7),
 (1,9,5,'product_feature',2,null),(1,10,6,'product_feature',3,null),
 (1,11,7,'support',3,null),(1,12,7,'support',4,11);
insert into industry_demo.segment values
 (1,1,1,1,'engagement','[2025-08-01 00:00Z,)','accepted','explicit'),
 (1,2,2,1,'engagement','[2025-08-01 00:00Z,2026-05-01 00:00Z)','accepted','explicit'),
 (1,3,3,1,'engagement','[2025-08-01 00:00Z,2026-04-25 00:00Z)','accepted','explicit'),
 (1,4,4,2,'engagement','[2026-08-01 00:00Z,)','accepted','explicit'),
 (1,5,5,3,'repo_archival','[2025-08-01 00:00Z,)','accepted','explicit'),
 (1,6,6,3,'repo_archival','[2025-08-01 00:00Z,2026-06-01 00:00Z)','accepted','explicit'),
 (1,7,6,3,'repo_archival','[2026-06-01 00:00Z,)','accepted','explicit'),
 (1,8,7,4,'product_feature','[2025-08-01 00:00Z,)','accepted','explicit'),
 (1,9,8,4,'product_feature','[2025-08-01 00:00Z,2026-02-01 00:00Z)','accepted','explicit'),
 (1,10,8,4,'product_feature','[2026-02-01 00:00Z,)','accepted','explicit'),
 (1,11,9,5,'product_feature','[2026-02-01 00:00Z,)','accepted','explicit'),
 (1,12,10,6,'product_feature','[2026-06-01 00:00Z,)','accepted','explicit'),
 (1,13,11,7,'support','[2026-06-01 00:00Z,2026-07-01 00:00Z)','accepted','explicit'),
 (1,14,12,7,'support','[2026-06-01 00:00Z,2026-07-01 00:00Z)','accepted','explicit');
insert into industry_demo.engagement_segment values(1,1,1,1,'engagement','employee'),(1,2,1,1,'engagement','employee'),
 (1,3,1,1,'engagement','employee'),(1,4,2,2,'engagement','contractor');
insert into industry_demo.repo_archival_segment values(1,5,3,1,'repo_archival',false),(1,6,3,1,'repo_archival',false),(1,7,3,1,'repo_archival',true);
insert into industry_demo.feature_segment values(1,8,4,1,1,'product_feature','available',1),
 (1,9,4,1,1,'product_feature','available',1),(1,10,4,1,1,'product_feature','available',2),
 (1,11,5,2,2,'product_feature','available',3),(1,12,6,3,3,'product_feature','available',4);
insert into industry_demo.support_segment values(1,13,7,1,'support','admitted','assessment:v1'),(1,14,7,1,'support','withdrawn','assessment:v2');
insert into industry_demo.event values(1,1,'hired'),(1,2,'left'),(1,3,'hired'),(1,4,'made_public'),(1,5,'release_published'),(1,6,'archived'),(1,7,'release_published'),(1,8,'release_published');
insert into industry_demo.employment_event values(1,1,'hired',1),(1,2,'left',1),(1,3,'hired',2);
insert into industry_demo.repository_release values(1,1,1,'v1.0'),(1,2,1,'v2.0 scheduled'),(1,3,1,'v1.1 occurrence bounded');
insert into industry_demo.repository_event values(1,4,'made_public',1,null),(1,5,'release_published',1,1),
 (1,6,'archived',1,null),(1,7,'release_published',1,2),(1,8,'release_published',1,3);
insert into industry_demo.event_revision values
 (1,1,1,'2025-08-01 00:00Z',null,'actual'),(1,2,3,'2026-05-01 00:00Z',null,'actual'),
 (1,2,4,'2026-04-25 00:00Z',null,'actual'),(1,3,4,'2026-08-01 00:00Z',null,'actual'),
 (1,4,1,'2025-08-01 00:00Z',null,'actual'),(1,5,1,'2025-08-05 00:00Z',null,'actual'),
 (1,6,3,'2026-06-01 00:00Z',null,'actual'),(1,7,4,'2026-09-20 00:00Z',null,'scheduled'),
 (1,8,4,null,'[2026-08-01 00:00Z,2026-08-06 00:00Z]','actual');
insert into industry_demo.event_encounter values
 (1,1,1,1,'2025-08-02 00:00Z','2025-08-02 00:01Z'),
 (1,2,2,3,'2026-05-10 00:00Z','2026-05-10 00:01Z'),
 (1,3,6,3,'2026-06-09 00:00Z','2026-06-09 00:01Z'),
 (1,4,7,4,'2026-09-09 00:00Z','2026-09-09 00:01Z'),
 (1,5,8,4,'2026-08-10 00:00Z','2026-08-10 00:01Z');
insert into industry_demo.publication_member values(1,1,1),(1,2,2);
insert into industry_demo.publication values(1,1,3,'manifest:old'),(1,2,4,'manifest:new');
insert into industry_demo.packet_member values(1,1,1,1);
insert into industry_demo.retrieval_run values(1,1,3,1);
insert into industry_demo.batch values
 (1,1,'2025-08-10 00:00Z','receipt:1'),(1,2,'2026-02-10 00:00Z','receipt:2'),
 (1,3,'2026-06-10 00:00Z','receipt:3'),(1,4,'2026-09-10 00:00Z','receipt:4');
revoke all on all functions in schema industry_demo from public;
commit;

-- EXAMPLE QUERIES (also exercised by verify-relational.mjs)
-- A. Distinct engagement episodes; known_end null means no known end.
select * from industry_demo.employment_history(1,1,4);
-- B. Correctable actual hire/leave occurrences rather than inferred observations.
select * from industry_demo.event_delays(1,4) where kind in('hired','left');
-- C. Repository public/release/archive dates and event-specific discovery delays.
select * from industry_demo.event_delays(1,4) where kind in('made_public','release_published','archived');
-- D. Product history reconstructed at fixed latest knowledge snapshot.
select d.label,f.* from (values
 ('one year ago','2025-09-10 00:00Z'::timestamptz),
 ('six months ago','2026-03-10 00:00Z'::timestamptz),
 ('two months ago','2026-07-10 00:00Z'::timestamptz)) d(label,world_at)
 cross join lateral industry_demo.features_at(1,1,'pro',d.world_at,4) f;
-- E. Old packet still returns old chunk after support withdrawal and new publication.
select r.knowledge_seq,r.publication_id,m.ordinal,c.text_content
 from industry_demo.retrieval_run r join industry_demo.packet_member m on m.tenant_id=r.tenant_id and m.run_id=r.id
 join industry_demo.chunk c on c.tenant_id=m.tenant_id and c.id=m.chunk_id where r.tenant_id=1 and r.id=1;
