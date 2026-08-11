"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Tag, Home, KeyRound, LogOut, Menu, X } from "lucide-react";

const NAV = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/home-content", label: "Home Content", icon: Home },
  { href: "/admin/change-password", label: "Change Password", icon: KeyRound },
];

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        setChecking(false);
      })
      .catch(() => router.replace("/admin"));
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin");
  };

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-neutral-400">Verifying access…</div>;
  }

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-neutral-800 bg-ink-soft">
      <div className="flex items-center gap-3 border-b border-neutral-800 p-5">
        <Image src="/logo.png" alt="Perfect Fit" width={36} height={36} className="rounded-full" />
        <div>
          <p className="font-display text-sm font-semibold text-neutral-100">Perfect Fit</p>
          <p className="text-[11px] uppercase tracking-wider text-gold">Admin</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-gold/10 text-gold"
                : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-100"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-neutral-800 p-3">
        <Link href="/" className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:text-neutral-100">
          <LayoutDashboard className="h-4 w-4" /> View Store
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:text-red-400">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-ink">
      <div className="hidden md:block">{Sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="h-full">{Sidebar}</div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-neutral-800 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu className="h-6 w-6 text-neutral-300" />
            </button>
            <h1 className="font-display text-xl text-neutral-100">{title}</h1>
          </div>
          {open && <button className="md:hidden" onClick={() => setOpen(false)}><X className="h-6 w-6" /></button>}
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
