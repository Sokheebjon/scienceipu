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
      <body className="bg-primary-900 flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="text-accent-400 text-sm font-semibold tracking-wide uppercase">
            404
          </p>
          <h1 className="mt-3 text-2xl text-white">
            Sahifa topilmadi / Page not found
          </h1>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/uz"
              className="bg-accent-500 text-primary-900 hover:bg-accent-400 rounded-md px-5 py-2.5 text-sm font-semibold"
            >
              Bosh sahifa
            </Link>
            <Link
              href="/en"
              className="border-primary-300 text-primary-100 hover:bg-primary-800 rounded-md border px-5 py-2.5 text-sm font-semibold"
            >
              Home page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
