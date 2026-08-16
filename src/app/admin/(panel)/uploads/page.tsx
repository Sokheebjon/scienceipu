"use client";

import { useState } from "react";
import { adminFetch, type AdminUpload } from "@/lib/admin/api";
import {
  DeleteButton,
  FilterSelect,
  formatDateTime,
  formatFileSize,
  KIND_LABELS,
  Pagination,
  SearchBox,
  TableShell,
  usePaginatedList,
} from "@/components/admin/ui";

const HEADERS = [
  "Roʻyxat raqami",
  "Ism-familiya",
  "Email",
  "Turi",
  "Fayl",
  "Hajmi",
  "Sana",
  "",
];

export default function AdminUploadsPage() {
  const [kind, setKind] = useState("");
  const list = usePaginatedList<AdminUpload>(
    "/conference-uploads",
    kind ? { kind } : {},
  );
  const rows = list.result?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Yuklangan fayllar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Maqola, tezis va taqdimot fayllari
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect
          value={kind}
          onChange={setKind}
          allLabel="Barcha turlar"
          options={Object.entries(KIND_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
      </div>

      <TableShell
        headers={HEADERS}
        loading={list.loading}
        error={list.error}
        empty={rows.length === 0}
      >
        {rows.map((row) => (
          <tr
            key={row._id}
            className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
          >
            <td className="px-4 py-3 font-medium whitespace-nowrap">
              {row.registrationNumber}
            </td>
            <td className="px-4 py-3">{row.fullName ?? "—"}</td>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {KIND_LABELS[row.kind] ?? row.kind}
            </td>
            <td className="max-w-xs px-4 py-3">
              <a
                href={row.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary-700 block truncate underline"
              >
                {row.fileName}
              </a>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatFileSize(row.fileSize)}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatDateTime(row.createdAt)}
            </td>
            <td className="px-4 py-3">
              <DeleteButton
                confirmText={`${row.fileName} yozuvi oʻchirilsinmi?`}
                onDelete={async () => {
                  await adminFetch(`/conference-uploads/${row._id}`, {
                    method: "DELETE",
                  });
                  list.reload();
                }}
              />
            </td>
          </tr>
        ))}
      </TableShell>

      {list.result ? (
        <Pagination
          page={list.result.page}
          totalPages={list.result.totalPages}
          total={list.result.total}
          onPage={list.setPage}
        />
      ) : null}
    </div>
  );
}
