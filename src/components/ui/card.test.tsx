import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { ClassValue } from 'clsx';

// Mock del componente cn para evitar problemas con tailwind
jest.mock('@/lib/utils', () => ({
  cn: (...args: ClassValue[]) => args.join(' '),
}));

describe('Card Components', () => {
  it('renderiza Card con las clases base correctamente', () => {
    const { container } = render(<Card>Test Content</Card>);
    expect(container.firstChild).toHaveClass(
      'rounded-lg',
      'border',
      'bg-card',
      'text-card-foreground',
      'shadow-sm'
    );
  });

  it('renderiza CardHeader con el espaciado correcto', () => {
    const { container } = render(<CardHeader>Header Content</CardHeader>);
    expect(container.firstChild).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
  });

  it('renderiza CardTitle con el estilo correcto', () => {
    const { container } = render(<CardTitle>Card Title</CardTitle>);
    expect(container.firstChild).toHaveClass(
      'text-2xl',
      'font-semibold',
      'leading-none',
      'tracking-tight'
    );
  });

  it('renderiza CardDescription con el color correcto', () => {
    const { container } = render(<CardDescription>Card Description</CardDescription>);
    expect(container.firstChild).toHaveClass('text-sm', 'text-muted-foreground');
  });

  it('renderiza CardContent con padding', () => {
    const { container } = render(<CardContent>Content</CardContent>);
    expect(container.firstChild).toHaveClass('p-6', 'pt-0');
  });

  it('renderiza CardFooter con espaciado', () => {
    const { container } = render(<CardFooter>Footer Content</CardFooter>);
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
  });

  it('combina componentes Card correctamente', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título de Prueba</CardTitle>
          <CardDescription>Descripción de prueba</CardDescription>
        </CardHeader>
        <CardContent>Contenido de prueba</CardContent>
        <CardFooter>Pie de prueba</CardFooter>
      </Card>
    );

    expect(screen.getByText('Título de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument();
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
    expect(screen.getByText('Pie de prueba')).toBeInTheDocument();
  });

  it('acepta className personalizada', () => {
    const { container } = render(<Card className="custom-class">Test Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
