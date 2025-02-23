import { render, screen } from '@testing-library/react';
import { StatsPanel } from './StatsPanel';

// Mock de los componentes hijos si es necesario
jest.mock('./StatItem', () => ({
  StatItem: ({ label, value }: { label: string; value: string | number }) => (
    <div data-testid="stat-item">
      {label}: {value}
    </div>
  ),
}));

describe('StatsPanel', () => {
  const mockStats = {
    totalWorkouts: 150,
    totalTime: '45h 30m',
    avgWorkoutTime: '30m',
    completionRate: '85%',
  };

  it('renderiza todas las estadísticas correctamente', () => {
    render(<StatsPanel stats={mockStats} />);

    expect(screen.getByText(/entrenamientos totales/i)).toBeInTheDocument();
    expect(screen.getByText(/tiempo total/i)).toBeInTheDocument();
    expect(screen.getByText(/tiempo promedio/i)).toBeInTheDocument();
    expect(screen.getByText(/tasa de finalización/i)).toBeInTheDocument();
  });

  it('muestra el estado de carga', () => {
    render(<StatsPanel isLoading />);

    expect(screen.getByTestId('stats-skeleton')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando falla la carga', () => {
    render(<StatsPanel error="Error al cargar estadísticas" />);

    expect(screen.getByText(/error al cargar estadísticas/i)).toBeInTheDocument();
  });

  it('formatea los valores correctamente', () => {
    render(<StatsPanel stats={mockStats} />);

    const statItems = screen.getAllByTestId('stat-item');
    expect(statItems[0]).toHaveTextContent('150');
    expect(statItems[1]).toHaveTextContent('45h 30m');
    expect(statItems[2]).toHaveTextContent('30m');
    expect(statItems[3]).toHaveTextContent('85%');
  });
});
