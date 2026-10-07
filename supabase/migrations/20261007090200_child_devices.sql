-- Device authentication grants no learner access until an existing guardian approves pairing.
begin;
create or replace function public.can_use_learner(p_id text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.learner_access a join auth.users u on u.id=a.account_id
 where a.account_id=auth.uid() and a.learner_id=p_id and (not coalesce(u.is_anonymous,false) or a.role='learner'))
$$;
create or replace function public.my_learners(p_name text default 'Můj profil') returns jsonb language plpgsql security definer set search_path='' as $$
declare v_device boolean;begin
 if auth.uid() is null then raise exception 'Not authorized' using errcode='42501'; end if;
 select coalesce(is_anonymous,false) into v_device from auth.users where id=auth.uid();
 if v_device and not exists(select 1 from public.learner_access where account_id=auth.uid() and role='learner') then return '[]'; end if;
 if not v_device and not exists(select 1 from public.learner_access where account_id=auth.uid() and role in ('self','learner')) then
  insert into public.learner_profiles values(auth.uid()::text,auth.uid(),left(coalesce(nullif(btrim(p_name),''),'Můj profil'),60),'self',now()) on conflict do nothing;
  insert into public.learner_access values(auth.uid(),auth.uid()::text,'self') on conflict do nothing;
 end if;
 return coalesce((select jsonb_agg(to_jsonb(p)||jsonb_build_object('access',a.role) order by p.created_at,p.id)
 from public.learner_profiles p join public.learner_access a on a.learner_id=p.id where a.account_id=auth.uid()
 and (a.role='learner' or not exists(select 1 from public.learner_access c where c.account_id=auth.uid() and c.role='learner'))),'[]');
end $$;
do $$ declare v text;begin
 v:=pg_get_functiondef('public.add_child(text)'::regprocedure);
 v:=replace(v,'if auth.uid() is null or exists(', 'if auth.uid() is null or exists(select 1 from auth.users where id=auth.uid() and is_anonymous=true) or exists(');
 execute v;
 v:=pg_get_functiondef('public.approve_learner_access(uuid,boolean)'::regprocedure);
 v:=replace(v, 'if v.purpose=''guardian'' and exists(', 'if v.purpose=''guardian'' and (exists(select 1 from auth.users where id=v.requested_by and is_anonymous=true) or exists(');
 v:=replace(v, 'where account_id=v.requested_by and role=''learner'') then', 'where account_id=v.requested_by and role=''learner'')) then');
 v:=replace(v, 'insert into public.learner_access values(v.requested_by,v.learner_id,v.purpose)', 'if v.purpose=''learner'' and exists(select 1 from public.learner_access where account_id=v.requested_by and role=''learner'' and learner_id<>v.learner_id) then raise exception ''Zařízení už je připojené k jinému dítěti. Nejprve odeber jeho původní přístup.''; end if; insert into public.learner_access values(v.requested_by,v.learner_id,v.purpose)');
 execute v;
end $$;

-- Legacy permissive policies must not expose data to device or unrelated accounts.
do $$ declare v_table text;begin
 foreach v_table in array array['user_levels','user_streaks','user_achievements','math_statistics','spelling_statistics','math_answers','spelling_answers','dictionary_statistics','dictionary_answers'] loop
  if to_regclass('public.'||v_table) is not null then
   execute format('alter table public.%I enable row level security',v_table);
   execute format('create policy family_private_read on public.%I as restrictive for select to authenticated using(public.can_use_learner(user_id::text))',v_table);
   execute format('create policy family_no_public_read on public.%I as restrictive for select to anon using(false)',v_table);
   execute format('revoke insert,update,delete on public.%I from anon,authenticated',v_table);
  end if;
 end loop;
end $$;
commit;
