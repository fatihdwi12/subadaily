import { prisma } from "@/lib/prisma";
import EditAtmosphereForm from "@/app/admin/components/EditAtmosphereForm";
import { notFound } from "next/navigation";

export default async function EditAtmosphere({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.atmosphere.findUnique({
    where: { id: parseInt(id) },
  });

  if (!item) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border border-white/15 rounded-2xl p-6 sm:p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Edit Atmosphere</h1>
        <p className="text-white/40 text-sm mb-8">Update konten atmosphere</p>
        <EditAtmosphereForm item={item} />
      </div>
    </div>
  );
}
