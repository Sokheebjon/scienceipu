import Link from "next/link";
import { defaultLocale } from "@/i18n/routing";
import "./globals.css";

/**
 * Reached only for paths outside any locale segment, so no translations are
 * available here. Both languages are shown side by side.
 */
export default function RootNotFound() {
  return (
    <html lang={defaultLocale}>
      <body className="flex min-h-screen items-center justify-center bg-primary-900 p-6">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-accent-400 uppercase">
            404
          </p>
          <h1 className="mt-3 text-2xl text-white">
            Sahifa topilmadi / Page not found
          </h1>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/uz"
              className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-primary-900 hover:bg-accent-400"
            >
              Bosh sahifa
            </Link>
            <Link
              href="/en"
              className="rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-100 hover:bg-primary-800"
            >
              Home page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
