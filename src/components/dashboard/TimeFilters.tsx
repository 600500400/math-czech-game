
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Search, Filter, RotateCcw } from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface TimeFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  dateRange: 'all' | 'week' | 'month' | '3months' | 'custom';
  startDate?: string;
  endDate?: string;
  subject: 'all' | 'math' | 'spelling';
  searchTerm: string;
}

export const TimeFilters: React.FC<TimeFiltersProps> = ({
  onFilterChange,
  filters
}) => {
  const handleDateRangeChange = (range: string) => {
    const today = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined;

    switch (range) {
      case 'week':
        startDate = format(subDays(today, 7), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(subMonths(today, 1), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case '3months':
        startDate = format(subMonths(today, 3), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'all':
      default:
        startDate = undefined;
        endDate = undefined;
        break;
    }

    onFilterChange({
      ...filters,
      dateRange: range as FilterState['dateRange'],
      startDate,
      endDate
    });
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: 'custom',
      [field]: value
    });
  };

  const handleSubjectChange = (subject: string) => {
    onFilterChange({
      ...filters,
      subject: subject as FilterState['subject']
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFilterChange({
      ...filters,
      searchTerm
    });
  };

  const handleReset = () => {
    onFilterChange({
      dateRange: 'all',
      subject: 'all',
      searchTerm: '',
      startDate: undefined,
      endDate: undefined
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtry a vyhledávání
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label>Časové období</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.dateRange === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('all')}
            >
              Vše
            </Button>
            <Button
              variant={filters.dateRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('week')}
            >
              Týden
            </Button>
            <Button
              variant={filters.dateRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('month')}
            >
              Měsíc
            </Button>
            <Button
              variant={filters.dateRange === '3months' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('3months')}
            >
              3 měsíce
            </Button>
          </div>
        </div>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Od</Label>
              <Input
                id="start-date"
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Do</Label>
              <Input
                id="end-date"
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Subject Filter */}
        <div className="space-y-2">
          <Label>Předmět</Label>
          <Select value={filters.subject} onValueChange={handleSubjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte předmět" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny předměty</SelectItem>
              <SelectItem value="math">Matematika</SelectItem>
              <SelectItem value="spelling">Pravopis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Hledat</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Hledat v aktivitách..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Resetovat filtry
        </Button>

        {/* Active Filters Summary */}
        {(filters.dateRange !== 'all' || filters.subject !== 'all' || filters.searchTerm) && (
          <div className="text-sm text-muted-foreground border-t pt-3">
            <p className="font-medium mb-1">Aktivní filtry:</p>
            <ul className="space-y-1 text-xs">
              {filters.dateRange !== 'all' && (
                <li>• Období: {getDateRangeLabel(filters.dateRange)}</li>
              )}
              {filters.subject !== 'all' && (
                <li>• Předmět: {getSubjectLabel(filters.subject)}</li>
              )}
              {filters.searchTerm && (
                <li>• Hledání: "{filters.searchTerm}"</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getDateRangeLabel(range: FilterState['dateRange']): string {
  switch (range) {
    case 'week': return 'Posledních 7 dní';
    case 'month': return 'Poslední měsíc';
    case '3months': return 'Poslední 3 měsíce';
    case 'custom': return 'Vlastní období';
    default: return 'Vše';
  }
}

function getSubjectLabel(subject: FilterState['subject']): string {
  switch (subject) {
    case 'math': return 'Matematika';
    case 'spelling': return 'Pravopis';
    default: return 'Všechny';
  }
}
