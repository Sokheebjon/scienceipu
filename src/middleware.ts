import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, the admin panel, Next internals and files
  // with an extension. /admin is intentionally outside the locale segment.
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
