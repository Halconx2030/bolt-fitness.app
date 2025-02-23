import { render, screen } from '@testing-library/react';
import { RecentActivity } from './RecentActivity';
import { MockActivity } from '@/types/test-types';

// Mock del componente ActivityItem
jest.mock('./ActivityItem', () => ({
  ActivityItem: ({ activity }: { activity: MockActivity }) => (
    <div data-testid="activity-item">
      {activity.type}: {activity.description}
    </div>
  ),
}));

const mockActivities: MockActivity[] = [
  {
    id: '1',
    type: 'exercise_completed',
    description: 'Completó entrenamiento de pecho',
    createdAt: new Date().toISOString(),
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: '2',
    type: 'achievement_unlocked',
    description: 'Logró nuevo récord personal',
    createdAt: new Date().toISOString(),
    user: {
      name: 'Jane Doe',
      email: 'jane@example.com',
    },
  },
];

describe('RecentActivity', () => {
  it('renderiza la lista de actividades correctamente', () => {
    render(<RecentActivity activities={mockActivities} />);

    const activityItems = screen.getAllByTestId('activity-item');
    expect(activityItems).toHaveLength(2);
    expect(activityItems[0]).toHaveTextContent(/completó entrenamiento/i);
    expect(activityItems[1]).toHaveTextContent(/logró nuevo récord/i);
  });

  it('muestra mensaje cuando no hay actividades', () => {
    render(<RecentActivity activities={[]} />);

    expect(screen.getByText(/no hay actividad reciente/i)).toBeInTheDocument();
  });

  it('muestra el estado de carga', () => {
    render(<RecentActivity isLoading />);

    expect(screen.getByTestId('activity-skeleton')).toBeInTheDocument();
  });

  it('muestra mensaje de error', () => {
    render(<RecentActivity error="Error al cargar actividades" />);

    expect(screen.getByText(/error al cargar actividades/i)).toBeInTheDocument();
  });

  it('limita el número de actividades mostradas', () => {
    const manyActivities: MockActivity[] = Array(10)
      .fill(null)
      .map((_, i) => ({
        id: i.toString(),
        type: 'exercise_completed',
        description: `Actividad ${i}`,
        createdAt: new Date().toISOString(),
        user: {
          name: `User ${i}`,
          email: `user${i}@example.com`,
        },
      }));

    render(<RecentActivity activities={manyActivities} limit={5} />);

    const activityItems = screen.getAllByTestId('activity-item');
    expect(activityItems).toHaveLength(5);
  });
});
