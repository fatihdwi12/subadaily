import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const slot = form.get("slot") as string;

    if (!file)
      return NextResponse.json({ error: "File tidak ada." }, { status: 400 });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `about-photo${slot}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "about");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(
      path.join(uploadDir, filename),
      Buffer.from(await file.arrayBuffer()),
    );

    const existing = await prisma.aboutContent.findFirst();
    const data = slot === "1" ? { photo1: filename } : { photo2: filename };
    if (existing)
      await prisma.aboutContent.update({ where: { id: existing.id }, data });
    else await prisma.aboutContent.create({ data });

    return NextResponse.json({ filename });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal upload." }, { status: 500 });
  }
}
