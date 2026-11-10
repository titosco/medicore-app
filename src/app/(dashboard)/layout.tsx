"use client";

import { useEffect, ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Loader2, X, Menu } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { navByRole, navItem } from "@/config/navigation";

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: navItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              active
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Guard, once loading is done, no user means redirect to login
  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  // While the drawer is open: lock page scroll, close on Escape,
  // and close if the window grows to desktop width
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  // All hooks stay above this line: an early return before a hook breaks React

  if (isLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-700" size={24} />
      </main>
    );
  }

  const items = navByRole[user.role] ?? [];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <span className="text-lg font-bold text-blue-700">Medicore</span>
        </div>
        <SidebarNav items={items} pathname={pathname} />
      </aside>

      {/* mobile drawer: backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile drawer: panel */}
      <aside
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-gray-100 transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-700">Medicore</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="p-1 -mr-2 rounded-lg text-blue-600 hover:bg-blue-200"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarNav
          items={items}
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-17.5 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-sidebar"
              className="md:hidden p-2 -ml-2 rounded-lg text-gray-700 hover:bg-gray-200"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
