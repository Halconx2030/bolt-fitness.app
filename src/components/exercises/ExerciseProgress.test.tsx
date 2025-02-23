import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseProgress } from './ExerciseProgress';

describe('ExerciseProgress', () => {
  const mockProgress = {
    sets: 3,
    reps: 12,
    weight: 50,
    completed: false,
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza el progreso correctamente', () => {
    render(<ExerciseProgress progress={mockProgress} onUpdate={mockOnUpdate} />);

    expect(screen.getByText(/series/i)).toBeInTheDocument();
    expect(screen.getByText(/repeticiones/i)).toBeInTheDocument();
    expect(screen.getByText(/peso/i)).toBeInTheDocument();
  });

  it('actualiza los valores correctamente', () => {
    render(<ExerciseProgress progress={mockProgress} onUpdate={mockOnUpdate} />);

    fireEvent.change(screen.getByLabelText(/series/i), {
      target: { value: '4' },
    });

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockProgress,
      sets: 4,
    });
  });

  it('marca como completado', () => {
    render(<ExerciseProgress progress={mockProgress} onUpdate={mockOnUpdate} />);

    fireEvent.click(screen.getByRole('button', { name: /completar/i }));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockProgress,
      completed: true,
    });
  });

  it('valida valores mínimos', () => {
    render(<ExerciseProgress progress={mockProgress} onUpdate={mockOnUpdate} />);

    fireEvent.change(screen.getByLabelText(/series/i), {
      target: { value: '-1' },
    });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('valida valores máximos', () => {
    render(<ExerciseProgress progress={mockProgress} onUpdate={mockOnUpdate} />);

    fireEvent.change(screen.getByLabelText(/peso/i), {
      target: { value: '1001' },
    });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('muestra el estado completado', () => {
    render(
      <ExerciseProgress progress={{ ...mockProgress, completed: true }} onUpdate={mockOnUpdate} />
    );

    expect(screen.getByText(/completado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /completar/i })).toBeDisabled();
  });
});
