import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@flagix/ui/components/table";
import { cn } from "@flagix/ui/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

type VariationMetrics = {
  name: string;
  conversions: number;
  participants: number;
  conversionRate: number;
  lift: number;
  significance: number;
  status: "winning" | "losing" | "tie";
};

type ABTestVariationTableProps = {
  variations: VariationMetrics[];
  controlVariation: string;
  TABLE_GRID_COLS: string;
};

const getStatusIcon = (status: "winning" | "losing" | "tie") => {
  switch (status) {
    case "winning":
      return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    case "losing":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case "tie":
      return <Minus className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

const getRowClassName = (
  variationName: string,
  controlVariation: string,
  status: "winning" | "losing" | "tie"
): string => {
  if (variationName === controlVariation) {
    return "bg-gray-50";
  }

  if (status === "winning") {
    return "transition-colors hover:bg-emerald-50";
  }

  return "";
};

const getLiftColorClass = (lift: number): string => {
  if (lift > 0) {
    return "text-emerald-600";
  }
  if (lift < 0) {
    return "text-red-600";
  }
  return "text-gray-500";
};

export function ABTestVariationTable({
  variations,
  controlVariation,
  TABLE_GRID_COLS,
}: ABTestVariationTableProps) {
  return (
    <Table>
      <TableHeader className="bg-[#F4F4F5] px-0 py-0">
        <div className={cn(TABLE_GRID_COLS, "items-center gap-4 px-3")}>
          <TableCell className="font-semibold text-gray-600 text-xs uppercase">
            Variation
          </TableCell>
          <TableCell className="text-right font-semibold text-gray-600 text-xs uppercase">
            Participants
          </TableCell>
          <TableCell className="text-right font-semibold text-gray-600 text-xs uppercase">
            Conversions
          </TableCell>
          <TableCell className="text-right font-semibold text-gray-600 text-xs uppercase">
            Conv. Rate
          </TableCell>
          <TableCell className="text-right font-semibold text-gray-600 text-xs uppercase">
            Lift vs. Control
          </TableCell>
          <TableCell className="text-right font-semibold text-gray-600 text-xs uppercase">
            Significance
          </TableCell>
          <TableCell className="text-right font-semibold text-gray-600 text-xs uppercase">
            Status
          </TableCell>
        </div>
      </TableHeader>

      <TableBody>
        {variations.map((variation) => (
          <TableRow
            className={cn(
              TABLE_GRID_COLS,
              "items-center gap-4",
              getRowClassName(
                variation.name,
                controlVariation,
                variation.status
              )
            )}
            hoverable={variation.name !== controlVariation}
            key={variation.name}
          >
            <TableCell className="flex items-center gap-2 font-medium">
              {variation.name === controlVariation && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 text-xs">
                  Control
                </span>
              )}
              {variation.name}
            </TableCell>
            <TableCell className="text-right">
              {variation.participants.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {variation.conversions.toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-medium">
              {`${(variation.conversionRate * 100).toFixed(2)}%`}
            </TableCell>
            <TableCell
              className={cn(
                "text-right font-semibold",
                getLiftColorClass(variation.lift)
              )}
            >
              {variation.name === controlVariation
                ? "N/A"
                : `${variation.lift > 0 ? "+" : ""}${(variation.lift * 100).toFixed(2)}%`}
            </TableCell>
            <TableCell
              className={cn(
                "text-right",
                variation.significance >= 0.95
                  ? "font-bold text-emerald-700"
                  : "text-gray-700"
              )}
            >
              {`${(variation.significance * 100).toFixed(1)}%`}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {getStatusIcon(variation.status)}
                <span className="capitalize">{variation.status}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
