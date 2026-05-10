import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 },
      );
    }

    // Simpan ke database
    const msg = await prisma.message.create({
      data: { name, email, message },
    });

    // Kirim notifikasi email ke pengelola (non-blocking)
    sendContactNotification({ name, email, message }).catch((err) =>
      console.error("Gagal kirim email notifikasi:", err),
    );

    return NextResponse.json({ msg }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan." },
      { status: 500 },
    );
  }
}
