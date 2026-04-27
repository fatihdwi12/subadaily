import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TeamForm from "../../TeamForm";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await prisma.team.findUnique({ where: { id } });
  if (!member) notFound();
  return <TeamForm mode="edit" member={member} />;
}
