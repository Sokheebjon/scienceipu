import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";

/**
 * The admin panel lives outside the locale segment, so it renders its own
 * <html> shell the same way the root not-found page does. The UI is
 * Uzbek-only; auth is handled by the ipu-back admin app.
 */
export const metadata: Metadata = {
  title: "IPU konferensiya — Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
