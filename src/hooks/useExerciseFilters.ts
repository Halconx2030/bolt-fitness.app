import { create } from 'zustand';

interface Filters {
  search: string;
  level: string;
  sortBy: string;
}

interface ExerciseFiltersState {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

const initialFilters: Filters = {
  search: '',
  level: '',
  sortBy: 'recent'
};

export const useExerciseFilters = create<ExerciseFiltersState>((set) => ({
  filters: initialFilters,
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: initialFilters })
})); 