import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TeamForm from "../../TeamForm";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;  // ← wajib await

  const member = await prisma.team.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TeamForm mode="edit" member={member} />
    </div>
  );
}