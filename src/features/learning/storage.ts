import { defaultMath } from './math';
import { spellingGroupNames } from './spelling';
import type { LearningData, LessonSession } from './types';

export function emptyLearningData(): LearningData {
  return { version: 2, sessions: [], words: {}, reviews: {}, baseXp: 0, badges: {}, preferences: { count: 10, math: { ...defaultMath, operations: ['+'] }, groups: [...spellingGroupNames], englishMode: 'cards', englishDirection: 'en_to_cz', englishCategory: 'all', reducedMotion: false, timeZone: 'Europe/Prague' } };
}
export function storageKey(learnerId: string, cloud: boolean): string { return `procvicka:v2:${cloud ? 'cloud' : 'local'}:${learnerId}`; }
export function validSession(value: unknown): value is LessonSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as LessonSession;
  return typeof session.id === 'string' && typeof session.learnerId === 'string' && typeof session.title === 'string' && Number.isFinite(session.xp) && session.xp >= 0 && Number.isFinite(Date.parse(session.startedAt)) && ['typing','cards'].includes(session.mode) && ['math','spelling','english'].includes(session.subject) && Array.isArray(session.tasks) && session.tasks.length > 0 && session.tasks.length <= 20 && Array.isArray(session.attempts) && session.attempts.length<=100 && Number.isInteger(session.index) && session.index >= 0 && session.index < session.tasks.length && ['answering','feedback','paused','summary'].includes(session.phase) && ['active','completed','interrupted'].includes(session.status) && session.tasks.every(t => t && typeof t.id === 'string' && typeof t.key === 'string' && typeof t.prompt === 'string' && typeof t.explanation==='string' && typeof t.hint==='string' && t.subject===session.subject && Array.isArray(t.expected) && t.expected.every(e=>typeof e==='string') && (t.subject==='math'?Number.isInteger(t.result)&&Number.isInteger(t.a)&&Number.isInteger(t.b):t.subject==='spelling'?typeof t.word==='string'&&spellingGroupNames.includes(t.group)&&Number.isInteger(t.gapIndex):t.word&&typeof t.word.english==='string'&&typeof t.word.czech==='string')) && session.attempts.every(a => a && typeof a.id === 'string' && typeof a.taskId === 'string' && typeof a.isCorrect === 'boolean' && typeof a.usedHint==='boolean' && typeof a.answer==='string' && Number.isInteger(a.number) && Number.isFinite(Date.parse(a.answeredAt)) && session.tasks.some(t=>t.id===a.taskId));
}
export function parseLearningData(text: string): LearningData {
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== 'object' || (value as LearningData).version !== 2) throw new Error('Tato záloha není platnou zálohou Procvičky.');
  const data = value as LearningData;
  if (!Array.isArray(data.sessions) || !data.sessions.every(validSession) || !data.words || typeof data.words !== 'object') throw new Error('Záloha obsahuje neplatné lekce nebo slovíčka.');
  if (!Object.values(data.words).every(w => w && typeof w.id === 'string' && typeof w.english === 'string' && typeof w.czech === 'string' && Array.isArray(w.accepted))) throw new Error('Záloha obsahuje neplatné slovíčko.');
  const defaults = emptyLearningData();
  return { ...defaults, ...data, baseXp: Number.isFinite(data.baseXp) ? Math.max(0, data.baseXp) : 0, preferences: { ...defaults.preferences, ...data.preferences }, reviews: data.reviews || {}, badges: data.badges || {} };
}
export function readLearningData(key: string): { data: LearningData; error: string | null } {
  try { const raw = localStorage.getItem(key); return { data: raw ? parseLearningData(raw) : emptyLearningData(), error: null }; }
  catch { return { data: emptyLearningData(), error: 'Uložené výsledky se nepodařilo načíst. Původní záznam zůstává zachován; před pokračováním stáhni zálohu.' }; }
}

export function mergeSessions(local: readonly LessonSession[], remote: readonly LessonSession[]): LessonSession[] {
  const map = new Map(local.map(s => [s.id, s]));
  for (const session of remote) if (validSession(session)) map.set(session.id, { ...session, sync: 'synced' });
  return [...map.values()].sort((a,b) => b.startedAt.localeCompare(a.startedAt));
}
export function downloadText(filename: string, content: string, mime = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function legacyLocalResults(learnerId: string): { count: number; data: Record<string, unknown> } {
  const data: Record<string, unknown> = {}; let count = 0;
  for (let i=0;i<localStorage.length;i++) {
    const key = localStorage.key(i);
    if (!key || !key.endsWith(`_${learnerId}`) || !/^(mathStats|spellingStats|dictionaryStats|mathAnswers|spellingAnswers|dictionaryAnswers|emergency_)/.test(key)) continue;
    try { const value: unknown = JSON.parse(localStorage.getItem(key) || 'null'); data[key] = value; if (Array.isArray(value)) count += value.length; } catch { data[key] = localStorage.getItem(key); }
  }
  return { count, data };
}
