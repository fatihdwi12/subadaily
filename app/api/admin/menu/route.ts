import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  const items = await prisma.menuItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name = (form.get("name") as string) || "";
    const price = Number(form.get("price")) || 0;
    const category = (form.get("category") as string) || "Coffee";
    const slug = (form.get("slug") as string) || "";
    const status = (form.get("status") as string) || "Active";
    const description = (form.get("description") as string) || "";
    const orderValue = form.get("order") as string | null;
    const file = form.get("file") as File | null;

    // Cek slug unik
    const existing = await prisma.menuItem.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "Slug sudah digunakan." },
        { status: 400 },
      );
    }

    let filename: string | null = null;
    if (file && file.size > 0) {
      const ext = file.name.split(".").pop() || "jpg";
      filename = `menu-${Date.now()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "images", "menu");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
    }

    let finalOrder = 0;
    if (orderValue && orderValue !== "") {
      finalOrder = Number(orderValue);
    } else {
      const last = await prisma.menuItem.findFirst({
        orderBy: { order: "desc" },
      });
      finalOrder = (last?.order ?? -1) + 1;
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        price,
        category,
        slug,
        status,
        description,
        order: finalOrder,
        image: filename,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menambahkan menu." },
      { status: 500 },
    );
  }
}
