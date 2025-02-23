import { render, screen } from '@testing-library/react';
import ActivityItem from './ActivityItem';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ActivityItem', () => {
  const mockActivity = {
    id: '1',
    type: 'exercise',
    description: 'Completó entrenamiento de pecho',
    createdAt: new Date().toISOString(),
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  };

  it('renderiza la descripción de la actividad', () => {
    render(<ActivityItem activity={mockActivity} />);
    expect(screen.getByText(mockActivity.description)).toBeInTheDocument();
  });

  it('muestra el tiempo relativo', () => {
    render(<ActivityItem activity={mockActivity} />);
    const expectedTime = formatDistanceToNow(new Date(mockActivity.createdAt), {
      addSuffix: true,
      locale: es,
    });
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });

  it('muestra el icono correcto según el tipo', () => {
    const { container } = render(<ActivityItem activity={mockActivity} />);
    expect(container.querySelector('[data-testid="exercise-icon"]')).toBeInTheDocument();
  });

  it('enlaza al perfil del usuario', () => {
    render(<ActivityItem activity={mockActivity} />);
    const userLink = screen.getByRole('link', { name: mockActivity.user.name });
    expect(userLink).toHaveAttribute('href', `/profile/${mockActivity.user.name}`);
  });

  it('formatea la fecha correctamente', () => {
    const date = new Date('2024-01-20T12:00:00Z');
    render(
      <ActivityItem
        activity={{
          ...mockActivity,
          createdAt: date.toISOString(),
        }}
      />
    );

    expect(screen.getByTestId('activity-time')).toHaveTextContent('hace menos de un minuto');
  });

  it('renders activity details correctly', () => {
    render(<ActivityItem activity={mockActivity} />);

    expect(screen.getByText(mockActivity.description)).toBeInTheDocument();
  });

  it('shows different icon based on activity type', () => {
    const exerciseActivity = { ...mockActivity, type: 'exercise_completed' as const };
    const achievementActivity = { ...mockActivity, type: 'achievement_unlocked' as const };

    const { rerender } = render(<ActivityItem activity={exerciseActivity} />);
    expect(screen.getByTestId('exercise-icon')).toBeInTheDocument();

    rerender(<ActivityItem activity={achievementActivity} />);
    expect(screen.getByTestId('achievement-icon')).toBeInTheDocument();
  });

  it('handles unknown activity type', () => {
    const unknownActivity = {
      ...mockActivity,
      // @ts-ignore - Testing invalid type
      type: 'unknown_type',
    };

    const { container } = render(<ActivityItem activity={unknownActivity} />);
    const iconContainer = container.querySelector('.flex-shrink-0');
    expect(iconContainer).toBeEmptyDOMElement();
  });
});
