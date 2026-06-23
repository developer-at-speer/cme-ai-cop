import { MobileNav } from "@/components/layout/SideNav";

export function AppHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 md:px-6">
      <MobileNav />
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
    </header>
  );
}
