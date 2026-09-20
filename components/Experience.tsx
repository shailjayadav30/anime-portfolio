// "use client";

// import Link from "next/link";
// import { Fragment, useCallback, useEffect, useRef, useState } from "react";
// import type { CSSProperties, MouseEvent } from "react";
// import { site } from "@/lib/site";
// import { CatDoodle, FactIcon, GithubIcon, LinkedinIcon, MailIcon, Sprig } from "./Icons";

// export type View = "home" | "about" | "projects";

// const BLOOM_MS = 1300; // 1.2s reveal + a breath, so scroll momentum can't double-fire
// const STEP_MS = 800; // one turn of the dial
// const PATHS: Record<View, string> = { home: "/", about: "/about", projects: "/projects" };
// const TITLES: Record<View, string> = {
//   home: "Ukato — A quiet room where code lives",
//   about: "About — Ukato",
//   projects: "Projects — Ukato",
// };
// const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

// const petals = [
//   { left: "44%", top: "13%", r: "20deg", d: "0s" },
//   { left: "60%", top: "27%", r: "-30deg", d: "-4s" },
//   { left: "41%", top: "57%", r: "45deg", d: "-8s" },
//   { left: "47%", top: "80%", r: "-10deg", d: "-2s" },
//   { left: "66%", top: "9%", r: "60deg", d: "-6s" },
//   { left: "90%", top: "22%", r: "-45deg", d: "-10s" },
//   { left: "43%", top: "36%", r: "15deg", d: "-12s" },
//   { left: "54%", top: "91%", r: "-25deg", d: "-5s" },
// ];

// /** Lets us pass CSS custom properties through `style`. */
// const vars = (v: Record<string, string | number>) => v as unknown as CSSProperties;

// function viewFromPath(pathname: string): View {
//   const p = pathname.replace(/\/+$/, "");
//   return p === "/about" ? "about" : p === "/projects" ? "projects" : "home";
// }

// /** Pick dark or cream text for a book cover, whichever contrasts more. */
// function inkFor(hex: string) {
//   const n = parseInt(hex.slice(1), 16);
//   const lin = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
//     const s = c / 255;
//     return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
//   });
//   const L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
//   const vsDark = (L + 0.05) / (0.026 + 0.05);
//   const vsCream = (0.93 + 0.05) / (L + 0.05);
//   return vsDark >= vsCream ? "#3c2a22" : "#fff6e6";
// }

// export default function Experience({ initialView }: { initialView: View }) {
//   const [view, setView] = useState<View>(initialView);
//   const [active, setActive] = useState(0);
//   const viewRef = useRef<View>(initialView);
//   const prevView = useRef<View>(initialView);
//   const activeRef = useRef(0);
//   const locked = useRef(false);
//   const lockTimer = useRef<number | undefined>(undefined);
//   const aboutScroll = useRef<HTMLDivElement>(null);

//   const items = site.projects.items;
//   const COUNT = items.length;

//   useEffect(() => {
//     document.title = TITLES[view];
//   }, [view]);

//   const lock = useCallback((ms: number) => {
//     locked.current = true;
//     window.clearTimeout(lockTimer.current);
//     lockTimer.current = window.setTimeout(() => {
//       locked.current = false;
//     }, ms);
//   }, []);

//   /** Move between the states of the room. */
//   const go = useCallback(
//     (next: View, push = true) => {
//       if (viewRef.current === next || locked.current) return;
//       lock(BLOOM_MS);
//       viewRef.current = next;
//       if (next === "projects") {
//         activeRef.current = 0;
//         setActive(0);
//       }
//       setView(next);
//       if (push) window.history.pushState({ view: next }, "", PATHS[next]);
//     },
//     [lock],
//   );

//   /** Turn the dial to a project. */
//   const turnTo = useCallback(
//     (i: number) => {
//       const n = Math.max(0, Math.min(COUNT - 1, i));
//       if (n === activeRef.current) return;
//       activeRef.current = n;
//       setActive(n);
//       lock(STEP_MS);
//     },
//     [COUNT, lock],
//   );

//   /**
//    * One "notch" of scrolling. Returns true if it did something, so key presses
//    * know whether to suppress the browser's own scrolling.
//    */
//   const advance = useCallback(
//     (dir: 1 | -1): boolean => {
//       if (locked.current) return false;
//       const v = viewRef.current;

