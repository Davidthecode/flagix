import { Skeleton } from "@flagix/ui/components/skeleton";

export const EnvironmentTabsSkeleton = () => (
  <div className="flex items-center justify-between border-b">
    <div className="flex space-x-6 overflow-x-auto whitespace-nowrap">
      <div className="relative px-0 py-3">
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="relative px-0 py-3">
        <Skeleton className="h-6 w-28" />
      </div>
      <div className="relative px-0 py-3">
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
    <Skeleton className="ml-4 h-9 w-20 flex-shrink-0" />
  </div>
);

export const EnvironmentDetailsSkeleton = () => (
  <div className="pt-4">
    <div className="mb-6 flex items-start justify-between">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-7 w-20" />
    </div>

    <div>
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="rounded-sm border bg-[#F4F4F5] p-3">
        <Skeleton className="h-5 w-full" />
      </div>
      <Skeleton className="mt-3 h-3 w-40" />
    </div>
  </div>
);

export const EnvironmentPageSkeleton = () => (
  <div className="py-6">
    <div className="flex flex-col space-y-4 overflow-hidden rounded-lg border bg-white px-6 py-6">
      <div className="flex flex-col space-y-1">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <EnvironmentTabsSkeleton />

      <EnvironmentDetailsSkeleton />
    </div>
  </div>
);
