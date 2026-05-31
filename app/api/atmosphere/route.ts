import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const data = await prisma.atmosphere.findMany({
    orderBy: { date: "desc" },
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}

export async function POST(req: Request) {
  const { title, description, image, slug, date, status } = await req.json();

  if (!title || !description || !image || !slug) {
    return NextResponse.json(
      { error: "Semua field wajib diisi" },
      { status: 400 },
    );
  }

  const item = await prisma.atmosphere.create({
    data: {
      title,
      description,
      image,
      slug,
      status: status ?? "Active",
      date: date ? new Date(date) : new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/atmosphere");
  revalidatePath("/admin/atmosphere");

  return NextResponse.json(item, { status: 201 });
}