//       if (v === "home") {
//         if (dir === 1) {
//           go("about");
//           return true;
//         }
//         return false;
//       }

//       if (v === "about") {
//         const el = aboutScroll.current;
//         const atTop = !el || el.scrollTop <= 2;
//         const atBottom = !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
//         if (dir === -1 && atTop) {
//           go("home");
//           return true;
//         }
//         if (dir === 1 && atBottom) {
//           go("projects");
//           return true;
//         }
//         return false;
//       }

//       // projects: scrolling turns the dial; past the first book, go back to About
//       const a = activeRef.current;
//       if (dir === 1) {
//         if (a < COUNT - 1) {
//           turnTo(a + 1);
//           return true;
//         }
//         return false;
//       }
//       if (a > 0) turnTo(a - 1);
//       else go("about");
//       return true;
//     },
//     [COUNT, go, turnTo],
//   );

//   // Scroll / swipe / keys / history
//   useEffect(() => {
//     const onWheel = (e: WheelEvent) => {
//       if (Math.abs(e.deltaY) < 24) return;
//       advance(e.deltaY > 0 ? 1 : -1);
//     };

//     let startY = 0;
//     const onTouchStart = (e: TouchEvent) => {
//       startY = e.touches[0].clientY;
//     };
//     const onTouchEnd = (e: TouchEvent) => {
//       const dy = startY - e.changedTouches[0].clientY;
//       if (Math.abs(dy) > 60) advance(dy > 0 ? 1 : -1);
//     };

//     const onKey = (e: KeyboardEvent) => {
//       const t = e.target as HTMLElement | null;
//       if (e.key === "Escape") {
//         if (viewRef.current === "projects") go("about");
//         else if (viewRef.current === "about") go("home");
//         return;
//       }
//       if (t && t !== document.body && /^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
//       if (["ArrowDown", "PageDown", " "].includes(e.key)) {
//         if (advance(1)) e.preventDefault();
//       } else if (["ArrowUp", "PageUp"].includes(e.key)) {
//         if (advance(-1)) e.preventDefault();
//       }
//     };

//     const onPop = () => {
//       const next = viewFromPath(window.location.pathname);
//       if (next !== viewRef.current) {
//         viewRef.current = next;
//         setView(next);
//       }
//     };

//     window.addEventListener("wheel", onWheel, { passive: true });
//     window.addEventListener("touchstart", onTouchStart, { passive: true });
//     window.addEventListener("touchend", onTouchEnd, { passive: true });
//     window.addEventListener("keydown", onKey);
//     window.addEventListener("popstate", onPop);
//     return () => {
//       window.removeEventListener("wheel", onWheel);
//       window.removeEventListener("touchstart", onTouchStart);
//       window.removeEventListener("touchend", onTouchEnd);
//       window.removeEventListener("keydown", onKey);
//       window.removeEventListener("popstate", onPop);
//     };
//   }, [advance, go]);

//   // Start About at the top each time the light arrives from the room
//   // (but not when coming back up from Projects — that would be visible).
//   useEffect(() => {
//     if (view === "about" && prevView.current === "home") aboutScroll.current?.scrollTo({ top: 0 });
//     prevView.current = view;
//   }, [view]);

//   const intercept = (next: View) => (e: MouseEvent) => {
//     if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
//     e.preventDefault();
//     go(next);
//   };

//   const { home, about, projects } = site;
//   const current = items[active];
//   const atEnd = active === COUNT - 1;

//   return (
//     <main className="stage" data-view={view}>
//       {/* ------------------------------------------------------------ the room */}
//       <section className="room" aria-hidden={view !== "home"}>
//         <h1 className="sr-only">{home.heroLines.join(" ")}</h1>
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           className="room__img"
//           src={site.assets.room}
//           alt="A warm, sunlit bedroom: a desk with a monitor facing a window, plants, bookshelves, and a cat asleep on the floor."
//           fetchPriority="high"
//         />
//         <div className="room__shade" />
//       </section>

