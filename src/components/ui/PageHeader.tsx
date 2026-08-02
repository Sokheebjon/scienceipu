import type { ReactNode } from "react";
import { Container } from "./Container";

type PageHeaderProps = {
  title: ReactNode;
  intro?: ReactNode;
  /** Optional eyebrow line, e.g. the conference edition. */
  eyebrow?: ReactNode;
  children?: ReactNode;
};

/**
 * Opens every inner page: a white sheet with the page h1, matching the plain
 * content headers of the reference.
 */
export function PageHeader({
  title,
  intro,
  eyebrow,
  children,
}: PageHeaderProps) {
  return (
    <Container>
      <div className="mb-5 bg-white p-5 sm:p-8">
        {eyebrow ? (
          <p className="text-accent-700 mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-2xl sm:text-3xl">{title}</h1>
        <div aria-hidden className="bg-accent-500 mt-3 h-1 w-14 rounded-full" />
        {intro ? (
          <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
      </div>
    </Container>
  );
}
