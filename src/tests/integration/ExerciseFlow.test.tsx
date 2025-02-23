import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExercises } from '@/hooks/useExercises';
import { NextExercises } from '@/components/dashboard/NextExercises';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';
import { mockExercises } from '@/mocks/exercises';
import { supabase } from '@/lib/supabase';

// Mock de react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Flujo de Ejercicios - Integración', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('carga y muestra ejercicios correctamente', async () => {
    // Mock de la respuesta de Supabase
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ data: mockExercises, error: null }),
    }));

    render(<NextExercises />, { wrapper });

    // Verificar estado de carga
    expect(screen.getByRole('status', { name: /cargando/i })).toBeInTheDocument();

    // Verificar que los ejercicios se muestran
    await waitFor(() => {
      mockExercises.forEach(exercise => {
        expect(screen.getByText(exercise.name)).toBeInTheDocument();
      });
    });
  });

  it('maneja errores de API correctamente', async () => {
    // Mock de error de Supabase
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Error al cargar ejercicios' },
      }),
    }));

    render(<NextExercises />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error al cargar ejercicios');
    });
  });

  it('permite crear nuevo ejercicio', async () => {
    const nuevoEjercicio = {
      name: 'Nuevo Ejercicio',
      muscleGroup: 'Pecho',
      difficulty: 'Intermediate',
      equipment: 'Mancuernas',
    };

    // Mock de inserción en Supabase
    (supabase.from as jest.Mock).mockImplementation(() => ({
      insert: jest.fn().mockResolvedValue({
        data: [{ id: '123', ...nuevoEjercicio }],
        error: null,
      }),
    }));

    render(<ExerciseForm />, { wrapper });

    // Llenar formulario
    await userEvent.type(screen.getByLabelText(/nombre/i), nuevoEjercicio.name);
    await userEvent.selectOptions(
      screen.getByLabelText(/grupo muscular/i),
      nuevoEjercicio.muscleGroup
    );
    await userEvent.selectOptions(screen.getByLabelText(/dificultad/i), nuevoEjercicio.difficulty);
    await userEvent.type(screen.getByLabelText(/equipo/i), nuevoEjercicio.equipment);

    // Enviar formulario
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }));

    // Verificar que se llamó a Supabase
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('exercises');
    });

    // Verificar mensaje de éxito
    expect(screen.getByText(/ejercicio creado/i)).toBeInTheDocument();
  });

  it('sincroniza datos entre componentes', async () => {
    const { result } = renderHook(() => useExercises(), { wrapper });

    // Verificar estado inicial
    expect(result.current.exercises).toEqual([]);
    expect(result.current.isLoading).toBe(true);

    // Simular carga de datos
    await act(async () => {
      await result.current.refetch();
    });

    // Verificar que los datos se actualizaron
    expect(result.current.exercises).toEqual(mockExercises);
    expect(result.current.isLoading).toBe(false);

    // Renderizar componente que usa los datos
    render(<NextExercises />, { wrapper });

    // Verificar que los datos se muestran correctamente
    mockExercises.forEach(exercise => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
    });
  });
});
