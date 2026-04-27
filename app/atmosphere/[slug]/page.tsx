import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Link from "next/link";

export default async function AtmosphereDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await prisma.atmosphere.findUnique({
    where: { slug },
  });

  if (!item || item.status !== "Active") notFound();

  return (
    <>
      <Navbar />
      <main className="bg-black min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <Link
            href="/atmosphere"
            className="flex items-center gap-2 text-white/40 text-sm hover:text-white transition mb-8">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Kembali
          </Link>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-zinc-900">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <p className="text-white/40 text-xs mb-3">
            {new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mb-6 leading-tight">
            {item.title}
          </h1>

          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            {item.description}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
