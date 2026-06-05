import Link from "next/link";
import CrawlabilityInspector from "@/components/CrawlabilityInspector";
import { services, locations, posts } from "@/lib/data";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Technical SEO · SSR Migration
        </p>
        <h1 className="text-4xl font-bold text-ink">
          Make your React/Vite SPA fully crawlable
        </h1>
        <p className="prose-body max-w-2xl text-lg">
          A client-rendered SPA ships an empty shell and paints content only
          after its bundle hydrates — so crawlers and link previews often see
          nothing. This demo mirrors a Lovable/Supabase site&apos;s route shape
          and serves complete, route-specific HTML (content{" "}
          <em>and</em> metadata) before any JavaScript runs.
        </p>
      </section>

      <CrawlabilityInspector />

      <section>
        <h2 className="text-2xl font-bold text-ink">Services</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <CardLink
              key={s.slug}
              href={`/services/${s.slug}`}
              title={s.h1}
              desc={s.description}
            />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-ink">Locations</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {locations.map((l) => (
            <CardLink
              key={l.slug}
              href={`/locations/${l.slug}`}
              title={l.h1}
              desc={l.description}
            />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-ink">From the blog</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {posts.map((p) => (
            <CardLink
              key={p.slug}
              href={`/blog/${p.slug}`}
              title={p.h1}
              desc={p.description}
            />
          ))}
        </ul>
      </section>

      <section className="text-sm text-slate-500">
        <p>
          SEO plumbing:{" "}
          <Link href="/sitemap.xml" className="text-brand hover:underline">
            /sitemap.xml
          </Link>{" "}
          ·{" "}
          <Link href="/robots.txt" className="text-brand hover:underline">
            /robots.txt
          </Link>{" "}
          ·{" "}
          <Link href="/thank-you" className="text-brand hover:underline">
            /thank-you (noindex)
          </Link>
        </p>
      </section>
    </div>
  );
}

function CardLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block h-full rounded-lg border border-slate-200 bg-white p-4 transition hover:border-brand hover:shadow-sm"
      >
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{desc}</p>
      </Link>
    </li>
  );
}
