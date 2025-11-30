import { Skeleton } from "@flagix/ui/components/skeleton";

export const MetricCardSkeleton = () => (
  <div className="flex h-full min-h-[160px] flex-col justify-between rounded-xl border bg-white p-6">
    <div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="mt-4 h-8 w-1/3" />
    </div>

    <div className="mt-4 flex flex-col items-start justify-start gap-y-2 border-t pt-4 text-xs">
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

export const IntegrationStatusSkeleton = () => (
  <div className="h-full rounded-xl border bg-white p-6">
    <div className="mb-4 flex items-center gap-2">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-6 w-52" />
    </div>

    <Skeleton className="mb-2 h-4 w-3/5" />

    <div className="mb-5 flex items-center rounded-lg border border-gray-200 bg-[#F4F4F5] p-2">
      <Skeleton className="h-5 w-full" />
    </div>

    <div className="flex items-center justify-between border-t pt-3 text-xs">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

export const RecentActivitySkeleton = () => (
  <div className="h-full rounded-xl border bg-white p-6">
    <div className="mb-5 flex items-center gap-2">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-6 w-48" />
    </div>

    <ul className="space-y-3">
      <li className="flex items-start justify-between border-b pb-3">
        <Skeleton className="h-4 w-4/5" />
      </li>
      <li className="flex items-start justify-between border-b pb-3">
        <Skeleton className="h-4 w-3/5" />
      </li>
      <li className="flex items-start justify-between border-b pb-3">
        <Skeleton className="h-4 w-2/5" />
      </li>
      <li className="flex items-start justify-between border-b pb-3">
        <Skeleton className="h-4 w-3/4" />
      </li>
    </ul>

    <div className="mt-4 border-t pt-3 text-right">
      <Skeleton className="ml-auto h-4 w-36" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div>
    <div className="mt-8">
      <h2 className="mb-4 font-semibold text-lg">
        <Skeleton className="h-6 w-1/4" />
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    </div>

    <div className="mt-8">
      <h2 className="mb-4 font-semibold text-lg">
        <Skeleton className="h-6 w-1/3" />
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <IntegrationStatusSkeleton />
        <RecentActivitySkeleton />
      </div>
    </div>
  </div>
);
