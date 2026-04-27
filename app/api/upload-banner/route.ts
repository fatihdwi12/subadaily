import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `banner-${Date.now()}.mp4`;
  const filePath = path.join(process.cwd(), "public", "videos", filename);

  await writeFile(filePath, buffer);
  return NextResponse.json({ filename });
}
