"use client";

import { useEffect, useState } from "react";

type Props = {
  src: string;
  title: string;
  /** Shown instead of the frame where PDFs cannot be displayed inline. */
  fallback: string;
};

/**
 * Inline PDF frame backed by the browser's own viewer. Phones and tablets
 * either have no inline viewer (Android) or show only the first page inside a
 * frame (iOS), so touch-only devices get a short notice instead; the open and
 * download buttons next to the viewer work everywhere.
 */
export function PdfViewer({ src, title, fallback }: Props) {
  // Unknown until mounted: the server cannot tell what the browser supports.
  const [canEmbed, setCanEmbed] = useState<boolean | null>(null);

  useEffect(() => {
    const touchOnly = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    setCanEmbed(navigator.pdfViewerEnabled !== false && !touchOnly);
  }, []);

  if (canEmbed === false) {
    return (
      <p className="border-line rounded-lg border bg-neutral-50 p-5 text-neutral-700">
        {fallback}
      </p>
    );
  }

  return (
    <div className="border-line h-[85vh] min-h-[30rem] overflow-hidden rounded-lg border bg-neutral-100">
      {canEmbed ? (
        <iframe key={src} src={src} title={title} className="h-full w-full" />
      ) : null}
    </div>
  );
}
