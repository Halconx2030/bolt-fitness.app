import { Exercise } from '@/types';
import { ExerciseCard } from './ExerciseCard';
import { Card } from '@/components/ui/card';

interface ExerciseListProps {
  exercises?: Exercise[];
  isLoading?: boolean;
  error?: string;
}

export function ExerciseList({ exercises = [], isLoading, error }: ExerciseListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse" data-testid="exercise-list-skeleton">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 text-destructive">
        <p className="text-center">{error}</p>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-center text-muted-foreground">No hay ejercicios disponibles</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map(exercise => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
