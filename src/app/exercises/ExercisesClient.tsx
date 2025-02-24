'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { Exercise } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ExercisesClient() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadExercises() {
      try {
        const { data: exercisesData, error } = await supabase
          .from('exercises')
          .select('*')
          .order('name');

        if (error) throw error;

        // Transformar los datos al formato correcto
        const transformedExercises: Exercise[] = exercisesData.map(data => ({
          id: data.id,
          name: data.name,
          description: data.description,
          difficulty: data.difficulty,
          muscleGroups: data.muscle_groups || [],
          equipment: data.equipment || [],
          instructions: data.instructions || [],
          videoUrl: data.video_url,
          imageUrl: data.image_url,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        }));

        setExercises(transformedExercises);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los ejercicios');
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Ejercicios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise: Exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
