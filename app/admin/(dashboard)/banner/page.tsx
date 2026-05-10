import { prisma } from "@/lib/prisma";
import AdminBannerClient from "./AdminBannerClient";

export const dynamic = "force-dynamic";

export default async function BannerPage() {
  const banners = (await prisma.banner.findMany({
    orderBy: { order: "asc" },
  })) as {
    id: string;
    createdAt: Date;
    status: "Active" | "Inactive";
    filename: string;
    order: number;
  }[]; // ← tambah cast ini

  return <AdminBannerClient banners={banners} />;
}
