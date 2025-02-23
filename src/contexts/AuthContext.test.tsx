import { render, screen, act, fireEvent } from '@testing-library/react';
import { AuthContext, AuthProvider, useAuthContext } from './AuthContext';
import { renderHook } from '@testing-library/react';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
        error: null,
      }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      onAuthStateChange: jest.fn(),
    },
  },
}));

const TestComponent = () => {
  const { login, logout, loading, user } = useAuthContext();
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('throws error when used outside provider', () => {
    // Silenciar el error de consola esperado
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow('useAuthContext must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  it('provides default values', () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });
    expect(result.current.user).toBe(null);
    expect(result.current.loading).toBe(true);
  });
});

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('proporciona el estado inicial correcto', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('null');
  });

  it('maneja el inicio de sesión correctamente', async () => {
    const mockUser = { email: 'test@example.com' };
    const signInPromise = Promise.resolve({ data: { user: mockUser }, error: null });
    (supabase.auth.signInWithPassword as jest.Mock).mockReturnValue(signInPromise);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');

    await act(async () => {
      fireEvent.click(loginButton);
      await signInPromise;
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('maneja el cierre de sesión correctamente', async () => {
    const signOutPromise = Promise.resolve({ error: null });
    (supabase.auth.signOut as jest.Mock).mockReturnValue(signOutPromise);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');

    await act(async () => {
      fireEvent.click(logoutButton);
      await signOutPromise;
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
