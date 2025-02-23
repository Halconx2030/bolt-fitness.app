import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from './Navbar';

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: null,
    loading: false,
  }),
}));

describe('Navbar', () => {
  const renderWithAuth = (ui: React.ReactElement) => {
    return render(<AuthProvider>{ui}</AuthProvider>);
  };

  it('muestra enlaces de navegación', () => {
    renderWithAuth(<Navbar />);

    expect(screen.getByText(/ejercicios/i)).toBeInTheDocument();
    expect(screen.getByText(/rutinas/i)).toBeInTheDocument();
  });

  it('muestra menú de usuario cuando está autenticado', () => {
    jest.mocked(useAuth).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    renderWithAuth(<Navbar />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('muestra enlace de inicio de sesión cuando no está autenticado', () => {
    jest.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithAuth(<Navbar />);

    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });
});
