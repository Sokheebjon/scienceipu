"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Animated tick: the circle draws first, then the check mark. */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 52 52"
      fill="none"
      aria-hidden="true"
      className={className ?? "mx-auto h-14 w-14 text-emerald-500"}
    >
      <circle
        className="check-circle"
        cx="26"
        cy="26"
        r="24"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        className="check-mark"
        d="M15 27l8 8 15-16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Replaces a form after a successful submit: animated tick, heading and
 * details, with optional action buttons below.
 */
export function SuccessPanel({
  title,
  children,
  actions,
}: {
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="feedback-in space-y-5">
      <div
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-8 text-center"
      >
        <SuccessCheck />
        <h3 className="mt-4 text-lg font-semibold text-emerald-900">{title}</h3>
        {children ? (
          <div className="mx-auto mt-2 max-w-xl text-sm text-emerald-800">
            {children}
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

/**
 * Error banner that slides in with a brief shake. Re-mount it (change its
 * `key`) to replay the animation on every failed submit. When the failure
 * happened on the server the submit button is usually far below the banner,
 * so `scrollTo` brings it into view.
 */
export function ErrorBanner({
  title,
  children,
  scrollTo = false,
}: {
  title?: ReactNode;
  children: ReactNode;
  scrollTo?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollTo) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollTo]);

  return (
    <div
      ref={ref}
      role="alert"
      className="feedback-error-in rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800"
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}
