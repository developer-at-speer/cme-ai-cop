"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Building2,
  CheckSquare,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { canAccessAdmin, canAccessWorkbench, canSubmitRecipe } from "@/lib/rbac";
import { navLinkClass } from "@/lib/brand";
import { CmeLogo } from "@/components/brand/CmeLogo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workbench", label: "AI Workbench", icon: FlaskConical, workbench: true },
  { href: "/recipes", label: "Recipe Library", icon: CheckSquare },
  { href: "/recipes/submit", label: "Submit Recipe", icon: CheckSquare, submit: true },
];

const adminNav = [
  { href: "/admin", label: "Overview", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/approvals", label: "Approvals", icon: CheckSquare },
  { href: "/admin/activity", label: "Activity", icon: Activity },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useAppData();

  if (!user) return null;

  const company = state.companies.find((c) => c.id === user.company_id);

  const links = mainNav.filter((item) => {
    if (item.workbench && !canAccessWorkbench(user)) return false;
    if (item.submit && !canSubmitRecipe(user)) return false;
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-5">
        <CmeLogo className="h-10" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cme-red">
          AI Community of Practice
        </p>
        <p className="mt-1 text-sm font-medium text-cme-black">{user.name}</p>
        <p className="text-xs text-muted-foreground">
          {company?.name ?? "CME Administration"} · {user.role}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? navLinkClass.active : navLinkClass.inactive,
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {canAccessAdmin(user) && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active ? navLinkClass.active : navLinkClass.inactive,
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-neutral-600"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function SideNav() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white md:block">
      <NavLinks />
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <SheetContent side="left" className="w-64 p-0">
        <NavLinks onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
