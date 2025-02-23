/**
 * Hook personalizado para gestionar la autenticación
 * @module useAuth
 * @example
 * ```tsx
 * const { user, loading, login, logout } = useAuth();
 *
 * // Iniciar sesión
 * const handleLogin = async () => {
 *   try {
 *     await login('user@example.com', 'password');
 *   } catch (error) {
 *     console.error('Error al iniciar sesión:', error);
 *   }
 * };
 * ```
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

/**
 * Error personalizado para autenticación
 */
interface AuthError extends Error {
  /** Mensaje descriptivo del error */
  message: string;
  /** Código opcional del error */
  code?: string;
}

interface AuthResponse {
  ok: boolean;
  error?: string;
  user?: User | null;
}

/**
 * Hook para gestionar la autenticación de usuarios
 * @returns Objeto con el estado y métodos de autenticación
 * @property {User | null} user - Current authenticated user
 * @property {boolean} loading - Loading state
 * @property {(email: string, password: string) => Promise<AuthResponse>} login - Login function
 * @property {() => Promise<AuthResponse>} logout - Logout function
 */
export const useAuth = () => {
  /** Estado del usuario actual */
  const [user, setUser] = useState<User | null>(null);
  /** Estado de carga de la autenticación */
  const [loading, setLoading] = useState(false);
  /** Estado de error de la autenticación */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Obtiene la sesión inicial del usuario
     * @async
     */
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        setUser(session?.user ?? null);
      } catch (error: unknown) {
        const authError = error as AuthError;
        console.error('Error getting session:', authError);
        setError(authError.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Inicia sesión con email y contraseña
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Resultado del inicio de sesión
   * @throws {AuthError} Si hay un error durante el login
   */
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      return { ok: true, user: data.user };
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message);
      return { ok: false, error: authError.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra la sesión del usuario actual
   * @async
   * @throws {AuthError} Si hay un error durante el logout
   */
  const logout = async (): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      return { ok: true };
    } catch (error: unknown) {
      const authError = error as AuthError;
      setError(authError.message);
      return { ok: false, error: authError.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
  };
};
