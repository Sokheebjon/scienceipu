import Image from "next/image";
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
 * Navy banner that opens every inner page. The background image is absolutely
 * positioned behind a fixed-height content column, so it cannot shift layout.
 */
export function PageHeader({
  title,
  intro,
  eyebrow,
  children,
}: PageHeaderProps) {
  return (
    <div className="border-primary-900 bg-primary-800 relative isolate overflow-hidden border-b">
      <Image
        src="/img/page-banner.svg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-60"
      />
      <div
        aria-hidden
        className="from-primary-900/95 via-primary-900/75 to-primary-800/40 absolute inset-0 -z-10 bg-gradient-to-r"
      />
      <Container className="py-12 sm:py-16">
        {eyebrow ? (
          <p className="text-accent-400 mb-2 text-xs font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-3xl text-white sm:text-4xl">{title}</h1>
        <div aria-hidden className="bg-accent-500 mt-4 h-1 w-16 rounded-full" />
        {intro ? (
          <p className="text-primary-100 mt-5 max-w-2xl leading-relaxed">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </Container>
    </div>
  );
}
