"use client";

import { useState } from "react";
import { adminFetch, type AdminContact } from "@/lib/admin/api";
import {
  DeleteButton,
  DetailRow,
  formatDateTime,
  Modal,
  Pagination,
  SearchBox,
  TableShell,
  usePaginatedList,
} from "@/components/admin/ui";

const HEADERS = ["Ism", "Email", "Telefon", "Xabar", "Sana", ""];

export default function AdminContactsPage() {
  const [selected, setSelected] = useState<AdminContact | null>(null);
  const list = usePaginatedList<AdminContact>("/conference-contacts");
  const rows = list.result?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Murojaatlar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Aloqa formasi orqali kelgan xabarlar
        </p>
      </div>

      <SearchBox onSearch={list.setSearch} />

      <TableShell
        headers={HEADERS}
        loading={list.loading}
        error={list.error}
        empty={rows.length === 0}
      >
        {rows.map((row) => (
          <tr
            key={row._id}
            onClick={() => setSelected(row)}
            className="cursor-pointer border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
          >
            <td className="px-4 py-3 font-medium">{row.name}</td>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3 whitespace-nowrap">{row.phone || "—"}</td>
            <td className="max-w-xs truncate px-4 py-3 text-neutral-600">
              {row.message}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatDateTime(row.createdAt)}
            </td>
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <DeleteButton
                confirmText="Bu murojaat oʻchirilsinmi?"
                onDelete={async () => {
                  await adminFetch(`/conference-contacts/${row._id}`, {
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

      {selected ? (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <DetailRow label="Email" value={selected.email} />
          <DetailRow label="Telefon" value={selected.phone} />
          <DetailRow
            label="Xabar"
            value={
              <span className="whitespace-pre-wrap">{selected.message}</span>
            }
          />
          <DetailRow label="Til" value={selected.locale} />
          <DetailRow label="Sana" value={formatDateTime(selected.createdAt)} />
        </Modal>
      ) : null}
    </div>
  );
}
