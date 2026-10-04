import { streak } from './rewards';
import { summarize } from './session';
import type { LessonSession } from './types';

export const badgeDefinitions = [
  { id: 'first-lesson', title: 'První krok', description: 'Dokončená lekce s alespoň jednou správnou odpovědí.', xp: 20 },
  { id: 'back-again', title: 'Učím se z chyby', description: 'Opravená odpověď po vysvětlení.', xp: 10 },
  { id: 'steady-three', title: 'Tři malé kroky', description: 'Procvičování ve třech dnech za sebou.', xp: 25 },
  { id: 'english-first', title: 'První anglická lekce', description: 'Dokončená anglická lekce s alespoň jednou známou odpovědí.', xp: 10 },
];
export function newBadges(session: LessonSession, earlier: readonly LessonSession[], unlocked: Record<string, string>): string[] {
  const anyCorrect = session.attempts.some(a => a.isCorrect);
  const conditions: Record<string, boolean> = {
    'first-lesson': anyCorrect && session.status === 'completed' && session.tasks.length >= 5,
    'back-again': summarize(session).corrected > 0,
    'steady-three': anyCorrect && streak([...earlier, session], session.activityDate) >= 3,
    'english-first': anyCorrect && session.subject === 'english' && session.status === 'completed' && session.tasks.length >= 5,
  };
  return badgeDefinitions.filter(b => conditions[b.id] && !unlocked[b.id]).map(b => b.id);
}
