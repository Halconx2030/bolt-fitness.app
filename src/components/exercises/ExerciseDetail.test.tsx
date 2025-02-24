import { render, screen, fireEvent } from '@testing-library/react';
import { ExerciseDetail } from './ExerciseDetail';
import { ButtonProps } from '@/components/ui/button';

// Usar un div simple en lugar de Card
jest.mock('@/components/ui/card', () => {
  const MockCard = ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="mock-card" {...props}>
      {children}
    </div>
  );
  MockCard.displayName = 'Card';
  return {
    __esModule: true,
    Card: MockCard,
    default: MockCard,
  };
});

jest.mock('@/components/ui/button', () => {
  const MockButton = (props: ButtonProps) => <button {...props} />;
  MockButton.displayName = 'Button';
  return { Button: MockButton };
});

// Usar un div simple en lugar de Progress
jest.mock('@/components/ui/progress', () => {
  const MockProgress = ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="progress" {...props}>
      {children}
    </div>
  );
  MockProgress.displayName = 'Progress';
  return {
    __esModule: true,
    Progress: MockProgress,
    default: MockProgress,
  };
});

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

describe('ExerciseDetail', () => {
  const mockExercise = {
    id: '1',
    name: 'Bench Press',
    description: 'Classic chest exercise',
    muscleGroup: 'Chest',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    image: '/exercises/bench-press.jpg',
    instructions: [
      'Lie on the bench',
      'Grip the bar with hands slightly wider than shoulders',
      'Lower the bar to chest level',
      'Push the bar back up',
    ],
    tips: ['Keep your back flat on the bench', 'Maintain control throughout the movement'],
    videoUrl: 'https://example.com/bench-press.mp4',
  };

  const mockOnStartExercise = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders exercise details correctly', () => {
    render(<ExerciseDetail exercise={mockExercise} onStartExercise={mockOnStartExercise} />);

    expect(screen.getByText(mockExercise.name)).toBeInTheDocument();
    expect(screen.getByText(mockExercise.description)).toBeInTheDocument();
    expect(screen.getByText(mockExercise.muscleGroup)).toBeInTheDocument();
    expect(screen.getByText(mockExercise.difficulty)).toBeInTheDocument();
  });

  it('displays instructions as numbered list', () => {
    render(<ExerciseDetail exercise={mockExercise} onStartExercise={mockOnStartExercise} />);

    mockExercise.instructions.forEach((instruction, index) => {
      const number = index + 1;
      const listItems = screen.getAllByRole('listitem');
      const matchingItem = listItems.find(
        item =>
          item.textContent?.includes(instruction) && item.textContent?.includes(number.toString())
      );
      expect(matchingItem).toBeInTheDocument();
    });
  });

  it('shows tips section', () => {
    render(<ExerciseDetail exercise={mockExercise} onStartExercise={mockOnStartExercise} />);

    expect(screen.getByText('Tips')).toBeInTheDocument();
    mockExercise.tips.forEach(tip => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });

  it('handles start exercise button click', () => {
    render(<ExerciseDetail exercise={mockExercise} onStartExercise={mockOnStartExercise} />);

    const startButton = screen.getByRole('button', { name: /comenzar ejercicio/i });
    fireEvent.click(startButton);
    expect(mockOnStartExercise).toHaveBeenCalledWith(mockExercise.id);
  });

  it('shows loading skeleton', () => {
    render(
      <ExerciseDetail exercise={mockExercise} onStartExercise={mockOnStartExercise} isLoading />
    );

    expect(screen.getByTestId('exercise-detail-skeleton')).toBeInTheDocument();
  });

  it('displays video when available', () => {
    render(<ExerciseDetail exercise={mockExercise} onStartExercise={mockOnStartExercise} />);

    const video = screen.getByTestId('exercise-video');
    expect(video).toHaveAttribute('src', mockExercise.videoUrl);
  });
});
