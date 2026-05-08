import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const contentType = req.headers.get("content-type") || "";

    // FormData (edit lengkap dengan gambar)
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const name = form.get("name") as string;
      const price = Number(form.get("price"));
      const category = form.get("category") as string;
      const slug = form.get("slug") as string;
      const status = form.get("status") as string;
      const order = Number(form.get("order")) || 0;
      const description = (form.get("description") as string) || "";
      const file = form.get("file") as File | null;

      let filename: string | undefined = undefined;
      if (file && file.size > 0) {
        const ext = file.name.split(".").pop() || "jpg";
        filename = `menu-${Date.now()}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "images", "menu");
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadDir, filename), buffer);
      }

      const item = await prisma.menuItem.update({
        where: { id },
        data: {
          name,
          price,
          category,
          slug,
          status,
          order,
          description,
          ...(filename ? { image: filename } : {}),
        },
      });
      return NextResponse.json(item);
    }

    // JSON (toggle status)
    const body = await req.json();
    const item = await prisma.menuItem.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengupdate." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const item = await prisma.menuItem.findUnique({ where: { id } });
    if (!item)
      return NextResponse.json({ error: "Tidak ditemukan." }, { status: 404 });

    if (item.image) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "images",
        "menu",
        item.image,
      );
      await unlink(filePath).catch(() => {});
    }

    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menghapus." }, { status: 500 });
  }
}
