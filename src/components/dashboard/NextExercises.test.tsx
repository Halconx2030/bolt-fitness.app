import { render, screen } from '@testing-library/react';
import { NextExercises } from './NextExercises';

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

const mockExercises = [
  {
    id: '1',
    name: 'Press de Banca',
    muscleGroup: 'Pecho',
    difficulty: 'Intermediate' as const,
    equipment: 'Barra y Pesas',
    image: '/images/bench-press.jpg',
  },
  {
    id: '2',
    name: 'Sentadillas',
    muscleGroup: 'Piernas',
    difficulty: 'Advanced' as const,
    equipment: 'Barra y Pesas',
    image: '/images/squats.jpg',
  },
];

describe('NextExercises', () => {
  it('muestra el estado de carga correctamente', () => {
    render(<NextExercises isLoading={true} exercises={[]} />);

    expect(screen.getByRole('status', { name: /cargando ejercicios/i })).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('muestra mensaje cuando no hay ejercicios', () => {
    render(<NextExercises exercises={[]} />);

    expect(
      screen.getByRole('status', { name: /no hay ejercicios programados/i })
    ).toBeInTheDocument();
  });

  it('muestra los ejercicios correctamente', () => {
    render(<NextExercises exercises={mockExercises} />);

    expect(screen.getByText('Press de Banca')).toBeInTheDocument();
    expect(screen.getByText('Sentadillas')).toBeInTheDocument();

    expect(screen.getByText('Grupo muscular: Pecho')).toBeInTheDocument();
    expect(screen.getByText('Grupo muscular: Piernas')).toBeInTheDocument();

    const difficultyLabels = screen.getAllByRole('status', { name: /dificultad:/i });
    expect(difficultyLabels).toHaveLength(2);
    expect(difficultyLabels[0]).toHaveTextContent('Intermediate');
    expect(difficultyLabels[1]).toHaveTextContent('Advanced');
  });

  it('muestra mensaje de error cuando hay un error', () => {
    const errorMessage = 'Error al cargar ejercicios';
    render(<NextExercises error={errorMessage} exercises={[]} />);

    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(errorMessage);
  });

  it('muestra las imágenes con alt text descriptivo', () => {
    render(<NextExercises exercises={mockExercises} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'Imagen de Press de Banca');
    expect(images[1]).toHaveAttribute('alt', 'Imagen de Sentadillas');
  });

  it('tiene la estructura correcta de encabezados', () => {
    render(<NextExercises exercises={mockExercises} />);

    const mainTitle = screen.getByRole('heading', { level: 2, name: /próximos ejercicios/i });
    expect(mainTitle).toBeInTheDocument();

    const exerciseTitles = screen.getAllByRole('heading', { level: 3 });
    expect(exerciseTitles).toHaveLength(2);
    expect(exerciseTitles[0]).toHaveTextContent('Press de Banca');
    expect(exerciseTitles[1]).toHaveTextContent('Sentadillas');
  });

  it('muestra el equipo necesario para cada ejercicio', () => {
    render(<NextExercises exercises={mockExercises} />);

    const equipmentLabels = screen.getAllByRole('status', { name: /equipo necesario:/i });
    expect(equipmentLabels).toHaveLength(2);
    expect(equipmentLabels[0]).toHaveTextContent('Barra y Pesas');
    expect(equipmentLabels[1]).toHaveTextContent('Barra y Pesas');
  });

  it('renders empty state when no exercises', () => {
    render(<NextExercises exercises={[]} />);
    expect(screen.getByText('No hay ejercicios programados')).toBeInTheDocument();
  });

  it('links to exercise details', () => {
    render(<NextExercises exercises={mockExercises} />);

    mockExercises.forEach(exercise => {
      const link = screen.getByRole('link', { name: new RegExp(exercise.name, 'i') });
      expect(link).toHaveAttribute('href', `/exercises/${exercise.id}`);
    });
  });

  it('shows difficulty badges', () => {
    render(<NextExercises exercises={mockExercises} />);

    expect(screen.getByText(mockExercises[0].muscleGroup)).toBeInTheDocument();
    expect(screen.getByText(mockExercises[1].muscleGroup)).toBeInTheDocument();
  });
});
