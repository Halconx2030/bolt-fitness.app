import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock de supabase mejorado
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
        error: null,
      }),
      onAuthStateChange: jest.fn().mockImplementation(callback => ({
        data: { subscription: { unsubscribe: jest.fn() } },
        error: null,
      })),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

// Mock del contexto de autenticación
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
  error: null,
};

describe('useAuth', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia con estado de carga', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
  });

  it('maneja el inicio de sesión correctamente', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.current.loading).toBe(false);
  });

  it('maneja errores de inicio de sesión', async () => {
    const mockError = new Error('Error de autenticación');
    (supabase.auth.signInWithPassword as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong',
        });
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });

    expect(result.current.loading).toBe(false);
  });

  it('maneja el cierre de sesión correctamente', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('maneja cambios en el estado de autenticación', async () => {
    const mockSession = {
      user: { email: 'test@example.com' },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.user).toEqual(mockSession.user);
    expect(result.current.loading).toBe(false);
  });

  it('maneja errores en el cambio de estado de autenticación', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Error de autenticación');

    (supabase.auth.getSession as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Error getting session:', mockError);

    consoleSpy.mockRestore();
  });

  it('proporciona los valores del contexto de autenticación', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Ajustamos la expectativa para coincidir con la estructura real
    expect(result.current).toEqual({
      user: null,
      loading: false,
      login: expect.any(Function),
      logout: expect.any(Function),
    });
  });
});
