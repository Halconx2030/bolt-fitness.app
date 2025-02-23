import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

// Mock más completo y consistente
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn().mockImplementation(callback => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inicia con estado inicial correcto', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('maneja el inicio de sesión correctamente', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    let response;
    await act(async () => {
      response = await result.current.login('test@example.com', 'password123');
    });

    expect(response.ok).toBe(true);
    expect(response.user).toEqual(mockUser);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('maneja errores de inicio de sesión', async () => {
    const mockError = new Error('Credenciales inválidas');
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: null },
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    let response;
    await act(async () => {
      response = await result.current.login('test@example.com', 'wrong');
    });

    expect(response.ok).toBe(false);
    expect(response.error).toBe(mockError.message);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError.message);
  });

  it('maneja el cierre de sesión correctamente', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    let response;
    await act(async () => {
      response = await result.current.logout();
    });

    expect(response.ok).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('maneja errores en el cierre de sesión', async () => {
    const mockError = new Error('Error al cerrar sesión');
    (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    let response;
    await act(async () => {
      response = await result.current.logout();
    });

    expect(response.ok).toBe(false);
    expect(response.error).toBe(mockError.message);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError.message);
  });

  it('maneja cambios en el estado de autenticación', async () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    let authStateCallback: any;

    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation(callback => {
      authStateCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      };
    });

    const { result } = renderHook(() => useAuth());

    act(() => {
      authStateCallback('SIGNED_IN', { user: mockUser });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
