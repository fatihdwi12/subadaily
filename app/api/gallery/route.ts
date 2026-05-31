// app/api/gallery/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  const items = await prisma.gallery.findMany({
    where: { status: "Active" },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = await prisma.gallery.create({ data: body });

  revalidatePath("/gallery"); // ← sesuaikan dengan path halaman Anda
  revalidatePath("/"); // ← jika homepage juga menampilkan data
  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const item = await prisma.gallery.update({
    where: { id: body.id },
    data: body,
  });

  revalidatePath("/gallery");
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.gallery.delete({ where: { id } });

  revalidatePath("/gallery");
  return NextResponse.json({ success: true });
}
