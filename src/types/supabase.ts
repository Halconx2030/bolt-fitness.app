export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nombre: string;
          avatar_url: string | null;
          nivel: number;
          puntos_totales: number;
          ejercicios_completados: number;
          racha_actual: number;
          mejor_racha: number;
          fecha_registro: string;
        };
        Insert: {
          email: string;
          nombre: string;
          password: string;
          avatar_url?: string;
        };
        Update: {
          email?: string;
          nombre?: string;
          avatar_url?: string;
          nivel?: number;
          puntos_totales?: number;
          ejercicios_completados?: number;
          racha_actual?: number;
          mejor_racha?: number;
        };
      };
      exercises: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string;
          nivel_requerido: string;
          puntos: number;
          tiempo_estimado: number | null;
          categoria: string;
          completado_por: number;
          fecha_creacion: string;
        };
        Insert: {
          nombre: string;
          descripcion: string;
          nivel_requerido: string;
          puntos: number;
          tiempo_estimado?: number;
          categoria: string;
        };
        Update: {
          nombre?: string;
          descripcion?: string;
          nivel_requerido?: string;
          puntos?: number;
          tiempo_estimado?: number;
          categoria?: string;
          completado_por?: number;
        };
      };
    };
    Functions: {
      get_user_progress: {
        Args: { user_id: string };
        Returns: {
          ejercicios_completados: number;
          puntos_totales: number;
          racha_actual: number;
        };
      };
    };
  };
}
