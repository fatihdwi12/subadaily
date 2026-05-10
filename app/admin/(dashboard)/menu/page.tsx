import { prisma } from "@/lib/prisma";
import MenuAdminList from "./MenuAdminList";
import Link from "next/link";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Menu</h1>
          <p className="mt-1 text-sm text-neutral-500">Kelola item menu</p>
        </div>
        <Link
          href="/admin/menu/create"
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 transition">
          + Tambah Menu
        </Link>
      </div>
      <MenuAdminList initialItems={items} />
    </div>
  );
}
