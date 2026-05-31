import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "File tidak ditemukan" },
      { status: 400 },
    );
  }

  // Validasi ukuran: video maks 50MB, gambar maks 5MB
  const isVideo = file.type.startsWith("video/");
  const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File terlalu besar (maks ${isVideo ? "50MB" : "5MB"})` },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  // Tentukan folder berdasarkan tipe file
  const subDir = isVideo ? "videos" : "images/uploads";
  const uploadDir = path.join(process.cwd(), "public", subDir);

  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  return NextResponse.json({
    path: `/${subDir}/${filename}`,
  });
}
