import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DataTableProps = {
  caption?: ReactNode;
  headers: ReactNode[];
  rows: ReactNode[][];
  /** Right-aligns the final column, used for numeric amounts. */
  alignLastRight?: boolean;
  className?: string;
};

/**
 * Tables carry most of the content on the deadlines and accommodation
 * pages. The wrapper scrolls horizontally so a wide table never makes the page
 * body scroll sideways on a phone.
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
        "border-line overflow-x-auto rounded-xl border bg-white shadow-sm",
        className,
      )}
    >
      <table className="w-full min-w-[36rem] text-left text-sm">
        {caption ? (
          <caption className="px-5 py-3 text-left text-sm text-neutral-600">
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
                  "px-5 py-3.5 text-xs font-semibold tracking-wide uppercase",
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
                "border-line hover:bg-primary-50/60 border-t align-top transition-colors",
                rowIndex % 2 === 1 && "bg-neutral-50",
              )}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    "px-5 py-3.5 text-neutral-700",
                    cellIndex === 0 && "font-medium text-neutral-800",
                    alignLastRight &&
                      cellIndex === lastIndex &&
                      "text-primary-800 text-right font-semibold whitespace-nowrap tabular-nums",
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
