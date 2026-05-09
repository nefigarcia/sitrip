"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard, Car, MapPin, CalendarCheck, User,
  LogOut, ChevronRight, Menu, X, Route,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/trips", label: "Mis Viajes", icon: Car },
  { href: "/requests", label: "Solicitudes", icon: MapPin },
  { href: "/bookings", label: "Reservas", icon: CalendarCheck },
  { href: "/profile", label: "Mi Perfil", icon: User },
];

function NavLink({ href, label, icon: Icon, collapsed }: {
  href: string; label: string; icon: any; collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-slate-400 hover:bg-white/10 hover:text-white",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
      {!collapsed && isActive && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  );
}

export function Sidebar() {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-slate-900 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-white/10", collapsed && "justify-center")}>
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Route className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SiTrip</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
            <Route className="h-5 w-5 text-white" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto text-slate-400 hover:text-white hover:bg-white/10", collapsed && "ml-0 mt-2")}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User */}
      <div className={cn("p-3 border-t border-white/10", collapsed && "p-2")}>
        <div className={cn("flex items-center gap-3 rounded-xl p-2", collapsed && "justify-center")}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback className="text-xs bg-primary/80">
              {getInitials(session?.user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{session?.user?.email}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "w-full mt-1 text-slate-400 hover:text-white hover:bg-white/10",
            collapsed ? "justify-center" : "justify-start gap-2"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && "Cerrar sesión"}
        </Button>
      </div>
    </aside>
  );
}
