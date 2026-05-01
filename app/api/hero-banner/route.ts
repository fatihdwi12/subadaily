import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

// ── GET — ambil banner aktif ──────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "our-team";
  const banner = await prisma.heroBanner.findFirst({
    where: { page, status: "Active" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ image: banner?.image ?? null });
}

// ── POST — upload banner baru ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const page = (form.get("page") as string) || "our-team";
    const file = form.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "File wajib diisi." }, { status: 400 });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `hero-${page}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "hero");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(
      path.join(uploadDir, filename),
      Buffer.from(await file.arrayBuffer()),
    );

    await prisma.heroBanner.updateMany({
      where: { page },
      data: { status: "Inactive" },
    });

    const banner = await prisma.heroBanner.create({
      data: { page, image: `/images/hero/${filename}`, status: "Active" },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error("HERO BANNER POST ERROR:", error);
    return NextResponse.json(
      { error: "Gagal upload banner." },
      { status: 500 },
    );
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const banner = await prisma.heroBanner.findUnique({ where: { id } });
    if (banner?.image) {
      await unlink(path.join(process.cwd(), "public", banner.image)).catch(
        () => {},
      );
    }
    await prisma.heroBanner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HERO BANNER DELETE ERROR:", error);
    return NextResponse.json({ error: "Gagal hapus." }, { status: 500 });
  }
}
