import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function GithubIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export function LinkedinIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function MailIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </svg>
  );
}

const factPaths: Record<string, JSX.Element> = {
  code: (
    <>
      <rect x="3" y="5" width="26" height="18" rx="3" />
      <path d="M13 12l-3 3 3 3M19 12l3 3-3 3" />
      <path d="M12 27h8M16 23v4" />
    </>
  ),
  palette: (
    <>
      <path d="M16 4C9 4 4 9 4 15.5S9 28 15 28c2 0 3-1 3-2.5 0-1.3-1-2-1-3.2 0-1.2 1-2 2.3-2H24c2.5 0 4-1.7 4-4C28 8.5 22.5 4 16 4z" />
      <circle cx="10" cy="14" r="1.4" />
      <circle cx="15" cy="9.5" r="1.4" />
      <circle cx="21.5" cy="11" r="1.4" />
    </>
  ),
  book: <path d="M16 8c-3-2-7-2.5-11-2v18c4-.5 8 0 11 2 3-2 7-2.5 11-2V6c-4-.5-8 0-11 2zM16 8v18" />,
  leaf: <path d="M6 26C6 14 13 6 27 5c0 14-7 21-19 21zM6 26c4-6 8-10 14-13" />,
};

export function FactIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...stroke} strokeWidth={1.3}>
      {factPaths[name]}
    </svg>
  );
}

/** Tiny hand-drawn cat head for the margin note. */
export function CatDoodle() {
  return (
    <svg viewBox="0 0 80 70" aria-hidden="true" {...stroke} strokeWidth={1.8}>
      <path d="M12 62c-4-10-4-24 2-34L12 8l16 10c8-3 16-3 24 0L68 8l-2 20c6 10 6 24 2 34-8 6-48 6-56 0z" />
      <circle cx="28" cy="38" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="52" cy="38" r="1.8" fill="currentColor" stroke="none" />
      <path d="M37 45l3 3 3-3z" fill="currentColor" />
      <path d="M40 48v3c-2 2-5 2-6 0M40 51c2 2 5 2 6 0" />
      <path d="M20 46l-11-2M20 50l-11 3M60 46l11-2M60 50l11 3" />
    </svg>
  );
}

/** A hand-drawn sprig: soft stem, alternating sage / olive leaves. */
export function Sprig({ leaves = 9, seed = 0 }: { leaves?: number; seed?: number }) {
  const pts = Array.from({ length: leaves }, (_, i) => {
    const t = i / (leaves - 1);
    return {
      x: 100 + Math.sin(t * 3.2 + seed) * 26,
      y: 380 - t * 340,
      t,
      left: i % 2 === 0,
    };
  });

  const f = (n: number) => n.toFixed(2);
  let d = `M${f(pts[0].x)} 400 L${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = (pts[i - 1].x + pts[i].x) / 2;
    const my = (pts[i - 1].y + pts[i].y) / 2;
    d += ` Q${f(pts[i - 1].x)} ${f(pts[i - 1].y)} ${f(mx)} ${f(my)}`;
  }
  d += ` L${f(pts[pts.length - 1].x)} ${f(pts[pts.length - 1].y)}`;

  return (
    <svg
      className="sprig"
      viewBox="0 0 200 400"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="#7e8a6b" strokeWidth="2.2" strokeLinecap="round" />
      {pts.map((p, i) => {
        const angle = p.left ? -150 + p.t * 34 : -30 - p.t * 34;
        const scale = 1.35 - p.t * 0.65;
        return (
          <path
            key={i}
            d="M0 0C14-13 38-13 54 0C38 13 14 13 0 0Z"
            fill={i % 3 === 0 ? "#68765b" : i % 3 === 1 ? "#9fae8c" : "#c4b57a"}
            opacity={0.9}
            transform={`translate(${f(p.x)} ${f(p.y)}) rotate(${f(angle)}) scale(${f(scale)})`}
          />
        );
      })}
    </svg>
  );
}
