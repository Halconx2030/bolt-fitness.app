import { Card } from '@/components/ui/card';

export function ExercisesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="aspect-video bg-muted animate-pulse rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-muted animate-pulse rounded px-3 w-20" />
            <div className="h-6 bg-muted animate-pulse rounded px-3 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}