//       <div className="ui-left">
//         <div className="jp" lang="ja" aria-hidden="true">
//           {home.jaLines.map((l) => (
//             <p key={l}>{l}</p>
//           ))}
//         </div>
//         <span className="rule" aria-hidden="true" />
//         <p className="tag">
//           {home.tagline.map((l, i) => (
//             <Fragment key={l}>
//               {l}
//               {i < home.tagline.length - 1 && <br />}
//             </Fragment>
//           ))}
//         </p>
//       </div>

//       <div className="ui-right home-only">
//         <p className="kana" lang="ja" aria-hidden="true">
//           {site.brandKana}
//         </p>
//         <span className="rule rule--v" aria-hidden="true" />
//         {/* <ul className="motto">
//           {home.motto.map((m) => (
//             <li key={m}>{m}</li>
//           ))}
//         </ul> */}
//       </div>

//       <div className="socials home-only">
//         <a href={site.github} aria-label="GitHub" target="_blank" rel="noreferrer">
//           <GithubIcon />
//         </a>
//         <a href={site.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
//           <LinkedinIcon />
//         </a>
//         <a href={`mailto:${site.email}`} aria-label="Email">
//           <MailIcon />
//         </a>
//       </div>

//       <button className="cue home-only" type="button" onClick={() => go("about")}>
//         <span className="cue__mouse" aria-hidden="true">
//           <span className="cue__dot" />
//         </span>
//         Scroll down
//       </button>

//       {/* --------------------------------------------------------------- header */}
//       <header className="header">
//         <Link className="logo" href="/" aria-label={`${site.brand} — home`} onClick={intercept("home")}>
//           {site.brand}
//         </Link>
//         <nav className="nav" aria-label="Primary">
//           <Link
//             className="nav__link"
//             href="/"
//             aria-current={view === "home" ? "page" : undefined}
//             onClick={intercept("home")}
//           >
//             Home
//           </Link>
//           <Link
//             className="nav__link"
//             href="/about"
//             aria-current={view === "about" ? "page" : undefined}
//             onClick={intercept("about")}
//           >
//             About
//           </Link>
//           <Link
//             className="nav__link"
//             href="/projects"
//             aria-current={view === "projects" ? "page" : undefined}
//             onClick={intercept("projects")}
//           >
//             Projects
//           </Link>
//           <Link className="nav__link" href="/contact">
//             Contact
//           </Link>
        
//         </nav>
//       </header>

//       {/* ---------------------------------------------- about · the sun bloom */}
//       <section className="about" aria-label="About me" aria-hidden={view !== "about"}>
//         {petals.map((p, i) => (
//           <span
//             key={i}
//             className="petal"
//             style={vars({ left: p.left, top: p.top, animationDelay: p.d, "--r": p.r })}
//             aria-hidden="true"
//           />
//         ))}

//         <div className="deco deco--sprig-low">
//           <Sprig leaves={11} seed={0.4} />
//         </div>
//         <div className="deco deco--sprig-high">
//           <Sprig leaves={8} seed={1.7} />
//         </div>

//         <div className="deco deco--cat">
//           <CatDoodle />
//           <p>
//             {about.note[0]}
//             <br />
//             {about.note[1]}
//           </p>
//         </div>

//         <div className="about__scroll" ref={aboutScroll}>
//           <div className="about__content">
//             <p className="about__kicker">{about.kicker}</p>

//             <h2 className="about__title">
//               {about.headline[0]}
//               <br />
//               {about.headline[1]} <em>{about.headline[2]}</em> {about.headline[3]}
//             </h2>

//             <p className="about__bio">
//               Hi, I&rsquo;m <strong>{site.name}</strong> — {about.bio}
//             </p>

//             <ul className="facts">
//               {about.facts.map((f) => (
//                 <li className="fact" key={f.title}>
//                   <FactIcon name={f.icon} />
//                   <h3>{f.title}</h3>
//                   <p>{f.text}</p>
//                 </li>
//               ))}
//             </ul>

//             <p className="about__quote">&ldquo;{about.quote}&rdquo;</p>

//             <ul className="stats">
//               {about.stats.map((s) => (
//                 <li className="stat" key={s.label}>
//                   <strong>{s.value}</strong>
//                   <span>{s.label}</span>
//                 </li>
//               ))}
//             </ul>

