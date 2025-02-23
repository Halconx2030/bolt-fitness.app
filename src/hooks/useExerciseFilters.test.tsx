import { renderHook, act } from '@testing-library/react';
import { useExerciseFilters } from './useExerciseFilters';

describe('useExerciseFilters', () => {
  const mockExercises = [
    {
      id: '1',
      muscleGroup: 'Pecho',
      difficulty: 'Intermedio',
      equipment: 'Mancuernas',
      name: 'Press de banca',
    },
    {
      id: '2',
      muscleGroup: 'Piernas',
      difficulty: 'Avanzado',
      equipment: 'Barra',
      name: 'Sentadillas',
    },
  ];

  it('inicia con filtros por defecto', () => {
    const { result } = renderHook(() => useExerciseFilters());

    expect(result.current.filters).toEqual({
      muscleGroup: '',
      difficulty: '',
      equipment: '',
      search: '',
    });
  });

  it('actualiza filtros individuales', () => {
    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.updateFilter('muscleGroup', 'Pecho');
    });

    expect(result.current.filters.muscleGroup).toBe('Pecho');
  });

  it('filtra por grupo muscular', () => {
    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.updateFilter('muscleGroup', 'Pecho');
    });

    const filtered = result.current.filterExercises(mockExercises);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('filtra por búsqueda de texto', () => {
    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.updateFilter('search', 'press');
    });

    const filtered = result.current.filterExercises(mockExercises);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toContain('Press');
  });

  it('combina múltiples filtros', () => {
    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.setFilters({
        muscleGroup: 'Pecho',
        difficulty: 'Intermedio',
        equipment: 'Mancuernas',
        search: '',
      });
    });

    const filtered = result.current.filterExercises(mockExercises);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('actualiza los filtros correctamente', () => {
    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.setFilters({
        muscleGroup: 'pecho',
        difficulty: 'intermedio',
        equipment: 'mancuernas',
      });
    });

    expect(result.current.filters).toEqual({
      muscleGroup: 'pecho',
      difficulty: 'intermedio',
      equipment: 'mancuernas',
    });
  });

  it('resetea los filtros', () => {
    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.setFilters({
        muscleGroup: 'pecho',
        difficulty: 'intermedio',
        equipment: 'mancuernas',
      });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      muscleGroup: '',
      difficulty: '',
      equipment: '',
    });
  });

  it('filtra ejercicios correctamente', () => {
    const mockExercises = [
      { id: '1', muscleGroup: 'pecho', difficulty: 'intermedio', equipment: 'mancuernas' },
      { id: '2', muscleGroup: 'piernas', difficulty: 'avanzado', equipment: 'barra' },
    ];

    const { result } = renderHook(() => useExerciseFilters());

    act(() => {
      result.current.setFilters({
        muscleGroup: 'pecho',
        difficulty: '',
        equipment: '',
      });
    });

    const filtered = result.current.filterExercises(mockExercises);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });
});
