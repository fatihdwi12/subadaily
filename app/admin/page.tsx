import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ImagePlay, Users, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const [atmosphereCount, teamCount, messageCount] = await Promise.all([
    prisma.atmosphere.count(),
    prisma.teamMember.count(),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    {
      label: "Atmosphere",
      count: atmosphereCount,
      href: "/admin/atmosphere",
      icon: ImagePlay,
    },
    {
      label: "Our Team",
      count: teamCount,
      href: "/admin/team",
      icon: Users,
    },
    {
      label: "Message",
      count: messageCount,
      href: "/admin/messages",
      icon: MessageSquare,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-white/50 text-sm mb-8">
        Selamat Datang Pada Dashboard Suba Daily
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, count, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="bg-zinc-900 border border-white/10 rounded-xl p-6 hover:border-white/25 hover:bg-zinc-800/50 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <Icon size={22} className="text-white/50" />
              <span className="text-white/60 text-sm">{label}</span>
            </div>
            <p className="text-5xl font-bold text-white">{count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
