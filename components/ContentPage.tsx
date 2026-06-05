import Link from "next/link";
import type { Page } from "@/lib/data";

// Server component: renders an H1 + body straight into the HTML response.
// Nothing here is client-injected, so view-source shows the real content.
export default function ContentPage({
  page,
  kicker,
}: {
  page: Page;
  kicker: string;
}) {
  return (
    <article className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand">
        {kicker}
      </p>
      <h1 className="text-3xl font-bold text-ink">{page.h1}</h1>
      <p className="prose-body text-lg">{page.body}</p>
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <p className="font-semibold text-ink">This page is server-rendered.</p>
        <p className="mt-1">
          Run{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            curl {page.canonical}
          </code>{" "}
          and you&apos;ll get this H1, this paragraph, and a unique{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            &lt;title&gt;
          </code>{" "}
          / canonical / Open Graph set — before any JavaScript runs.
        </p>
      </div>
      <Link href="/" className="inline-block text-sm text-brand hover:underline">
        ← Back to the Crawlability Inspector
      </Link>
    </article>
  );
}
