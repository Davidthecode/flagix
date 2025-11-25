"use client";

import { Button } from "@flagix/ui/components/button";
import { Skeleton } from "@flagix/ui/components/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFetching: boolean;
};

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}) => {
  const handlePrev = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);

  return (
    <div className="flex items-center justify-end pt-4">
      <div className="flex items-center gap-4">
        <p className="text-gray-600 text-sm">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          className="flex items-center gap-1 text-xs disabled:text-gray-600"
          disabled={currentPage <= 1 || isFetching}
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          className="flex items-center gap-1 text-xs disabled:text-gray-600"
          disabled={currentPage >= totalPages || isFetching}
          onClick={handleNext}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const LogListLoader = () => (
  <div className="divide-y divide-gray-100">
    <div className="-mx-6 flex items-start justify-between px-6 py-4">
      <div className="flex w-full flex-col pr-4">
        <Skeleton className="mb-1 h-4 w-5/6" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>

    <div className="-mx-6 flex items-start justify-between px-6 py-4">
      <div className="flex w-full flex-col pr-4">
        <Skeleton className="mb-1 h-4 w-4/6" />
        <Skeleton className="h-3 w-1/5" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>

    <div className="-mx-6 flex items-start justify-between px-6 py-4">
      <div className="flex w-full flex-col pr-4">
        <Skeleton className="mb-1 h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);
