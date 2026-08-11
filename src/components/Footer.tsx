import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-800 bg-ink-soft">
      <div className="container-px grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Perfect Fit" width={48} height={48} className="rounded-full" />
            <span className="font-display text-lg font-semibold text-neutral-100">
              PERFECT <span className="gold-text">FIT</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Style that fits. Confidence that shows. Luxury tailored fashion, proudly made in Karnataka.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition hover:border-gold hover:text-gold"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Shop</h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-400">
            <li><Link href="/shop" className="transition hover:text-gold">All Products</Link></li>
            <li><Link href="/shop?category=Shirts" className="transition hover:text-gold">Shirts</Link></li>
            <li><Link href="/shop?category=Suits" className="transition hover:text-gold">Suits</Link></li>
            <li><Link href="/wishlist" className="transition hover:text-gold">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Help</h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-400">
            <li><Link href="/track-order" className="transition hover:text-gold">Track Order</Link></li>
            <li><Link href="/shipping-policy" className="transition hover:text-gold">Shipping Policy</Link></li>
            <li><Link href="/refund-policy" className="transition hover:text-gold">Refund Policy</Link></li>
            <li><Link href="/privacy-policy" className="transition hover:text-gold">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-neutral-400">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Bengaluru, Karnataka</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +91 99999 99999</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@perfectfit.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-800 py-6">
        <div className="container-px flex flex-col items-center justify-between gap-2 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Perfect Fit. All rights reserved.</p>
          <p>Made in Karnataka with care.</p>
        </div>
      </div>
    </footer>
  );
}
