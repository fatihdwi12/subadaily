import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/");
  revalidatePath("/atmosphere");
  revalidatePath("/admin/atmosphere");

  return NextResponse.json(item);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await prisma.atmosphere.delete({ where: { id: parseInt(id) } });

  revalidatePath("/");
  revalidatePath("/atmosphere");
  revalidatePath("/admin/atmosphere");

  return NextResponse.json({ success: true });
}
