
import { renderHook, act } from '@testing-library/react';
import { useGroupSelection } from '@/hooks/spelling/useGroupSelection';
import { vi } from 'vitest';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the spelling groups
vi.mock('@/data/spellingData', () => ({
  spellingGroups: [
    { name: 'b', words: [] },
    { name: 'm', words: [] },
    { name: 'p', words: [] }
  ]
}));

describe('useGroupSelection', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useGroupSelection());
    
    expect(result.current.selectedGroups).toEqual([]);
    expect(result.current.showGroupDialog).toBe(false);
  });

  test('should toggle group selection', () => {
    const { result } = renderHook(() => useGroupSelection());
    
    // Add a group
    act(() => {
      result.current.toggleGroup('b');
    });
    
    expect(result.current.selectedGroups).toEqual(['b']);
    
    // Add another group
    act(() => {
      result.current.toggleGroup('p');
    });
    
    expect(result.current.selectedGroups).toEqual(['b', 'p']);
    
    // Remove a group
    act(() => {
      result.current.toggleGroup('b');
    });
    
    expect(result.current.selectedGroups).toEqual(['p']);
  });

  test('should select all groups', () => {
    const { result } = renderHook(() => useGroupSelection());
    
    act(() => {
      result.current.selectAll();
    });
    
    // Should include all groups from the mock
    expect(result.current.selectedGroups).toEqual(['b', 'm', 'p']);
  });

  test('should deselect all groups', () => {
    const { result } = renderHook(() => useGroupSelection());
    
    // First select some groups
    act(() => {
      result.current.toggleGroup('b');
      result.current.toggleGroup('m');
    });
    
    expect(result.current.selectedGroups).toEqual(['b', 'm']);
    
    // Then deselect all
    act(() => {
      result.current.deselectAll();
    });
    
    expect(result.current.selectedGroups).toEqual([]);
  });

  test('should toggle group dialog visibility', () => {
    const { result } = renderHook(() => useGroupSelection());
    
    act(() => {
      result.current.setShowGroupDialog(true);
    });
    
    expect(result.current.showGroupDialog).toBe(true);
    
    act(() => {
      result.current.setShowGroupDialog(false);
    });
    
    expect(result.current.showGroupDialog).toBe(false);
  });
});
