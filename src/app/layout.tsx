import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Perfect Fit | Style That Fits. Confidence That Shows.",
    template: "%s | Perfect Fit",
  },
  description:
    "Perfect Fit — luxury tailored fashion, made in Karnataka. Premium shirts, suits and apparel crafted for the modern individual.",
  keywords: ["Perfect Fit", "luxury fashion", "tailored shirts", "Made in Karnataka", "premium apparel"],
  openGraph: {
    title: "Perfect Fit | Style That Fits. Confidence That Shows.",
    description: "Luxury tailored fashion, made in Karnataka.",
    type: "website",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
