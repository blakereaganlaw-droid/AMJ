import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
  displayName?: string;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-8">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
