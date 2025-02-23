/**
 * Hook personalizado para gestionar ejercicios
 * @module useExercises
 * @example
 * ```tsx
 * const { exercises, loading, error, fetchExercises } = useExercises();
 *
 * // Cargar ejercicios con filtros
 * useEffect(() => {
 *   fetchExercises({
 *     muscleGroup: 'chest',
 *     difficulty: 'intermediate'
 *   });
 * }, [fetchExercises]);
 * ```
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Filtros disponibles para búsqueda de ejercicios
 */
interface ExerciseFilters {
  /** Grupo muscular objetivo */
  muscleGroup?: string;
  /** Nivel de dificultad */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** Equipamiento requerido */
  equipment?: string;
  /** Término de búsqueda */
  searchTerm?: string;
}

/**
 * Datos de un ejercicio
 */
interface Exercise {
  /** ID único del ejercicio */
  id: string;
  /** Nombre del ejercicio */
  name: string;
  /** Descripción detallada */
  description: string;
  /** Grupo muscular principal */
  muscleGroup: string;
  /** Nivel de dificultad */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Equipamiento necesario */
  equipment: string;
  /** URL de la imagen demostrativa */
  imageUrl?: string;
  /** Instrucciones paso a paso */
  instructions: string[];
  /** Músculos secundarios trabajados */
  secondaryMuscles?: string[];
}

/**
 * Hook para gestionar la lista y búsqueda de ejercicios
 * @returns Objeto con estado y métodos para ejercicios
 */
export const useExercises = () => {
  /** Lista de ejercicios actual */
  const [exercises, setExercises] = useState<Exercise[]>([]);
  /** Estado de carga */
  const [loading, setLoading] = useState(false);
  /** Error si existe */
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene ejercicios según los filtros especificados
   * @param filters - Filtros para la búsqueda
   * @throws {Error} Si hay un error en la consulta
   */
  const fetchExercises = useCallback(async (filters?: ExerciseFilters) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('exercises').select('*');

      // Aplicar filtros si existen
      if (filters?.muscleGroup) {
        query = query.eq('muscle_group', filters.muscleGroup);
      }
      // ... más lógica de filtrado

      const { data, error } = await query;
      if (error) throw error;

      setExercises(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ejercicios');
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exercises,
    loading,
    error,
    fetchExercises,
  };
};
