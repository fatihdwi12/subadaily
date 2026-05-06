import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const items = await prisma.media.findMany({ orderBy: { order: "asc" } });
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

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `image-${Date.now()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "images", "media");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    let finalOrder = 0;
    if (orderValue && orderValue !== "") {
      finalOrder = Number(orderValue);
    } else {
      const lastItem = await prisma.media.findFirst({
        orderBy: { order: "desc" },
      });
      finalOrder = (lastItem?.order ?? -1) + 1;
    }

    const item = await prisma.media.create({
      data: { title, status, order: finalOrder, type: "image", filename },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menambahkan foto." },
      { status: 500 },
    );
  }
}
