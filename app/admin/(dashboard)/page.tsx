import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ImagePlay,
  Users,
  MessageSquare,
  Image as ImageIcon,
  UtensilsCrossed,
  ArrowUpRight,
  Mail,
  Circle,
} from "lucide-react";

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}d lalu`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

export default async function AdminDashboard() {
  const [
    atmosphereCount,
    teamCount,
    unreadMessageCount,
    totalMessageCount,
    galleryCount,
    menuCount,
    recentMessages,
  ] = await Promise.all([
    prisma.atmosphere.count(),
    prisma.teamMember.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.message.count(),
    prisma.gallery.count(),
    prisma.menuItem.count(),
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    {
      label: "Atmosphere",
      count: atmosphereCount,
      href: "/admin/atmosphere",
      icon: ImagePlay,
      sub: "konten aktif",
    },
    {
      label: "Our Team",
      count: teamCount,
      href: "/admin/team",
      icon: Users,
      sub: "anggota tim",
    },
    {
      label: "Gallery",
      count: galleryCount,
      href: "/admin/gallery",
      icon: ImageIcon,
      sub: "item gallery",
    },
    {
      label: "Menu",
      count: menuCount,
      href: "/admin/menu",
      icon: UtensilsCrossed,
      sub: "item menu",
    },
    {
      label: "Messages",
      count: totalMessageCount,
      href: "/admin/message",
      icon: MessageSquare,
      sub: `${unreadMessageCount} belum dibaca`,
      highlight: unreadMessageCount > 0,
    },
  ];

  const quickActions = [
    { label: "Tambah Menu", href: "/admin/menu/create", icon: UtensilsCrossed },
    { label: "Upload Gallery", href: "/admin/gallery/add", icon: ImageIcon },
    { label: "Tambah Team", href: "/admin/team/create", icon: Users },
    {
      label: "Upload Atmosphere",
      href: "/admin/atmosphere/create",
      icon: ImagePlay,
    },
  ];

  return (
    <div className="flex flex-col gap-10 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/40">
            Selamat datang kembali, Admin Suba Daily
          </p>
        </div>
        {unreadMessageCount > 0 && (
          <Link
            href="/admin/messages"
            className="flex items-center gap-2 rounded-full bg-blue-900/40 border border-blue-500/30 px-4 py-2 text-sm text-blue-400 hover:bg-blue-900/60 transition">
            <Mail size={14} />
            {unreadMessageCount} pesan baru
          </Link>
        )}
      </div>

      {/* Stat Cards */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
          Overview
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(({ label, count, href, icon: Icon, sub, highlight }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200
                ${
                  highlight
                    ? "border-blue-500/30 bg-blue-900/10 hover:bg-blue-900/20"
                    : "border-white/10 bg-zinc-900 hover:border-white/25 hover:bg-zinc-800/50"
                }`}>
              <div className="flex items-center justify-between">
                <Icon
                  size={18}
                  className={highlight ? "text-blue-400" : "text-white/30"}
                />
                <ArrowUpRight
                  size={14}
                  className="text-white/10 transition group-hover:text-white/40"
                />
              </div>
              <div className="mt-6">
                <p
                  className={`text-4xl font-black ${highlight ? "text-blue-300" : "text-white"}`}>
                  {count}
                </p>
                <p className="mt-1 text-xs font-medium text-white/50">
                  {label}
                </p>
                <p
                  className={`mt-0.5 text-xs ${highlight ? "text-blue-400" : "text-white/25"}`}>
                  {sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Messages */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Pesan Terbaru
            </p>
            <Link
              href="/admin/message"
              className="text-xs text-white/30 hover:text-white transition">
              Lihat semua →
            </Link>
          </div>

          <div className="flex flex-col rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden">
            {recentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-white/20">
                <MessageSquare size={32} strokeWidth={1} />
                <p className="text-sm">Belum ada pesan masuk</p>
              </div>
            ) : (
              recentMessages.map((msg, i) => (
                <Link
                  key={msg.id}
                  href="/admin/message"
                  className={`flex items-start gap-4 px-5 py-4 transition hover:bg-white/5
                    ${i !== recentMessages.length - 1 ? "border-b border-white/5" : ""}`}>
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-bold text-white">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      {!msg.read && (
                        <Circle
                          size={6}
                          className="shrink-0 fill-blue-500 text-blue-500"
                        />
                      )}
                      <p
                        className={`truncate text-sm ${!msg.read ? "font-semibold text-white" : "text-white/60"}`}>
                        {msg.name}
                      </p>
                    </div>
                    <p className="truncate text-xs text-white/30">
                      {msg.email}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-white/40">
                      {msg.message}
                    </p>
                  </div>

                  {/* Time */}
                  <span className="shrink-0 text-xs text-white/20">
                    {timeAgo(msg.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">
            Quick Actions
          </p>
          <div className="flex flex-col gap-2">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3.5 transition hover:border-white/25 hover:bg-zinc-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition group-hover:bg-white/10">
                  <Icon size={15} className="text-white/50" />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white transition">
                  {label}
                </span>
                <ArrowUpRight
                  size={14}
                  className="ml-auto text-white/10 transition group-hover:text-white/40"
                />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-white/10" />

          {/* Info Box */}
          <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Status Sistem
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Database", ok: true },
                { label: "Storage", ok: true },
                { label: "Email Notif", ok: true },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between text-xs">
                  <span className="text-white/40">{s.label}</span>
                  <span
                    className={`flex items-center gap-1.5 font-medium
                    ${s.ok ? "text-emerald-400" : "text-red-400"}`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${s.ok ? "bg-emerald-400" : "bg-red-400"}`}
                    />
                    {s.ok ? "Online" : "Offline"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
