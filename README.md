# CrawlReady SEO — SPA-to-SSR Crawlability Demo

A small Next.js (App Router) site that proves a React/Vite-style SPA can be made
**fully crawlable** by serving complete, route-specific HTML — content *and*
metadata — in the initial response, before any JavaScript runs. It mirrors the
route shape of a Lovable/Supabase site on Vercel to demonstrate the exact
migration approach.

## What it demonstrates

- **Server-rendered content** — every route paints its `<h1>` and body copy into
  the raw HTML. `view-source` / `curl` shows real text, not an empty `<div id="root">`.
- **Per-route SSR metadata** via `generateMetadata` — unique `<title>`,
  description, canonical, Open Graph, and Twitter tags for each URL, all in the
  document head on first byte.
- **Dynamic routes rendered from data** — `/services/[slug]`, `/locations/[slug]`,
  and `/blog/[slug]` are generated from a single in-memory data module
  (`lib/data.ts`).
- **Data-driven `sitemap.xml`** (`app/sitemap.ts`) listing every public route —
  including dynamic blog slugs — plus a `robots.txt` (`app/robots.ts`) that
  points at it.
- **Indexing hygiene** — `/thank-you` ships `<meta name="robots" content="noindex">`.
- **Deep links survive refresh** — every route resolves server-side, so opening
  or reloading `/blog/<slug>` returns a real 200, never a 404.
- **Interactive Crawlability Inspector** on the homepage — pick any route, fetch
  its raw HTML, and see exactly which title / H1 / meta tags a crawler receives
  with no JS execution.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage + Crawlability Inspector |
| `/services/[slug]` | Service page (SSR metadata) |
| `/locations/[slug]` | Location page (SSR metadata) |
| `/blog/[slug]` | Dynamic blog post, rendered server-side from data |
| `/thank-you` | `noindex` example |
| `/sitemap.xml`, `/robots.txt` | Generated from the data layer |

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Verify SSR yourself:

```bash
curl -s http://localhost:3000/services/ssr-migration | grep -E "<title>|<h1|canonical"
```

## Test

Behavioral Playwright tests cover every acceptance criterion (raw-HTML SSR
assertions, distinct metadata per route, sitemap/robots, deep-link refresh,
noindex, and the inspector).

```bash
pnpm exec playwright install --with-deps chromium   # once
pnpm test
```

## Stack

Next.js (App Router, latest) · TypeScript · Tailwind CSS · Playwright. All data
is in-memory; no external API keys required at runtime.
