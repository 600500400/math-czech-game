-- Additive learning model. Old answers, words and total XP remain intact.
begin;
create table public.learning_content (
  content_id text primary key, subject text not null check(subject in ('spelling','english')),
  payload jsonb not null
);
create table public.learning_words (
  owner_id uuid not null references auth.users(id) on delete cascade,
  learner_id text not null, content_id text not null, payload jsonb not null,
  updated_at timestamptz not null default now(), primary key(owner_id,learner_id,content_id),
  check(learner_id=owner_id::text), check(payload->>'id'=content_id),
  check(payload->>'source'='personal'),
  check(length(payload->>'english') between 1 and 200),
  check(length(payload->>'czech') between 1 and 500),
  check(jsonb_typeof(payload->'accepted')='array')
);
create table public.learning_sessions (
  owner_id uuid not null references auth.users(id) on delete cascade,
  learner_id text not null, session_id uuid not null,
  subject text not null check(subject in ('math','spelling','english')),
  activity_date date not null, completed_at timestamptz not null,
  payload jsonb not null, xp integer not null check(xp>=0),
  primary key(owner_id,learner_id,session_id), check(learner_id=owner_id::text)
);
create index learning_sessions_history on public.learning_sessions(owner_id,learner_id,completed_at desc);
create table public.learning_daily_rewards (
  owner_id uuid not null, learner_id text not null, activity_date date not null,
  task_key text not null, primary key(owner_id,learner_id,activity_date,task_key)
);
create table public.learning_badges (
  owner_id uuid not null, learner_id text not null, badge_id text not null,
  awarded_at timestamptz not null, primary key(owner_id,learner_id,badge_id)
);
alter table public.learning_content enable row level security;
alter table public.learning_words enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.learning_daily_rewards enable row level security;
alter table public.learning_badges enable row level security;
create policy learning_content_read on public.learning_content for select using(true);
create policy learning_words_read on public.learning_words for select to authenticated using(owner_id=auth.uid());
create policy learning_words_insert on public.learning_words for insert to authenticated with check(owner_id=auth.uid() and learner_id=auth.uid()::text);
create policy learning_words_update on public.learning_words for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid() and learner_id=auth.uid()::text);
create policy learning_sessions_read on public.learning_sessions for select to authenticated using(owner_id=auth.uid());
create policy learning_badges_read on public.learning_badges for select to authenticated using(owner_id=auth.uid());
grant select on public.learning_content to anon,authenticated;
grant select,insert,update on public.learning_words to authenticated;
grant select on public.learning_sessions,public.learning_badges to authenticated;
revoke all on public.learning_daily_rewards from anon,authenticated;

-- A stale device cannot overwrite a newer dictionary edit during outbox replay.
create function public.learning_keep_newer_word() returns trigger language plpgsql set search_path='' as $$
begin
  if new.updated_at <= old.updated_at then return old; end if;
  return new;
end $$;
create trigger learning_word_timestamp before update on public.learning_words for each row execute function public.learning_keep_newer_word();

