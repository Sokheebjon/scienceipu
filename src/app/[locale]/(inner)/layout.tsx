import type { ReactNode } from "react";
import { QuickLinksBar } from "@/components/layout/QuickLinksBar";

/**
 * Inner pages mirror the reference order: nav → logo → fastnav → content.
 * The home page sits outside this group because its hero image goes between
 * the logo and the fastnav, exactly as on the reference.
 */
export default function InnerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <QuickLinksBar />
      {children}
    </>
  );
}
