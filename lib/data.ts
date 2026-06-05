// Single source of truth for every public route's content + SEO metadata.
// Routes (app/.../page.tsx) and the sitemap (app/sitemap.ts) all read from here,
// so a page can never exist without a matching sitemap entry or vice-versa.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://upwork-demo-107.example.com";

export type Page = {
  slug: string;
  title: string; // <title> + og:title
  description: string; // <meta name="description"> + og:description
  canonical: string; // absolute canonical URL
  ogImage: string; // absolute Open Graph image URL
  h1: string; // server-rendered <h1>
  body: string; // server-rendered body copy
};

const og = (label: string) =>
  `${SITE_URL}/og/${label}.png`;

export const services: Page[] = [
  {
    slug: "ssr-migration",
    title: "SPA → SSR Migration | CrawlReady SEO",
    description:
      "Migrate a client-rendered React/Vite SPA to server-rendered HTML so Google indexes content on first byte — no JS execution required.",
    canonical: `${SITE_URL}/services/ssr-migration`,
    ogImage: og("ssr-migration"),
    h1: "SPA-to-SSR Migration",
    body:
      "Your Lovable + Supabase app ships an empty <div id=\"root\"> and paints content only after the bundle hydrates. We move every route to Next.js App Router server components, so the full H1, copy, and meta tags arrive in the initial HTML response. Crawlers, link unfurlers, and slow devices all see real content immediately.",
  },
  {
    slug: "metadata-architecture",
    title: "Per-Route Metadata Architecture | CrawlReady SEO",
    description:
      "Unique title, description, canonical, Open Graph, and Twitter tags generated server-side per route via generateMetadata — never injected client-side.",
    canonical: `${SITE_URL}/services/metadata-architecture`,
    ogImage: og("metadata-architecture"),
    h1: "Per-Route Metadata Architecture",
    body:
      "A single React Helmet tag in a SPA can't give each URL distinct, crawlable metadata. We wire generateMetadata into every route so each page returns its own canonical, OG image, and Twitter card in the document head before any script runs. Share a link in Slack and it unfurls correctly the first time.",
  },
];

export const locations: Page[] = [
  {
    slug: "austin-tx",
    title: "SEO Engineering in Austin, TX | CrawlReady SEO",
    description:
      "Technical SEO and SSR migration for Austin-based SaaS and service businesses running React/Vite on Vercel.",
    canonical: `${SITE_URL}/locations/austin-tx`,
    ogImage: og("austin-tx"),
    h1: "Technical SEO — Austin, TX",
    body:
      "We help Austin teams ship crawlable, fast-indexing sites without rewriting their product. This location page is itself server-rendered: view-source on it and you'll find this exact paragraph and the Austin H1 in the raw HTML, which is what lets a local landing page actually rank.",
  },
  {
    slug: "denver-co",
    title: "SEO Engineering in Denver, CO | CrawlReady SEO",
    description:
      "Server-rendered location pages and sitemap automation for Denver companies migrating off client-only React rendering.",
    canonical: `${SITE_URL}/locations/denver-co`,
    ogImage: og("denver-co"),
    h1: "Technical SEO — Denver, CO",
    body:
      "Denver service businesses lose local rankings when every city page is the same empty SPA shell to a crawler. Each location here is a distinct server-rendered route with its own canonical and Open Graph tags, generated from one data module so adding a city is a one-line change.",
  },
];

export const posts: Page[] = [
  {
    slug: "why-view-source-matters",
    title: "Why view-source Still Decides Your Rankings | CrawlReady Blog",
    description:
      "Googlebot renders JS, but first-pass indexing, link previews, and many crawlers read raw HTML. Here's why SSR content beats client injection.",
    canonical: `${SITE_URL}/blog/why-view-source-matters`,
    ogImage: og("why-view-source-matters"),
    h1: "Why view-source Still Decides Your Rankings",
    body:
      "Open view-source on a Vite SPA and you'll see an empty root div — the content exists only after JavaScript runs. Google's second rendering pass can recover some of it, but the first indexing pass, social unfurlers, and lighter crawlers do not. This post walks through moving that content into the server response so it's present on first byte.",
  },
  {
    slug: "sitemaps-from-data",
    title: "Generating sitemap.xml From Your Data Layer | CrawlReady Blog",
    description:
      "Stop hand-maintaining sitemaps. Drive sitemap.xml from the same data that renders your routes so new pages are discoverable automatically.",
    canonical: `${SITE_URL}/blog/sitemaps-from-data`,
    ogImage: og("sitemaps-from-data"),
    h1: "Generating sitemap.xml From Your Data Layer",
    body:
      "A sitemap that drifts from your real routes is worse than none. In the App Router, sitemap.ts is just code: import the same arrays your pages render from and map them to URL entries. Add a blog post to the data module and it appears in both the route tree and sitemap.xml with zero extra steps.",
  },
  {
    slug: "deep-links-without-404s",
    title: "Deep Links That Survive a Refresh | CrawlReady Blog",
    description:
      "Why SPA deep links 404 on a hard refresh behind some hosts, and how server-rendered routes make every URL directly loadable.",
    canonical: `${SITE_URL}/blog/deep-links-without-404s`,
    ogImage: og("deep-links-without-404s"),
    h1: "Deep Links That Survive a Refresh",
    body:
      "When a user refreshes /blog/some-post on a misconfigured SPA, the host looks for a file that doesn't exist and returns a 404 before the router ever loads. Server-rendered routes resolve on the server, so every deep link — bookmarked, shared, or refreshed — returns real HTML with a 200 status.",
  },
];

const bySlug = (arr: Page[], slug: string) => arr.find((p) => p.slug === slug);

export const getService = (slug: string) => bySlug(services, slug);
export const getLocation = (slug: string) => bySlug(locations, slug);
export const getPost = (slug: string) => bySlug(posts, slug);
