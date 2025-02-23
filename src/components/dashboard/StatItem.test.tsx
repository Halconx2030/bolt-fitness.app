import { render, screen } from '@testing-library/react';
import StatItem from './StatItem';

describe('StatItem', () => {
  it('renderiza el valor y etiqueta correctamente', () => {
    render(<StatItem value={100} label="Ejercicios" />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Ejercicios')).toBeInTheDocument();
  });

  it('renderiza el icono cuando se proporciona', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;

    render(<StatItem value={100} label="Ejercicios" icon={<TestIcon />} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('aplica las clases base correctamente', () => {
    const { container } = render(<StatItem value={100} label="Ejercicios" />);

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass('flex', 'items-center', 'p-4', 'bg-white', 'rounded-lg', 'shadow');
  });

  it('maneja valores de tipo string', () => {
    render(<StatItem value="45m" label="Tiempo" />);

    expect(screen.getByText('45m')).toBeInTheDocument();
  });
});
