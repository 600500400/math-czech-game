-- Run in Supabase SQL Editor after the migration. All test writes roll back.
begin;
select set_config('procvicka.test.parent',(select id::text from auth.users order by id limit 1),true);
select set_config('procvicka.test.other',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data,is_anonymous) values(current_setting('procvicka.test.other')::uuid,'authenticated','authenticated','rollback-family-test@example.invalid','{}','{"full_name":"Rollback test","role":"child"}',true);
select set_config('procvicka.test.xp',(select sum(total_xp)::text from public.user_levels),true);
select set_config('request.jwt.claim.sub',current_setting('procvicka.test.parent'),true);
set local role authenticated;
do $$
declare c jsonb;s jsonb;t jsonb:='[]';a jsonb:='[]';task uuid;n int;result jsonb;invite jsonb;begin
 c:=public.add_child('Production rollback test');
 perform set_config('procvicka.test.child',c->>'id',true);
 for n in 1..5 loop
  task:=gen_random_uuid();
  t:=t||jsonb_build_array(jsonb_build_object('id',task,'subject','math','a',1,'b',n,'operation','+','expected',jsonb_build_array((n+1)::text)));
  a:=a||jsonb_build_array(jsonb_build_object('id',gen_random_uuid(),'taskId',task,'answer',(n+1)::text,'number',1,'usedHint',false,'answeredAt',now()));
 end loop;
 s:=jsonb_build_object('id',gen_random_uuid(),'learnerId',c->>'id','subject','math','contentVersion','learning-v2','title','Production rollback test','mode','typing','tasks',t,'attempts',a,'index',4,'phase','summary','status','completed','startedAt',now()-interval '1 minute','completedAt',now(),'xp',999999);
 result:=public.complete_learning_session(s);
 if (result->>'total_xp')::int<>75 then raise exception 'Unexpected initial XP: %',result;end if;
 if (public.complete_learning_session(s)->>'total_xp')::int<>75 then raise exception 'Replay awarded XP';end if;
 invite:=public.issue_learner_invite(c->>'id');
 perform set_config('procvicka.test.invite',invite->>'id',true);
 perform set_config('procvicka.test.code',invite->>'code',true);
 perform set_config('procvicka.test.session',s::text,true);
end $$;
select set_config('request.jwt.claim.sub',current_setting('procvicka.test.other'),true);
do $$ begin
 if jsonb_array_length(public.my_learners('Unpaired device'))<>0 then raise exception 'Unpaired device has profiles';end if;
 if exists(select 1 from public.user_levels) then raise exception 'Device leaked legacy levels';end if;
 if public.can_use_learner(current_setting('procvicka.test.child')) then raise exception 'Cross-family access';end if;
 if exists(select 1 from public.learning_sessions where learner_id=current_setting('procvicka.test.child')) then raise exception 'RLS leaked session';end if;
 perform public.request_learner_access(current_setting('procvicka.test.code'));
 if public.can_use_learner(current_setting('procvicka.test.child')) then raise exception 'Access before approval';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('procvicka.test.parent'),true);
select public.approve_learner_access(current_setting('procvicka.test.invite')::uuid,true);
select set_config('request.jwt.claim.sub',current_setting('procvicka.test.other'),true);
do $$ declare r jsonb;s jsonb;begin
 if not public.can_use_learner(current_setting('procvicka.test.child')) then raise exception 'Approved access missing';end if;
 if jsonb_array_length(public.get_learning_sessions(current_setting('procvicka.test.child')))<>1 then raise exception 'Shared history missing';end if;
 s:=current_setting('procvicka.test.session')::jsonb||jsonb_build_object('id',gen_random_uuid());
 if (public.complete_learning_session(s)->>'total_xp')::int<>80 then raise exception 'Duplicate task reward across accounts';end if;
 r:=public.save_learning_draft(current_setting('procvicka.test.child'),0,'{"sessions":[],"preferences":{"count":5}}');
 if (r->>'revision')::int<>1 then raise exception 'Draft not saved';end if;
 r:=public.save_learning_draft(current_setting('procvicka.test.child'),0,'{"sessions":[],"preferences":{"count":10}}');
 if not (r->>'conflict')::boolean then raise exception 'Concurrent write overwrote draft';end if;
end $$;
select set_config('request.jwt.claim.sub',current_setting('procvicka.test.parent'),true);
select public.revoke_learner_access(current_setting('procvicka.test.child'),current_setting('procvicka.test.other')::uuid);
select set_config('request.jwt.claim.sub',current_setting('procvicka.test.other'),true);
do $$ begin
 if public.can_use_learner(current_setting('procvicka.test.child')) then raise exception 'Revoke ineffective';end if;
 if exists(select 1 from public.learning_sessions where learner_id=current_setting('procvicka.test.child')) then raise exception 'Revoked RLS access';end if;
end $$;
reset role;
select 'PASSED: guardian approval, RLS isolation, shared history, replay, stable rewards, conflict detection, revocation; test writes rolled back' as family_verification;
rollback;
