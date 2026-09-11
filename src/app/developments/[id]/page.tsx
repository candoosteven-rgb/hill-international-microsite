import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { devData, devById, pageDataFor } from "@/lib/data";
import { hasRealUpload } from "@/lib/image";
import DevelopmentPage from "@/components/DevelopmentPage";

export function generateStaticParams() {
  return devData.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const d = devById(id);
  if (!d) return {};
  const title = `${d.name} | Hill International`;
  const description = d.tagline || `New homes at ${d.name}, ${d.region}, by Hill International.`;

  // Share this development's own hero photo where we have a real one - only
  // a genuine uploaded/remote image works as a link-preview thumbnail (a
  // data: URI placeholder can't be fetched by the crawlers that build these
  // previews), so anything else falls back to the site-wide OG image.
  const hero = pageDataFor(d.id)?.hero;
  const images = hero && hasRealUpload(hero) ? [hero.startsWith("http") ? hero : `/${hero}`] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!devById(id)) notFound();
  return <DevelopmentPage key={id} id={id} />;
}
