"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface CyberPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  onPageChange?: (page: number) => void;
}

export function CyberPagination({
  currentPage,
  totalPages,
  className,
  onPageChange,
}: CyberPaginationProps) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`flex justify-center items-center space-x-2 ${className}`}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={
          onPageChange && currentPage > 1
            ? () => onPageChange(currentPage - 1)
            : undefined
        }
        disabled={currentPage <= 1}
        className="relative group border border-zinc-800 bg-black/50 hover:bg-purple-900/20 hover:border-purple-500/50 disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-purple-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

        <ChevronLeft className="h-4 w-4 text-zinc-400 group-hover:text-purple-400" />

        <span className="sr-only">Previous Page</span>
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNum, idx) => (
          <div key={idx}>
            {pageNum === "..." ? (
              <span className="px-3 text-zinc-600">...</span>
            ) : (
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={
                  onPageChange
                    ? () => onPageChange(pageNum as number)
                    : undefined
                }
                className={`relative group min-w-[2.5rem] border ${
                  currentPage === pageNum
                    ? "bg-purple-900/30 border-purple-500/50 text-purple-200"
                    : "border-zinc-800 bg-black/50 hover:bg-purple-900/20 hover:border-purple-500/50 text-zinc-400 hover:text-purple-300"
                }`}
              >
                <div className="absolute inset-0 bg-purple-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

                <span className="relative">{pageNum}</span>
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={
          onPageChange && currentPage < totalPages
            ? () => onPageChange(currentPage + 1)
            : undefined
        }
        disabled={currentPage >= totalPages}
        className="relative group border border-zinc-800 bg-black/50 hover:bg-purple-900/20 hover:border-purple-500/50 disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-purple-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />

        <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:text-purple-400" />

        <span className="sr-only">Next Page</span>
      </Button>
    </nav>
  );
}
