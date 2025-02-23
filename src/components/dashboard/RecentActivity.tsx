'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { Trophy, Dumbbell, CircleDot } from 'lucide-react';
import { ActivityItem } from './ActivityItem';
import { Skeleton } from '@/components/ui/skeleton';

interface Activity {
  id: string;
  type: 'exercise_completed' | 'achievement_unlocked';
  title: string;
  description: string;
  date: string;
  user: {
    name: string;
    image: string;
  };
}

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

const ActivityIcon = ({ type }: { type: Activity['type'] | string }) => {
  switch (type) {
    case 'exercise_completed':
      return <Dumbbell className="h-5 w-5 text-primary" />;
    case 'achievement_unlocked':
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    default:
      return <CircleDot data-testid="default-icon" className="h-5 w-5 text-gray-400" />;
  }
};

const ActivitySkeleton = () => (
  <div
    data-testid="activity-skeleton"
    className="flex items-start space-x-4 p-3 bg-background/50 rounded-lg animate-pulse"
  >
    <div className="h-10 w-10 bg-gray-700 rounded-lg" />
    <div className="flex-1">
      <div className="h-4 w-24 bg-gray-700 rounded mb-2" />
      <div className="h-3 w-full bg-gray-700 rounded" />
    </div>
  </div>
);

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
