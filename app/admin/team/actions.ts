"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMember(data: {
  name: string;
  role: string;
  image: string | null;
  order: number;
}) {
  try {
    const member = await prisma.team.create({
      data: { ...data, status: "Active" },
    });
    revalidatePath("/");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch {
    return { success: false, member: null };
  }
}

export async function updateMember(
  id: string,
  data: { name: string; role: string; image: string | null },
) {
  try {
    const member = await prisma.team.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/admin/team");
    return { success: true, member };
  } catch {
    return { success: false, member: null };
  }
}

export async function deleteMember(id: string) {
  try {
    await prisma.team.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/team");
    return { success: true };
  } catch {
    return { success: false };
  }
}
