import { prisma } from "@/lib/prisma";
import HeroBannerMenuManager from "./HeroBannerMenuManager";

export default async function MenuHeroBannerPage() {
  const items = await prisma.heroBanner.findMany({
    where: { page: "menu" },
    orderBy: { createdAt: "desc" },
  });

  return <HeroBannerMenuManager initialItems={items} />;
}
