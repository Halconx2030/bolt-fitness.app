import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseCard from './ExerciseCard';
import { MockExercise } from '@/types/test-types';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('ExerciseCard', () => {
  const mockExercise: MockExercise = {
    id: '1',
    name: 'Bench Press',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    image: '/exercises/bench-press.jpg',
    description: 'Classic chest exercise',
  };

  it('renders exercise details correctly', () => {
    render(<ExerciseCard exercise={mockExercise} />);

    expect(screen.getByText(mockExercise.name)).toBeInTheDocument();
    expect(screen.getByText(mockExercise.muscleGroup)).toBeInTheDocument();
    expect(screen.getByText(mockExercise.difficulty)).toBeInTheDocument();
    expect(screen.getByAltText(mockExercise.name)).toHaveAttribute('src', mockExercise.image);
  });

  it('links to exercise details page', () => {
    render(<ExerciseCard exercise={mockExercise} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/exercises/${mockExercise.id}`);
  });

  it('shows difficulty badge with correct color', () => {
    const { rerender } = render(<ExerciseCard exercise={mockExercise} />);
    expect(screen.getByText('Intermediate')).toHaveClass('bg-yellow-500');

    rerender(<ExerciseCard exercise={{ ...mockExercise, difficulty: 'Beginner' }} />);
    expect(screen.getByText('Beginner')).toHaveClass('bg-green-500');

    rerender(<ExerciseCard exercise={{ ...mockExercise, difficulty: 'Advanced' }} />);
    expect(screen.getByText('Advanced')).toHaveClass('bg-red-500');
  });

  it('truncates long descriptions', () => {
    const longDescription = 'A '.repeat(100);
    render(<ExerciseCard exercise={{ ...mockExercise, description: longDescription }} />);

    const description = screen.getByText(/A A A A/i);
    expect(description.textContent?.length).toBeLessThanOrEqual(75); // 72 chars + '...'
  });

  it('handles hover state', () => {
    render(<ExerciseCard exercise={mockExercise} />);

    const card = screen.getByTestId('exercise-card');
    fireEvent.mouseEnter(card);
    expect(card).toHaveClass('transform', 'scale-105');

    fireEvent.mouseLeave(card);
    expect(card).not.toHaveClass('scale-105');
  });
});
