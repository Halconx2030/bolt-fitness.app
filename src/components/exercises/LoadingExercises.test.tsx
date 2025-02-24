import { render, screen } from '@testing-library/react';
import { LoadingExercises } from './LoadingExercises';

// Mock del componente Skeleton
jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

describe('LoadingExercises', () => {
  it('renderiza el número correcto de skeletons', () => {
    render(<LoadingExercises />);

    // 6 contenedores con 3 skeletons cada uno (imagen, título y descripción)
    expect(screen.getAllByTestId('skeleton')).toHaveLength(18);
  });

  it('aplica las clases de grid correctamente', () => {
    const { container } = render(<LoadingExercises />);

    const grid = container.firstChild;
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
  });

  it('aplica las clases de skeleton correctamente', () => {
    render(<LoadingExercises />);

    const skeletons = screen.getAllByTestId('skeleton');

    // Verifica las clases del skeleton de imagen
    for (let i = 0; i < 6; i++) {
      expect(skeletons[i * 3]).toHaveClass('h-[200px]', 'w-full', 'rounded-xl');
    }

    // Verifica las clases del skeleton de título
    for (let i = 0; i < 6; i++) {
      expect(skeletons[i * 3 + 1]).toHaveClass('h-4', 'w-[250px]');
    }

    // Verifica las clases del skeleton de descripción
    for (let i = 0; i < 6; i++) {
      expect(skeletons[i * 3 + 2]).toHaveClass('h-4', 'w-[200px]');
    }
  });

  it('aplica las clases de espacio correctamente', () => {
    const { container } = render(<LoadingExercises />);

    const items = container.querySelectorAll('.flex.flex-col');
    items.forEach(item => {
      expect(item).toHaveClass('space-y-3');

      const contentContainer = item.querySelector('div:nth-child(2)');
      expect(contentContainer).toHaveClass('space-y-2');
    });
  });
});
