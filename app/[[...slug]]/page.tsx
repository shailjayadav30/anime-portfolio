import type { Metadata } from "next";
import Experience from "@/components/Experience";

type Props = { params: { slug?: string[] } };

// Only "/" and "/about" are rendered here. Real folders (projects, contact) win over this catch-all.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["about"] }];
}

export function generateMetadata({ params }: Props): Metadata {
  return params.slug?.[0] === "about" ? { title: "About — Ukato" } : {};
}

export default function Page({ params }: Props) {
  const view = params.slug?.[0] === "about" ? "about" : "home";
  return <Experience initialView={view} />;
}
