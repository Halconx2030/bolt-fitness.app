import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavLink from './NavLink';
import { ClassValue } from 'clsx';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock del componente cn para evitar problemas con tailwind
jest.mock('@/lib/utils', () => ({
  cn: (...args: ClassValue[]) => args.join(' '),
}));

describe('NavLink', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renderiza el enlace correctamente', () => {
    render(<NavLink href="/test">Test Link</NavLink>);

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toHaveAttribute('href', '/test');
  });

  it('aplica clases base correctamente', () => {
    const { container } = render(<NavLink href="/test">Test Link</NavLink>);

    expect(container.firstChild).toHaveClass(
      'inline-flex',
      'items-center',
      'text-sm',
      'font-medium',
      'transition-colors'
    );
  });

  it('marca el enlace como activo cuando coincide con la ruta actual', () => {
    (usePathname as jest.Mock).mockReturnValue('/test');

    const { container } = render(<NavLink href="/test">Test Link</NavLink>);

    expect(container.firstChild).toHaveClass('text-foreground');
  });

  it('marca el enlace como inactivo cuando no coincide con la ruta actual', () => {
    (usePathname as jest.Mock).mockReturnValue('/other');

    const { container } = render(<NavLink href="/test">Test Link</NavLink>);

    expect(container.firstChild).toHaveClass('text-muted-foreground');
  });

  it('acepta className personalizada', () => {
    const { container } = render(
      <NavLink href="/test" className="custom-class">
        Test Link
      </NavLink>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('maneja rutas con parámetros dinámicos', () => {
    (usePathname as jest.Mock).mockReturnValue('/users/123');

    const { container } = render(
      <NavLink href="/users/[id]" as="/users/123">
        User Profile
      </NavLink>
    );

    expect(container.firstChild).toHaveClass('text-foreground');
  });
});
