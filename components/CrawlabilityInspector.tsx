"use client";

import { useState } from "react";

type Route = { path: string; label: string };

// Routes the visitor can inspect. Each fetches the page's RAW HTML and we
// extract what a crawler would read from the initial response — no JS execution.
const ROUTES: Route[] = [
  { path: "/", label: "Home" },
  { path: "/services/ssr-migration", label: "Service · SSR Migration" },
  {
    path: "/services/metadata-architecture",
    label: "Service · Metadata Architecture",
  },
  { path: "/locations/austin-tx", label: "Location · Austin, TX" },
  { path: "/locations/denver-co", label: "Location · Denver, CO" },
  {
    path: "/blog/why-view-source-matters",
    label: "Blog · view-source Matters",
  },
  { path: "/blog/sitemaps-from-data", label: "Blog · Sitemaps From Data" },
  {
    path: "/blog/deep-links-without-404s",
    label: "Blog · Deep Links Without 404s",
  },
  { path: "/thank-you", label: "Thank-you (noindex)" },
];

function extract(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

type Result = {
  status: number;
  title: string | null;
  h1: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
};

export default function CrawlabilityInspector() {
  const [path, setPath] = useState<string>("/services/ssr-migration");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function inspect() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Fetch the raw HTML exactly as a crawler / curl would receive it.
      const res = await fetch(path, { headers: { Accept: "text/html" } });
      const html = await res.text();
      setResult({
        status: res.status,
        title: extract(html, /<title[^>]*>([^<]*)<\/title>/i),
        h1: extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)?.replace(
          /<[^>]+>/g,
          ""
        ) ?? null,
        description: extract(
          html,
          /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
        ),
        canonical: extract(
          html,
          /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i
        ),
        robots: extract(
          html,
          /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i
        ),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch HTML");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-ink">Crawlability Inspector</h2>
      <p className="prose-body mt-1 text-sm">
        Pick any route and fetch its <strong>raw HTML</strong> — the bytes a
        crawler reads before a single line of JavaScript executes. Real content
        and per-route metadata show up here because the page is server-rendered.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm font-medium text-slate-700">
          Route to inspect
          <select
            aria-label="Route to inspect"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {ROUTES.map((r) => (
              <option key={r.path} value={r.path}>
                {r.label} — {r.path}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={inspect}
          disabled={loading}
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Inspecting…" : "Inspect raw HTML"}
        </button>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600" data-testid="inspector-error">
          {error}
        </p>
      )}

      {result && (
        <div
          data-testid="inspector-result"
          className="mt-5 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm"
        >
          <p className="font-semibold text-green-700">
            ✓ Found in raw HTML (HTTP {result.status}) — no JS required
          </p>
          <Row k="<title>" v={result.title} />
          <Row k="<h1>" v={result.h1} />
          <Row k="meta description" v={result.description} />
          <Row k="canonical" v={result.canonical} />
          <Row
            k="meta robots"
            v={result.robots ?? "(none — indexable)"}
          />
        </div>
      )}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3">
      <span className="font-mono text-xs text-slate-500">{k}</span>
      <span className="text-slate-800">{v ?? "—"}</span>
    </div>
  );
}
