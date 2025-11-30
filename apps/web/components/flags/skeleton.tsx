import { Skeleton } from "@flagix/ui/components/skeleton";

export const FlagMetadataSectionSkeleton = () => (
  <div className="flex flex-col space-y-4 rounded-lg border bg-white p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton className="h-9 w-20" />
    </div>
    <div className="flex items-start justify-between">
      <div>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-1 h-5 w-96" />
        <Skeleton className="mt-1 h-4 w-48" />
      </div>
    </div>
  </div>
);

export const FlagVariationsSectionSkeleton = () => (
  <div className="rounded-lg border bg-white p-6">
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>

    <div className="flex flex-wrap gap-3">
      <Skeleton className="h-6 w-24 rounded-lg" />
      <Skeleton className="h-6 w-32 rounded-lg" />
      <Skeleton className="h-6 w-28 rounded-lg" />
    </div>
  </div>
);

export const FlagEnvironmentConfigSkeleton = () => (
  <div className="rounded-lg border bg-white p-6">
    <div className="mb-6 flex items-center justify-between">
      <Skeleton className="h-7 w-60" />
      <Skeleton className="h-10 w-40" />
    </div>

    <div className="mb-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>

    <div className="mb-6 border-t pt-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Skeleton className="h-5 w-2/5" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
    </div>

    <div className="border-t pt-4">
      <Skeleton className="h-4 w-40" />
      <div className="mt-2 flex items-center gap-2">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  </div>
);

export const FlagDeleteSectionSkeleton = () => (
  <div className="rounded-lg border bg-white p-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>
      <Skeleton className="h-9 w-24" />
    </div>
  </div>
);

export const FlagPageSkeleton = () => (
  <div className="min-h-screen py-8">
    <div className="flex flex-col gap-y-5">
      <FlagMetadataSectionSkeleton />
      <FlagVariationsSectionSkeleton />
      <FlagEnvironmentConfigSkeleton />
      <FlagDeleteSectionSkeleton />
    </div>
  </div>
);
