import { render, screen } from '@testing-library/react';
import ExerciseList from './ExerciseList';

describe('ExerciseList', () => {
  const mockExercises = [
    {
      id: '1',
      name: 'Press de Banca',
      muscleGroup: 'Pecho',
      difficulty: 'Intermedio',
      equipment: 'Barra',
    },
    {
      id: '2',
      name: 'Sentadillas',
      muscleGroup: 'Piernas',
      difficulty: 'Avanzado',
      equipment: 'Barra',
    },
  ];

  it('renderiza la lista de ejercicios', () => {
    render(<ExerciseList exercises={mockExercises} />);

    mockExercises.forEach(exercise => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
      expect(screen.getByText(exercise.muscleGroup)).toBeInTheDocument();
    });
  });

  it('muestra mensaje cuando no hay ejercicios', () => {
    render(<ExerciseList exercises={[]} />);

    expect(screen.getByText(/no hay ejercicios/i)).toBeInTheDocument();
  });

  it('muestra el estado de carga', () => {
    render(<ExerciseList isLoading />);

    expect(screen.getByTestId('exercise-list-skeleton')).toBeInTheDocument();
  });

  it('muestra mensaje de error', () => {
    render(<ExerciseList error="Error al cargar ejercicios" />);

    expect(screen.getByText(/error al cargar ejercicios/i)).toBeInTheDocument();
  });
});
