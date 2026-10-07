-- Stable learners and explicit guardian grants; preserves all existing IDs and XP.
begin;
create table public.learner_profiles (
 id text primary key, owner_id uuid not null references auth.users(id),
 name text not null check(length(btrim(name)) between 1 and 60),
 kind text not null check(kind in ('self','child')), created_at timestamptz not null default now()
);
create table public.learner_access (
 account_id uuid not null references auth.users(id), learner_id text not null references public.learner_profiles(id),
 role text not null check(role in ('self','guardian','learner')), primary key(account_id,learner_id)
);
insert into public.learner_profiles(id,owner_id,name,kind)
 select id::text,id,left(coalesce(nullif(raw_user_meta_data->>'full_name',''),nullif(raw_user_meta_data->>'name',''),split_part(email,'@',1),'Můj profil'),60),'self' from auth.users;
insert into public.learner_access select owner_id,id,'self' from public.learner_profiles;
do $$ begin
 if to_regclass('public.profiles') is not null then
  execute 'update public.learner_profiles l set name=left(p.full_name,60) from public.profiles p where p.id::text=l.id and length(btrim(p.full_name))>0';
 end if;
end $$;
create function public.can_use_learner(p_id text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.learner_access where account_id=auth.uid() and learner_id=p_id)
$$;
create function public.learner_owner(p_id text) returns uuid language sql stable security definer set search_path='' as $$
 select owner_id from public.learner_profiles where id=p_id and public.can_use_learner(p_id)
$$;
create function public.is_learner_guardian(p_id text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.learner_access where account_id=auth.uid() and learner_id=p_id and role='guardian')
$$;
alter table public.learner_profiles enable row level security;
alter table public.learner_access enable row level security;
create policy learner_profiles_read on public.learner_profiles for select to authenticated using(public.can_use_learner(id));
create policy learner_access_read on public.learner_access for select to authenticated using(account_id=auth.uid() or public.is_learner_guardian(learner_id));
grant select on public.learner_profiles,public.learner_access to authenticated;

create function public.my_learners(p_name text default 'Můj profil') returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Not authorized' using errcode='42501'; end if;
 if not exists(select 1 from public.learner_access where account_id=auth.uid() and role in ('self','learner')) then
  insert into public.learner_profiles values(auth.uid()::text,auth.uid(),left(coalesce(nullif(btrim(p_name),''),'Můj profil'),60),'self',now()) on conflict do nothing;
  insert into public.learner_access values(auth.uid(),auth.uid()::text,'self') on conflict do nothing;
 end if;
 -- Linked child accounts cannot turn their personal account into a guardian account.
 return coalesce((select jsonb_agg(to_jsonb(p)||jsonb_build_object('access',a.role) order by p.created_at,p.id)
 from public.learner_profiles p join public.learner_access a on a.learner_id=p.id
 where a.account_id=auth.uid() and (a.role='learner' or not exists(select 1 from public.learner_access c where c.account_id=auth.uid() and c.role='learner'))),'[]');
