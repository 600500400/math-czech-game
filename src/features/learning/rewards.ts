import type { LessonSession, Review } from './types';
import { summarize } from './session';

// Cumulative thresholds retain the existing SQL progression and total XP.
export function levelThreshold(level: number): number { return level <= 1 ? 0 : level * 100 + (level - 1) * 50; }
export function levelProgress(totalXp: number) {
  const xp = Math.max(0, totalXp);
  const level = xp < 250 ? 1 : Math.floor((xp + 50) / 150);
  const base = levelThreshold(level);
  const next = levelThreshold(level + 1);
  return { level, totalXp: xp, current: xp - base, needed: next - base, percent: Math.min(100, (xp - base) / (next - base) * 100) };
}
export function calendarDay(date: Date | string = new Date(), timeZone = 'Europe/Prague'): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(date));
  const part = (name: string) => parts.find(p => p.type === name)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}
export function previousDay(day: string): string {
  const value = new Date(`${day}T12:00:00Z`); value.setUTCDate(value.getUTCDate() - 1); return value.toISOString().slice(0, 10);
}
export function streak(sessions: readonly LessonSession[], today = calendarDay()) {
  const days = new Set(sessions.filter(s => s.status !== 'active' && s.attempts.length).map(s => s.activityDate || calendarDay(s.completedAt || s.startedAt)));
  let cursor = days.has(today) ? today : previousDay(today);
  let current = 0;
  while (days.has(cursor)) { current++; cursor = previousDay(cursor); }
  return current;
}

export function lessonXp(session: LessonSession, earlier: readonly LessonSession[]): number {
  const date = session.activityDate || calendarDay(session.completedAt || session.startedAt);
  const sameDay = earlier.filter(s => s.id !== session.id && s.status !== 'active' && (s.activityDate || calendarDay(s.completedAt || s.startedAt)) === date);
  const rewarded = new Set(sameDay.flatMap(s => s.tasks.filter(t => s.attempts.some(a => a.taskId === t.id && a.isCorrect)).map(t => t.key)));
  const seen = new Set<string>();
  let xp = 0;
  for (const task of session.tasks) {
    const attempts = session.attempts.filter(a => a.taskId === task.id);
    if (!attempts.length || rewarded.has(task.key) || seen.has(task.key)) continue;
    seen.add(task.key);
    if (attempts[0].isCorrect && !attempts[0].usedHint && attempts[0].assessment === 'verified') xp += 10;
    else if (attempts.some(a => a.isCorrect)) xp += 3;
  }
  const completedToday = sameDay.filter(s => s.subject === session.subject && s.status === 'completed').length;
  if (session.status === 'completed' && session.tasks.length >= 5 && completedToday < 2 && session.attempts.some(a => a.isCorrect)) xp += 5;
  return xp;
}

export function updateReviews(reviews: Record<string, Review>, session: LessonSession): Record<string, Review> {
  const result = { ...reviews };
  const seen = new Set<string>();
  const at = new Date(session.completedAt || session.startedAt).getTime();
  for (const task of session.tasks) {
    if(seen.has(task.key)) continue;
    const first = session.attempts.find(a => a.taskId === task.id);
    if (!first) continue;
    seen.add(task.key);
    const independent = first.isCorrect && !first.usedHint;
    const successes = independent ? (reviews[task.key]?.successes || 0) + 1 : 0;
    const interval = independent ? [1, 3, 7, 14, 30][Math.min(successes - 1, 4)] * 86400000 : 10 * 60000;
    result[task.key] = { key: task.key, skillId: task.skillId, subject: task.subject, successes, dueAt: new Date(at + interval).toISOString(), lastCorrect: independent };
  }
  return result;
}

export function getSkillProgress(sessions: readonly LessonSession[]) {
  const bySkill = new Map<string, { subject: LessonSession['subject']; title: string; correct: number; count: number }>();
  for (const session of [...sessions].sort((a, b) => a.startedAt.localeCompare(b.startedAt))) {
    const seen = new Set<string>();
    for (const task of session.tasks) {
      if(seen.has(task.key)) continue;
      const first = session.attempts.find(a => a.taskId === task.id);
      if (!first) continue;
      seen.add(task.key);
      const skill = bySkill.get(task.skillId) || { subject: session.subject, title: session.title, correct: 0, count: 0 };
      skill.count++; if (first.isCorrect && !first.usedHint) skill.correct++; bySkill.set(task.skillId, skill);
    }
  }
  return [...bySkill].map(([id, value]) => ({ id, ...value, percent: Math.round(value.correct / value.count * 100) }));
}

export { summarize };
export function rebuildReviews(sessions: readonly LessonSession[]) {
  return [...sessions].filter(s => s.status !== 'active').sort((a, b) => (a.completedAt || a.startedAt).localeCompare(b.completedAt || b.startedAt)).reduce((reviews, session) => updateReviews(reviews, session), {} as Record<string, Review>);
}
