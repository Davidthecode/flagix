"use client";

import { cn } from "@flagix/ui/lib/utils";
import type * as React from "react";

interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Table({ className, children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 bg-white",
        className
      )}
      data-slot="table"
      {...props}
    >
      {children}
    </div>
  );
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <div
      className={cn(
        "border-gray-100 border-b bg-gray-50/50 px-6 py-3 font-medium text-gray-600 text-sm",
        className
      )}
      data-slot="table-header"
      {...props}
    >
      {children}
    </div>
  );
}

interface TableBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <div
      className={cn("divide-y divide-gray-100", className)}
      data-slot="table-body"
      {...props}
    >
      {children}
    </div>
  );
}

interface TableRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

function TableRow({
  className,
  children,
  hoverable = true,
  ...props
}: TableRowProps) {
  return (
    <div
      className={cn(
        "group bg-white px-6 py-4 transition-colors last:border-b-0",
        hoverable && "hover:bg-gray-50/50",
        className
      )}
      data-slot="table-row"
      {...props}
    >
      {children}
    </div>
  );
}

interface TableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <div className={cn("text-sm", className)} data-slot="table-cell" {...props}>
      {children}
    </div>
  );
}

interface TableEmptyProps {
  children: React.ReactNode;
  className?: string;
}

function TableEmpty({ children, className }: TableEmptyProps) {
  return (
    <div
      className={cn("flex flex-col items-center py-16 text-center", className)}
      data-slot="table-empty"
    >
      {children}
    </div>
  );
}

export { Table, TableHeader, TableBody, TableRow, TableCell, TableEmpty };
