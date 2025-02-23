export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="relative">
        <div className="h-48 bg-gray-800/50 rounded-lg animate-pulse" />
        <div className="absolute -bottom-16 left-8 flex items-end space-x-6">
          <div className="w-32 h-32 bg-gray-800/50 rounded-full animate-pulse" />
          <div className="mb-4 space-y-2">
            <div className="h-8 w-48 bg-gray-800/50 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-[500px] bg-gray-800/50 rounded-lg animate-pulse" />
        </div>
        <div className="h-[600px] bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
