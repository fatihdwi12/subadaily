"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Settings,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ImagePlay,
} from "lucide-react";

const navLinks = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/atmosphere", label: "Atmosphere", icon: ImagePlay },
  { href: "/admin/banner",     label: "Banner",     icon: ImagePlay },
  { href: "/admin/team",       label: "Our Team",   icon: Users },
  { href: "/admin/services",   label: "Services",   icon: Settings },
  { href: "/admin/messages",   label: "Message",    icon: MessageSquare },
];

const Logo = ({ width, eager }: { width: number; eager?: boolean }) => (
  <Image
    src="/images/logo2.png"
    alt="Suba Daily"
    width={width}
    height={40}
    style={{ width: `${width}px`, height: "auto" }}
    loading={eager ? "eager" : "lazy"}
    className="brightness-0 invert"
  />
);

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavLinks = () => (
    <nav className="flex-1 px-3 py-4 overflow-y-auto">
      <ul className="flex flex-col gap-1">
        {navLinks.map(({ href, label, icon: Icon, exact }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive(href, exact)
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-60 bg-zinc-900 border-r border-white/10 fixed inset-y-0 left-0 z-40">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10">
            <Link href="/admin">
              <Logo width={120} />
            </Link>
            <p className="text-white/40 text-xs mt-2">Admin Panel</p>
          </div>

          <NavLinks />

          {/* Logout */}
          <div className="px-3 py-4 border-t border-white/10">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 w-full">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR — tinggi h-16 (64px) ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-900 border-b border-white/10 flex items-center justify-between px-4">
        <Link href="/admin">
          <Logo width={90} eager />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-lg hover:bg-white/10 transition text-white"
          aria-label="Toggle Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-zinc-900 z-50 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" onClick={() => setOpen(false)}>
              <Logo width={90} />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <NavLinks />

          {/* Logout */}
          <div className="px-3 py-4 border-t border-white/10">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 w-full">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}