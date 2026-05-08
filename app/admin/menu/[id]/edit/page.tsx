import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditMenuForm from "./EditMenuForm";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) notFound();
  return <EditMenuForm item={item} />;
}