//             <figure className="portrait">
//               {/* eslint-disable-next-line @next/next/no-img-element */}
//               <img
//                 src={site.assets.portrait}
//                 alt="Portrait of a girl with dark hair in a cream sweater, holding a coffee mug and looking toward a sunlit window."
//               />
//             </figure>
//           </div>
//         </div>
//       </section>

//       {/* ------------------------------ projects · deeper into the same room */}
//       <section className="projects" aria-label="Projects" aria-hidden={view !== "projects"}>
//         {/* the same room again — closer, dimmer, later in the day */}
//         <div className="projects__bg" aria-hidden="true">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img src={site.assets.room} alt="" />
//         </div>

//         <div className="projects__intro">
//           <p className="projects__kicker">{projects.kicker}</p>
//           <h2 className="projects__title">
//             {projects.headline[0]}
//             <br />
//             {projects.headline[1]}
//           </h2>
//           <p className="projects__lede">{projects.intro}</p>
//           <p className="projects__hint">
//             <span className="projects__hint-line" aria-hidden="true" />
//             {atEnd ? "That’s the last book on the shelf." : "Scroll to turn the dial"}
//           </p>
//         </div>

//         <p className="projects__ja" lang="ja" aria-hidden="true">
//           {projects.ja}
//         </p>

//         {/* the dial: a clock face whose centre is the corner of the room */}
//         <div className="dial" style={vars({ "--idx": active })}>
//           <div className="dial__line" aria-hidden="true" />
//           <div className="dial__ticks dial__ticks--minor" aria-hidden="true" />
//           <div className="dial__ticks dial__ticks--major" aria-hidden="true" />

//           <ul className="dial__books">
//             {items.map((p, i) => {
//               const d = i - active;
//               const far = d > 3.3 || d < -3.2;
//               return (
//                 <li
//                   key={p.title}
//                   className={`slot${i === active ? " is-active" : ""}${far ? " is-far" : ""}`}
//                   style={vars({ "--i": i })}
//                 >
//                   <button
//                     type="button"
//                     className="book"
//                     style={vars({
//                       "--cover": p.cover,
//                       "--spine": `color-mix(in srgb, ${p.cover} 76%, #3c2a22)`,
//                       "--ink": inkFor(p.cover),
//                     })}
//                     onClick={() => turnTo(i)}
//                     tabIndex={far ? -1 : 0}
//                     aria-label={`${p.title}, project ${i + 1} of ${COUNT}`}
//                     aria-current={i === active ? "true" : undefined}
//                   >
//                     <span className="book__ribbon" aria-hidden="true" />
//                     <span className="book__num" aria-hidden="true">
//                       {ROMAN[i]}
//                     </span>
//                     <span className="book__meta">
//                       <span className="book__title">{p.title}</span>
//                       <span className="book__kind">{p.year}</span>
//                     </span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>

//         <p className="projects__note" aria-hidden="true">
//           {projects.note}
//         </p>

//         {/* the open book */}
//         <div className="detail-wrap">
//           <article className="detail" key={active} aria-live="polite">
//             <p className="detail__no">
//               Book {ROMAN[active]} <span>of {ROMAN[COUNT - 1]}</span>
//             </p>
//             <h3 className="detail__title">{current.title}</h3>
//             <p className="detail__kind">
//               {current.kind} · {current.year}
//             </p>
//             <p className="detail__blurb">{current.blurb}</p>
//             <ul className="detail__stack">
//               {current.stack.map((s) => (
//                 <li key={s}>{s}</li>
//               ))}
//             </ul>
//             <p className="detail__links">
//               {current.live && (
//                 <a href={current.live} target="_blank" rel="noreferrer">
//                   Visit the site
//                 </a>
//               )}
//               {current.repo && (
//                 <a href={current.repo} target="_blank" rel="noreferrer">
//                   Read the code
//                 </a>
//               )}
//             </p>
//           </article>

//           <div className="detail__nav">
//             <button
//               type="button"
//               aria-label="Previous project"
//               onClick={() => turnTo(active - 1)}
//               disabled={active === 0}
//             >
//               <svg viewBox="0 0 24 24" aria-hidden="true">
//                 <path d="M6 15l6-6 6 6" />
//               </svg>
//             </button>
//             <button
//               type="button"
//               aria-label="Next project"
//               onClick={() => turnTo(active + 1)}
//               disabled={atEnd}
//             >
//               <svg viewBox="0 0 24 24" aria-hidden="true">
//                 <path d="M6 9l6 6 6-6" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* the golden edges of the light, travelling with each bloom */}
//       <span className="ring" aria-hidden="true" />
//       <span className="ring ring--2" aria-hidden="true" />
//     </main>
//   );
// }




