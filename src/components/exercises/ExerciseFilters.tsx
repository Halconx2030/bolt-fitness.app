'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Filters {
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  search: string;
}

interface FilterOptions {
  muscleGroups: string[];
  difficulties: string[];
  equipment: string[];
}

interface ExerciseFiltersProps {
  filters: Filters;
  options: FilterOptions;
  onFilterChange: (filters: Filters) => void;
}

export const ExerciseFilters = ({ filters, options, onFilterChange }: ExerciseFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const handleReset = () => {
    onFilterChange({
      muscleGroup: '',
      difficulty: '',
      equipment: '',
      search: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="Buscar ejercicios..."
          className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="muscleGroup" className="block text-sm font-medium mb-2">
            Grupo Muscular
          </label>
          <select
            id="muscleGroup"
            value={filters.muscleGroup}
            onChange={e => onFilterChange({ ...filters, muscleGroup: e.target.value })}
            className="w-full bg-background rounded-lg border border-gray-700 p-2"
          >
            <option value="">Todos</option>
            {options.muscleGroups.map(group => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
            Dificultad
          </label>
          <select
            id="difficulty"
            value={filters.difficulty}
            onChange={e => onFilterChange({ ...filters, difficulty: e.target.value })}
            className="w-full bg-background rounded-lg border border-gray-700 p-2"
          >
            <option value="">Todas</option>
            {options.difficulties.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="equipment" className="block text-sm font-medium mb-2">
            Equipamiento
          </label>
          <select
            id="equipment"
            value={filters.equipment}
            onChange={e => onFilterChange({ ...filters, equipment: e.target.value })}
            className="w-full bg-background rounded-lg border border-gray-700 p-2"
          >
            <option value="">Todos</option>
            {options.equipment.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleReset}
          disabled={!hasActiveFilters}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Limpiar Filtros</span>
        </Button>
      </div>
    </div>
  );
};
