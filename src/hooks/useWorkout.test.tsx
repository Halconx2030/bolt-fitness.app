import { renderHook, act } from '@testing-library/react';
import { useWorkout } from './useWorkout';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

describe('useWorkout', () => {
  const mockWorkout = {
    id: '1',
    name: 'Entrenamiento de Pecho',
    exercises: [
      { id: '1', name: 'Press de Banca', sets: 3, reps: 12, completed: false },
      { id: '2', name: 'Aperturas', sets: 3, reps: 15, completed: false },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('carga el workout correctamente', async () => {
    (supabase.from().single as jest.Mock).mockResolvedValue({
      data: mockWorkout,
      error: null,
    });

    const { result } = renderHook(() => useWorkout('1'));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.workout).toEqual(mockWorkout);
    expect(result.current.loading).toBe(false);
  });

  it('maneja errores de carga', async () => {
    const error = new Error('Error al cargar');
    (supabase.from().single as jest.Mock).mockResolvedValue({
      data: null,
      error,
    });

    const { result } = renderHook(() => useWorkout('1'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.error).toBe(error);
  });

  it('actualiza el progreso del ejercicio', async () => {
    (supabase.from().single as jest.Mock).mockResolvedValue({
      data: mockWorkout,
      error: null,
    });

    const { result } = renderHook(() => useWorkout('1'));

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.updateExerciseProgress('1', { completed: true });
    });

    expect(result.current.workout?.exercises[0].completed).toBe(true);
  });
});
