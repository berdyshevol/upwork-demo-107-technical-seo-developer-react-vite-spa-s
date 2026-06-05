import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CrawlReady SEO — Make Your React SPA Fully Crawlable",
    template: "%s",
  },
  description:
    "We migrate client-rendered React/Vite SPAs to server-rendered HTML so search engines and link previews see real content on first byte.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "CrawlReady SEO",
    title: "CrawlReady SEO — Make Your React SPA Fully Crawlable",
    description:
      "Server-rendered content + per-route metadata for React/Vite apps on Vercel.",
    images: [`${SITE_URL}/og/home.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrawlReady SEO — Make Your React SPA Fully Crawlable",
    description:
      "Server-rendered content + per-route metadata for React/Vite apps on Vercel.",
    images: [`${SITE_URL}/og/home.png`],
  },
};

const nav = [
  { href: "/", label: "Home" },
  { href: "/services/ssr-migration", label: "Services" },
  { href: "/locations/austin-tx", label: "Locations" },
  { href: "/blog/why-view-source-matters", label: "Blog" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
            <Link href="/" className="font-bold text-brand">
              CrawlReady<span className="text-ink"> SEO</span>
            </Link>
            <ul className="flex gap-5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="text-slate-600 hover:text-brand"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl px-5 py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-5 py-6 text-sm text-slate-500">
            CrawlReady SEO — a technical SEO demo showing SSR crawlability for
            React/Vite SPAs on Vercel.
          </div>
        </footer>
      </body>
    </html>
  );
}