create function public.get_learning_sessions(p_learner_id text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null or p_learner_id is distinct from auth.uid()::text then raise exception 'Not authorized' using errcode='42501'; end if;
  return coalesce((select jsonb_agg(payload order by completed_at desc) from public.learning_sessions where owner_id=auth.uid() and learner_id=p_learner_id),'[]'::jsonb);
end $$;
create function public.get_learning_badges(p_learner_id text) returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null or p_learner_id is distinct from auth.uid()::text then raise exception 'Not authorized' using errcode='42501'; end if;
  return coalesce((select jsonb_object_agg(badge_id,to_char(awarded_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) from public.learning_badges where owner_id=auth.uid() and learner_id=p_learner_id),'{}'::jsonb);
end $$;
create function public.learning_normalize(value text) returns text language sql immutable set search_path='' as $$
  select lower(regexp_replace(btrim(normalize(value,NFC)),'\s+',' ','g'));
$$;
create or replace function public.calculate_xp_for_level(level_num integer) returns integer language sql immutable set search_path='' as $$
  select case when level_num<=1 then 0 else level_num*150-50 end;
$$;

create function public.complete_learning_session(p_session jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare
  v_owner uuid:=auth.uid(); v_learner text:=p_session->>'learnerId'; v_id uuid;
  v_subject text:=p_session->>'subject'; v_status text:=p_session->>'status';
  v_completed timestamptz; v_started timestamptz; v_day date; v_total integer; v_level integer;
  v_task jsonb; v_canonical jsonb; v_word jsonb; v_attempt jsonb; v_tasks jsonb:='[]'; v_attempts jsonb:='[]';
  v_first jsonb; v_correct boolean; v_any boolean:=false; v_repaired boolean:=false; v_xp integer:=0;
  v_key text; v_task_id text; v_task_ids text[]:='{}'; v_attempt_ids text[]:='{}'; v_seen text[]:='{}';
  v_expected jsonb; v_number integer; v_a integer; v_b integer; v_result integer; v_op text; v_inserted integer;
  v_existing jsonb; v_badge text; v_bonus integer; v_badges jsonb; v_valid jsonb; v_answer text; v_at timestamptz;
begin
  if v_owner is null or v_learner is distinct from v_owner::text then raise exception 'Not authorized' using errcode='42501'; end if;
  v_id:=(p_session->>'id')::uuid;
  -- Serialize both first-row creation and completion/achievement awards per account.
  perform pg_advisory_xact_lock(hashtextextended(v_owner::text,0));
  select payload into v_existing from public.learning_sessions where owner_id=v_owner and learner_id=v_learner and session_id=v_id;
  if v_existing is not null then
    select total_xp into v_total from public.user_levels where user_id=v_learner;
    return jsonb_build_object('session',v_existing,'total_xp',coalesce(v_total,0),'badges',public.get_learning_badges(v_learner));
  end if;
  if p_session->>'contentVersion' is distinct from 'learning-v2' or coalesce(v_subject,'') not in ('math','spelling','english') or coalesce(v_status,'') not in ('completed','interrupted') or coalesce(p_session->>'mode','') not in ('typing','cards') or (p_session->>'mode'='cards' and v_subject<>'english') then raise exception 'Invalid lesson'; end if;
  if jsonb_typeof(p_session->'tasks') is distinct from 'array' or jsonb_array_length(p_session->'tasks') not between 1 and 20 or jsonb_typeof(p_session->'attempts') is distinct from 'array' or jsonb_array_length(p_session->'attempts')>100 then raise exception 'Invalid lesson size'; end if;
  v_started:=(p_session->>'startedAt')::timestamptz; v_completed:=(p_session->>'completedAt')::timestamptz;
  if v_started is null or v_completed is null or v_started>v_completed or v_completed>now()+interval '5 minutes' or v_started<now()-interval '90 days' then raise exception 'Invalid lesson dates'; end if;
  v_day:=(v_completed at time zone 'Europe/Prague')::date;
  for v_task in select value from jsonb_array_elements(p_session->'tasks') loop
    v_task_id:=v_task->>'id'; perform v_task_id::uuid;
    if v_task_id=any(v_task_ids) or v_task->>'subject'<>v_subject then raise exception 'Invalid task identity'; end if;
    v_task_ids:=array_append(v_task_ids,v_task_id);
    if v_subject='math' then
      v_a:=(v_task->>'a')::integer; v_b:=(v_task->>'b')::integer; v_op:=v_task->>'operation';
      if v_a is null or v_b is null or v_op is null or v_op not in ('+','-','*','/') or v_a<0 or v_b<0 then raise exception 'Invalid operands'; end if;
      if v_op in ('+','-') and (v_a>100 or v_b>100 or (v_op='+' and v_a+v_b>100) or (v_op='-' and v_b>v_a)) then raise exception 'Invalid arithmetic bounds'; end if;
      if v_op='*' and (v_a>12 or v_b>12) then raise exception 'Invalid multiplication'; end if;
      if v_op='/' and (v_b=0 or v_b>12 or v_a>144 or v_a%v_b<>0 or v_a/v_b>12) then raise exception 'Invalid division'; end if;
      v_result:=case v_op when '+' then v_a+v_b when '-' then v_a-v_b when '*' then v_a*v_b else v_a/v_b end;
      v_key:='math:'||v_op||':'||v_a||':'||v_b; v_expected:=jsonb_build_array(v_result::text);
      v_task:=v_task||jsonb_build_object('key',v_key,'contentId',v_key,'result',v_result,'expected',v_expected);
    elsif v_subject='spelling' then
      select payload into v_canonical from public.learning_content where content_id=v_task->>'contentId' and subject='spelling';
      if v_canonical is null then raise exception 'Unknown spelling task'; end if;
      v_task:=v_task||v_canonical; v_key:=v_task->>'key'; v_expected:=v_task->'expected';
    else
      select payload into v_word from public.learning_content where content_id=v_task->>'contentId' and subject='english';
      if v_word is null then select payload into v_word from public.learning_words where owner_id=v_owner and learner_id=v_learner and content_id=v_task->>'contentId'; end if;
      if v_word is null or v_task->>'direction' not in ('en_to_cz','cz_to_en') then raise exception 'Unknown word or direction'; end if;
      v_expected:=case when v_task->>'direction'='en_to_cz' then v_word->'accepted' else jsonb_build_array(v_word->>'english') end;
      v_key:='english:'||(v_word->>'id')||':'||(v_task->>'direction');
      v_task:=v_task||jsonb_build_object('key',v_key,'word',v_word,'expected',v_expected);
    end if;
    v_tasks:=v_tasks||jsonb_build_array(v_task); v_number:=0; v_first:=null; v_correct:=false;
    for v_attempt in select value from jsonb_array_elements(p_session->'attempts') where value->>'taskId'=v_task_id loop
      v_number:=v_number+1;
      perform (v_attempt->>'id')::uuid;
      if (v_attempt->>'id')=any(v_attempt_ids) or (v_attempt->>'number')::integer<>v_number or jsonb_typeof(v_attempt->'usedHint')<>'boolean' or length(v_attempt->>'answer') not between 1 and 500 then raise exception 'Invalid attempt'; end if;
      v_at:=(v_attempt->>'answeredAt')::timestamptz;
      if v_at is null or v_at<v_started or v_at>v_completed then raise exception 'Invalid attempt date'; end if;
      v_attempt_ids:=array_append(v_attempt_ids,v_attempt->>'id'); v_answer:=v_attempt->>'answer';
      if p_session->>'mode'='cards' then
        if v_attempt->>'assessment'<>'self' then raise exception 'Invalid self assessment'; end if;
        v_correct:=coalesce((v_attempt->>'isCorrect')::boolean,false);
      else
        v_correct:=exists(select 1 from jsonb_array_elements_text(v_expected) expected where public.learning_normalize(expected)=public.learning_normalize(v_answer));
        if v_subject='math' then v_correct:=case when v_answer~'^\s*[0-9]+\s*$' then btrim(v_answer)::numeric=v_result else false end; end if;
      end if;
      v_attempt:=v_attempt||jsonb_build_object('isCorrect',v_correct,'usedHint',(v_attempt->>'usedHint')::boolean or v_number>1,'assessment',case when p_session->>'mode'='cards' then 'self' else 'verified' end);
      if v_number=1 then v_first:=v_attempt; elsif v_correct and not (v_first->>'isCorrect')::boolean then v_repaired:=true; end if;
      v_attempts:=v_attempts||jsonb_build_array(v_attempt);
      if v_correct then v_any:=true; end if;
    end loop;
    if v_status='completed' and v_number=0 then raise exception 'Unanswered completed task'; end if;
    if v_first is not null and not v_key=any(v_seen) and exists(select 1 from jsonb_array_elements(v_attempts) a where a->>'taskId'=v_task_id and (a->>'isCorrect')::boolean) then
      insert into public.learning_daily_rewards values(v_owner,v_learner,v_day,v_key) on conflict do nothing;
      get diagnostics v_inserted=row_count;
      if v_inserted=1 then v_xp:=v_xp+case when (v_first->>'isCorrect')::boolean and not (v_first->>'usedHint')::boolean and p_session->>'mode'<>'cards' then 10 else 3 end; end if;
    end if;
    v_seen:=array_append(v_seen,v_key);
  end loop;
  if jsonb_array_length(v_attempts)<>jsonb_array_length(p_session->'attempts') then raise exception 'Attempt references an unknown task'; end if;
  if v_status='completed' and jsonb_array_length(v_tasks)>=5 and v_any and (select count(*) from public.learning_sessions where owner_id=v_owner and learner_id=v_learner and activity_date=v_day and subject=v_subject and payload->>'status'='completed')<2 then v_xp:=v_xp+5; end if;
  for v_badge,v_bonus in select * from (values('first-lesson',20),('back-again',10),('steady-three',25),('english-first',10)) b(id,xp) loop
    if (v_badge='first-lesson' and v_status='completed' and jsonb_array_length(v_tasks)>=5 and v_any)
      or (v_badge='back-again' and v_repaired)
      or (v_badge='english-first' and v_subject='english' and v_status='completed' and jsonb_array_length(v_tasks)>=5 and v_any)
      or (v_badge='steady-three' and v_any and exists(select 1 from public.learning_sessions where owner_id=v_owner and activity_date=v_day-1 and jsonb_array_length(payload->'attempts')>0) and exists(select 1 from public.learning_sessions where owner_id=v_owner and activity_date=v_day-2 and jsonb_array_length(payload->'attempts')>0)) then
      insert into public.learning_badges values(v_owner,v_learner,v_badge,v_completed) on conflict do nothing;
      get diagnostics v_inserted=row_count; if v_inserted=1 then v_xp:=v_xp+v_bonus; end if;
    end if;
  end loop;
  v_valid:=p_session||jsonb_build_object('tasks',v_tasks,'attempts',v_attempts,'xp',v_xp,'activityDate',v_day::text,'sync','synced','phase','summary');
  insert into public.learning_sessions values(v_owner,v_learner,v_id,v_subject,v_day,v_completed,v_valid,v_xp);
  insert into public.user_levels(user_id,total_xp,current_level,xp_to_next_level) values(v_learner,0,1,250) on conflict(user_id) do nothing;
  update public.user_levels set total_xp=total_xp+v_xp,updated_at=now() where user_id=v_learner returning total_xp into v_total;
  v_level:=case when v_total<250 then 1 else (v_total+50)/150 end;
  update public.user_levels set current_level=v_level,xp_to_next_level=public.calculate_xp_for_level(v_level+1)-v_total where user_id=v_learner;
  v_badges:=public.get_learning_badges(v_learner);
  return jsonb_build_object('session',v_valid,'total_xp',v_total,'badges',v_badges);
end $$;

revoke all on function public.complete_learning_session(jsonb),public.get_learning_sessions(text),public.get_learning_badges(text) from public,anon;
grant execute on function public.complete_learning_session(jsonb),public.get_learning_sessions(text),public.get_learning_badges(text) to authenticated;
-- Remove the old arbitrary-XP endpoint and permissive dictionary policies.
revoke execute on function public.update_user_level(text,integer) from public,anon,authenticated;
do $$ declare p record; begin
  for p in select tablename,policyname from pg_policies where schemaname='public' and (tablename='dictionary_words' or (tablename in ('user_levels','user_streaks','user_achievements') and cmd<>'SELECT')) loop
    execute format('drop policy %I on public.%I',p.policyname,p.tablename);
  end loop;
end $$;
create policy dictionary_words_read_v2 on public.dictionary_words for select using(is_user_created=false or user_id=auth.uid()::text);
create policy dictionary_words_insert_v2 on public.dictionary_words for insert to authenticated with check(user_id=auth.uid()::text and is_user_created=true);
create policy dictionary_words_update_v2 on public.dictionary_words for update to authenticated using(user_id=auth.uid()::text and is_user_created=true) with check(user_id=auth.uid()::text and is_user_created=true);
create policy dictionary_words_delete_v2 on public.dictionary_words for delete to authenticated using(user_id=auth.uid()::text and is_user_created=true);
revoke insert,update,delete on public.user_levels,public.user_streaks,public.user_achievements from anon,authenticated;
update public.user_levels set current_level=case when total_xp<250 then 1 else (total_xp+50)/150 end;
update public.user_levels set xp_to_next_level=public.calculate_xp_for_level(current_level+1)-total_xp;
commit;
