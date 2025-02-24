import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge', () => {
  it('renderiza correctamente', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('aplica variantes correctamente', () => {
    const { container } = render(<Badge variant="destructive">Warning</Badge>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('acepta clases personalizadas', () => {
    const { container } = render(<Badge className="custom-class">Custom Badge</Badge>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('aplica variante por defecto cuando no se especifica', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });
});
