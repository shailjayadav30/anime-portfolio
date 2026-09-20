import type { Metadata } from "next";
import Experience from "@/components/Experience";

type Props = { params: { slug?: string[] } };

// "/", "/about" and "/projects" are the same room in three states.
// Real folders (contact) win over this catch-all.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["about"] }, { slug: ["projects"] }];
}

const viewOf = (slug?: string[]) =>
  slug?.[0] === "about" ? "about" : slug?.[0] === "projects" ? "projects" : "home";

export function generateMetadata({ params }: Props): Metadata {
  const v = viewOf(params.slug);
  return v === "about" ? { title: "About — Ukato" } : v === "projects" ? { title: "Projects — Ukato" } : {};
}

export default function Page({ params }: Props) {
  return <Experience initialView={viewOf(params.slug)} />;
}
