import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flagix/ui/components/select";
import type { TimeRange } from "@/types/analytics";

type TimeRangeSelectorProps = {
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
};

export function TimeRangeSelector({
  timeRange,
  setTimeRange,
}: TimeRangeSelectorProps) {
  return (
    <div className="w-fit">
      <Select onValueChange={setTimeRange} value={timeRange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="3m">Last 3 Months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
