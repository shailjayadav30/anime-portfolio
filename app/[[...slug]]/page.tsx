import type { Metadata } from "next";
import Experience from "@/components/Experience";

type Props = { params: { slug?: string[] } };


export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ["about"] }, { slug: ["projects"] }];
}

const viewOf = (slug?: string[]) =>
  slug?.[0] === "about"
    ? "about"
    : slug?.[0] === "projects"
      ? "projects"
      : slug?.[0] === "contact"
        ? "contact"
        : "home";

export function generateMetadata({ params }: Props): Metadata {
  const v = viewOf(params.slug);
  return v === "about"
    ? { title: "About — Shailja" }
    : v === "projects"
      ? { title: "Projects — Shailja" }
      : {};
}

export default function Page({ params }: Props) {
  return <Experience initialView={viewOf(params.slug)} />;
}
