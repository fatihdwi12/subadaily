import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const filename = `team-${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const filePath = path.join(
    process.cwd(),
    "public",
    "images",
    "team",
    filename,
  );

  await writeFile(filePath, Buffer.from(bytes));
  return NextResponse.json({ url: `/images/team/${filename}` });
}
