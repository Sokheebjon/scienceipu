import type { ReactNode } from "react";

/**
 * `[locale]/layout.tsx` renders <html> and <body>. This root layout exists
 * only because Next requires one at the top of the app directory, and because
 * the root not-found page sits outside the locale segment.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
