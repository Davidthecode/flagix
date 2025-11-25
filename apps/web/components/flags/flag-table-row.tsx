import { TableCell, TableRow } from "@flagix/ui/components/table";
import Link from "next/link";

type FlagTableRowProps = {
  flag: {
    id: string;
    key: string;
    description: string;
    environments: Record<string, boolean>;
    updatedAt: string;
  };
  projectId: string;
};

export const FlagTableRow = ({ flag, projectId }: FlagTableRowProps) => (
  <TableRow className="!px-0 !py-0" hoverable={false}>
    <div className="grid grid-cols-[3fr_1fr] items-center gap-4 px-6 py-4">
      <TableCell>
        <Link
          className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          href={`/projects/${projectId}/flags/${flag.id}`}
        >
          {flag.key}
        </Link>
        <p className="mt-0.5 truncate text-gray-500 text-xs">
          {flag.description}
        </p>
      </TableCell>

      <TableCell className="text-gray-500">{flag.updatedAt}</TableCell>
    </div>
  </TableRow>
);
