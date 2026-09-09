import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { devData, devById } from "@/lib/data";
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
  return {
    title: `${d.name} | Hill International`,
    description: d.tagline || `New homes at ${d.name}, ${d.region}, by Hill International.`,
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
