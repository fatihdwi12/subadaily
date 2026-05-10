"use client";

import { useState, useRef } from "react";
import Image from "next/image";

type AboutContent = {
  id: string;
  tagline: string;
  intro1: string;
  intro2: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
  stat4Number: string;
  stat4Label: string;
  photo1: string | null;
  photo2: string | null;
};

type AboutValue = {
  id: string;
  number: string;
  title: string;
  desc: string;
  order: number;
};

function useToast() {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const show = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, show };
}

const TABS = ["Intro & Stats", "Values", "Foto", "Hero Banner"] as const;
type Tab = (typeof TABS)[number];

export default function AboutManager({
  initialContent,
  initialValues,
}: {
  initialContent: AboutContent | null;
  initialValues: AboutValue[];
}) {
  const { toast, show } = useToast();
  const [tab, setTab] = useState<Tab>("Intro & Stats");
  const [content, setContent] = useState<Partial<AboutContent>>(
    initialContent ?? {},
  );
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);

  // ── Save Intro & Stats ──
  async function saveContent() {
    setLoading(true);
    const res = await fetch("/api/admin/about/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) show("Berhasil disimpan.");
    else show("Gagal menyimpan.", false);
    setLoading(false);
  }

  // ── Save Values ──
  async function saveValue(val: AboutValue) {
    const res = await fetch(`/api/admin/about/values/${val.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(val),
    });
    if (res.ok) show("Value disimpan.");
    else show("Gagal.", false);
  }

  async function deleteValue(id: string) {
    if (!confirm("Hapus value ini?")) return;
    const res = await fetch(`/api/admin/about/values/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setValues((prev) => prev.filter((v) => v.id !== id));
      show("Value dihapus.");
    }
  }

  async function addValue() {
    const res = await fetch("/api/admin/about/values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: `0${values.length + 1}`,
        title: "New Value",
        desc: "Deskripsi value baru.",
        order: values.length,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setValues((prev) => [...prev, data.value]);
      show("Value ditambahkan.");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">About Us</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola konten halaman About
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition
                ${tab === t ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab: Intro & Stats ── */}
        {tab === "Intro & Stats" && (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
              <h2 className="mb-5 text-base font-semibold text-white">
                Intro Section
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Tagline
                  </label>
                  <input
                    value={content.tagline ?? ""}
                    onChange={(e) =>
                      setContent({ ...content, tagline: e.target.value })
                    }
                    className="h-11 w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 text-sm text-white outline-none focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Paragraf 1
                  </label>
                  <textarea
                    rows={3}
                    value={content.intro1 ?? ""}
                    onChange={(e) =>
                      setContent({ ...content, intro1: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-neutral-500 resize-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    Paragraf 2
                  </label>
                  <textarea
                    rows={3}
                    value={content.intro2 ?? ""}
                    onChange={(e) =>
                      setContent({ ...content, intro2: e.target.value })
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-neutral-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
              <h2 className="mb-5 text-base font-semibold text-white">Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 rounded-xl border border-neutral-800 p-4">
                    <input
                      value={(content as any)[`stat${i}Number`] ?? ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          [`stat${i}Number`]: e.target.value,
                        })
                      }
                      placeholder="Angka (e.g. 50+)"
                      className="h-9 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm font-bold text-white outline-none focus:border-neutral-500"
                    />
                    <input
                      value={(content as any)[`stat${i}Label`] ?? ""}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          [`stat${i}Label`]: e.target.value,
                        })
                      }
                      placeholder="Label"
                      className="h-9 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white/60 outline-none focus:border-neutral-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={saveContent}
              disabled={loading}
              className="self-start rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-neutral-100 disabled:opacity-50 transition">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}

        {/* ── Tab: Values ── */}
        {tab === "Values" && (
          <div className="flex flex-col gap-4">
            {values.map((val, idx) => (
              <div
                key={val.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-neutral-500">
                    Value {idx + 1}
                  </span>
                  <button
                    onClick={() => deleteValue(val.id)}
                    className="text-xs text-neutral-600 hover:text-red-400 transition">
                    Hapus
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-neutral-500">
                        Nomor
                      </label>
                      <input
                        value={val.number}
                        onChange={(e) =>
                          setValues((prev) =>
                            prev.map((v) =>
                              v.id === val.id
                                ? { ...v, number: e.target.value }
                                : v,
                            ),
                          )
                        }
                        className="h-9 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none focus:border-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-neutral-500">
                        Judul
                      </label>
                      <input
                        value={val.title}
                        onChange={(e) =>
                          setValues((prev) =>
                            prev.map((v) =>
                              v.id === val.id
                                ? { ...v, title: e.target.value }
                                : v,
                            ),
                          )
                        }
                        className="h-9 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none focus:border-neutral-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-neutral-500">
                      Deskripsi
                    </label>
                    <textarea
                      rows={2}
                      value={val.desc}
                      onChange={(e) =>
                        setValues((prev) =>
                          prev.map((v) =>
                            v.id === val.id
                              ? { ...v, desc: e.target.value }
                              : v,
                          ),
                        )
                      }
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={() => saveValue(val)}
                    className="self-end rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-neutral-100 transition">
                    Simpan
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addValue}
              className="flex items-center gap-2 self-start rounded-xl border border-neutral-700 px-5 py-2.5 text-sm text-neutral-400 hover:text-white hover:border-neutral-500 transition">
              + Tambah Value
            </button>
          </div>
        )}

        {/* ── Tab: Foto ── */}
        {tab === "Foto" && (
          <AboutPhotoManager
            content={content}
            setContent={setContent}
            onSave={saveContent}
            loading={loading}
          />
        )}

        {/* ── Tab: Hero Banner ── */}
        {tab === "Hero Banner" && <HeroBannerAbout />}
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl
          ${toast.ok ? "bg-emerald-900 text-emerald-300" : "bg-red-950 text-red-400"}`}>
          {toast.ok ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </>
  );
}

// ── Sub-component: Foto ──
function AboutPhotoManager({ content, setContent, onSave, loading }: any) {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadPhoto(file: File, slot: 1 | 2) {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("slot", String(slot));
    const res = await fetch("/api/admin/about/photos", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    if (res.ok) {
      if (slot === 1)
        setContent((prev: any) => ({ ...prev, photo1: data.filename }));
      else setContent((prev: any) => ({ ...prev, photo2: data.filename }));
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="mb-5 text-base font-semibold text-white">
          Foto Visual Break
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              slot: 1 as const,
              label: "Foto Utama (16:9)",
              ref: ref1,
              preview: preview1,
              setPreview: setPreview1,
              existing: content.photo1,
            },
            {
              slot: 2 as const,
              label: "Foto Sekunder (1:1)",
              ref: ref2,
              preview: preview2,
              setPreview: setPreview2,
              existing: content.photo2,
            },
          ].map(({ slot, label, ref, preview, setPreview, existing }) => (
            <div key={slot}>
              <label className="mb-2 block text-sm text-white/70">
                {label}
              </label>
              <div
                role="button"
                tabIndex={0}
                onClick={() => ref.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && ref.current?.click()}
                className="flex min-h-[160px] cursor-pointer items-center justify-center rounded-xl border border-neutral-700 transition hover:border-neutral-500 overflow-hidden">
                <input
                  ref={ref}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPreview(URL.createObjectURL(file));
                    uploadPhoto(file, slot);
                  }}
                />
                {preview || existing ? (
                  <div className="relative w-full h-40">
                    <Image
                      src={preview ?? `/images/about/${existing}`}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto mb-2 text-neutral-600">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="text-xs text-neutral-500">
                      Klik untuk upload
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={loading || uploading}
        className="self-start rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-black hover:bg-neutral-100 disabled:opacity-50 transition">
        {uploading ? "Mengupload..." : loading ? "Menyimpan..." : "Simpan Foto"}
      </button>
    </div>
  );
}

// ── Sub-component: Hero Banner ──
function HeroBannerAbout() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
      <p className="text-sm text-neutral-400">
        Kelola hero banner halaman About melalui{" "}
        <a
          href="/admin/about/hero-banner"
          className="text-white underline hover:text-neutral-300">
          halaman Hero Banner About
        </a>
        .
      </p>
    </div>
  );
}
