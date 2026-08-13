"use client";

import { useState } from "react";
import { adminFetch, type AdminRegistration } from "@/lib/admin/api";
import {
  CONFERENCE_LABELS,
  DeleteButton,
  DetailRow,
  FilterSelect,
  formatDateTime,
  Modal,
  Pagination,
  PRESENTATION_LABELS,
  SearchBox,
  TableShell,
  TITLE_LABELS,
  usePaginatedList,
} from "@/components/admin/ui";

const HEADERS = [
  "Raqam",
  "Ism-familiya",
  "Email",
  "Konferensiya",
  "Ishtirok turi",
  "Sana",
  "",
];

export default function AdminRegistrationsPage() {
  const [conference, setConference] = useState("");
  const [presentationType, setPresentationType] = useState("");
  const [selected, setSelected] = useState<AdminRegistration | null>(null);

  const list = usePaginatedList<AdminRegistration>(
    "/conference-registrations",
    {
      ...(conference ? { conference } : {}),
      ...(presentationType ? { presentationType } : {}),
    },
  );

  const rows = list.result?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Roʻyxatdan oʻtishlar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Konferensiya ishtirokchilarining arizalari
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect
          value={conference}
          onChange={setConference}
          allLabel="Barcha konferensiyalar"
          options={Object.entries(CONFERENCE_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <FilterSelect
          value={presentationType}
          onChange={setPresentationType}
          allLabel="Barcha ishtirok turlari"
          options={Object.entries(PRESENTATION_LABELS).map(
            ([value, label]) => ({ value, label }),
          )}
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
            onClick={() => setSelected(row)}
            className="cursor-pointer border-b border-neutral-100 last:border-0 hover:bg-neutral-50"
          >
            <td className="px-4 py-3 font-medium whitespace-nowrap">
              {row.registrationNumber}
            </td>
            <td className="px-4 py-3">
              {[TITLE_LABELS[row.title ?? ""], row.firstName, row.lastName]
                .filter(Boolean)
                .join(" ")}
            </td>
            <td className="px-4 py-3">{row.email}</td>
            <td className="px-4 py-3 whitespace-nowrap">
              {CONFERENCE_LABELS[row.conference] ?? row.conference}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {PRESENTATION_LABELS[row.presentationType] ??
                row.presentationType}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatDateTime(row.createdAt)}
            </td>
            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
              <DeleteButton
                confirmText={`${row.registrationNumber} arizasi oʻchirilsinmi?`}
                onDelete={async () => {
                  await adminFetch(`/conference-registrations/${row._id}`, {
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
        <Modal
          title={`Ariza ${selected.registrationNumber}`}
          onClose={() => setSelected(null)}
        >
          <DetailRow
            label="Ism-familiya"
            value={[
              TITLE_LABELS[selected.title ?? ""],
              selected.firstName,
              selected.lastName,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <DetailRow label="Tashkilot" value={selected.affiliation} />
          <DetailRow label="Davlat" value={selected.country} />
          <DetailRow label="Manzil" value={selected.address} />
          <DetailRow label="Telefon" value={selected.phone} />
          <DetailRow label="Email" value={selected.email} />
          <DetailRow label="Qoʻshimcha email" value={selected.secondEmail} />
          <DetailRow
            label="Konferensiya"
            value={CONFERENCE_LABELS[selected.conference] ?? selected.conference}
          />
          <DetailRow
            label="Ishtirok turi"
            value={
              PRESENTATION_LABELS[selected.presentationType] ??
              selected.presentationType
            }
          />
          <DetailRow label="Maqola sarlavhasi" value={selected.articleTitle} />
          <DetailRow label="Annotatsiya" value={selected.articleAbstract} />
          {selected.hasSecondArticle ? (
            <>
              <DetailRow
                label="2-maqola sarlavhasi"
                value={selected.articleTitle2}
              />
              <DetailRow
                label="2-maqola annotatsiyasi"
                value={selected.articleAbstract2}
              />
            </>
          ) : null}
          <DetailRow label="Til" value={selected.locale} />
          <DetailRow label="Sana" value={formatDateTime(selected.createdAt)} />
        </Modal>
      ) : null}
    </div>
  );
}
