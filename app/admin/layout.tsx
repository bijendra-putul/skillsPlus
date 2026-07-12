// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();

  const [checking, setChecking]       = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Skip auth check on the login page itself
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem("token");
    const role  = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/admin/login");
      return;
    }

    // Verify token with backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.clear();
          router.replace("/admin/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        localStorage.clear();
        router.replace("/admin/login");
      });
  }, [router, isLoginPage]);

  // ── Login page: render without sidebar/topbar shell ──
  if (isLoginPage) {
    return <>{children}</>;
  }

  // ── Auth check in progress ──
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">
            Verifying access…
          </p>
        </div>
      </div>
    );
  }

  // ── Authenticated admin shell ──
  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}