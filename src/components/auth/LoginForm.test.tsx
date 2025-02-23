import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { useAuth } from '@/hooks/useAuth';

// Mock del hook useAuth
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('LoginForm', () => {
  const mockLogin = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false,
    });
  });

  it('renderiza el formulario correctamente', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('maneja el envío del formulario correctamente', async () => {
    mockLogin.mockResolvedValueOnce({ ok: true });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('muestra error de validación para email inválido', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email inválido');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('muestra error de validación para contraseña corta', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123');

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'La contraseña debe tener al menos 6 caracteres'
    );
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('muestra mensaje de error de la API', async () => {
    mockLogin.mockResolvedValueOnce({
      ok: false,
      error: 'Credenciales inválidas',
    });

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'password123');

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas');
  });

  it('deshabilita el botón durante la carga', () => {
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: true,
    });

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /iniciando sesión/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });
});