end $$;
create function public.add_child(p_name text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_id text:=gen_random_uuid()::text; v_profile public.learner_profiles;
begin
 if auth.uid() is null or exists(select 1 from public.learner_access where account_id=auth.uid() and role='learner') then raise exception 'Not authorized' using errcode='42501'; end if;
 if length(btrim(p_name)) not between 1 and 60 then raise exception 'Zadej jméno dítěte (1–60 znaků).'; end if;
 if (select count(*) from public.learner_access where account_id=auth.uid() and role='guardian')>=20 then raise exception 'Nejvýše 20 dětských profilů.'; end if;
 insert into public.learner_profiles values(v_id,auth.uid(),btrim(p_name),'child',now()) returning * into v_profile;
 insert into public.learner_access values(auth.uid(),v_id,'guardian');
 return to_jsonb(v_profile)||jsonb_build_object('access','guardian');
end $$;
create function public.rename_learner(p_learner_id text,p_name text) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.can_use_learner(p_learner_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 if length(btrim(p_name)) not between 1 and 60 then raise exception 'Zadej jméno (1–60 znaků).'; end if;
 update public.learner_profiles set name=btrim(p_name) where id=p_learner_id;
end $$;
revoke all on function public.rename_learner(text,text) from public,anon;
grant execute on function public.rename_learner(text,text) to authenticated;

-- Remove only the old account=learner checks, leaving every content constraint intact.
do $$ declare r record; begin
 for r in select conrelid::regclass t,conname from pg_constraint where contype='c' and conrelid in ('public.learning_words'::regclass,'public.learning_sessions'::regclass) and pg_get_constraintdef(oid) like '%learner_id%owner_id%' loop
  execute format('alter table %s drop constraint %I',r.t,r.conname);
 end loop;
end $$;
drop policy learning_words_read on public.learning_words;
drop policy learning_words_insert on public.learning_words;
drop policy learning_words_update on public.learning_words;
drop policy learning_sessions_read on public.learning_sessions;
drop policy learning_badges_read on public.learning_badges;
create policy learning_words_read on public.learning_words for select to authenticated using(public.can_use_learner(learner_id));
create policy learning_words_insert on public.learning_words for insert to authenticated with check(owner_id=public.learner_owner(learner_id));
create policy learning_words_update on public.learning_words for update to authenticated using(public.can_use_learner(learner_id)) with check(owner_id=public.learner_owner(learner_id));
create policy learning_sessions_read on public.learning_sessions for select to authenticated using(public.can_use_learner(learner_id));
create policy learning_badges_read on public.learning_badges for select to authenticated using(public.can_use_learner(learner_id));
create policy levels_family_read on public.user_levels for select to authenticated using(public.can_use_learner(user_id));

-- Adapt the already deployed canonical validator without replacing its reward logic.
do $$ declare v text; begin
 v:=pg_get_functiondef('public.complete_learning_session(jsonb)'::regprocedure);
 v:=replace(v,'if v_owner is null or v_learner is distinct from v_owner::text then', 'if v_owner is null or not public.can_use_learner(v_learner) then');
 v:=replace(v,'v_id:=(p_session->>''id'')::uuid;', 'v_owner:=public.learner_owner(v_learner); v_id:=(p_session->>''id'')::uuid;');
 v:=replace(v,'hashtextextended(v_owner::text,0)','hashtextextended(v_learner,0)');
 v:=replace(v,'where owner_id=v_owner and activity_date=', 'where owner_id=v_owner and learner_id=v_learner and activity_date=');
 execute v;
 foreach v in array array[pg_get_functiondef('public.get_learning_sessions(text)'::regprocedure),pg_get_functiondef('public.get_learning_badges(text)'::regprocedure)] loop
  v:=replace(v,'p_learner_id is distinct from auth.uid()::text','not public.can_use_learner(p_learner_id)');
  v:=replace(v,'owner_id=auth.uid() and learner_id=p_learner_id','owner_id=public.learner_owner(p_learner_id) and learner_id=p_learner_id');
  execute v;
 end loop;
end $$;

create table public.learning_drafts (
 learner_id text primary key references public.learner_profiles(id), revision bigint not null default 0,
 payload jsonb not null default '{}', updated_at timestamptz not null default now()
);
alter table public.learning_drafts enable row level security;
create policy drafts_read on public.learning_drafts for select to authenticated using(public.can_use_learner(learner_id));
grant select on public.learning_drafts to authenticated;
create function public.save_learning_draft(p_learner_id text,p_revision bigint,p_payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare v public.learning_drafts;
begin
 if not public.can_use_learner(p_learner_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 if pg_column_size(p_payload)>2000000 or jsonb_typeof(p_payload) is distinct from 'object' or jsonb_typeof(p_payload->'sessions') is distinct from 'array' or jsonb_typeof(p_payload->'preferences') is distinct from 'object' then raise exception 'Invalid draft'; end if;
 if exists(select 1 from jsonb_array_elements(p_payload->'sessions') s where s->>'learnerId' is distinct from p_learner_id or s->>'status'<>'active') then raise exception 'Invalid draft learner'; end if;
 perform pg_advisory_xact_lock(hashtextextended('draft:'||p_learner_id,0));
 insert into public.learning_drafts(learner_id) values(p_learner_id) on conflict do nothing;
 select * into v from public.learning_drafts where learner_id=p_learner_id for update;
 if v.revision<>p_revision then return jsonb_build_object('conflict',true,'revision',v.revision,'payload',v.payload); end if;
 update public.learning_drafts set revision=revision+1,payload=p_payload,updated_at=now() where learner_id=p_learner_id returning * into v;
 return jsonb_build_object('conflict',false,'revision',v.revision,'payload',v.payload);
end $$;

-- High entropy single-use codes. Accepting a code requests access; only a guardian approves it.
create table public.learner_invites (
 id uuid primary key default gen_random_uuid(), learner_id text not null references public.learner_profiles(id),
 code_hash text not null unique, expires_at timestamptz not null, issued_by uuid not null references auth.users(id),
 requested_by uuid references auth.users(id), requested_at timestamptz, approved_at timestamptz, revoked_at timestamptz,
 purpose text not null default 'learner' check(purpose in ('learner','guardian'))
);
create table public.learning_archives (
 learner_id text not null references public.learner_profiles(id), local_id text not null,
 payload jsonb not null, imported_at timestamptz not null default now(), primary key(learner_id,local_id)
);
alter table public.learning_archives enable row level security;
create policy archives_read on public.learning_archives for select to authenticated using(public.can_use_learner(learner_id));
grant select on public.learning_archives to authenticated;
create function public.import_local_history(p_learner_id text,p_local_id text,p_payload jsonb) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.can_use_learner(p_learner_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 if length(p_local_id) not between 1 and 100 or pg_column_size(p_payload)>10000000 or jsonb_typeof(p_payload)<>'object' then raise exception 'Invalid archive'; end if;
 insert into public.learning_archives values(p_learner_id,p_local_id,p_payload,now()) on conflict do nothing;
end $$;
revoke all on function public.import_local_history(text,text,jsonb) from public,anon;
grant execute on function public.import_local_history(text,text,jsonb) to authenticated;
create function public.get_learner_legacy(p_learner_id text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_table text;v_rows jsonb;v_result jsonb:='{}';begin
 if not public.can_use_learner(p_learner_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 foreach v_table in array array['math_statistics','spelling_statistics','math_answers','spelling_answers','dictionary_statistics','dictionary_answers'] loop
  if to_regclass('public.'||v_table) is not null then
   execute format('select coalesce(jsonb_agg(to_jsonb(t)),''[]''::jsonb) from public.%I t where user_id::text=$1',v_table) into v_rows using p_learner_id;
   v_result:=v_result||jsonb_build_object(v_table,v_rows);
  end if;
 end loop;return v_result;
end $$;
revoke all on function public.get_learner_legacy(text) from public,anon;
grant execute on function public.get_learner_legacy(text) to authenticated;
create function public.get_learner_words(p_learner_id text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not public.can_use_learner(p_learner_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 return coalesce((select jsonb_agg(to_jsonb(w)) from public.dictionary_words w where user_id::text=p_learner_id),'[]');
end $$;
revoke all on function public.get_learner_words(text) from public,anon;
grant execute on function public.get_learner_words(text) to authenticated;
alter table public.learner_invites enable row level security;
create policy invites_read on public.learner_invites for select to authenticated using(public.is_learner_guardian(learner_id) or requested_by=auth.uid() or (purpose='guardian' and issued_by=auth.uid()));
grant select on public.learner_invites to authenticated;
create function public.issue_learner_invite(p_learner_id text,p_purpose text default 'learner') returns jsonb language plpgsql security definer set search_path='' as $$
declare v_code text:=upper(substr(replace(gen_random_uuid()::text,'-',''),1,12)); v_id uuid;
begin
 if p_purpose not in ('learner','guardian') or not (public.is_learner_guardian(p_learner_id) or (p_purpose='guardian' and exists(select 1 from public.learner_access where account_id=auth.uid() and learner_id=p_learner_id and role='self'))) then raise exception 'Not authorized' using errcode='42501'; end if;
 update public.learner_invites set revoked_at=now() where learner_id=p_learner_id and purpose=p_purpose and requested_by is null and approved_at is null and revoked_at is null;
 insert into public.learner_invites(learner_id,code_hash,expires_at,issued_by,purpose) values(p_learner_id,md5(v_code),now()+interval '10 minutes',auth.uid(),p_purpose) returning id into v_id;
 return jsonb_build_object('id',v_id,'code',v_code,'expires_at',now()+interval '10 minutes');
end $$;
create function public.request_learner_access(p_code text,p_purpose text default 'learner') returns jsonb language plpgsql security definer set search_path='' as $$
declare v public.learner_invites;
begin
 if auth.uid() is null then raise exception 'Nejprve se přihlas.' using errcode='42501'; end if;
 select * into v from public.learner_invites where code_hash=md5(upper(regexp_replace(p_code,'[ -]','','g'))) for update;
 if v.id is null or v.expires_at<now() or v.revoked_at is not null or v.requested_by is not null then raise exception 'Kód neplatí nebo už byl použit.'; end if;
 if v.purpose is distinct from p_purpose then raise exception 'Tento kód patří jinému způsobu propojení.'; end if;
 if public.can_use_learner(v.learner_id) then raise exception 'Tento profil už máš připojený.'; end if;
 update public.learner_invites set requested_by=auth.uid(),requested_at=now() where id=v.id;
 return jsonb_build_object('id',v.id,'name',(select name from public.learner_profiles where id=v.learner_id));
end $$;
create function public.approve_learner_access(p_invite_id uuid,p_approve boolean) returns void language plpgsql security definer set search_path='' as $$
declare v public.learner_invites;
begin
 select * into v from public.learner_invites where id=p_invite_id for update;
 if not (coalesce(public.is_learner_guardian(v.learner_id),false) or (v.purpose='guardian' and v.issued_by=auth.uid() and exists(select 1 from public.learner_access where account_id=auth.uid() and learner_id=v.learner_id and role='self'))) then raise exception 'Not authorized' using errcode='42501'; end if;
 if v.requested_by is null or v.revoked_at is not null or v.approved_at is not null or v.requested_at<now()-interval '1 day' then raise exception 'Žádost už neplatí.'; end if;
 if p_approve then
  if v.purpose='guardian' and exists(select 1 from public.learner_access where account_id=v.requested_by and role='learner') then raise exception 'Dětský účet nemůže spravovat jiné profily.'; end if;
  insert into public.learner_access values(v.requested_by,v.learner_id,v.purpose) on conflict do nothing;
  if v.purpose='guardian' then update public.learner_profiles set kind='child' where id=v.learner_id; end if;
  update public.learner_invites set approved_at=now() where id=v.id;
 else update public.learner_invites set revoked_at=now() where id=v.id; end if;
end $$;
create function public.revoke_learner_access(p_learner_id text,p_account_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.is_learner_guardian(p_learner_id) then raise exception 'Not authorized' using errcode='42501'; end if;
 delete from public.learner_access where learner_id=p_learner_id and account_id=p_account_id and role='learner';
 update public.learner_invites set revoked_at=now() where learner_id=p_learner_id and requested_by=p_account_id;
end $$;

-- All privileged functions are authenticated-only. No metadata or browser role grants access.
revoke all on function public.can_use_learner(text),public.learner_owner(text),public.is_learner_guardian(text),public.my_learners(text),public.add_child(text),public.save_learning_draft(text,bigint,jsonb),public.issue_learner_invite(text,text),public.request_learner_access(text,text),public.approve_learner_access(uuid,boolean),public.revoke_learner_access(text,uuid) from public,anon;
grant execute on function public.can_use_learner(text),public.learner_owner(text),public.is_learner_guardian(text),public.my_learners(text),public.add_child(text),public.save_learning_draft(text,bigint,jsonb),public.issue_learner_invite(text,text),public.request_learner_access(text,text),public.approve_learner_access(uuid,boolean),public.revoke_learner_access(text,uuid) to authenticated;
commit;
