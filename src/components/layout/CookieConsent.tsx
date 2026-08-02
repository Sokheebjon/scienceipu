"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "cookie-consent";

type Props = {
  title: string;
  body: string;
  accept: string;
  decline: string;
  policy: string;
};

/**
 * Remembers the choice in localStorage. Rendered only after mount so the
 * server markup and the first client paint agree, and reserved as a fixed
 * overlay so it never shifts page content.
 */
export function CookieConsent({
  title,
  body,
  accept,
  decline,
  policy,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Storage blocked; leave the banner hidden rather than nagging.
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore: the banner still closes for this session.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-accent-500 bg-primary-900 p-4 shadow-2xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-primary-100">
          {body}{" "}
          <Link
            href="/privacy"
            className="font-medium text-accent-400 underline underline-offset-2 hover:text-accent-300"
          >
            {policy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="accent"
            size="sm"
            onClick={() => decide("accepted")}
          >
            {accept}
          </Button>
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-primary-100 hover:bg-primary-800 hover:text-white"
          >
            {decline}
          </button>
        </div>
      </div>
    </div>
  );
}
