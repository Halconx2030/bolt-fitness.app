import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExerciseComments from './ExerciseComments';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('ExerciseComments', () => {
  const mockComments = [
    {
      id: '1',
      content: 'Great exercise!',
      createdAt: '2024-01-20T10:00:00Z',
      user: {
        name: 'John Doe',
        image: '/avatars/john.jpg',
      },
    },
    {
      id: '2',
      content: 'Really helpful tips',
      createdAt: '2024-01-19T15:30:00Z',
      user: {
        name: 'Jane Smith',
        image: '/avatars/jane.jpg',
      },
    },
  ];

  const mockOnAddComment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders comments list correctly', () => {
    render(<ExerciseComments comments={mockComments} onAddComment={mockOnAddComment} />);

    mockComments.forEach(comment => {
      expect(screen.getByText(comment.content)).toBeInTheDocument();
      expect(screen.getByText(comment.user.name)).toBeInTheDocument();
      expect(screen.getByAltText(comment.user.name)).toHaveAttribute('src', comment.user.image);
    });
  });

  it('shows empty state when no comments', () => {
    render(<ExerciseComments comments={[]} onAddComment={mockOnAddComment} />);
    expect(screen.getByText('No hay comentarios aún')).toBeInTheDocument();
  });

  it('handles new comment submission', async () => {
    render(<ExerciseComments comments={mockComments} onAddComment={mockOnAddComment} />);

    const input = screen.getByPlaceholderText(/escribe un comentario/i);
    const submitButton = screen.getByRole('button', { name: /comentar/i });

    await userEvent.type(input, 'New comment');
    await userEvent.click(submitButton);

    expect(mockOnAddComment).toHaveBeenCalledWith('New comment');
    expect(input).toHaveValue('');
  });

  it('disables submit button when input is empty', () => {
    render(<ExerciseComments comments={mockComments} onAddComment={mockOnAddComment} />);

    const submitButton = screen.getByRole('button', { name: /comentar/i });
    expect(submitButton).toBeDisabled();
  });

  it('formats dates correctly', () => {
    render(<ExerciseComments comments={mockComments} onAddComment={mockOnAddComment} />);

    expect(screen.getByText(/20 Jan 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/19 Jan 2024/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ExerciseComments comments={mockComments} onAddComment={mockOnAddComment} isLoading />);

    expect(screen.getAllByTestId('comment-skeleton')).toHaveLength(2);
  });
});
