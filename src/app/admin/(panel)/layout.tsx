"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  clearSession,
  getStoredUser,
  getToken,
  type AdminUser,
} from "@/lib/admin/api";

const NAV = [
  { href: "/admin", label: "Boshqaruv" },
  { href: "/admin/registrations", label: "Roʻyxatdan oʻtishlar" },
  { href: "/admin/contacts", label: "Murojaatlar" },
  { href: "/admin/newsletter", label: "Obunachilar" },
  { href: "/admin/uploads", label: "Yuklangan fayllar" },
];

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setUser(getStoredUser());
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center text-sm text-neutral-500">
        Yuklanmoqda…
      </main>
    );
  }

  const displayName =
    user?.name?.uz || user?.name?.en || user?.phone || "Administrator";

  return (
    <div className="flex min-h-screen">
      <aside className="bg-primary-900 flex w-60 shrink-0 flex-col p-4 text-white">
        <div className="px-2 py-3">
          <p className="text-accent-400 text-xs font-semibold tracking-wide uppercase">
            IPU konferensiya
          </p>
          <p className="mt-1 text-lg font-semibold">Admin panel</p>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary-700 font-medium text-white"
                    : "text-primary-100 hover:bg-primary-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-primary-700 mt-4 border-t pt-4">
          <p className="truncate px-3 text-xs text-primary-200">{displayName}</p>
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.replace("/admin/login");
            }}
            className="text-primary-100 hover:bg-primary-800 mt-2 w-full rounded-md px-3 py-2 text-left text-sm"
          >
            Chiqish
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
