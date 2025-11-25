import { TableHeader } from "@flagix/ui/components/table";

export const FlagTableHeader = () => (
  <TableHeader>
    <div className="grid grid-cols-[3fr_1fr] items-center gap-4">
      <div>Flag Key / Description</div>
      <div>Last Updated</div>
    </div>
  </TableHeader>
);
