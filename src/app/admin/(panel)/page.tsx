"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminFetch,
  UnauthorizedError,
  type Paginated,
} from "@/lib/admin/api";

const SECTIONS = [
  {
    path: "/conference-registrations",
    href: "/admin/registrations",
    label: "Roʻyxatdan oʻtishlar",
  },
  { path: "/conference-contacts", href: "/admin/contacts", label: "Murojaatlar" },
  {
    path: "/conference-newsletter",
    href: "/admin/newsletter",
    label: "Obunachilar",
  },
  {
    path: "/conference-uploads",
    href: "/admin/uploads",
    label: "Yuklangan fayllar",
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SECTIONS.map((section) =>
        adminFetch<Paginated<unknown>>(`${section.path}?page=1&limit=1`)
          .then((result) => [section.path, result.total] as const)
          .catch((err: unknown) => {
            if (err instanceof UnauthorizedError) throw err;
            return [section.path, null] as const;
          }),
      ),
    )
      .then((entries) => {
        if (!cancelled) setCounts(Object.fromEntries(entries));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Boshqaruv</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Konferensiya sayti orqali kelgan maʼlumotlar
      </p>

      {error ? (
        <p className="mt-6 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SECTIONS.map((section) => {
          const count = counts[section.path];
          return (
            <Link
              key={section.path}
              href={section.href}
              className="rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <p className="text-sm text-neutral-500">{section.label}</p>
              <p className="text-primary-900 mt-2 text-3xl font-semibold">
                {count === undefined ? "…" : count === null ? "—" : count}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
