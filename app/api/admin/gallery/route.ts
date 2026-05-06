import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const items = await prisma.gallery.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = (form.get("title") as string) || "";
    const status = (form.get("status") as string) || "Active";
    const orderValue = form.get("order") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan." },
        { status: 400 },
      );
    }

    // ← Deteksi type otomatis dari MIME type file
    const isVideo = file.type.startsWith("video/");
    const type = isVideo ? "video" : "image";

    const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
    const filename = `${type}-${Date.now()}.${ext}`;

    // ← Path berbeda untuk image dan video
    const uploadDir = isVideo
      ? path.join(process.cwd(), "public", "videos")
      : path.join(process.cwd(), "public", "images", "gallery");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    let finalOrder = 0;
    if (orderValue && orderValue !== "") {
      finalOrder = Number(orderValue);
    } else {
      const lastItem = await prisma.gallery.findFirst({
        orderBy: { order: "desc" },
      });
      finalOrder = (lastItem?.order ?? -1) + 1;
    }

    const item = await prisma.gallery.create({
      data: { title, status, order: finalOrder, type, filename }, // ← type dinamis
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menambahkan." }, { status: 500 });
  }
}
