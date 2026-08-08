import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Self-contained production build (server.js + minimal node_modules) so CI
  // can copy .next/standalone to the server and run it under pm2.
  output: "standalone",
  images: {
    // All imagery is locally generated SVG placeholders served from /public;
    // no remote patterns are needed. The CSP below keeps those SVGs inert.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
