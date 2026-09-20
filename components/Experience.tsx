"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { site } from "@/lib/site";
import { CatDoodle, FactIcon, GithubIcon, LinkedinIcon, MailIcon, Sprig } from "./Icons";

export type View = "home" | "about";

const BLOOM_MS = 1300; // 1.2s reveal + a breath, so scroll momentum can't double-fire
const PATHS: Record<View, string> = { home: "/", about: "/about" };
const TITLES: Record<View, string> = {
  home: "Ukato — A quiet room where code lives",
  about: "About — Ukato",
};

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

function viewFromPath(pathname: string): View {
  return pathname.replace(/\/+$/, "") === "/about" ? "about" : "home";
}

export default function Experience({ initialView }: { initialView: View }) {
  const [view, setView] = useState<View>(initialView);
  const viewRef = useRef<View>(initialView);
  const locked = useRef(false);
  const aboutScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewRef.current = view;
    document.title = TITLES[view];
  }, [view]);

  /** Move between the two states of the room. */
  const go = useCallback((next: View, push = true) => {
    if (viewRef.current === next || locked.current) return;
    locked.current = true;
    viewRef.current = next;
    setView(next);
    if (push) window.history.pushState({ view: next }, "", PATHS[next]);
    window.setTimeout(() => {
      locked.current = false;
    }, BLOOM_MS);
  }, []);

  // Scroll / swipe / keys
  useEffect(() => {
    const atTop = () => (aboutScroll.current?.scrollTop ?? 0) <= 2;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 24) return;
      if (viewRef.current === "home" && e.deltaY > 0) go("about");
      else if (viewRef.current === "about" && e.deltaY < 0 && atTop()) go("home");
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = startY - e.changedTouches[0].clientY;
      if (viewRef.current === "home" && dy > 60) go("about");
      else if (viewRef.current === "about" && dy < -60 && atTop()) go("home");
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t !== document.body && /^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (viewRef.current === "home" && ["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go("about");
      } else if (viewRef.current === "about" && ["ArrowUp", "PageUp", "Escape"].includes(e.key) && atTop()) {
        go("home");
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
  }, [go]);

  // Keep the About panel scrolled to the top each time the light arrives.
  useEffect(() => {
    if (view === "about") aboutScroll.current?.scrollTo({ top: 0 });
  }, [view]);

  const intercept = (next: View) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(next);
  };

  const { home, about } = site;

  return (
    <main className="stage" data-view={view}>
      {/* ------------------------------------------------------------ the room */}
      <section className="room" aria-hidden={view === "about"}>
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
        <ul className="motto">
          {home.motto.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
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
          <Link className="nav__link" href="/projects">
            Projects
          </Link>
          <Link className="nav__link" href="/contact">
            Contact
          </Link>
          {/* <a className="cta" href={`mailto:${site.email}`}>
            Let&rsquo;s talk
          </a> */}
        </nav>
      </header>

      {/* ---------------------------------------------- about · the sun bloom */}
      <section className="about" aria-label="About me" aria-hidden={view !== "about"}>
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{ left: p.left, top: p.top, animationDelay: p.d, ["--r" as string]: p.r }}
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
              <img src={site.assets.portrait} alt="Portrait of a girl with dark hair in a cream sweater, holding a coffee mug and looking toward a sunlit window." />
            </figure>
          </div>
        </div>
      </section>

      {/* the golden edge of the light, travelling with the bloom */}
      <span className="ring" aria-hidden="true" />
    </main>
  );
}