"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { site } from "@/lib/site";
import { CatDoodle, FactIcon, GithubIcon, LinkedinIcon, MailIcon, Sprig } from "./Icons";
import ContactForm from "./ContactForm";

export type View = "home" | "about" | "projects" | "contact";

const BLOOM_MS = 1300; // 1.2s reveal + a breath, so scroll momentum can't double-fire
const STEP_MS = 800; // one turn of the dial
const LAMP_DELAY_MS = 1900; // night arrives first, then the lamp clicks on
const PATHS: Record<View, string> = {
  home: "/",
  about: "/about",
  projects: "/projects",
  contact: "/contact",
};
const TITLES: Record<View, string> = {
  home: "Ukato — A quiet room where code lives",
  about: "About — Ukato",
  projects: "Projects — Ukato",
  contact: "Contact — Ukato",
};
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

const petals = [
  { left: "44%", top: "13%", r: "20deg", d: "0s" },
  { left: "60%", top: "27%", r: "-30deg", d: "-4s" },
  { left: "41%", top: "57%", r: "45deg", d: "-8s" },
  { left: "47%", top: "80%", r: "-10deg", d: "-2s" },
  { left: "66%", top: "9%", r: "60deg", d: "-6s" },
  { left: "90%", top: "22%", r: "-45deg", d: "-10s" },
  { left: "43%", top: "36%", r: "15deg", d: "-12s" },
  { left: "54%", top: "91%", r: "-25deg", d: "-5s" },
];

/** Lets us pass CSS custom properties through `style`. */
const vars = (v: Record<string, string | number>) => v as unknown as CSSProperties;

function viewFromPath(pathname: string): View {
  const p = pathname.replace(/\/+$/, "");
  return p === "/about"
    ? "about"
    : p === "/projects"
      ? "projects"
      : p === "/contact"
        ? "contact"
        : "home";
}

/** Pick dark or cream text for a book cover, whichever contrasts more. */
function inkFor(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lin = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const vsDark = (L + 0.05) / (0.026 + 0.05);
  const vsCream = (0.93 + 0.05) / (L + 0.05);
  return vsDark >= vsCream ? "#3c2a22" : "#fff6e6";
}

