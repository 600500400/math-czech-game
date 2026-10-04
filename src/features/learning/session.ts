import type { Attempt, LessonAction, LessonSession, Task } from './types';

export function normalizeAnswer(answer: string): string {
  return answer.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('cs');
}
export function isCorrect(task: Task, answer: string): boolean {
  if (task.subject === 'math') return /^\d+$/.test(answer.trim()) && Number(answer) === task.result;
  return task.expected.some(expected => normalizeAnswer(expected) === normalizeAnswer(answer));
}

export function reduceLesson(session: LessonSession, action: LessonAction): LessonSession {
  if (session.status !== 'active') return session;
  const task = session.tasks[session.index];
  switch (action.type) {
    case 'answer': {
      if (session.phase !== 'answering' || !task || !action.answer.trim() || (session.mode === 'cards' && !session.revealed)) return session;
      const previous = session.attempts.filter(attempt => attempt.taskId === task.id);
      const attempt: Attempt = { id: action.id, taskId: task.id, answer: action.answer, isCorrect: session.mode === 'cards' ? action.selfCorrect === true : isCorrect(task, action.answer), usedHint: session.usedHint, number: previous.length + 1, answeredAt: action.at, assessment: session.mode === 'cards' ? 'self' : 'verified' };
      return { ...session, attempts: [...session.attempts, attempt], phase: 'feedback', revealed: true };
    }
    case 'hint': return session.phase === 'answering' ? { ...session, usedHint: true } : session;
    case 'reveal': return session.phase === 'answering' ? { ...session, revealed: true } : session;
    case 'retry': return session.phase === 'feedback' ? { ...session, phase: 'answering', usedHint: true, revealed: false } : session;
    case 'pause': return session.phase !== 'paused' && session.phase !== 'summary' ? { ...session, previousPhase: session.phase, phase: 'paused' } : session;
    case 'resume': return session.phase === 'paused' ? { ...session, phase: session.previousPhase || 'answering' } : session;
    case 'next':
      if (session.phase !== 'feedback') return session;
      return session.index + 1 >= session.tasks.length
        ? { ...session, phase: 'summary', status: 'completed', completedAt: action.at }
        : { ...session, index: session.index + 1, phase: 'answering', revealed: false, usedHint: false };
    case 'finish': return { ...session, phase: 'summary', status: 'interrupted', completedAt: action.at };
  }
}

export function summarize(session: LessonSession) {
  const answered = session.tasks.map(task => ({ task, attempts: session.attempts.filter(a => a.taskId === task.id) })).filter(row => row.attempts.length);
  const independent = answered.filter(row => row.attempts[0].isCorrect && !row.attempts[0].usedHint).length;
  const corrected = answered.filter(row => !row.attempts[0].isCorrect && row.attempts.slice(1).some(a => a.isCorrect)).length;
  return { answered: answered.length, independent, corrected, review: answered.filter(row => !row.attempts[0].isCorrect || row.attempts[0].usedHint), firstAccuracy: answered.length ? Math.round(independent / answered.length * 100) : null };
}
