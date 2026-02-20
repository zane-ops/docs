import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { Button } from "~/components/templates/button";
import { cn } from "~/lib/utils";

export type PaginationProps = {
  totalPages: number;
  currentPage: number;
  className?: string;
  onChangePage: (page: number) => void;
};

export function Pagination({
  totalPages,
  currentPage,
  className,
  onChangePage
}: PaginationProps) {
  return (
    <div className={cn("flex items-center justify-end px-2", className)}>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-25 items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className={cn(
              "px-2",
              currentPage === 1 && "opacity-50 pointer-events-none"
            )}
            onClick={() => onChangePage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            className={cn(
              "px-2",
              currentPage === 1 && "opacity-50 pointer-events-none"
            )}
            onClick={() => onChangePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            className={cn(
              "px-2",
              currentPage === totalPages && "opacity-50 pointer-events-none"
            )}
            onClick={() => onChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            className={cn(
              "px-2",
              currentPage === totalPages && "opacity-50 pointer-events-none"
            )}
            onClick={() => onChangePage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
