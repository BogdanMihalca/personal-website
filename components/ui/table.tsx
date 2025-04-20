"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface TableProps extends React.ComponentProps<"table"> {
  variant?: "default" | "cyberpunk";
}

function Table({ className, variant = "default", ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn(
        "relative w-full overflow-x-auto",
        variant === "cyberpunk" &&
          "rounded-md shadow-[0_0_15px_rgba(0,255,255,0.2)]"
      )}
    >
      <table
        data-slot="table"
        data-variant={variant}
        className={cn(
          "w-full caption-bottom text-sm",
          variant === "cyberpunk" && "bg-space-black/50 backdrop-blur-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TableHeaderProps extends React.ComponentProps<"thead"> {
  variant?: "default" | "cyberpunk";
}

function TableHeader({
  className,
  variant = "default",
  ...props
}: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b",
        variant === "cyberpunk" &&
          "border-b border-neon-cyan/30 bg-space-black/80",
        className
      )}
      {...props}
    />
  );
}

interface TableBodyProps extends React.ComponentProps<"tbody"> {
  variant?: "default" | "cyberpunk";
}

function TableBody({
  className,
  variant = "default",
  ...props
}: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:border-0",
        variant === "cyberpunk" && "text-gray-300",
        className
      )}
      {...props}
    />
  );
}

interface TableFooterProps extends React.ComponentProps<"tfoot"> {
  variant?: "default" | "cyberpunk";
}

function TableFooter({
  className,
  variant = "default",
  ...props
}: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        variant === "cyberpunk" &&
          "bg-space-black/80 border-t border-neon-cyan/30 text-neon-cyan",
        className
      )}
      {...props}
    />
  );
}

interface TableRowProps extends React.ComponentProps<"tr"> {
  variant?: "default" | "cyberpunk";
}

function TableRow({ className, variant = "default", ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        variant === "cyberpunk" &&
          "hover:bg-neon-cyan/10 border-b border-neon-cyan/20 transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

interface TableHeadProps extends React.ComponentProps<"th"> {
  variant?: "default" | "cyberpunk";
}

function TableHead({
  className,
  variant = "default",
  ...props
}: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        variant === "cyberpunk" && "text-neon-cyan font-mono tracking-wide",
        className
      )}
      {...props}
    />
  );
}

interface TableCellProps extends React.ComponentProps<"td"> {
  variant?: "default" | "cyberpunk";
  highlight?: boolean;
}

function TableCell({
  className,
  variant = "default",
  highlight,
  ...props
}: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        variant === "cyberpunk" && "text-gray-300",
        variant === "cyberpunk" && highlight && "text-neon-cyan font-medium",
        className
      )}
      {...props}
    />
  );
}

interface TableCaptionProps extends React.ComponentProps<"caption"> {
  variant?: "default" | "cyberpunk";
}

function TableCaption({
  className,
  variant = "default",
  ...props
}: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "text-muted-foreground mt-4 text-sm",
        variant === "cyberpunk" && "text-neon-pink/70 font-mono tracking-wide",
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
