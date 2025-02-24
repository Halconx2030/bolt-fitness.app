import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectTrigger, SelectContent, SelectItem } from './Select';
import { ClassValue } from 'clsx';

// Mock del componente cn para evitar problemas con tailwind
jest.mock('@/lib/utils', () => ({
  cn: (...args: ClassValue[]) => args.join(' '),
}));

describe('Select Components', () => {
  it('renderiza el Select completo correctamente', () => {
    render(
      <Select defaultValue="1">
        <SelectTrigger aria-label="Select option">
          <span>Seleccionar opción</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Opción 1</SelectItem>
          <SelectItem value="2">Opción 2</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(screen.getByLabelText('Select option')).toBeInTheDocument();
  });

  it('aplica clases base al SelectTrigger', () => {
    const { container } = render(
      <SelectTrigger>
        <span>Trigger</span>
      </SelectTrigger>
    );

    expect(container.firstChild).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'items-center',
      'justify-between',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm'
    );
  });

  it('aplica clases base al SelectContent', () => {
    const { container } = render(
      <SelectContent>
        <SelectItem value="1">Opción 1</SelectItem>
      </SelectContent>
    );

    expect(container.firstChild).toHaveClass(
      'relative',
      'z-50',
      'min-w-[8rem]',
      'overflow-hidden',
      'rounded-md',
      'border',
      'bg-popover',
      'text-popover-foreground',
      'shadow-md'
    );
  });

  it('maneja la selección de items correctamente', () => {
    const handleValueChange = jest.fn();

    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          <span>Seleccionar</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Opción 1</SelectItem>
          <SelectItem value="2">Opción 2</SelectItem>
        </SelectContent>
      </Select>
    );

    fireEvent.click(screen.getByText('Seleccionar'));
    fireEvent.click(screen.getByText('Opción 1'));

    expect(handleValueChange).toHaveBeenCalledWith('1');
  });

  it('maneja estado deshabilitado', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <span>Deshabilitado</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Opción 1</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByText('Deshabilitado').parentElement;
    expect(trigger).toHaveAttribute('data-state', 'disabled');
    expect(trigger).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('acepta className personalizada', () => {
    const { container } = render(
      <SelectTrigger className="custom-class">
        <span>Custom Select</span>
      </SelectTrigger>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
