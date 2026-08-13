"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getToken, login, storeSession } from "@/lib/admin/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const session = await login(phone.trim(), password);
      storeSession(session.token, session.user);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  // Someone who is already signed in does not need the form again.
  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-primary-900 text-xl font-semibold">
          Admin panelga kirish
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          IPU konferensiya saytining boshqaruvi
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <div>
            <label
              htmlFor="admin-phone"
              className="mb-1.5 block text-sm font-medium"
            >
              Telefon raqami
            </label>
            <input
              id="admin-phone"
              type="tel"
              required
              autoComplete="username"
              placeholder="+998901234567"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="focus:border-primary-500 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium"
            >
              Parol
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="focus:border-primary-500 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="bg-primary-800 hover:bg-primary-600 w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Tekshirilmoqda…" : "Kirish"}
          </button>
        </form>
      </div>
    </main>
  );
}
