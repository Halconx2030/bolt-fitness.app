export function ExerciseDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Exercise Detail Skeleton */}
      <div className="p-6 bg-gray-800/50 rounded-lg animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-10 h-10 bg-gray-700 rounded-lg" />
          <div className="h-8 w-48 bg-gray-700 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="h-6 w-32 bg-gray-700 rounded mb-2" />
              <div className="h-20 bg-gray-700 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-6 w-24 bg-gray-700 rounded" />
              <div className="h-6 w-24 bg-gray-700 rounded" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-6 w-40 bg-gray-700 rounded mb-4" />
              <div className="h-4 bg-gray-700 rounded" />
            </div>
            <div className="h-12 bg-gray-700 rounded" />
          </div>
        </div>
      </div>

      {/* Progress and Comments Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="p-6 bg-gray-800/50 rounded-lg animate-pulse">
            <div className="h-6 w-32 bg-gray-700 rounded mb-6" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded" />
              <div className="h-[300px] bg-gray-700 rounded" />
            </div>
          </div>
        </div>
        <div>
          <div className="p-6 bg-gray-800/50 rounded-lg animate-pulse">
            <div className="h-6 w-32 bg-gray-700 rounded mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
