import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title, description, image, slug, date, status } = await req.json();

  const item = await prisma.atmosphere.update({
    where: { id: parseInt(id) },
    data: {
      title,
      description,
      image,
      slug,
      status,
      date: date ? new Date(date) : undefined,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.atmosphere.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
