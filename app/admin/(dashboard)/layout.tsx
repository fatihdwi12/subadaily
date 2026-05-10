// app/admin/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/admin/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>; // ← render tanpa sidebar
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <main className="md:ml-60 pt-14 md:pt-0 p-4 sm:p-6 lg:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
