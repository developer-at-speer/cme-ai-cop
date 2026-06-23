import { MobileNav } from "@/components/layout/SideNav";

export function AppHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-neutral-200 bg-white px-4 md:px-6">
      <MobileNav />
      <h1 className="text-lg font-semibold text-cme-black">{title}</h1>
    </header>
  );
}
