"use client";

import { adminFetch, type AdminNewsletter } from "@/lib/admin/api";
import {
  DeleteButton,
  formatDateTime,
  Pagination,
  SearchBox,
  TableShell,
  usePaginatedList,
} from "@/components/admin/ui";

const HEADERS = ["Email", "Qaysi sahifadan", "Til", "Sana", ""];

export default function AdminNewsletterPage() {
  const list = usePaginatedList<AdminNewsletter>("/conference-newsletter");
  const rows = list.result?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Obunachilar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Yangiliklar byulleteniga obuna boʻlganlar
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
            className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
          >
            <td className="px-4 py-3 font-medium">{row.email}</td>
            <td className="px-4 py-3">{row.sourcePath || "—"}</td>
            <td className="px-4 py-3">{row.locale}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatDateTime(row.createdAt)}
            </td>
            <td className="px-4 py-3">
              <DeleteButton
                confirmText={`${row.email} obunadan oʻchirilsinmi?`}
                onDelete={async () => {
                  await adminFetch(`/conference-newsletter/${row._id}`, {
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
