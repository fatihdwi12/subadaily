import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← Promise
) {
  try {
    const { id } = await params; // ← await dulu

    const item = await prisma.media.findUnique({ where: { id } });

    if (!item)
      return NextResponse.json(
        { error: "Media tidak ditemukan." },
        { status: 404 },
      );

    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      item.filename,
    );
    await unlink(filePath).catch(() => {});

    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE MEDIA ERROR:", error);
    return NextResponse.json(
      { error: "Gagal menghapus media." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ← Promise
) {
  try {
    const { id } = await params; // ← await dulu
    const body = await req.json();

    const item = await prisma.media.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.order !== undefined && { order: Number(body.order) }),
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("PATCH MEDIA ERROR:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui media." },
      { status: 500 },
    );
  }
}
