import { test, expect } from "@playwright/test";

// Acceptance tests for the SPA-to-SSR SEO Crawlability demo.
// Most assertions fetch the RAW HTML via request.get (no browser, no JS) —
// this is the whole point: content + metadata must be present before any
// script runs, exactly what `curl` / `view-source` / a crawler would see.

function meta(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`,
    "i"
  );
  const m = html.match(re) || html.match(alt);
  return m ? m[1] : null;
}

function title(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1] : null;
}

function canonical(html: string): string | null {
  const m = html.match(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i
  );
  return m ? m[1] : null;
}

// AC1: curl <url>/services/<slug> (no JS) returns full HTML with the correct
// H1, body, and unique <title>/<meta>/canonical/OG tags.
test("AC1: service page raw HTML carries H1, body, and full SEO tags", async ({
  request,
}) => {
  const res = await request.get("/services/ssr-migration");
  expect(res.status()).toBe(200);
  const html = await res.text();

  // Server-rendered content present in the raw response (not injected by JS).
  expect(html).toContain("<h1");
  expect(html).toContain("SPA-to-SSR Migration");
  // Body copy is in the initial HTML (angle brackets in the copy are
  // HTML-escaped by React, so assert on a clean substring of the same body).
  expect(html).toContain("paints content only after the bundle hydrates");

  // Full, route-specific metadata.
  expect(title(html)).toBe("SPA → SSR Migration | CrawlReady SEO");
  expect(meta(html, "description")).toContain("server-rendered HTML");
  expect(canonical(html)).toContain("/services/ssr-migration");
  expect(meta(html, "og:title")).toBe("SPA → SSR Migration | CrawlReady SEO");
  expect(meta(html, "og:image")).toContain("/og/ssr-migration.png");
  expect(meta(html, "twitter:card")).toBe("summary_large_image");
});

// AC2: Each route shows distinct metadata in view-source — confirmed for
// home, service, location, and a blog post.
test("AC2: home, service, location, and blog post all have distinct titles", async ({
  request,
}) => {
  const paths = [
    "/",
    "/services/ssr-migration",
    "/locations/austin-tx",
    "/blog/why-view-source-matters",
  ];
  const titles: string[] = [];
  for (const p of paths) {
    const res = await request.get(p);
    expect(res.status()).toBe(200);
    const t = title(await res.text());
    expect(t, `title for ${p}`).toBeTruthy();
    titles.push(t as string);
  }
  // Every title is unique.
  expect(new Set(titles).size).toBe(titles.length);
});

// AC2 (cont.): location page raw HTML has its own canonical + H1.
test("AC2: location page has its own server-rendered H1 and canonical", async ({
  request,
}) => {
  const html = await (await request.get("/locations/austin-tx")).text();
  expect(html).toContain("Technical SEO — Austin, TX");
  expect(canonical(html)).toContain("/locations/austin-tx");
  expect(title(html)).toContain("Austin");
});

// AC3a: /sitemap.xml lists every public route including dynamic blog slugs.
test("AC3: sitemap.xml lists all static and dynamic routes", async ({
  request,
}) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(res.headers()["content-type"]).toContain("xml");

  for (const url of [
    "/services/ssr-migration",
    "/services/metadata-architecture",
    "/locations/austin-tx",
    "/locations/denver-co",
    "/blog/why-view-source-matters",
    "/blog/sitemaps-from-data",
    "/blog/deep-links-without-404s",
  ]) {
    expect(xml, `sitemap should contain ${url}`).toContain(url);
  }
  // The noindex page must NOT be in the sitemap.
  expect(xml).not.toContain("/thank-you");
});

// AC3b: /robots.txt references the sitemap.
test("AC3: robots.txt references the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const txt = await res.text();
  expect(txt.toLowerCase()).toContain("sitemap:");
  expect(txt).toContain("/sitemap.xml");
});

// AC4: Refreshing or directly opening any deep link (e.g. /blog/<slug>) loads
// correctly — no 404. Driven through a real browser navigation + reload.
test("AC4: deep-linking and refreshing a blog post does not 404", async ({
  page,
}) => {
  const resp = await page.goto("/blog/deep-links-without-404s");
  expect(resp?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Deep Links That Survive a Refresh" })
  ).toBeVisible();

  // Hard reload — the exact scenario that 404s on a misconfigured SPA.
  const reload = await page.reload();
  expect(reload?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Deep Links That Survive a Refresh" })
  ).toBeVisible();
});

// AC4 (edge): an unknown slug returns a real 404, not a blank SPA shell.
test("AC4 edge: unknown blog slug returns 404", async ({ request }) => {
  const res = await request.get("/blog/this-post-does-not-exist");
  expect(res.status()).toBe(404);
});

// AC5: /thank-you returns a noindex robots meta tag.
test("AC5: /thank-you is noindex in the raw HTML", async ({ request }) => {
  const res = await request.get("/thank-you");
  expect(res.status()).toBe(200);
  const html = await res.text();
  const robots = meta(html, "robots");
  expect(robots).toBeTruthy();
  expect(robots).toContain("noindex");
});

// Interactive value-prop screen: the homepage Crawlability Inspector lets a
// visitor fetch any route's RAW HTML and see the title/H1 a crawler receives.
test("Inspector: homepage tool reveals server-rendered content for a route", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Crawlability Inspector/i })
  ).toBeVisible();

  // Choose a route and run the inspection.
  await page.getByLabel("Route to inspect").selectOption("/blog/sitemaps-from-data");
  await page.getByRole("button", { name: /Inspect raw HTML/i }).click();

  // The inspector reports what was found in the raw (pre-JS) response.
  const result = page.getByTestId("inspector-result");
  await expect(result).toContainText(
    "Generating sitemap.xml From Your Data Layer"
  );
  await expect(result).toContainText(/Found in raw HTML/i);
});
