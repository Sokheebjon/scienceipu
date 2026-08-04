"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type ExcursionProgramStop = {
  id: string;
  /** Visit window, e.g. "13:00 – 13:30". */
  time: string;
  name: string;
  paragraphs: string[];
  image: string;
  /** "Stop 3", pre-formatted on the server. */
  stopLabel: string;
  /** Screen-reader label for the photo trigger. */
  open: string;
  /** "Image 3 of 6", pre-formatted on the server. */
  counter: string;
};

type Props = {
  stops: ExcursionProgramStop[];
  labels: {
    lightboxLabel: string;
    close: string;
    previous: string;
    next: string;
  };
};

/**
 * The Samarkand excursion itinerary: timed stops with alternating photo and
 * text columns, and the same keyboard-navigable lightbox behaviour as the
 * gallery. All strings arrive pre-formatted from the server.
 */
export function ExcursionProgram({ stops, labels }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setOpenIndex((current) => {
      if (current !== null) triggerRefs.current[current]?.focus();
      return null;
    });
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) =>
        current === null
          ? current
          : (current + delta + stops.length) % stops.length,
      );
    },
    [stops.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }

    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : stops[openIndex];

  return (
    <>
      <ol className="divide-line divide-y">
        {stops.map((stop, index) => (
          <li
            key={stop.id}
            className="grid gap-5 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:items-center md:gap-8"
          >
            <button
              type="button"
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              onClick={() => setOpenIndex(index)}
              className={
                "group border-line relative block w-full overflow-hidden rounded-lg border md:col-span-5" +
                (index % 2 === 1 ? " md:order-last" : "")
              }
            >
              <span className="relative block aspect-[3/2] w-full">
                <Image
                  src={stop.image}
                  alt={stop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span
                aria-hidden
                className="bg-primary-950/70 absolute right-3 bottom-3 rounded-full p-2 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM20 20l-4.9-4.9M10.5 8v5M8 10.5h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="sr-only">{stop.open}</span>
            </button>

            <div className="md:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-accent-700 text-xs font-semibold tracking-[0.14em] uppercase">
                  {stop.stopLabel}
                </p>
                <p className="bg-primary-800 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white tabular-nums">
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="text-accent-400 h-3.5 w-3.5"
                    fill="none"
                  >
                    <path
                      d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5V12l3 2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {stop.time}
                </p>
              </div>

              <h3 className="mt-3 text-lg sm:text-xl">{stop.name}</h3>

              <div className="mt-3 space-y-3 leading-relaxed text-neutral-600">
                {stop.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={labels.lightboxLabel}
          className="bg-primary-950/95 fixed inset-0 z-50 flex flex-col p-4"
        >
          <div className="text-primary-100 flex items-center justify-between gap-4 text-sm">
            <p className="min-w-0">
              <span className="block truncate font-semibold text-white">
                {active.name}
              </span>
              <span className="text-primary-300">{active.counter}</span>
            </p>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={close}
              className="hover:bg-primary-800 shrink-0 rounded p-2 hover:text-white"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="sr-only">{labels.close}</span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center gap-3 py-4">
            <button
              type="button"
              onClick={() => step(-1)}
              className="bg-primary-900/80 hover:bg-primary-700 shrink-0 rounded-full p-3 text-white"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
              >
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">{labels.previous}</span>
            </button>

            <div className="relative h-full min-h-0 w-full max-w-4xl">
              <Image
                src={active.image}
                alt={active.name}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              className="bg-primary-900/80 hover:bg-primary-700 shrink-0 rounded-full p-3 text-white"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
              >
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">{labels.next}</span>
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
