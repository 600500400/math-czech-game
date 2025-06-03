
import { useState } from "react";

export interface FilterState {
  dateRange: 'all' | 'week' | 'month' | '3months' | 'custom';
  subject: 'all' | 'math' | 'spelling';
  searchTerm: string;
  startDate?: string;
  endDate?: string;
}

export const useDashboardFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    subject: 'all',
    searchTerm: '',
    startDate: undefined,
    endDate: undefined
  });

  // Filter statistics based on current filters
  const getFilteredStats = (stats: any[], type: 'math' | 'spelling') => {
    let filtered = [...stats];

    // Subject filter
    if (filters.subject !== 'all') {
      if ((filters.subject === 'math' && type !== 'math') || 
          (filters.subject === 'spelling' && type !== 'spelling')) {
        return [];
      }
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(stat => {
        const statDate = new Date(stat.created_at);
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;
        
        if (start && statDate < start) return false;
        if (end && statDate > end) return false;
        return true;
      });
    }

    // Search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(stat => {
        const searchFields = [
          stat.operation || '',
          stat.word_group || '',
          new Date(stat.created_at).toLocaleDateString('cs-CZ')
        ];
        
        return searchFields.some(field => 
          field.toLowerCase().includes(searchTerm)
        );
      });
    }

    return filtered;
  };

  return {
    filters,
    setFilters,
    getFilteredStats
  };
};
