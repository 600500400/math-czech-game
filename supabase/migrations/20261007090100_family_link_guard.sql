-- Do not hide an existing student's history by pairing their account to a second learner.
begin;
create or replace function public.request_learner_access(p_code text,p_purpose text default 'learner') returns jsonb language plpgsql security definer set search_path='' as $$
declare v public.learner_invites;
begin
 if auth.uid() is null then raise exception 'Nejprve se přihlas.' using errcode='42501'; end if;
 select * into v from public.learner_invites where code_hash=md5(upper(regexp_replace(p_code,'[ -]','','g'))) for update;
 if v.id is null or v.expires_at<now() or v.revoked_at is not null or v.requested_by is not null then raise exception 'Kód neplatí nebo už byl použit.'; end if;
 if v.purpose is distinct from p_purpose then raise exception 'Tento kód patří jinému způsobu propojení.'; end if;
 if public.can_use_learner(v.learner_id) then raise exception 'Tento profil už máš připojený.'; end if;
 if v.purpose='learner' and (
  exists(select 1 from public.learning_sessions where learner_id=auth.uid()::text)
  or exists(select 1 from public.user_levels where user_id=auth.uid()::text and total_xp>0)
  or exists(select 1 from public.dictionary_words where user_id::text=auth.uid()::text and is_user_created=true)
  or exists(select 1 from public.learning_words where learner_id=auth.uid()::text and updated_at>'2026-10-01T00:00:00Z')
 ) then raise exception 'Tento účet už má vlastní výsledky nebo slovník. V jeho Profilu zvol Propojit tento profil s rodičem. Rodič pak připojí původní profil bez rozdělení historie.'; end if;
 update public.learner_invites set requested_by=auth.uid(),requested_at=now() where id=v.id;
 return jsonb_build_object('id',v.id,'name',(select name from public.learner_profiles where id=v.learner_id));
end $$;
commit;
