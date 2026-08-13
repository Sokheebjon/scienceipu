"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  adminFetch,
  listQuery,
  UnauthorizedError,
  type Paginated,
} from "@/lib/admin/api";

/** Uzbek labels shared by the admin tables. */
export const CONFERENCE_LABELS: Record<string, string> = {
  "exact-sciences": "Aniq fanlar",
  "engineering-sciences": "Muhandislik fanlari",
  "natural-sciences": "Tabiiy fanlar",
  humanities: "Gumanitar fanlar",
};

export const PRESENTATION_LABELS: Record<string, string> = {
  oral: "Ogʻzaki maʼruza",
  onlineOral: "Onlayn maʼruza",
  attendee: "Ishtirokchi",
};

export const KIND_LABELS: Record<string, string> = {
  manuscript: "Maqola",
  abstract: "Tezis",
  presentation: "Taqdimot",
};

export const TITLE_LABELS: Record<string, string> = {
  mr: "Mr",
  ms: "Ms",
  dr: "Dr",
  prof: "Prof",
  eng: "Eng",
};

export function formatDateTime(value: string | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatFileSize(bytes: number): string {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Paginated list state against one admin endpoint. Extra filters restart the
 * list from page 1; an expired session routes back to the login page.
 */
export function usePaginatedList<T>(
  path: string,
  filters: Record<string, string> = {},
  limit = 20,
) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Paginated<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadFlag, setReloadFlag] = useState(0);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    setPage(1);
  }, [search, filterKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    adminFetch<Paginated<T>>(
      `${path}${listQuery({ page, limit, search, ...JSON.parse(filterKey) })}`,
    )
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof UnauthorizedError) {
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path, page, limit, search, filterKey, reloadFlag, router]);

  return {
    page,
    setPage,
    search,
    setSearch,
    result,
    loading,
    error,
    reload: () => setReloadFlag((n) => n + 1),
  };
}

export function SearchBox({
  onSearch,
  placeholder = "Qidirish…",
}: {
  onSearch: (value: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="focus:border-primary-500 w-56 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none"
      />
      <button
        type="submit"
        className="bg-primary-800 hover:bg-primary-600 rounded-md px-3 py-2 text-sm font-medium text-white"
      >
        Qidirish
      </button>
    </form>
  );
}

export function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm"
    >
      <option value="">{allLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Pagination({
  page,
  totalPages,
  total,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
}) {
  if (total === 0) return null;
  return (
    <div className="flex items-center justify-between text-sm text-neutral-600">
      <span>
        Jami: <strong>{total}</strong>
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
        >
          Oldingi
        </button>
        <span>
          {page} / {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 disabled:opacity-40"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
}

export function DeleteButton({
  onDelete,
  confirmText = "Bu yozuv oʻchirilsinmi?",
}: {
  onDelete: () => Promise<void>;
  confirmText?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    try {
      await onDelete();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
    >
      Oʻchirish
    </button>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] gap-3 border-b border-neutral-100 py-2 text-sm">
      <span className="font-medium text-neutral-500">{label}</span>
      <span className="break-words text-neutral-900">{value || "—"}</span>
    </div>
  );
}

export function TableShell({
  headers,
  loading,
  error,
  empty,
  children,
}: {
  headers: string[];
  loading: boolean;
  error: string;
  empty: boolean;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full min-w-[40rem] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs text-neutral-500 uppercase">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-neutral-500">
                Yuklanmoqda…
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-red-600">
                {error}
              </td>
            </tr>
          ) : empty ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-neutral-500">
                Maʼlumot yoʻq
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}
