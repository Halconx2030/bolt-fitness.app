'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { userService } from '@/services/api/users';
import { ActivityItem } from './ActivityItem';

export function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await userService.getRecentActivity();
        setActivities(response.data);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {loading ? (
            // Skeleton loader
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-800/50 rounded-lg animate-pulse"
              />
            ))
          ) : (
            activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
} 