import { Button } from "@flagix/ui/components/button";
import { cn } from "@flagix/ui/lib/utils";
import type React from "react";

interface MetricCardProps {
  title: string;
  value: string | React.ReactNode;
  description: string;
  subValue?: string;
  subDescription?: string;
  actionLink?: { label: string; href?: string; onClick?: () => void };
  icon?: React.ElementType;
  className?: string;
  // biome-ignore lint/suspicious/noExplicitAny: <>
  linkComponent?: React.ComponentType<any>;
}

export const MetricCard = ({
  title,
  value,
  description,
  subValue,
  subDescription,
  actionLink,
  icon: Icon,
  className,
  linkComponent: LinkComponent,
}: MetricCardProps) => (
  <div
    className={cn(
      "flex flex-col rounded-xl border bg-white p-6 transition-all hover:shadow-sm",
      "h-full min-h-[160px]",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wide">
        {title}
      </h3>
      {Icon && <Icon className="h-5 w-5 text-gray-400" />}
    </div>

    <div className="mt-4 flex flex-grow flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <div className="font-semibold text-2xl text-gray-900">{value}</div>
        {subValue && (
          <div className="font-medium text-gray-700 text-sm">{subValue}</div>
        )}
      </div>
      {subDescription && (
        <p className="text-gray-500 text-xs">{subDescription}</p>
      )}
    </div>

    <div className="mt-4 flex flex-col items-start justify-start gap-y-2 border-gray-100 border-t pt-4 text-xs">
      <p className="text-gray-500">{description}</p>

      {actionLink &&
        (LinkComponent && actionLink.href ? (
          <LinkComponent href={actionLink.href}>
            <Button
              className="h-auto p-0 font-semibold text-emerald-600 text-xs hover:text-emerald-70 hover:underline"
              type="button"
            >
              {actionLink.label}
            </Button>
          </LinkComponent>
        ) : (
          <Button
            className="h-auto p-0 font-semibold text-emerald-600 text-xs hover:text-emerald-70 hover:underline"
            onClick={actionLink.onClick}
            type="button"
          >
            {actionLink.label}
          </Button>
        ))}
    </div>
  </div>
);
