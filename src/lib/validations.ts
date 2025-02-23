import { z } from 'zod';
import { NivelRequerido } from '@/types';

// Esquemas base
export const userSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  avatar_url: z.string().url().optional(),
});

export const exerciseSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede exceder 1000 caracteres'),
  nivel_requerido: z.nativeEnum(NivelRequerido),
  puntos: z
    .number()
    .min(0, 'Los puntos no pueden ser negativos')
    .max(1000, 'Los puntos no pueden exceder 1000'),
  tiempo_estimado: z
    .number()
    .min(1, 'El tiempo mínimo es 1 minuto')
    .max(120, 'El tiempo máximo es 120 minutos')
    .optional(),
  categoria: z.string(),
});

export const commentSchema = z.object({
  contenido: z
    .string()
    .min(1, 'El comentario no puede estar vacío')
    .max(500, 'El comentario no puede exceder 500 caracteres'),
  exercise_id: z.number().positive(),
});

// Esquemas para filtros
export const exerciseFiltersSchema = z.object({
  search: z.string().optional(),
  level: z.nativeEnum(NivelRequerido).optional(),
  categoria: z.string().optional(),
  sort_by: z.enum(['recent', 'popular', 'points']).optional(),
  page: z.number().positive().optional(),
  per_page: z.number().positive().max(100).optional(),
});

// Función helper para validación
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createApiError.validation(
        'Error de validación',
        Object.fromEntries(error.errors.map(err => [err.path.join('.'), [err.message]]))
      );
    }
    throw error;
  }
};
