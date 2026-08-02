"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type GalleryItem = {
  src: string;
  /** Alt text. */
  alt: string;
  /** Screen-reader label for the thumbnail trigger. */
  open: string;
  /** "Image 3 of 12", pre-formatted on the server. */
  counter: string;
};

type Props = {
  items: GalleryItem[];
  labels: {
    lightboxLabel: string;
    close: string;
    previous: string;
    next: string;
  };
};

/**
 * Responsive grid with a keyboard-navigable lightbox. All strings arrive
 * pre-formatted from the server, so no translation function crosses the
 * server/client boundary.
 */
export function Gallery({ items, labels }: Props) {
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
          : (current + delta + items.length) % items.length,
      );
    },
    [items.length],
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

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <li key={item.src}>
            <button
              type="button"
              ref={(node) => {
                triggerRefs.current[index] = node;
              }}
              onClick={() => setOpenIndex(index)}
              className="group block w-full overflow-hidden rounded-lg border border-line"
            >
              <span className="relative block aspect-[4/3] w-full">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </span>
              <span className="sr-only">{item.open}</span>
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={labels.lightboxLabel}
          className="fixed inset-0 z-50 flex flex-col bg-primary-950/95 p-4"
        >
          <div className="flex items-center justify-between text-sm text-primary-100">
            <p>{active.counter}</p>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={close}
              className="rounded p-2 hover:bg-primary-800 hover:text-white"
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
              className="shrink-0 rounded-full bg-primary-900/80 p-3 text-white hover:bg-primary-700"
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
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => step(1)}
              className="shrink-0 rounded-full bg-primary-900/80 p-3 text-white hover:bg-primary-700"
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
