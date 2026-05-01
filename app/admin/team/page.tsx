import { prisma } from "@/lib/prisma";
import AdminTeamList from "./AdminTeamList";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await prisma.team.findMany({
    orderBy: { order: "asc" },
  });
  return <AdminTeamList members={members} />;
}
