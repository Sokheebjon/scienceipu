"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminFetch,
  reviewUpload,
  UnauthorizedError,
  type AdminUpload,
  type ReviewDecision,
} from "@/lib/admin/api";
import {
  ACTION_BUTTON_CLASS,
  CheckIcon,
  CONFERENCE_LABELS,
  DeleteButton,
  FilterSelect,
  formatDateTime,
  formatFileSize,
  KIND_LABELS,
  Pagination,
  REVIEW_STATUS_LABELS,
  SearchBox,
  TableShell,
  usePaginatedList,
  XIcon,
} from "@/components/admin/ui";

const HEADERS = [
  "Roʻyxat raqami",
  "Ism-familiya",
  "Email",
  "Turi",
  "Fayl",
  "Hajmi",
  "Sana",
  "Holat",
  "",
];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminUploadsPage() {
  const [conference, setConference] = useState("");
  const [kind, setKind] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const list = usePaginatedList<AdminUpload>("/conference-uploads", {
    ...(conference ? { conference } : {}),
    ...(kind ? { kind } : {}),
    ...(reviewStatus ? { reviewStatus } : {}),
  });
  const rows = list.result?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Yuklangan fayllar</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Maqola, tezis va taqdimot fayllari. Qabul qilish yoki rad etishda
          muallifga email yuboriladi.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox onSearch={list.setSearch} />
        <FilterSelect
          value={conference}
          onChange={setConference}
          allLabel="Barcha konferensiyalar"
          options={[
            ...Object.entries(CONFERENCE_LABELS).map(([value, label]) => ({
              value,
              label,
            })),
            { value: "none", label: "Konferensiyasiz" },
          ]}
        />
        <FilterSelect
          value={kind}
          onChange={setKind}
          allLabel="Barcha turlar"
          options={Object.entries(KIND_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <FilterSelect
          value={reviewStatus}
          onChange={setReviewStatus}
          allLabel="Barcha holatlar"
          options={Object.entries(REVIEW_STATUS_LABELS).map(
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
        {rows.map((row) => {
          const status = row.reviewStatus ?? "pending";
          return (
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
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status] ?? STATUS_BADGE.pending}`}
                >
                  {REVIEW_STATUS_LABELS[status] ?? status}
                </span>
                {row.reviewedAt ? (
                  <div className="mt-1 text-xs text-neutral-500">
                    {formatDateTime(row.reviewedAt)}
                  </div>
                ) : null}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-start gap-2">
                  {status === "pending" ? (
                    <ReviewButtons upload={row} onDone={() => list.reload()} />
                  ) : null}
                  <DeleteButton
                    confirmText={`${row.fileName} yozuvi oʻchirilsinmi?`}
                    onDelete={async () => {
                      await adminFetch(`/conference-uploads/${row._id}`, {
                        method: "DELETE",
                      });
                      list.reload();
                    }}
                  />
                </div>
              </td>
            </tr>
          );
        })}
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

const DECISION_LABELS: Record<ReviewDecision, string> = {
  accepted: "Qabul qilish",
  rejected: "Rad etish",
};

const DECISION_CONFIRM: Record<ReviewDecision, string> = {
  accepted:
    "qabul qilinadi va muallifga qabul qilingani haqida email yuboriladi",
  rejected: "rad etiladi va muallifga rad etilgani haqida email yuboriladi",
};

/**
 * "Qabul qilish" / "Rad etish" pair. The backend sends the e-mail before it
 * stores the decision, so a failure leaves the row pending and shows the
 * error under the buttons.
 */
function ReviewButtons({
  upload,
  onDone,
}: {
  upload: AdminUpload;
  onDone: () => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<ReviewDecision | null>(null);
  const [error, setError] = useState("");

  async function decide(decision: ReviewDecision) {
    const confirmed = window.confirm(
      `${upload.fileName} ${DECISION_CONFIRM[decision]} (${upload.email}). Davom etilsinmi?`,
    );
    if (!confirmed) return;
    setBusy(decision);
    setError("");
    try {
      await reviewUpload(upload._id, decision);
      onDone();
    } catch (err: unknown) {
      if (err instanceof UnauthorizedError) {
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => decide("accepted")}
          className={`${ACTION_BUTTON_CLASS} border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700`}
        >
          {busy === "accepted" ? (
            <Spinner />
          ) : (
            <CheckIcon className="h-3.5 w-3.5 stroke-[2.6]" />
          )}
          {busy === "accepted" ? "Yuborilmoqda…" : DECISION_LABELS.accepted}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => decide("rejected")}
          className={`${ACTION_BUTTON_CLASS} border-red-300 bg-white text-red-700 hover:border-red-400 hover:bg-red-50`}
        >
          {busy === "rejected" ? <Spinner /> : <XIcon />}
          {busy === "rejected" ? "Yuborilmoqda…" : DECISION_LABELS.rejected}
        </button>
      </div>
      {error ? (
        <span className="max-w-xs text-xs text-red-600">{error}</span>
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
