import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.team.findMany({
    where: { status: "Active" },
    orderBy: { order: "asc" },
    select: { id: true, name: true, role: true, image: true },
  });
  return NextResponse.json(members);
}
