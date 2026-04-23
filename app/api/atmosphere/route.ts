import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.atmosphere.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(data);
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

  return NextResponse.json(item, { status: 201 });
}
