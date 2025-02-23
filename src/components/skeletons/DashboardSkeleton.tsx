export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {/* Esqueleto para StatsPanel */}
        <div className="h-[400px] bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
      <div className="space-y-8">
        {/* Esqueleto para NextExercises */}
        <div className="h-[300px] bg-gray-800/50 rounded-lg animate-pulse" />
        {/* Esqueleto para RecentActivity */}
        <div className="h-[400px] bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
