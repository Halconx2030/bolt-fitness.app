import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { ClassValue } from 'clsx';

// Mock del componente cn para evitar problemas con tailwind
jest.mock('@/lib/utils', () => ({
  cn: (...args: ClassValue[]) => args.join(' '),
}));

describe('Button', () => {
  it('renderiza el contenido correctamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('maneja eventos de click', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('aplica variantes de estilo correctamente', () => {
    const { container } = render(<Button variant="outline">Outline Button</Button>);
    expect(container.firstChild).toHaveClass('border', 'border-input', 'bg-background');
  });

  it('aplica tamaños correctamente', () => {
    const { container } = render(<Button size="sm">Small Button</Button>);
    expect(container.firstChild).toHaveClass('h-9', 'px-3');
  });

  it('maneja estado deshabilitado', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('renderiza como link cuando se proporciona href', () => {
    render(<Button href="/test">Link Button</Button>);
    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex', 'items-center');
  });

  it('acepta className personalizada', () => {
    const { container } = render(<Button className="custom-class">Custom Button</Button>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('maneja estado de carga', () => {
    render(<Button loading>Loading Button</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
