import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { LearningContext } from './context';
import { reduceLesson } from './session';
import { calendarDay, lessonXp, updateReviews, rebuildReviews } from './rewards';
import { badgeDefinitions, newBadges } from './badges';
import { dictionaryWords, personalWords, translationVariants } from './dictionary';
import { learningCloud } from './cloud';
import { downloadText, legacyLocalResults, mergeSessions, parseLearningData, readLearningData, storageKey, validSession } from './storage';
import type { LearningData, LearningWord, LessonAction, LessonSession, Preferences } from './types';

export function LearningProvider({ children }: { children: ReactNode }) {
  const { authState } = useAuth();
  const learnerId = authState.user?.id || 'host';
  const cloud = authState.mode === 'cloud';
  return <ProfileLearningProvider key={storageKey(learnerId, cloud)} learnerId={learnerId} cloud={cloud}>{children}</ProfileLearningProvider>;
}

function ProfileLearningProvider({ learnerId, cloud, children }: { learnerId: string; cloud: boolean; children: ReactNode }) {
  const key = storageKey(learnerId, cloud);
  const initial = useRef(readLearningData(key));
  const [data, setData] = useState(initial.current.data);
  const current = useRef(data);
  const [storageError, setStorageError] = useState<string | null>(initial.current.error);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const busy = useRef(false);
  const needsSync = useRef(false);
  const alive = useRef(true);
  const hydrated = useRef(!cloud);

  const commit = useCallback((next: LearningData) => {
    // Persist before notifying React. Repeated button events see the new phase
    // immediately, even before React renders the disabled answer controls.
    try {
      if (initial.current.error) {
        localStorage.setItem(`${key}:recovery:${Date.now()}`, localStorage.getItem(key) || '');
        initial.current.error = null;
      }
      localStorage.setItem(key, JSON.stringify(next)); setStorageError(null);
    } catch { setStorageError('Výsledky se teď nepodařilo uložit na zařízení. Stáhni si zálohu, než stránku zavřeš.'); }
    current.current = next;
    if (alive.current) setData(next);
  }, [key]);

  const retrySync = useCallback(async () => {
    if (!cloud || !hydrated.current || !navigator.onLine) return;
    if (busy.current) { needsSync.current = true; return; }
    needsSync.current = false;
    let succeeded = false;
    busy.current = true; setSyncing(true);
    try {
      const { data: auth } = await supabase.auth.getSession();
      const owner = auth.session?.user.id;
      if (!owner || owner !== learnerId) throw new Error('Přihlášení vypršelo. Přihlas se znovu; výsledky jsou zachované na zařízení.');
      const words = dictionaryWords(current.current.words).filter(w => w.source === 'personal');
      const { error: wordError } = await learningCloud.from('learning_words').upsert(words.map(w => ({ owner_id: owner, learner_id: learnerId, content_id: w.id, payload: w as unknown as Json, updated_at: w.updatedAt || '2026-10-01T00:00:00.000Z' })), { onConflict: 'owner_id,learner_id,content_id' });
      if (wordError) throw wordError;
      const pending = current.current.sessions.filter(s => s.sync === 'pending' && s.status !== 'active').sort((a,b) => a.startedAt.localeCompare(b.startedAt));
      for (const session of pending) {
        const { data: response, error } = await learningCloud.rpc('complete_learning_session', { p_session: session as unknown as Json });
        if (error) throw error;
        const result = response as unknown as { session: LessonSession; total_xp: number; badges: Record<string,string> };
        if (!result?.session || !validSession(result.session) || !Number.isFinite(result.total_xp)) throw new Error('Uložení zatím nebylo potvrzeno.');
        const sessions = mergeSessions(current.current.sessions, [{ ...result.session, sync: 'synced' }]);
        const syncedXp = sessions.filter(s => s.sync === 'synced').reduce((sum,s) => sum + s.xp, 0);
        commit({ ...current.current, sessions, baseXp: Math.max(0, result.total_xp - syncedXp), badges: { ...current.current.badges, ...result.badges } });
      }
      setSyncError(null);
      succeeded = true;
    } catch { if (alive.current) setSyncError('Výsledky jsou na zařízení. Do účtu se je zatím nepodařilo uložit; zkus synchronizaci znovu.'); }
    finally { busy.current = false; if (alive.current) { setSyncing(false); if (succeeded && needsSync.current) queueMicrotask(() => void retrySync()); } }
  }, [cloud, learnerId, commit]);

  useEffect(() => {
    alive.current = true;
    if (cloud) {
      void (async () => {
        const results = await Promise.allSettled([
          learningCloud.rpc('get_learning_sessions', { p_learner_id: learnerId }),
          learningCloud.from('learning_words').select('*').eq('owner_id', learnerId).eq('learner_id', learnerId),
          supabase.from('user_levels').select('total_xp').eq('user_id', learnerId).maybeSingle(),
          supabase.from('dictionary_words').select('*').eq('user_id', learnerId),
          learningCloud.rpc('get_learning_badges', { p_learner_id: learnerId }),
        ]);
        if (!alive.current) return;
        const [sessionResult, wordResult, xpResult, legacyResult, badgeResult] = results;
        const next = { ...current.current, words: { ...current.current.words } };
        if (legacyResult.status === 'fulfilled' && !legacyResult.value.error) {
          for (const w of legacyResult.value.data || []) {
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
        commit(next);
        hydrated.current = true;
        void retrySync();
      })();
    }
    const online = () => { void retrySync(); };
    window.addEventListener('online', online);
    return () => { alive.current = false; window.removeEventListener('online', online); };
  }, [cloud, learnerId, commit, retrySync]);

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
    for(let i=0;i<localStorage.length;i++) { const name=localStorage.key(i); if(name?.startsWith(`${key}:recovery:`)) recovery[name]=localStorage.getItem(name); }
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
  return <LearningContext.Provider value={{ data, learnerId, cloud, storageError, syncError, syncing, start, dispatch, savePreferences, saveWords, retrySync, exportBackup, importBackup }}>{children}</LearningContext.Provider>;
}
