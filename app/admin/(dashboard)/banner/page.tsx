import { prisma } from "@/lib/prisma";
import AdminBannerClient from "./AdminBannerClient";

export default async function AdminBannerPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { order: "asc" },
  });

  return <AdminBannerClient banners={banners} />;
}
