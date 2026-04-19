/**
 * Lightweight logger that suppresses verbose output in production.
 * - debug/info/log: only in development (Vite import.meta.env.DEV)
 * - warn/error: always logged
 *
 * Use this instead of console.log in hot paths (game generation, validation, render loops)
 * to avoid flooding the production console.
 */

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV === true;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
  warn: (...args: unknown[]) => {
    console.warn(...args);
  },
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
