/**
 * Tipos compartidos para tests
 * @packageDocumentation
 * @example
 * ```typescript
 * const mockUser: MockUser = {
 *   id: '1',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   role: 'user'
 * };
 * ```
 */

/**
 * Tipos de actividades disponibles en el sistema
 */
export type ActivityType = 'exercise_completed' | 'achievement_unlocked';

/**
 * Niveles de dificultad para ejercicios
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * Representa una actividad de usuario para pruebas
 * @interface MockActivity
 * @example
 * ```typescript
 * const activity: MockActivity = {
 *   id: '1',
 *   type: 'exercise_completed',
 *   description: 'Completó Press de Banca',
 *   createdAt: new Date().toISOString(),
 *   user: {
 *     name: 'John Doe',
 *     email: 'john@example.com'
 *   }
 * };
 * ```
 */
export interface MockActivity {
  /** Identificador único de la actividad */
  id: string;
  /** Tipo de actividad: ejercicio completado o logro desbloqueado */
  type: 'exercise_completed' | 'achievement_unlocked';
  /** Descripción de la actividad */
  description: string;
  /** Fecha y hora de la actividad en formato ISO */
  createdAt: string;
  /** Información del usuario que realizó la actividad */
  user: {
    /** Nombre del usuario */
    name: string;
    /** Email del usuario */
    email: string;
  };
}

/**
 * Representa un usuario para pruebas
 * @interface MockUser
 */
export interface MockUser {
  /** Identificador único del usuario */
  id: string;
  /** Nombre completo del usuario */
  name: string;
  /** Email del usuario */
  email: string;
  /** Rol del usuario en el sistema */
  role: string;
}

/**
 * Representa un ejercicio para pruebas
 * @interface MockExercise
 */
export interface MockExercise {
  /** Identificador único del ejercicio */
  id: string;
  /** Nombre del ejercicio */
  name: string;
  /** Descripción detallada del ejercicio */
  description: string;
  /** Grupo muscular principal que trabaja el ejercicio */
  muscleGroup: string;
  /** Nivel de dificultad del ejercicio */
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Equipamiento necesario para realizar el ejercicio */
  equipment: string;
  /** URL de la imagen del ejercicio */
  image?: string;
}
