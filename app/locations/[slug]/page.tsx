import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getLocation, locations } from "@/lib/data";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocation(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      url: page.canonical,
      images: [page.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [page.ogImage],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLocation(slug);
  if (!page) notFound();
  return <ContentPage page={page} kicker="Location" />;
}
