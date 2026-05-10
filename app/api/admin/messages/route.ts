import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages);
}

// Mark all as read
export async function PATCH(req: NextRequest) {
  try {
    const { markAllRead } = await req.json();
    if (markAllRead) {
      await prisma.message.updateMany({ data: { read: true } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal." }, { status: 500 });
  }
}
