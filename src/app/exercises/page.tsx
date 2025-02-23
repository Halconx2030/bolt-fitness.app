import { Suspense } from 'react';
import { ExerciseGrid } from '@/components/exercises/ExerciseGrid';
import { ExerciseFilters } from '@/components/exercises/ExerciseFilters';
import { ExercisesSkeleton } from '@/components/skeletons/ExercisesSkeleton';

export default function ExercisesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-100">Ejercicios</h1>
      </div>

      <ExerciseFilters />

      <Suspense fallback={<ExercisesSkeleton />}>
        <ExerciseGrid />
      </Suspense>
    </div>
  );
} 