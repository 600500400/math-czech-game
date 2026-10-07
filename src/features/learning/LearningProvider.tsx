import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate,useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { LearningContext } from './context';
import { reduceLesson } from './session';
import { calendarDay, lessonXp, updateReviews, rebuildReviews } from './rewards';
import { badgeDefinitions, newBadges } from './badges';
import { dictionaryWords, personalWords, translationVariants } from './dictionary';
import { learningCloud } from './cloud';
import { useFamily } from './family-context';
import { downloadText, legacyLocalResults, mergeSessions, parseLearningData, readLearningData, storageKey, validSession } from './storage';
import type { LearningData, LearningWord, LessonAction, LessonSession, Preferences } from './types';

export function LearningProvider({ children }: { children: ReactNode }) {
  const { authState } = useAuth();
  const location=useLocation();
  const family = useFamily();
  const learnerId = family.active?.id || authState.user?.id || 'host';
  const cloud = authState.mode === 'cloud';
  if(cloud && !family.active && location.pathname==='/auth')return <ProfileLearningProvider key={`pair:${learnerId}`} learnerId={learnerId} ownerId={learnerId} cloud={false}>{children}</ProfileLearningProvider>;
  if(cloud && !family.active && !family.loading && !family.error)return <Navigate to="/auth" replace/>;
  if(cloud && (family.loading || !family.active)) return <div className="learning-app"><main className="learn-main"><p role="status">{family.error||'Načítáme cloudový profil…'}</p>{family.error&&<button onClick={()=>void family.refresh()}>Zkusit znovu</button>}</main></div>;
  return <ProfileLearningProvider key={storageKey(learnerId, cloud)} learnerId={learnerId} ownerId={family.active?.owner_id || learnerId} cloud={cloud}>{children}</ProfileLearningProvider>;
}

