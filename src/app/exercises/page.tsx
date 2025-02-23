import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { ExerciseList } from '@/components/exercises/ExerciseList';
import { ExerciseFilters } from '@/components/exercises/ExerciseFilters';
import { LoadingExercises } from '@/components/exercises/LoadingExercises';
import { getExercises } from '@/lib/api/exercises';

export const revalidate = 3600; // Revalidar cada hora

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return notFound();
    }

    const filters = {
      muscleGroup: searchParams.muscleGroup as string,
      difficulty: searchParams.difficulty as string,
      equipment: searchParams.equipment as string,
      search: searchParams.q as string,
    };

    const initialExercises = await getExercises(filters);

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Ejercicios</h1>

        <ExerciseFilters initialFilters={filters} className="mb-8" />

        <Suspense fallback={<LoadingExercises />}>
          <ExerciseList initialData={initialExercises} filters={filters} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error('Error loading exercises:', error);
    return notFound();
  }
}
