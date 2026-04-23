import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.atmosphere.createMany({
    data: [
      {
        title: "Morning Vibes at Suba",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt",
        image: "/images/atmosphere-1.jpg",
        slug: "morning-vibes-at-suba",
        date: new Date("2026-04-20"),
      },
      {
        title: "Golden Hour Sessions",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt",
        image: "/images/atmosphere-2.jpg",
        slug: "golden-hour-sessions",
        date: new Date("2026-04-20"),
      },
      {
        title: "The Late Night Crowd",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt",
        image: "/images/atmosphere-3.jpg",
        slug: "the-late-night-crowd",
        date: new Date("2026-04-20"),
      },
      {
        title: "Weekend Brunch Stories",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt",
        image: "/images/atmosphere-4.jpg",
        slug: "weekend-brunch-stories",
        date: new Date("2026-04-20"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed berhasil!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
