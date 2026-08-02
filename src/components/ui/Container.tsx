import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** `narrow` is for long-form text sheets; everything else uses the wrap. */
  width?: "narrow" | "default" | "wide";
};

/** The boxed page wrap: 1200px like the reference `#wrap`. */
const widths = {
  narrow: "max-w-3xl",
  default: "max-w-[75rem]",
  wide: "max-w-[75rem]",
} as const;

export function Container({
  children,
  className,
  width = "default",
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-5", widths[width], className)}
    >
      {children}
    </div>
  );
}
