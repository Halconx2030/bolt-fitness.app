'use client';

import { ActivityItem } from './ActivityItem';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentActivityProps {
  activities?: Array<{
    id: string;
    type: 'workout' | 'achievement';
    description: string;
    timestamp: string;
  }>;
  isLoading?: boolean;
  error?: string;
  limit?: number;
}

export const RecentActivity = ({
  activities = [],
  isLoading,
  error,
  limit = 5,
}: RecentActivityProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4" data-testid="activity-skeleton">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (activities.length === 0) {
    return <div className="text-center text-gray-500">No hay actividad reciente</div>;
  }

  return (
    <div className="space-y-4">
      {activities.slice(0, limit).map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
};

export default RecentActivity;
