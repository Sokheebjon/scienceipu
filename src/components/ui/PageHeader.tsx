import type { ReactNode } from "react";
import { Container } from "./Container";

type PageHeaderProps = {
  title: ReactNode;
  intro?: ReactNode;
  /** Optional eyebrow line, e.g. the conference edition. */
  eyebrow?: ReactNode;
  children?: ReactNode;
};

/** Navy banner that opens every inner page, mirroring the reference layout. */
export function PageHeader({
  title,
  intro,
  eyebrow,
  children,
}: PageHeaderProps) {
  return (
    <div className="border-b border-primary-900 bg-primary-800">
      <Container className="py-10 sm:py-14">
        {eyebrow ? (
          <p className="mb-2 text-sm font-semibold tracking-wide text-accent-400 uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl text-white sm:text-4xl">{title}</h1>
        <div aria-hidden className="mt-4 h-1 w-16 rounded-full bg-accent-500" />
        {intro ? (
          <p className="mt-5 max-w-2xl text-primary-200">{intro}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </div>
  );
}
