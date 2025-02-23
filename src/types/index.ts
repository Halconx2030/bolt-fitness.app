// Enums
export enum NivelRequerido {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado'
}

export enum TipoLogro {
  EJERCICIO = 'ejercicio',
  RACHA = 'racha',
  PUNTOS = 'puntos'
}

// Interfaces base
export interface Exercise {
  id: number;
  nombre: string;
  descripcion: string;
  nivel_requerido: NivelRequerido;
  puntos: number;
  tiempo_estimado?: number;
  categoria: string;
  completado_por: number;
  fecha_creacion: Date;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  avatar_url?: string;
  nivel: number;
  puntos_totales: number;
  ejercicios_completados: number;
  racha_actual: number;
  mejor_racha: number;
  fecha_registro: Date;
}

export interface Comment {
  id: number;
  contenido: string;
  fecha_creacion: Date;
  user: User;
  likes: number;
  liked: boolean;
  exercise_id: number;
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Tipos para filtros y ordenamiento
export interface ExerciseFilters {
  search?: string;
  level?: NivelRequerido;
  categoria?: string;
  sort_by?: 'recent' | 'popular' | 'points';
  page?: number;
  per_page?: number;
}

// Tipos para estadísticas
export interface UserStats {
  daily: {
    ejercicios_completados: number;
    puntos_ganados: number;
    tiempo_total: number;
  };
  weekly: {
    ejercicios_completados: number;
    puntos_ganados: number;
    mejor_dia: string;
  };
  total: {
    ejercicios_completados: number;
    puntos_totales: number;
    racha_actual: number;
    mejor_racha: number;
  };
} 