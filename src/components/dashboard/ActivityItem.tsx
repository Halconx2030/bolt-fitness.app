'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trophy, Dumbbell } from 'lucide-react';

interface ActivityItemProps {
  activity: {
    id: string;
    type: 'exercise_completed' | 'achievement_unlocked';
    description: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const icon =
    activity.type === 'exercise_completed' ? (
      <Dumbbell data-testid="exercise-icon" className="h-5 w-5 text-primary" />
    ) : (
      <Trophy data-testid="achievement-icon" className="h-5 w-5 text-yellow-500" />
    );

  return (
    <div className="flex items-start gap-4 rounded-lg border p-4">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">
          <Link href={`/profile/${activity.user.name}`}>{activity.user.name}</Link>{' '}
          {activity.description}
        </p>
        <time
          className="text-xs text-gray-500"
          dateTime={activity.createdAt}
          data-testid="activity-time"
        >
          {formatDistanceToNow(new Date(activity.createdAt), {
            addSuffix: true,
            locale: es,
          })}
        </time>
      </div>
    </div>
  );
};

export default ActivityItem;
