"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShoppingBag, Heart, Search, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist, hydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-ink/90 backdrop-blur-md">
      <div className="container-px flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="flex items-center gap-3" aria-label="Perfect Fit home">
          <Image src="/logo.png" alt="Perfect Fit" width={44} height={44} className="rounded-full" priority />
          <span className="hidden font-display text-lg font-semibold tracking-wide text-neutral-100 sm:block">
            PERFECT <span className="gold-text">FIT</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-gold ${
                pathname === item.href ? "text-gold" : "text-neutral-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/shop" aria-label="Search" className="p-2 text-neutral-300 transition hover:text-gold">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative p-2 text-neutral-300 transition hover:text-gold">
            <Heart className="h-5 w-5" />
            {hydrated && wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative p-2 text-neutral-300 transition hover:text-gold">
            <ShoppingBag className="h-5 w-5" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="p-2 text-neutral-300 transition hover:text-gold md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-neutral-800 bg-ink-soft md:hidden">
          <div className="container-px flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 py-3 text-sm font-medium uppercase tracking-wider ${
                  pathname === item.href ? "text-gold" : "text-neutral-300"
                }`}
              >
                <Package className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
