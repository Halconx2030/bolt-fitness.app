import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutCard } from './WorkoutCard';

// Mock de next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="workout-link">
      {children}
    </a>
  ),
}));

describe('WorkoutCard', () => {
  const mockWorkout = {
    id: '1',
    name: 'Entrenamiento de Pecho',
    description: 'Rutina completa para pecho',
    duration: '45 min',
    exercises: [
      { id: '1', name: 'Press de Banca', sets: 3, reps: 12 },
      { id: '2', name: 'Aperturas', sets: 3, reps: 15 },
    ],
  };

  it('renderiza la información del workout correctamente', () => {
    render(<WorkoutCard workout={mockWorkout} />);

    expect(screen.getByText(mockWorkout.name)).toBeInTheDocument();
    expect(screen.getByText(mockWorkout.description)).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
  });

  it('muestra la lista de ejercicios', () => {
    render(<WorkoutCard workout={mockWorkout} />);

    mockWorkout.exercises.forEach(exercise => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
      expect(screen.getByText(`${exercise.sets}x${exercise.reps}`)).toBeInTheDocument();
    });
  });

  it('navega al detalle del workout al hacer click', () => {
    render(<WorkoutCard workout={mockWorkout} />);

    const link = screen.getByTestId('workout-link');
    expect(link).toHaveAttribute('href', `/workouts/${mockWorkout.id}`);
  });

  it('muestra el estado de progreso', () => {
    render(
      <WorkoutCard
        workout={{
          ...mockWorkout,
          progress: 75,
          completed: false,
        }}
      />
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });
});
