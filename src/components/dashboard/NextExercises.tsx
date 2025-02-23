'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { memo } from 'react';

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  image: string;
}

interface NextExercisesProps {
  exercises?: Exercise[];
  isLoading?: boolean;
  error?: string;
}

const difficultyColors = {
  Beginner: 'bg-green-500',
  Intermediate: 'bg-yellow-500',
  Advanced: 'bg-red-500',
} as const;

const ExerciseSkeleton = memo(() => (
  <div className="flex items-center space-x-4 p-3 bg-background/50 rounded-lg animate-pulse">
    <Skeleton className="h-16 w-16 rounded-md" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  </div>
));

ExerciseSkeleton.displayName = 'ExerciseSkeleton';

const ExerciseCard = memo(({ exercise }: { exercise: Exercise }) => (
  <Link
    href={`/exercises/${exercise.id}`}
    className="flex items-center space-x-4 p-3 bg-background/50 rounded-lg hover:bg-background/70 transition"
    aria-labelledby={`exercise-${exercise.id}-title`}
  >
    <div className="relative h-16 w-16">
      <Image
        src={exercise.image}
        alt={`Imagen de ${exercise.name}`}
        fill
        sizes="(max-width: 64px) 100vw, 64px"
        className="object-cover rounded-md"
        priority={false}
      />
    </div>
    <div className="flex-1">
      <h3 id={`exercise-${exercise.id}-title`} className="font-medium">
        {exercise.name}
      </h3>
      <p className="text-sm text-gray-400">Grupo muscular: {exercise.muscleGroup}</p>
      <div className="flex items-center space-x-2 mt-1">
        <span
          className={`text-xs px-2 py-1 rounded-full text-white ${difficultyColors[exercise.difficulty]}`}
          role="status"
          aria-label={`Dificultad: ${exercise.difficulty}`}
        >
          {exercise.difficulty}
        </span>
        <span
          className="text-xs text-gray-400"
          role="status"
          aria-label={`Equipo necesario: ${exercise.equipment}`}
        >
          {exercise.equipment}
        </span>
      </div>
    </div>
  </Link>
));

ExerciseCard.displayName = 'ExerciseCard';

/**
 * @component NextExercises
 * @description Componente que muestra una lista de próximos ejercicios programados,
 * con estados de carga, error y visualización de detalles.
 *
 * @example
 * ```tsx
 * <NextExercises
 *   exercises={[
 *     {
 *       id: '1',
 *       name: 'Press de Banca',
 *       muscleGroup: 'Pecho',
 *       difficulty: 'Intermediate',
 *       equipment: 'Barra y Pesas',
 *       image: '/images/bench-press.jpg'
 *     }
 *   ]}
 *   isLoading={false}
 * />
 * ```
 *
 * @accessibility
 * - Usa roles ARIA para estados de carga y errores
 * - Implementa estructura jerárquica de encabezados
 * - Proporciona textos alternativos para imágenes
 * - Mantiene contraste adecuado para badges de dificultad
 *
 * @performance
 * - Implementa lazy loading para imágenes
 * - Utiliza Skeleton para estados de carga
 * - Minimiza re-renders usando constantes para colores
 */

export const NextExercises = memo(
  ({ exercises = [], isLoading = false, error }: NextExercisesProps) => {
    return (
      <section className="p-4 bg-secondary rounded-lg" aria-labelledby="next-exercises-title">
        <h2 id="next-exercises-title" className="text-xl font-semibold mb-4">
          Próximos Ejercicios
        </h2>

        {isLoading && (
          <div role="status" aria-label="Cargando ejercicios" className="space-y-4">
            <ExerciseSkeleton />
            <ExerciseSkeleton />
            <ExerciseSkeleton />
          </div>
        )}

        {error && (
          <div role="alert" className="text-red-500 p-3 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && exercises.length === 0 && (
          <p className="text-gray-400" role="status" aria-label="No hay ejercicios programados">
            No hay ejercicios programados
          </p>
        )}

        {!isLoading && !error && exercises.length > 0 && (
          <div className="space-y-4">
            {exercises.map(exercise => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </section>
    );
  }
);

NextExercises.displayName = 'NextExercises';

export default NextExercises;
