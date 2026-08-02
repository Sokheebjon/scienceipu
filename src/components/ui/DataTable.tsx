import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DataTableProps = {
  caption?: ReactNode;
  headers: ReactNode[];
  rows: ReactNode[][];
  /** Right-aligns the final column, used for fee amounts. */
  alignLastRight?: boolean;
  className?: string;
};

/**
 * Tables are the main content type on the fees, deadlines and accommodation
 * pages. The wrapper scrolls horizontally so a wide table never forces the
 * page body to scroll sideways on a phone.
 */
export function DataTable({
  caption,
  headers,
  rows,
  alignLastRight = false,
  className,
}: DataTableProps) {
  const lastIndex = headers.length - 1;

  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-line bg-white",
        className,
      )}
    >
      <table className="w-full min-w-[36rem] text-left text-sm">
        {caption ? (
          <caption className="px-4 py-3 text-left text-sm text-neutral-600">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="bg-primary-800 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={cn(
                  "px-4 py-3 font-semibold",
                  alignLastRight && index === lastIndex && "text-right",
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "border-t border-line align-top",
                rowIndex % 2 === 1 && "bg-neutral-50",
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-4 py-3 text-neutral-700",
                    cellIndex === 0 && "font-medium text-neutral-800",
                    alignLastRight &&
                      cellIndex === lastIndex &&
                      "text-right whitespace-nowrap tabular-nums",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
