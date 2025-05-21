
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock the console.log methods
global.console.log = vi.fn();
global.console.error = vi.fn();
global.console.warn = vi.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup any global mocks here
vi.mock('@/components/ui/toast', () => ({
  toast: vi.fn(),
}));

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
