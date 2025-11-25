import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <MobileNav />
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
