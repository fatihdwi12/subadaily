"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  id,
  endpoint,
}: {
  id: number;
  endpoint: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus?")) return;

    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:border-red-500/70 hover:text-red-300 transition">
      Hapus
    </button>
  );
}
