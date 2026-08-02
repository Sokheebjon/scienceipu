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
    <div className="border-primary-900 bg-primary-800 border-b">
      <Container className="py-10 sm:py-14">
        {eyebrow ? (
          <p className="text-accent-400 mb-2 text-sm font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl text-white sm:text-4xl">{title}</h1>
        <div aria-hidden className="bg-accent-500 mt-4 h-1 w-16 rounded-full" />
        {intro ? (
          <p className="text-primary-200 mt-5 max-w-2xl">{intro}</p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </div>
  );
}
