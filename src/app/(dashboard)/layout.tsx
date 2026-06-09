import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Lock, LayoutDashboard, Plus, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/capsules/new", label: "New Capsule", icon: Plus },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/10 bg-[#22233a] px-4 py-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Lock className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Vaultly</span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 px-2 pt-4 border-t border-white/10">
          <UserButton  />
          <span className="text-sm text-muted-foreground">Account</span>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#22233a] px-4 h-14">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Lock className="h-3 w-3" />
          </div>
          <span className="font-semibold">Vaultly</span>
        </Link>
        <UserButton  />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col md:pt-0 pt-14">
        {children}
      </main>
    </div>
  );
}
