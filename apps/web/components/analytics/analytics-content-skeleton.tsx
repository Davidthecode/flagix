import { Skeleton } from "@flagix/ui/components/skeleton";

export const AnalyticsContentSkeleton = () => (
  <div className="space-y-6">
    <div className="mb-4 flex justify-end">
      <Skeleton className="h-10 w-32" />
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div className="rounded-xl border bg-card px-6 py-8 shadow-sm" key={i}>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-lg border bg-white p-5">
        <Skeleton className="mb-4 h-6 w-64" />
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div className="rounded-lg border bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
      <div className="rounded-lg border bg-white p-5">
        <Skeleton className="mb-4 h-6 w-64" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  </div>
);
