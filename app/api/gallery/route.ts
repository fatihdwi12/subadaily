// ✅ app/api/gallery/route.ts — versi lengkap yang sudah diperbaiki

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await prisma.gallery.findMany({
    where: { status: "Active" },
    orderBy: { order: "asc" },
  });

  // ✅ Tambahkan header agar response tidak di-cache browser/CDN
  return NextResponse.json(items, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
    },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await prisma.gallery.create({ data: body });

  revalidatePath("/");
  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const item = await prisma.gallery.update({
    where: { id: body.id },
    data: body,
  });

  revalidatePath("/");
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.gallery.delete({ where: { id } });

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
