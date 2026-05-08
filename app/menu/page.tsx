// app/menu/page.tsx
import { prisma } from "@/lib/prisma";
import MenuPageClient from "./MenuPageClient";
import Image from "next/image";

export default async function MenuPage() {
  const [menuItems, hero] = await Promise.all([
    prisma.menuItem.findMany({
      where: { status: "Active" },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
        slug: true,
        status: true,
      },
    }),
    prisma.heroBanner.findFirst({
      where: { page: "menu", status: "Active" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="bg-black min-h-screen">
      {hero ? (
        <div className="relative h-[220px] sm:h-[300px] lg:h-[380px] w-full overflow-hidden">
          <Image
            src={`/images/hero/${hero.image}`}
            alt="Menu Banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div
          className="h-[220px] sm:h-[300px] lg:h-[380px] w-full"
          style={{
            backgroundImage:
              "linear-gradient(45deg,#e5e5e5 25%,transparent 25%)," +
              "linear-gradient(-45deg,#e5e5e5 25%,transparent 25%)," +
              "linear-gradient(45deg,transparent 75%,#e5e5e5 75%)," +
              "linear-gradient(-45deg,transparent 75%,#e5e5e5 75%)",
            backgroundSize: "40px 40px",
            backgroundPosition: "0 0,0 20px,20px -20px,-20px 0",
            backgroundColor: "#f0f0f0",
          }}
        />
      )}

      <MenuPageClient items={menuItems} />
    </main>
  );
}
