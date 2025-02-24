import { render, screen, waitFor } from '@testing-library/react';
import { ExerciseGrid } from './ExerciseGrid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useExerciseFilters } from '@/hooks/useExerciseFilters';
import { Exercise } from '@/types/exercises';
import { PostgrestResponse } from '@supabase/supabase-js';

// Mock de Supabase
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Mock del hook useExerciseFilters
jest.mock('@/hooks/useExerciseFilters', () => ({
  useExerciseFilters: jest.fn(),
}));

// Mock del componente ExerciseCard
jest.mock('./ExerciseCard', () => ({
  ExerciseCard: ({ exercise }: { exercise: Exercise }) => (
    <div data-testid="exercise-card">
      <h3>{exercise.name}</h3>
      <p>{exercise.description}</p>
    </div>
  ),
}));

// Mock del componente ExercisesSkeleton
jest.mock('@/components/skeletons/ExercisesSkeleton', () => ({
  ExercisesSkeleton: () => <div data-testid="exercises-skeleton" />,
}));

describe('ExerciseGrid', () => {
  const mockExercises = [
    {
      id: '1',
      name: 'Press de Banca',
      description: 'Ejercicio para pecho',
      category: 'Fuerza',
      difficulty: 'intermediate',
      imageUrl: '/images/bench-press.jpg',
      equipment: ['barra', 'banco'],
      muscles: ['pecho', 'tríceps'],
      instructions: ['Paso 1', 'Paso 2'],
      tips: ['Tip 1', 'Tip 2'],
    },
    {
      id: '2',
      name: 'Sentadillas',
      description: 'Ejercicio para piernas',
      category: 'Fuerza',
      difficulty: 'advanced',
      imageUrl: '/images/squats.jpg',
      equipment: ['barra', 'rack'],
      muscles: ['cuádriceps', 'glúteos'],
      instructions: ['Paso 1', 'Paso 2'],
      tips: ['Tip 1', 'Tip 2'],
    },
  ] as Exercise[];

  let mockQuery: PostgrestResponse<Exercise[]>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockQuery = {
      data: mockExercises,
      error: null,
      count: null,
      status: 200,
      statusText: 'OK',
    };

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
    (useExerciseFilters as jest.Mock).mockReturnValue({
      filters: {
        category: '',
        difficulty: '',
        search: '',
      },
    });
  });

  it('muestra el skeleton mientras carga', () => {
    render(<ExerciseGrid />);
    expect(screen.getByTestId('exercises-skeleton')).toBeInTheDocument();
  });

  it('renderiza la lista de ejercicios', async () => {
    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(screen.queryByTestId('exercises-skeleton')).not.toBeInTheDocument();
    });

    const exerciseCards = screen.getAllByTestId('exercise-card');
    expect(exerciseCards).toHaveLength(2);
    expect(screen.getByText('Press de Banca')).toBeInTheDocument();
    expect(screen.getByText('Sentadillas')).toBeInTheDocument();
  });

  it('filtra por categoría', async () => {
    (useExerciseFilters as jest.Mock).mockReturnValue({
      filters: {
        category: 'Fuerza',
        difficulty: '',
        search: '',
      },
    });

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('exercises');
      expect(mockSupabase.eq).toHaveBeenCalledWith('category', 'Fuerza');
    });
  });

  it('filtra por dificultad', async () => {
    (useExerciseFilters as jest.Mock).mockReturnValue({
      filters: {
        category: '',
        difficulty: 'intermediate',
        search: '',
      },
    });

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('exercises');
      expect(mockSupabase.eq).toHaveBeenCalledWith('difficulty', 'intermediate');
    });
  });

  it('filtra por búsqueda', async () => {
    (useExerciseFilters as jest.Mock).mockReturnValue({
      filters: {
        category: '',
        difficulty: '',
        search: 'press',
      },
    });

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('exercises');
      expect(mockSupabase.ilike).toHaveBeenCalledWith('name', '%press%');
    });
  });

  it('maneja errores al cargar ejercicios', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockQuery = {
      data: null,
      error: new Error('Error al cargar ejercicios'),
    };

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading exercises:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('aplica múltiples filtros', async () => {
    (useExerciseFilters as jest.Mock).mockReturnValue({
      filters: {
        category: 'Fuerza',
        difficulty: 'intermediate',
        search: 'press',
      },
    });

    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('exercises');
      expect(mockSupabase.eq).toHaveBeenCalledWith('category', 'Fuerza');
      expect(mockSupabase.eq).toHaveBeenCalledWith('difficulty', 'intermediate');
      expect(mockSupabase.ilike).toHaveBeenCalledWith('name', '%press%');
    });
  });

  it('ordena los ejercicios por nombre', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => mockQuery),
    };

    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);

    render(<ExerciseGrid />);

    await waitFor(() => {
      expect(mockSupabase.from).toHaveBeenCalledWith('exercises');
      expect(mockSupabase.order).toHaveBeenCalledWith('name');
    });
  });
});
