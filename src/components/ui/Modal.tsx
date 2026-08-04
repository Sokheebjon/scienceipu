"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Localised aria-label for the close button. */
  closeLabel: string;
  /** Id of the heading inside `children` that names the dialog. */
  labelledBy: string;
  children: ReactNode;
};

/**
 * Overlay dialog: dark backdrop, centred white card with its own scrollbar,
 * and a round close button hanging off the top-right corner.
 */
export function Modal({ open, onClose, closeLabel, labelledBy, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      // Keep Tab inside the dialog while it is open.
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="bg-primary-950/85 fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative w-full max-w-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="bg-primary-950 hover:bg-primary-700 absolute -top-3 -right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-dotted border-white/90 text-white transition-colors sm:-top-4 sm:-right-4"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div
          tabIndex={0}
          className="max-h-[85vh] overflow-y-auto rounded-md bg-white p-6 shadow-2xl sm:p-10"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
