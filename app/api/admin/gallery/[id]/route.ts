import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← Promise
) {
  try {
    const { id } = await params; // ← await
    const body = await req.json();
    const item = await prisma.gallery.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← Promise
) {
  try {
    const { id } = await params; // ← await

    const item = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Item tidak ditemukan." },
        { status: 404 },
      );
    }

    // Hapus file fisik sesuai type
    const subDir =
      item.type === "video" ? "videos" : path.join("images", "gallery");
    const filePath = path.join(process.cwd(), "public", subDir, item.filename);
    await unlink(filePath).catch(() => {});

    await prisma.gallery.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus." }, { status: 500 });
  }
}
