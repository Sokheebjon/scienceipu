import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  /** Renders an `<h2>` with a gold rule, and wires up aria-labelledby. */
  heading?: ReactNode;
  /** Small uppercase line above the heading. */
  eyebrow?: ReactNode;
  description?: ReactNode;
  id?: string;
  className?: string;
  tone?: "plain" | "tinted" | "navy";
  width?: "narrow" | "default" | "wide";
};

const tones = {
  plain: "bg-surface",
  tinted: "bg-primary-50",
  navy: "bg-primary-800 text-primary-100",
} as const;

export function Section({
  children,
  heading,
  eyebrow,
  description,
  id,
  className,
  tone = "plain",
  width = "default",
}: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={heading ? headingId : undefined}
      className={cn("scroll-mt-24 py-14 sm:py-20", tones[tone], className)}
    >
      <Container width={width}>
        {heading ? (
          <div className="mb-10">
            {eyebrow ? (
              <p
                className={cn(
                  "mb-2 text-xs font-semibold tracking-[0.14em] uppercase",
                  tone === "navy" ? "text-accent-400" : "text-accent-700",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={headingId}
              className={cn(
                "text-2xl sm:text-3xl",
                tone === "navy" && "text-white",
              )}
            >
              {heading}
            </h2>
            <div
              aria-hidden
              className="bg-accent-500 mt-3 h-1 w-14 rounded-full"
            />
            {description ? (
              <p
                className={cn(
                  "mt-4 max-w-2xl leading-relaxed",
                  tone === "navy" ? "text-primary-200" : "text-neutral-600",
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
