import type { Metadata } from "next";
import Link from "next/link";

// Indexing hygiene example: a confirmation page should never appear in search
// results. `robots: { index: false }` emits <meta name="robots" content="noindex">
// directly into the server-rendered HTML head.
export const metadata: Metadata = {
  title: "Thank you — CrawlReady SEO",
  description: "Submission received.",
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <article className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        Confirmation
      </p>
      <h1 className="text-3xl font-bold text-ink">Thanks — we got it.</h1>
      <p className="prose-body text-lg">
        This page is intentionally marked{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">noindex</code>
        . Confirmation and thank-you pages add no search value and can dilute
        crawl budget, so we keep them out of the index while leaving them fully
        reachable for real visitors.
      </p>
      <Link href="/" className="inline-block text-sm text-brand hover:underline">
        ← Back home
      </Link>
    </article>
  );
}
