'use client';

import { Button } from '@/components/ui/button';
import { Dumbbell, CheckCircle, PlayCircle } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  image: string;
  instructions: string[];
  tips: string[];
  videoUrl: string;
}

interface ExerciseDetailProps {
  exercise: Exercise;
  onStartExercise: (id: string) => void;
  isLoading?: boolean;
}

const ExerciseDetailSkeleton = () => (
  <div data-testid="exercise-detail-skeleton" className="animate-pulse space-y-4">
    <div className="h-64 bg-gray-700 rounded-lg" />
    <div className="space-y-2">
      <div className="h-8 w-1/3 bg-gray-700 rounded" />
      <div className="h-4 w-2/3 bg-gray-700 rounded" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-700 rounded" />
      ))}
    </div>
  </div>
);

export const ExerciseDetail = ({
  exercise,
  onStartExercise,
  isLoading = false,
}: ExerciseDetailProps) => {
  if (isLoading) {
    return <ExerciseDetailSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="relative aspect-video rounded-lg overflow-hidden">
        {exercise.videoUrl ? (
          <video
            data-testid="exercise-video"
            src={exercise.videoUrl}
            poster={exercise.image}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{exercise.name}</h1>
        <p className="mt-2 text-gray-400">{exercise.description}</p>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span>{exercise.muscleGroup}</span>
          </div>
          <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded-full">
            {exercise.difficulty}
          </span>
          <span className="text-sm text-gray-400">{exercise.equipment}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
        <ol className="space-y-3">
          {exercise.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
                {index + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Tips</h2>
        <ul className="space-y-3">
          {exercise.tips.map((tip, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          onClick={() => onStartExercise(exercise.id)}
          className="flex items-center space-x-2"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Comenzar Ejercicio</span>
        </Button>
      </div>
    </div>
  );
};