export default function Experience({ initialView }: { initialView: View }) {
  const [view, setView] = useState<View>(initialView);
  const [active, setActive] = useState(0);
  const [lampOn, setLampOn] = useState(false);
  const viewRef = useRef<View>(initialView);
  const prevView = useRef<View>(initialView);
  const activeRef = useRef(0);
  const locked = useRef(false);
  const lockTimer = useRef<number | undefined>(undefined);
  const lampTouched = useRef(false);
  const aboutScroll = useRef<HTMLDivElement>(null);
  const contactScroll = useRef<HTMLDivElement>(null);

  const items = site.projects.items;
  const COUNT = items.length;

  useEffect(() => {
    document.title = TITLES[view];
  }, [view]);

  // Night arrives first; a moment later the lamp switches on (unless the visitor already chose).
  useEffect(() => {
    if (view !== "contact") {
      setLampOn(false);
      lampTouched.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      if (!lampTouched.current) setLampOn(true);
    }, LAMP_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [view]);

  const toggleLamp = () => {
    lampTouched.current = true;
    setLampOn((on) => !on);
  };

  const lock = useCallback((ms: number) => {
    locked.current = true;
    window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => {
      locked.current = false;
    }, ms);
  }, []);

  /** Move between the states of the room. */
  const go = useCallback(
    (next: View, push = true) => {
      if (viewRef.current === next || locked.current) return;
      lock(BLOOM_MS);
      const from = viewRef.current;
      viewRef.current = next;
      if (next === "projects") {
        // coming back from Contact lands on the last book; arriving from About starts at the first
        const start = from === "contact" ? COUNT - 1 : 0;
        activeRef.current = start;
        setActive(start);
      }
      setView(next);
      if (push) window.history.pushState({ view: next }, "", PATHS[next]);
    },
    [COUNT, lock],
  );

  /** Turn the dial to a project. */
  const turnTo = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(COUNT - 1, i));
      if (n === activeRef.current) return;
      activeRef.current = n;
      setActive(n);
      lock(STEP_MS);
    },
    [COUNT, lock],
  );

  /**
   * One "notch" of scrolling. Returns true if it did something, so key presses
   * know whether to suppress the browser's own scrolling.
   */
  const advance = useCallback(
    (dir: 1 | -1): boolean => {
      if (locked.current) return false;
      const v = viewRef.current;

      if (v === "home") {
        if (dir === 1) {
          go("about");
          return true;
        }
        return false;
      }

      if (v === "about") {
        const el = aboutScroll.current;
        const atTop = !el || el.scrollTop <= 2;
        const atBottom = !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
        if (dir === -1 && atTop) {
          go("home");
          return true;
        }
        if (dir === 1 && atBottom) {
          go("projects");
          return true;
        }
        return false;
      }

      // contact: the end of the road. Scrolling up (from the top of the page) goes back to the books.
      if (v === "contact") {
        if (dir === -1) {
          const el = contactScroll.current;
          const atTop = !el || el.scrollTop <= 2;
          if (atTop) {
            go("projects");
            return true;
          }
        }
        return false;
      }

      // projects: scrolling turns the dial; past the last book, the night comes in
      const a = activeRef.current;
      if (dir === 1) {
        if (a < COUNT - 1) {
          turnTo(a + 1);
          return true;
        }
        go("contact");
        return true;
      }
      if (a > 0) turnTo(a - 1);
      else go("about");
      return true;
    },
    [COUNT, go, turnTo],
  );

  // Scroll / swipe / keys / history
  useEffect(() => {
    const inField = (el: EventTarget | null) =>
      !!(el as HTMLElement | null)?.closest?.("input, textarea, select");

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 24) return;
      if (inField(e.target)) return; // let a long message scroll inside its own box
      advance(e.deltaY > 0 ? 1 : -1);
    };

    let startY = 0;
    let ignoreTouch = false;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      ignoreTouch = inField(e.target);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (ignoreTouch) return;
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 60) advance(dy > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "Escape") {
        // inside a field, Escape just leaves the field so a typed message is never lost by accident
        if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) {
          t.blur();
          return;
        }
        if (viewRef.current === "contact") go("projects");
        else if (viewRef.current === "projects") go("about");
        else if (viewRef.current === "about") go("home");
        return;
      }
      if (t && t !== document.body && /^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        if (advance(1)) e.preventDefault();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        if (advance(-1)) e.preventDefault();
      }
    };

    const onPop = () => {
      const next = viewFromPath(window.location.pathname);
      if (next !== viewRef.current) {
        viewRef.current = next;
        setView(next);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [advance, go]);

  // Start About at the top each time the light arrives from the room
  // (but not when coming back up from Projects — that would be visible).
  useEffect(() => {
    if (view === "about" && prevView.current === "home") aboutScroll.current?.scrollTo({ top: 0 });
    if (view === "contact" && prevView.current !== "contact") contactScroll.current?.scrollTo({ top: 0 });
    prevView.current = view;
  }, [view]);

  const intercept = (next: View) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(next);
  };

  const { home, about, projects, contact } = site;
  const current = items[active];
  const atEnd = active === COUNT - 1;

  return (
    <main className="stage" data-view={view}>
      {/* ------------------------------------------------------------ the room */}
      <section className="room" aria-hidden={view !== "home"}>
        <h1 className="sr-only">{home.heroLines.join(" ")}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="room__img"
          src={site.assets.room}
          alt="A warm, sunlit bedroom: a desk with a monitor facing a window, plants, bookshelves, and a cat asleep on the floor."
          fetchPriority="high"
        />
        <div className="room__shade" />
      </section>

      <div className="ui-left">
        <div className="jp" lang="ja" aria-hidden="true">
          {home.jaLines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <span className="rule" aria-hidden="true" />
        <p className="tag">
          {home.tagline.map((l, i) => (
            <Fragment key={l}>
              {l}
              {i < home.tagline.length - 1 && <br />}
            </Fragment>
          ))}
        </p>
      </div>

      <div className="ui-right home-only">
        <p className="kana" lang="ja" aria-hidden="true">
          {site.brandKana}
        </p>
        <span className="rule rule--v" aria-hidden="true" />
      </div>

      <div className="socials home-only">
        <a href={site.github} aria-label="GitHub" target="_blank" rel="noreferrer">
          <GithubIcon />
        </a>
        <a href={site.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
          <LinkedinIcon />
        </a>
        <a href={`mailto:${site.email}`} aria-label="Email">
          <MailIcon />
        </a>
      </div>

      <button className="cue home-only" type="button" onClick={() => go("about")}>
        <span className="cue__mouse" aria-hidden="true">
          <span className="cue__dot" />
        </span>
        Scroll down
      </button>

      {/* --------------------------------------------------------------- header */}
      <header className="header">
        <Link className="logo" href="/" aria-label={`${site.brand} — home`} onClick={intercept("home")}>
          {site.brand}
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link
            className="nav__link"
            href="/"
            aria-current={view === "home" ? "page" : undefined}
            onClick={intercept("home")}
          >
            Home
          </Link>
          <Link
            className="nav__link"
            href="/about"
            aria-current={view === "about" ? "page" : undefined}
            onClick={intercept("about")}
          >
            About
          </Link>
          <Link
            className="nav__link"
            href="/projects"
            aria-current={view === "projects" ? "page" : undefined}
            onClick={intercept("projects")}
          >
            Projects
          </Link>
          <Link
            className="nav__link"
            href="/contact"
            aria-current={view === "contact" ? "page" : undefined}
            onClick={intercept("contact")}
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* ---------------------------------------------- about · the sun bloom */}
      <section className="about" aria-label="About me" aria-hidden={view !== "about"}>
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={vars({ left: p.left, top: p.top, animationDelay: p.d, "--r": p.r })}
            aria-hidden="true"
          />
        ))}

        <div className="deco deco--sprig-low">
          <Sprig leaves={11} seed={0.4} />
        </div>
        <div className="deco deco--sprig-high">
          <Sprig leaves={8} seed={1.7} />
        </div>

        <div className="deco deco--cat">
          <CatDoodle />
          <p>
            {about.note[0]}
            <br />
            {about.note[1]}
          </p>
        </div>

        <div className="about__scroll" ref={aboutScroll}>
          <div className="about__content">
            <p className="about__kicker">{about.kicker}</p>

            <h2 className="about__title">
              {about.headline[0]}
              <br />
              {about.headline[1]} <em>{about.headline[2]}</em> {about.headline[3]}
            </h2>

            <p className="about__bio">
              Hi, I&rsquo;m <strong>{site.name}</strong> — {about.bio}
            </p>

            <ul className="facts">
              {about.facts.map((f) => (
                <li className="fact" key={f.title}>
                  <FactIcon name={f.icon} />
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>

            <p className="about__quote">&ldquo;{about.quote}&rdquo;</p>

            <ul className="stats">
              {about.stats.map((s) => (
                <li className="stat" key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>

            <figure className="portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={site.assets.portrait}
                alt="Portrait of a girl with dark hair in a cream sweater, holding a coffee mug and looking toward a sunlit window."
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ------------------------------ projects · deeper into the same room */}
      <section className="projects" aria-label="Projects" aria-hidden={view !== "projects"}>
        {/* the same room again — closer, dimmer, later in the day */}
        <div className="projects__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.assets.room} alt="" />
        </div>

        <div className="projects__intro">
          <p className="projects__kicker">{projects.kicker}</p>
          <h2 className="projects__title">
            {projects.headline[0]}
            <br />
            {projects.headline[1]}
          </h2>
          <p className="projects__lede">{projects.intro}</p>
          <p className="projects__hint">
            <span className="projects__hint-line" aria-hidden="true" />
            {atEnd ? contact.projectsEndHint : "Scroll to turn the dial"}
          </p>
        </div>

        <p className="projects__ja" lang="ja" aria-hidden="true">
          {projects.ja}
        </p>

        {/* the dial: a clock face whose centre is the corner of the room */}
        <div className="dial" style={vars({ "--idx": active })}>
          <div className="dial__line" aria-hidden="true" />
          <div className="dial__ticks dial__ticks--minor" aria-hidden="true" />
          <div className="dial__ticks dial__ticks--major" aria-hidden="true" />

          <ul className="dial__books">
            {items.map((p, i) => {
              const d = i - active;
              const far = d > 3.3 || d < -3.2;
              return (
                <li
                  key={p.title}
                  className={`slot${i === active ? " is-active" : ""}${far ? " is-far" : ""}`}
                  style={vars({ "--i": i })}
                >
                  <button
                    type="button"
                    className="book"
                    style={vars({
                      "--cover": p.cover,
                      "--spine": `color-mix(in srgb, ${p.cover} 76%, #3c2a22)`,
                      "--ink": inkFor(p.cover),
                    })}
                    onClick={() => turnTo(i)}
                    tabIndex={far ? -1 : 0}
                    aria-label={`${p.title}, project ${i + 1} of ${COUNT}`}
                    aria-current={i === active ? "true" : undefined}
                  >
                    <span className="book__ribbon" aria-hidden="true" />
                    <span className="book__num" aria-hidden="true">
                      {ROMAN[i]}
                    </span>
                    <span className="book__meta">
                      <span className="book__title">{p.title}</span>
                      <span className="book__kind">{p.year}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="projects__note" aria-hidden="true">
          {projects.note}
        </p>

        {/* the open book */}
        <div className="detail-wrap">
          <article className="detail" key={active} aria-live="polite">
            <p className="detail__no">
              Book {ROMAN[active]} <span>of {ROMAN[COUNT - 1]}</span>
            </p>
            <h3 className="detail__title">{current.title}</h3>
            <p className="detail__kind">
              {current.kind} · {current.year}
            </p>
            <p className="detail__blurb">{current.blurb}</p>
            <ul className="detail__stack">
              {current.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="detail__links">
              {current.live && (
                <a href={current.live} target="_blank" rel="noreferrer">
                  Visit the site
                </a>
              )}
              {current.repo && (
                <a href={current.repo} target="_blank" rel="noreferrer">
                  Read the code
                </a>
              )}
            </p>
          </article>

          <div className="detail__nav">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => turnTo(active - 1)}
              disabled={active === 0}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 15l6-6 6 6" />
              </svg>
            </button>
            {/* on the last book, the same button carries on into the night room */}
            <button
              type="button"
              aria-label={atEnd ? "Next: contact" : "Next project"}
              onClick={() => (atEnd ? go("contact") : turnTo(active + 1))}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------- contact · the night comes in at the window */}
      <section
        className={`contact${lampOn ? " is-lit" : ""}`}
        aria-label="Contact"
        aria-hidden={view !== "contact"}
      >
        <div className="contact__bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.assets.roomNight} alt="" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="is-lamp" src={site.assets.roomNightLamp} alt="" />
        </div>

        {/* <p className="contact__ja" lang="ja" aria-hidden="true">
          {contact.ja}
        </p> */}

        <div className="contact__scroll" ref={contactScroll}>
          <div className="contact__layout">
            <div className="contact__intro">
              <p className="contact__kicker">{contact.kicker}</p>
              <h2 className="contact__title">
                {contact.headline[0]}
                <br />
                {contact.headline[1]}
              </h2>
              <p className="contact__lede">{contact.intro}</p>

              <ul className="contact__links">
                <li>
                  <a href={`mailto:${site.email}`}>
                    <MailIcon />
                    <span>{site.email}</span>
                  </a>
                </li>
                <li>
                  <a href={site.github} target="_blank" rel="noreferrer">
                    <GithubIcon />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noreferrer">
                    <LinkedinIcon />
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>

              <button
                type="button"
                className="contact__lamp"
                onClick={toggleLamp}
                aria-pressed={lampOn}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 3h6l3 8H6l3-8Z" />
                  <path d="M12 11v6M8 21h8M12 17v4" />
                </svg>
                {lampOn ? contact.lampOff : contact.lampOn}
              </button>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* the golden edges of the light, travelling with each bloom */}
      <span className="ring" aria-hidden="true" />
      <span className="ring ring--2" aria-hidden="true" />
      {/* …and the pale edge of the night, spreading out from the window */}
      <span className="night-ring" aria-hidden="true" />
    </main>
  );
}