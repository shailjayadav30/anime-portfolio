// lib/projects.ts
//
// Cards read: name, category, tone (media fallback, 0-3, cycles if unset).
// The hub reads: name, description, stack, href.
//
// 6 real placeholders carried over from the site's own content, plus 2 marked
// TODO to reach the 8 the dial is tuned for (see curved-dial-slider-spec.md
// §5, "N < 8 spreads the cards; do not duplicate to fill slots" — 8 avoids
// that path entirely). Replace names, descriptions, stack and href with the
// real projects; do not invent employers, metrics or links for the TODO ones.

export type Project = {
  slug: string;
  name: string;
  category: string; // short, uppercase in the UI — "DEVELOPMENT", "DESIGN", etc.
  description: string; // 2–3 sentences; the hub clamps to 3 lines
  stack: string[];
  href: string;
  image?: string; // omit to use the tone fallback
  tone?: 0 | 1 | 2 | 3;
};

export const projects: Project[] = [
  {
    slug: "ukato",
    name: "Ukato",
    category: "Development",
    description:
      "This room. One circle of light that grows from the corner, and a site that never quite becomes a second page.",
    stack: ["Next.js", "TypeScript", "CSS clip-path"],
    href: "https://github.com/you/ukato",
    tone: 3,
  },
  {
    slug: "lantern",
    name: "Lantern",
    category: "Product",
    description:
      "A notes app that only shows the three things you wrote most recently. Everything older has to be searched for on purpose.",
    stack: ["SwiftUI", "SQLite"],
    href: "#",
    tone: 0,
  },
  {
    slug: "kettle",
    name: "Kettle",
    category: "Tool",
    description:
      "A build watcher that speaks in one line. It boils while it works and goes quiet when it is done.",
    stack: ["Rust", "CLI"],
    href: "#",
    tone: 1,
  },
  {
    slug: "paper-moon",
    name: "Paper Moon",
    category: "Web App",
    description:
      "A reading tracker shaped like a lunar calendar. Each finished book fills in one night of the month.",
    stack: ["React", "D3", "Postgres"],
    href: "#",
    tone: 2,
  },
  {
    slug: "sill",
    name: "Sill",
    category: "Desktop",
    description:
      "A tiny weather window for a second monitor. No forecast, no icons — just the colour of the light outside, right now.",
    stack: ["Electron", "Canvas"],
    href: "#",
    tone: 0,
  },
  {
    slug: "hand-warmer",
    name: "Hand-Warmer",
    category: "Firmware",
    description:
      "A first released thing: a keyboard layout for cold rooms that keeps every common key under a resting finger.",
    stack: ["QMK", "C"],
    href: "#",
    tone: 1,
  },
  {
    // TODO — replace with a real project. Placeholder only.
    slug: "project-seven",
    name: "Project Seven",
    category: "TODO",
    description: "TODO — one or two sentences on what this project is and why it exists.",
    stack: ["TODO"],
    href: "#",
    tone: 2,
  },
  {
    // TODO — replace with a real project. Placeholder only.
    slug: "project-eight",
    name: "Project Eight",
    category: "TODO",
    description: "TODO — one or two sentences on what this project is and why it exists.",
    stack: ["TODO"],
    href: "#",
    tone: 3,
  },
];

/** Splits a title so the last word of a multi-word name can be set in gold italic,
 *  matching the site's headline treatment. Single-word names are left alone. */
export function splitTitle(name: string): { lead: string; last: string | null } {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return { lead: name, last: null };
  return { lead: parts.slice(0, -1).join(" ") + " ", last: parts[parts.length - 1] };
}