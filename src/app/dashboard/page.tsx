import { Suspense } from 'react';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { NextExercises } from '@/components/dashboard/NextExercises';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StatsPanel />
          </div>
          <div className="space-y-8">
            <NextExercises />
            <RecentActivity />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