function ProfileLearningProvider({ learnerId, ownerId, cloud, children }: { learnerId: string; ownerId:string; cloud: boolean; children: ReactNode }) {
  const key = storageKey(learnerId, cloud);
  const initial = useRef(readLearningData(key));
  const [data, setData] = useState(initial.current.data);
  const current = useRef(data);
  const [storageError, setStorageError] = useState<string | null>(initial.current.error);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncNotice,setSyncNotice] = useState<string|null>(null);
  const [syncing, setSyncing] = useState(false);
  const busy = useRef(false);
  const needsSync = useRef(false);
  const alive = useRef(true);
  const hydrated = useRef(!cloud||!navigator.onLine);
  const revision = useRef(Number(localStorage.getItem(`${key}:revision`) || 0));
  const draftDirty = useRef(localStorage.getItem(`${key}:dirty`) === 'true');
  const generation = useRef(0);
  const [conflict,setConflict] = useState<{revision:number;payload:Json}|null>(null);
  const conflictRef = useRef<typeof conflict>(null);

  const commit = useCallback((next: LearningData, edit = true) => {
    // Persist before notifying React. Repeated button events see the new phase
    // immediately, even before React renders the disabled answer controls.
    try {
      if (initial.current.error) {
        localStorage.setItem(`${key}:recovery:${Date.now()}`, localStorage.getItem(key) || '');
        initial.current.error = null;
      }
      localStorage.setItem(key, JSON.stringify(next));
      if(cloud && edit) { draftDirty.current=true;generation.current++;localStorage.setItem(`${key}:dirty`,'true'); }
      setStorageError(null);
    } catch { setStorageError('Výsledky se teď nepodařilo uložit na zařízení. Stáhni si zálohu, než stránku zavřeš.'); }
    current.current = next;
    if (alive.current) setData(next);
  }, [key,cloud]);

  const retrySync = useCallback(async () => {
    if (!cloud || !hydrated.current || !navigator.onLine) return;
    if (busy.current) { needsSync.current = true; return; }
    needsSync.current = false;
    let succeeded = false;
    busy.current = true; setSyncing(true);
    try {
      const { data: auth } = await supabase.auth.getSession();
      const owner = auth.session?.user.id;
      if (!owner) throw new Error('Přihlášení vypršelo. Přihlas se znovu; výsledky jsou zachované na zařízení.');
      const words = dictionaryWords(current.current.words).filter(w => w.source === 'personal');
      const { error: wordError } = await learningCloud.from('learning_words').upsert(words.map(w => ({ owner_id: ownerId, learner_id: learnerId, content_id: w.id, payload: w as unknown as Json, updated_at: w.updatedAt || '2026-10-01T00:00:00.000Z' })), { onConflict: 'owner_id,learner_id,content_id' });
      if (wordError) throw wordError;
      const pending = current.current.sessions.filter(s => s.sync === 'pending' && s.status !== 'active').sort((a,b) => a.startedAt.localeCompare(b.startedAt));
      for (const session of pending) {
        const { data: response, error } = await learningCloud.rpc('complete_learning_session', { p_session: session as unknown as Json });
        if (error) throw error;
        const result = response as unknown as { session: LessonSession; total_xp: number; badges: Record<string,string> };
        if (!result?.session || !validSession(result.session) || !Number.isFinite(result.total_xp)) throw new Error('Uložení zatím nebylo potvrzeno.');
        const attemptSignature=(s:LessonSession)=>JSON.stringify(s.attempts.map(a=>[a.id,a.taskId,a.answer,a.answeredAt]));
        if(attemptSignature(session)!==attemptSignature(result.session)){
          const {error:archiveError}=await learningCloud.rpc('import_local_history',{p_learner_id:learnerId,p_local_id:`conflict-${session.id}-${session.attempts[session.attempts.length-1]?.id||'empty'}`,p_payload:{version:2,sessions:[{...session,xp:0}],words:{},baseXp:0,badges:{},reviews:{},preferences:current.current.preferences,legacy:{originalSession:session},reason:'concurrent_completion'} as unknown as Json});
          if(archiveError)throw archiveError;
          setSyncNotice('Tato lekce už byla dokončena na jiném zařízení. Obě sady odpovědí jsou zachované; další pokusy najdeš v přenesené historii. XP se nepřičítají dvakrát.');
        }
        const sessions = mergeSessions(current.current.sessions, [{ ...result.session, sync: 'synced' }]);
        const syncedXp = sessions.filter(s => s.sync === 'synced').reduce((sum,s) => sum + s.xp, 0);
        commit({ ...current.current, sessions, baseXp: Math.max(0, result.total_xp - syncedXp), badges: { ...current.current.badges, ...result.badges } });
      }
      if(draftDirty.current && !conflictRef.current) {
        const sentGeneration=generation.current;
        const payload={sessions:current.current.sessions.filter(s=>s.status==='active'),preferences:current.current.preferences} as unknown as Json;
        const {data:response,error}=await learningCloud.rpc('save_learning_draft',{p_learner_id:learnerId,p_revision:revision.current,p_payload:payload});
        if(error)throw error;
        const result=response as unknown as {conflict:boolean;revision:number;payload:Json};
        if(result.conflict){conflictRef.current=result;setConflict(result);}
        else {revision.current=result.revision;localStorage.setItem(`${key}:revision`,String(result.revision));if(generation.current===sentGeneration){draftDirty.current=false;localStorage.setItem(`${key}:dirty`,'false');}else needsSync.current=true;}
      }
      setSyncError(null);
      succeeded = true;
    } catch { if (alive.current) setSyncError('Výsledky jsou na zařízení. Do účtu se je zatím nepodařilo uložit; zkus synchronizaci znovu.'); }
    finally { busy.current = false; if (alive.current) { setSyncing(false); if (succeeded && needsSync.current) queueMicrotask(() => void retrySync()); } }
  }, [cloud, learnerId, ownerId, key, commit]);

  useEffect(() => {
    alive.current = true;
    if (cloud) {
      void (async () => {
        const results = await Promise.allSettled([
          learningCloud.rpc('get_learning_sessions', { p_learner_id: learnerId }),
          learningCloud.from('learning_words').select('*').eq('learner_id', learnerId),
          supabase.from('user_levels').select('total_xp').eq('user_id', learnerId).maybeSingle(),
          learningCloud.rpc('get_learner_words',{p_learner_id:learnerId}),
          learningCloud.rpc('get_learning_badges', { p_learner_id: learnerId }),
          learningCloud.from('learning_drafts').select('*').eq('learner_id',learnerId).maybeSingle(),
        ]);
        if (!alive.current) return;
        const [sessionResult, wordResult, xpResult, legacyResult, badgeResult, draftResult] = results;
        if(sessionResult.status==='rejected'||sessionResult.value.error||draftResult.status==='rejected'||draftResult.value.error){setSyncError('Cloud se nepodařilo načíst. Obnov stránku po návratu připojení; místní záznamy zůstávají zachované.');return;}
        const next = { ...current.current, words: { ...current.current.words } };
        if (legacyResult.status === 'fulfilled' && !legacyResult.value.error) {
          for (const w of (legacyResult.value.data || []) as unknown as {id:string;english_word:string;czech_translation:string;updated_at:string}[]) {
            const id = personalWords.find(t => t.english.toLocaleLowerCase('en') === w.english_word.toLocaleLowerCase('en'))?.id || w.id;
            if (!next.words[id]) next.words[id] = { id, english: w.english_word, czech: w.czech_translation, accepted: translationVariants(w.czech_translation), category: 'Můj slovník', source: 'personal', updatedAt: w.updated_at };
          }
        }
        if (wordResult.status === 'fulfilled' && !wordResult.value.error) {
          for (const row of wordResult.value.data || []) {
            const word = row.payload as unknown as LearningWord;
            if (!word?.id || !Array.isArray(word.accepted)) continue;
            if (!next.words[word.id] || (word.updatedAt || '') > (next.words[word.id].updatedAt || '')) next.words[word.id] = word;
          }
        }
        if (sessionResult.status === 'fulfilled' && !sessionResult.value.error && Array.isArray(sessionResult.value.data)) next.sessions = mergeSessions(next.sessions, (sessionResult.value.data as unknown[]).filter(validSession));
        if (xpResult.status === 'fulfilled' && !xpResult.value.error && xpResult.value.data) next.baseXp = Math.max(0, xpResult.value.data.total_xp - next.sessions.filter(s => s.sync === 'synced').reduce((sum,s) => sum+s.xp,0));
        if (badgeResult.status === 'fulfilled' && !badgeResult.value.error && badgeResult.value.data && typeof badgeResult.value.data === 'object') next.badges = { ...next.badges, ...(badgeResult.value.data as Record<string,string>) };
        next.reviews = rebuildReviews(next.sessions);
        if(draftResult.status==='fulfilled'&&draftResult.value.data){
          const remote=draftResult.value.data;
          if(draftDirty.current && revision.current!==remote.revision){conflictRef.current={revision:remote.revision,payload:remote.payload};setConflict(conflictRef.current);}
          else if(!draftDirty.current){
            const draft=remote.payload as unknown as {sessions?:LessonSession[];preferences?:Preferences};
            next.sessions=[...next.sessions.filter(s=>s.status!=='active'),...(draft.sessions||[]).filter(validSession).filter(s=>s.learnerId===learnerId&&s.status==='active'&&!next.sessions.some(t=>t.id===s.id&&t.status!=='active'))];
            if(draft.preferences)next.preferences={...next.preferences,...draft.preferences};
            revision.current=remote.revision;localStorage.setItem(`${key}:revision`,String(remote.revision));
          }
        }
        else if(next.sessions.some(s=>s.status==='active')&&!draftDirty.current){draftDirty.current=true;localStorage.setItem(`${key}:dirty`,'true');}
        commit(next,false);
        hydrated.current = true;
        void retrySync();
      })();
    }
    const online = () => { void retrySync(); };
    window.addEventListener('online', online);
    return () => { alive.current = false; window.removeEventListener('online', online); };
  }, [cloud, learnerId, key, commit, retrySync]);

  useEffect(()=>{if(!cloud)return;const timer=window.setTimeout(()=>{void retrySync();},700);return()=>window.clearTimeout(timer);},[data,cloud,retrySync]);
  useEffect(()=>{
    if(!cloud)return;
    let refreshing=false;
    const refresh=async()=>{
      if(refreshing||busy.current||draftDirty.current||conflictRef.current||!hydrated.current||!navigator.onLine||document.hidden)return;
      refreshing=true;
      try {
        const [history,level,draft,words,badges]=await Promise.all([
          learningCloud.rpc('get_learning_sessions',{p_learner_id:learnerId}),
          supabase.from('user_levels').select('total_xp').eq('user_id',learnerId).maybeSingle(),
          learningCloud.from('learning_drafts').select('*').eq('learner_id',learnerId).maybeSingle(),
          learningCloud.from('learning_words').select('*').eq('learner_id',learnerId),
          learningCloud.rpc('get_learning_badges',{p_learner_id:learnerId}),
        ]);
        if(!alive.current||draftDirty.current||busy.current||history.error||level.error||draft.error||words.error||badges.error)return;
        const next={...current.current,words:{...current.current.words}};
        next.sessions=mergeSessions(next.sessions,(history.data as unknown[]).filter(validSession));
        if(draft.data&&draft.data.revision>revision.current){const payload=draft.data.payload as unknown as {sessions?:LessonSession[];preferences?:Preferences};next.sessions=[...next.sessions.filter(s=>s.status!=='active'),...(payload.sessions||[]).filter(validSession).filter(s=>s.learnerId===learnerId&&s.status==='active'&&!next.sessions.some(t=>t.id===s.id&&t.status!=='active'))];next.preferences={...next.preferences,...payload.preferences};revision.current=draft.data.revision;localStorage.setItem(`${key}:revision`,String(revision.current));}
        for(const row of words.data||[]){const word=row.payload as unknown as LearningWord;if(word?.id&&Array.isArray(word.accepted)&&(!next.words[word.id]||(word.updatedAt||'')>(next.words[word.id].updatedAt||'')))next.words[word.id]=word;}
        if(level.data)next.baseXp=Math.max(0,level.data.total_xp-next.sessions.filter(s=>s.sync==='synced').reduce((sum,s)=>sum+s.xp,0));
        next.badges={...next.badges,...badges.data as Record<string,string>};next.reviews=rebuildReviews(next.sessions);commit(next,false);
      } finally {refreshing=false;}
    };
    const focus=()=>{void refresh();};const timer=window.setInterval(focus,30000);window.addEventListener('focus',focus);
    return()=>{window.clearInterval(timer);window.removeEventListener('focus',focus);};
  },[cloud,learnerId,key,commit]);
  const resolveConflict=(useRemote:boolean)=>{
    const remote=conflictRef.current;if(!remote)return;
    localStorage.setItem(`${key}:before-conflict:${Date.now()}`,JSON.stringify(current.current));
    revision.current=remote.revision;localStorage.setItem(`${key}:revision`,String(remote.revision));
    if(useRemote){const payload=remote.payload as unknown as {sessions?:LessonSession[];preferences?:Preferences};commit({...current.current,sessions:[...current.current.sessions.filter(s=>s.status!=='active'),...(payload.sessions||[]).filter(validSession).filter(s=>s.learnerId===learnerId&&s.status==='active'&&!current.current.sessions.some(t=>t.id===s.id&&t.status!=='active'))],preferences:{...current.current.preferences,...payload.preferences}},false);draftDirty.current=false;localStorage.setItem(`${key}:dirty`,'false');}
    conflictRef.current=null;setConflict(null);void retrySync();
  };

  const start = (session: LessonSession) => {
    if (session.learnerId !== learnerId) throw new Error('Lekce patří jinému profilu.');
    commit({ ...current.current, sessions: [session, ...current.current.sessions.filter(s => s.id !== session.id)] });
  };
  const dispatch = (id: string, action: LessonAction) => {
    const before = current.current.sessions.find(s => s.id === id); if (!before) return;
    let session = reduceLesson(before, action); if (session === before) return;
    const next = { ...current.current };
    if (before.status === 'active' && session.status !== 'active') {
      session = { ...session, activityDate: calendarDay(session.completedAt, next.preferences.timeZone), sync: cloud ? 'pending' : 'local' };
      const earned = newBadges(session, next.sessions.filter(s => s.id !== id), next.badges);
      const bonus = badgeDefinitions.filter(b => earned.includes(b.id)).reduce((sum,b) => sum + b.xp, 0);
      session.xp = lessonXp(session, next.sessions) + bonus;
      next.badges = { ...next.badges, ...Object.fromEntries(earned.map(b => [b, session.completedAt || ''])) };
      next.reviews = updateReviews(next.reviews, session);
    }
    next.sessions = next.sessions.map(s => s.id === id ? session : s);
    commit(next);
    if (session.sync === 'pending') void retrySync();
  };
  const savePreferences = (preferences: Partial<Preferences>) => commit({ ...current.current, preferences: { ...current.current.preferences, ...preferences } });
  const saveWords = (words: readonly LearningWord[]) => {
    const changes = { ...current.current.words };
    for (const word of words) { if (!word.english.trim() || !word.czech.trim() || !word.accepted.length) throw new Error('Slovíčko potřebuje anglické slovo a český překlad.'); changes[word.id] = { ...word, updatedAt: new Date().toISOString() }; }
    commit({ ...current.current, words: changes }); void retrySync();
  };
  const exportBackup = () => {
    const recovery: Record<string,string|null> = {};
    for(let i=0;i<localStorage.length;i++) { const name=localStorage.key(i); if(name?.startsWith(`${key}:recovery:`)||name?.startsWith(`${key}:before-`)) recovery[name]=localStorage.getItem(name); }
    if(initial.current.error) recovery[key]=localStorage.getItem(key);
    downloadText(`procvicka-${learnerId}-${calendarDay()}.json`, JSON.stringify({ ...current.current, learnerId, legacy: legacyLocalResults(learnerId).data, recovery }, null, 2));
  };
  const importBackup = (text: string) => {
    const imported = parseLearningData(text);
    const raw = JSON.parse(text) as { learnerId?: string; legacy?: Record<string,unknown> };
    if(raw.learnerId && raw.learnerId!==learnerId) throw new Error('Záloha patří jinému profilu. Nejprve vyber správný profil.');
    if (imported.sessions.some(s => s.learnerId !== learnerId)) throw new Error('Záloha patří jinému profilu. Nejprve vyber správný profil.');
    localStorage.setItem(`${key}:before-import:${Date.now()}`, JSON.stringify(current.current));
    for(const [legacyKey,value] of Object.entries(raw.legacy || {})) {
      if(!legacyKey.endsWith(`_${learnerId}`) || !/^(mathStats|spellingStats|dictionaryStats|mathAnswers|spellingAnswers|dictionaryAnswers|emergency_)/.test(legacyKey)) continue;
      const existing=localStorage.getItem(legacyKey);
      if(!existing) localStorage.setItem(legacyKey,typeof value==='string'?value:JSON.stringify(value));
      else if(Array.isArray(value)) {
        try { const before:unknown=JSON.parse(existing); if(Array.isArray(before)) { const records=new Map([...value,...before].map(record=>[record && typeof record==='object' && 'id' in record ? String(record.id):JSON.stringify(record),record])); localStorage.setItem(legacyKey,JSON.stringify([...records.values()])); } } catch { /* Preserve the existing record for manual recovery. */ }
      }
    }
    const sessions = new Map(current.current.sessions.map(s => [s.id, s]));
    for (const session of imported.sessions) if (!sessions.has(session.id)) sessions.set(session.id, { ...session, sync: cloud && session.status !== 'active' ? 'pending' : 'local' });
    const next = { ...current.current, sessions: [...sessions.values()], words: { ...imported.words, ...current.current.words }, badges: { ...imported.badges, ...current.current.badges } };
    next.reviews = rebuildReviews(next.sessions);
    commit(next); void retrySync();
  };
  if(cloud&&!hydrated.current)return <div className="learning-app"><main className="learn-main"><p role="status">{syncError||'Načítáme tvoje výsledky a rozpracované lekce…'}</p>{syncError&&<button className="learn-button secondary" onClick={()=>window.location.reload()}>Zkusit znovu</button>}</main></div>;
  return <LearningContext.Provider value={{ data, learnerId, cloud, storageError, syncError, syncNotice, syncing, unsaved:draftDirty.current||!hydrated.current||data.sessions.some(s=>s.sync==='pending'&&s.status!=='active'), conflict:!!conflict, resolveConflict, start, dispatch, savePreferences, saveWords, retrySync, exportBackup, importBackup }}>{children}</LearningContext.Provider>;
}
