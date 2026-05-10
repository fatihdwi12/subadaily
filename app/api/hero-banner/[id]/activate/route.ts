// app/api/hero-banner/[id]/activate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // Ambil banner yang akan diaktifkan untuk tahu page-nya
    const target = await prisma.heroBanner.findUnique({
      where: { id },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Banner tidak ditemukan." },
        { status: 404 },
      );
    }

    // Nonaktifkan semua banner di page yang sama, lalu aktifkan yang dipilih
    await prisma.$transaction([
      prisma.heroBanner.updateMany({
        where: { page: target.page },
        data: { status: "Inactive" },
      }),
      prisma.heroBanner.update({
        where: { id },
        data: { status: "Active" },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
