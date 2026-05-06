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
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";

// ── Tipe nav ──────────────────────────────────────────────────────────────────
type NavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  children?: { href: string; label: string; icon: React.ElementType }[];
};

const navLinks: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    label: "Atmosphere",
    icon: ImagePlay,
    children: [
      { href: "/admin/atmosphere", label: "Content", icon: ImagePlay },
      {
        href: "/admin/atmosphere/hero-banner",
        label: "Hero Banner",
        icon: ImageIcon,
      },
    ],
  },
  { href: "/admin/banner", label: "Banner", icon: ImagePlay },
  {
    label: "Our Team",
    icon: Users,
    children: [
      { href: "/admin/team", label: "Members", icon: Users },
      {
        href: "/admin/team/hero-banner",
        label: "Hero Banner",
        icon: ImageIcon,
      },
    ],
  },
  // ... sisanya tidak berubah

  { href: "/admin/media-gallery", label: "Media", icon: ImagePlay },
  { href: "/admin/services", label: "Services", icon: Settings },
  { href: "/admin/messages", label: "Message", icon: MessageSquare },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
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

// ── Dropdown Item ─────────────────────────────────────────────────────────────
function DropdownItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  // Auto-buka jika salah satu child sedang aktif
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(!!isChildActive);

  return (
    <li>
      {/* Trigger dropdown */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200
          ${
            isChildActive
              ? "bg-white/15 text-white font-medium"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}>
        <item.icon size={18} />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sub-items */}
      {open && (
        <ul className="mt-0.5 flex flex-col gap-0.5 pl-9">
          {item.children?.map((child) => {
            const active =
              pathname === child.href || pathname.startsWith(child.href + "/");
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onClose}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200
                    ${
                      active
                        ? "bg-white/10 text-white font-medium"
                        : "text-white/50 hover:text-white hover:bg-white/[0.07]"
                    }`}>
                  <child.icon size={15} />
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

// ── NavLinks ──────────────────────────────────────────────────────────────────
function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="flex flex-col gap-1">
        {navLinks.map((item) =>
          item.children ? (
            <DropdownItem key={item.label} item={item} onClose={onClose} />
          ) : (
            <li key={item.href}>
              <Link
                href={item.href!}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200
                  ${
                    isActive(item.href!, item.exact)
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────
export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/10 bg-zinc-900 fixed inset-y-0 left-0 z-40">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <Link href="/admin">
              <Logo width={120} />
            </Link>
            <p className="mt-2 text-xs text-white/40">Admin Panel</p>
          </div>

          <NavLinks />

          <div className="border-t border-white/10 px-3 py-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-zinc-900 px-4">
        <Link href="/admin">
          <Logo width={90} eager />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10"
          aria-label="Toggle Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── MOBILE OVERLAY ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
            <Link href="/admin" onClick={() => setOpen(false)}>
              <Logo width={90} />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <NavLinks onClose={() => setOpen(false)} />

          <div className="border-t border-white/10 px-3 py-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
