import { cn } from "@flagix/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#dddddd]", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
