import { Suspense } from 'react';
import { ExerciseDetail } from '@/components/exercises/ExerciseDetail';
import { ExerciseProgress } from '@/components/exercises/ExerciseProgress';
import { ExerciseComments } from '@/components/exercises/ExerciseComments';
import { ExerciseDetailSkeleton } from '@/components/skeletons/ExerciseDetailSkeleton';

interface ExercisePageProps {
  params: {
    id: string;
  };
}

export default function ExercisePage({ params }: ExercisePageProps) {
  return (
    <div className="space-y-8">
      <Suspense fallback={<ExerciseDetailSkeleton />}>
        <ExerciseDetail id={parseInt(params.id)} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ExerciseProgress id={parseInt(params.id)} />
          </div>
          <div>
            <ExerciseComments id={parseInt(params.id)} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
