"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  FolderPlus,
  FolderKanban,
  User,
  LogOut,
  LayoutDashboard,
  Users,
  Palette,
  CheckCircle2,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { NexusLogo } from "@/components/ui/nexus-logo";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants/brand";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

interface SidebarProps {
  role: UserRole;
  userName: string;
  userEmail: string;
}

export function PortalSidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push("/login");
  };

  const navItems = {
    customer: [
      { name: "My Cases", href: "/dashboard/customer", icon: FolderKanban },
      { name: "New Case", href: "/dashboard/customer/new", icon: FolderPlus },
      { name: "Profile", href: "/dashboard/customer/profile", icon: User },
    ],
    designer: [
      { name: "Assigned Cases", href: "/dashboard/designer", icon: FolderKanban },
      { name: "Completed Cases", href: "/dashboard/designer/completed", icon: CheckCircle2 },
      { name: "Profile", href: "/dashboard/designer/profile", icon: User },
    ],
    admin: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "All Cases", href: "/dashboard/admin/cases", icon: FolderKanban },
      { name: "Customers", href: "/dashboard/admin/customers", icon: Users },
      { name: "Designers", href: "/dashboard/admin/designers", icon: Palette },
      { name: "Profile", href: "/dashboard/admin/profile", icon: User },
    ],
  }[role] || [];

  const roleLabel = BRAND.portalRoles[role] || "User";

  const navContent = (
    <div className="flex flex-col h-full bg-[#090e1c] border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <NexusLogo href={`/dashboard/${role}`} roleBadge={roleLabel} />
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
          {roleLabel} Portal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm shadow-cyan-500/10"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-cyan-400" : "text-slate-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Bottom Bar */}
      <div className="p-4 border-t border-slate-800/80 bg-[#070b16]">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-xs font-bold uppercase">
            {userName ? userName.charAt(0) : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{userName || "User"}</p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#090e1c] border-b border-slate-800">
        <NexusLogo href={`/dashboard/${role}`} roleBadge={roleLabel} />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {navContent}
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>
    </>
  );
}
