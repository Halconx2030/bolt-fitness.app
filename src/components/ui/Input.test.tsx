import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('renderiza correctamente', () => {
    render(<Input aria-label="test-input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('maneja cambios de valor', () => {
    const handleChange = jest.fn();
    render(<Input aria-label="test-input" onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test value' },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('aplica clases base correctamente', () => {
    const { container } = render(<Input aria-label="test-input" />);

    expect(container.firstChild).toHaveClass(
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-background',
      'px-3',
      'py-2',
      'text-sm'
    );
  });

  it('maneja estado deshabilitado', () => {
    render(<Input aria-label="test-input" disabled />);
    const input = screen.getByRole('textbox');

    expect(input).toBeDisabled();
    expect(input).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('acepta className personalizada', () => {
    const { container } = render(<Input aria-label="test-input" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('maneja estado de error', () => {
    const { container } = render(<Input aria-label="test-input" error="Campo requerido" />);
    expect(container.firstChild).toHaveClass('border-destructive');
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });
});
