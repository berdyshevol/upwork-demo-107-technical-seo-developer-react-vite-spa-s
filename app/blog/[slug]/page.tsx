import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentPage from "@/components/ContentPage";
import { getPost, posts } from "@/lib/data";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPost(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    openGraph: {
      type: "article",
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPost(slug);
  if (!page) notFound();
  return <ContentPage page={page} kicker="Blog" />;
}
