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

const getStatusColorClass = (status: "winning" | "losing" | "tie"): string => {
  switch (status) {
    case "winning":
      return "text-emerald-700";
    case "losing":
      return "text-red-700";
    case "tie":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
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
    <Table className="rounded-none border-none">
      <TableHeader className="border-gray-100 border-b bg-[#F4F4F5] px-0 py-0">
        <div className={cn(TABLE_GRID_COLS, "items-center gap-4 px-6 py-3")}>
          <TableCell className="font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Variation
          </TableCell>
          <TableCell className="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Users
          </TableCell>
          <TableCell className="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Conversions
          </TableCell>
          <TableCell className="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Rate
          </TableCell>
          <TableCell className="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Lift
          </TableCell>
          <TableCell className="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Conf.
          </TableCell>
          <TableCell className="text-right font-bold text-[10px] text-gray-500 uppercase tracking-wider">
            Status
          </TableCell>
        </div>
      </TableHeader>

      <TableBody>
        {variations.map((variation) => (
          <TableRow
            className={cn(TABLE_GRID_COLS, "items-center gap-4 px-6 py-4")}
            hoverable={variation.name !== controlVariation}
            key={variation.name}
          >
            <TableCell className="flex items-center gap-2 font-semibold text-gray-900">
              {variation.name}
              {variation.name === controlVariation && (
                <span className="rounded-md bg-[#F4F4F5] px-1.5 py-0.5 font-bold text-[10px] uppercase">
                  Control
                </span>
              )}
            </TableCell>
            <TableCell className="text-right text-gray-600">
              {variation.participants.toLocaleString()}
            </TableCell>
            <TableCell className="text-right text-gray-600">
              {variation.conversions.toLocaleString()}
            </TableCell>
            <TableCell className="text-right font-medium text-gray-900">
              {`${(variation.conversionRate * 100).toFixed(2)}%`}
            </TableCell>
            <TableCell
              className={cn(
                "text-right font-bold",
                getLiftColorClass(variation.lift)
              )}
            >
              {variation.name === controlVariation
                ? "—"
                : `${variation.lift > 0 ? "+" : ""}${variation.lift.toFixed(1)}%`}
            </TableCell>
            <TableCell className="text-right">
              <div
                className={cn(
                  "inline-flex items-center justify-end font-medium",
                  variation.significance >= 0.95
                    ? "text-emerald-700"
                    : "text-gray-500"
                )}
              >
                {`${(variation.significance * 100).toFixed(1)}%`}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {getStatusIcon(variation.status)}
                <span
                  className={cn(
                    "font-medium text-xs capitalize",
                    getStatusColorClass(variation.status)
                  )}
                >
                  {variation.status}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
