import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const items = await prisma.heroBanner.findMany({
    where: { page: "menu" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const status = (form.get("status") as string) || "Active";
    const file = form.get("file") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `hero-menu-${Date.now()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "images", "hero");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const item = await prisma.heroBanner.create({
      data: { page: "menu", status, image: filename },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menambahkan." }, { status: 500 });
  }
}
