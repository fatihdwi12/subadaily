import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.aboutContent.findFirst();
    const content = existing
      ? await prisma.aboutContent.update({
          where: { id: existing.id },
          data: body,
        })
      : await prisma.aboutContent.create({ data: body });
    return NextResponse.json(content);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan." }, { status: 500 });
  }
}
