import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const item = await prisma.heroBanner.update({ where: { id }, data: body });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.heroBanner.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });

    const filePath = path.join(process.cwd(), "public", "images", "hero", irror(error);
    return NextRespePath).catch(() => {});

    await prisma.heroBanner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus." }, { status: 500 });
  }
}