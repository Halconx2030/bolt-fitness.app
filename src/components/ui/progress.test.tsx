import { render } from '@testing-library/react';
import { Progress } from './progress';

// Mock de la función cn
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.join(' '),
}));

describe('Progress', () => {
  it('renderiza con valores por defecto', () => {
    const { container } = render(<Progress value={50} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('aplica className personalizada', () => {
    const { container } = render(<Progress value={75} className="custom-progress" />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar?.className).toContain('custom-progress');
  });

  it('ajusta el valor entre min y max', () => {
    const { container } = render(<Progress value={150} min={0} max={100} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('maneja valores negativos correctamente', () => {
    const { container } = render(<Progress value={-50} min={0} max={100} />);

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('actualiza el estilo de la barra de progreso', () => {
    const { container } = render(<Progress value={60} />);

    const progressIndicator = container.querySelector('[data-testid="progress-indicator"]');
    expect(progressIndicator).toHaveStyle({ transform: 'translateX(-40%)' });
  });
});
