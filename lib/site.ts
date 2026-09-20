/**
 * Everything you'll want to edit lives here.
 * Swap the two image paths below when you have your own artwork.
 */

import { commits } from "./commits";



export const site = {
  brand: "SHAILJA",
  brandKana: "シャイリャ",
  name: "Shailja Yadav", // <- put your real name here
  email: "shailjayadav7275@gmail.com",
  github: "https://github.com/shailjayadav30",
  linkedin: "https://www.linkedin.com/in/shailja-yadav-643853252",

  assets: {
    // Full-bleed room scene (landing page + blurred "past" behind About).
    // Replace with /images/room.jpg (or .png / .webp) once you generate one.
    room: "/images/room.svg",
    // Portrait shown in the bottom-right circle of the About page.
    portrait: "/images/utako.svg",
  },

  home: {
    heroLines: ["Building things that matter.", "One commit at a time."],
    jaLines: ["わたしは少し変わってる", "でも、それでいい"],
    tagline: ["A bit", "different", "and that's", "okay"],
    // motto: ["Build", "Learn", "Create", "Repeat"],
  },

  about: {
    kicker: "About Me",
    headline: ["Just a girl who builds", "things she", "cares", "about."],
    bio: "I’m a full-stack developer who loves turning ideas into real products. I enjoy exploring design, technology, and new ideas while learning along the way. Outside coding, I’m usually enjoying good food, coffee, music, anime, series, or a good comedy video",
    quote: "A bit different, and that's okay.",
    note: ["same girl,", "different tab :)"],
    facts: [
      {
        icon: "code",
        title: "Development",
        text: "Full Stack Web Apps that work and scale.",
      },
      {
        icon: "palette",
        title: "Design",
        text: "Clean, thoughtful user experiences.",
      },
      {
        icon: "book",
        title: "Learning",
        text: "Always curious, always building.",
      },
      {
        icon: "leaf",
        title: "Life",
        text: "Anime, music, plants and good coffee.",
      },
    ],
    stats: [
      { value: commits, label: "Github Commits" },
      { value: "MCA", label: "Graduate" },
      { value: "∞", label: "Curiosity" },
    ],
  },

  projects: {
    kicker: "Projects",
    headline: ["Things I've made,", "one page at a time."],
    intro:
      "Each project began as a small idea and became a way to learn, experiment, and build something meaningful.",
    note: "pull one out",
    ja: "つくったもの",

    items: [
      // {
      //   title: "Curricula",
      //   kind: "AI-powered syllabus tracker",
      //   year: "2026",
      //   cover: "#9fae8c",
      //   blurb:
      //     "A mobile-first study companion that transforms syllabus content into structured subjects, units, topics, and subtopics, helping students track their learning step by step.",
      //   stack: [
      //     "React Native",
      //     "Expo",
      //     "Express",
      //     "TypeScript",
      //     "Prisma",
      //     "PostgreSQL",
      //     "Gemini API",
      //   ],
      //   live: "",
      //   repo: "",
      // },

      {
        title: "Jungle Safari",
        kind: "Wildlife safari booking platform",
        year: "2025",
        cover: "#7e8a6b",
        blurb:
          "A wildlife safari booking experience designed to help visitors explore destinations, discover safari experiences, and plan their next adventure through a simple and engaging interface.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        live: "https://jungle-safari-frontend.vercel.app",
        repo: "https://github.com/shailjayadav30/JungleSafariBackend",
      },

      {
        title: "Persona AI",
        kind: "Conversational AI platform",
        year: "2026",
        cover: "#e7b8a3",
        blurb:
          "A conversational AI application where users interact with different personas through authenticated conversations, AI-generated responses, safety guardrails, and rate-limited requests.",
        stack: [
          "Next.js",
          "TypeScript",
          "Gemini API",
          "NextAuth",
          "Prisma",
          "Neon",
          "Upstash",
        ],
        live: "https://persona-ai-tawny.vercel.app/",
        repo: "https://github.com/shailjayadav30/Persona_ai",
      },

      {
        title: "Agent as a Judge",
        kind: "AI evaluation project",
        year: "2026",
        cover: "#e8c16b",
        blurb:
          "An experimental AI project exploring how an agent can evaluate responses, follow judging criteria, and provide structured feedback through an automated assessment workflow.",
        stack: ["Next.js", "TypeScript", "AI Agents", "Gemini API", "Inngest"],
        live: "",
        repo: "https://github.com/shailjayadav30/AgentJudge",
      },

      {
        title: "GradeUp",
        kind: "NCC uniforms and supplies website",
        year: "2026",
        cover: "#d9a5b0",
        blurb:
          "A responsive website for schools, colleges, academies, and organizations looking for NCC uniforms, kits, accessories, and bulk enquiries.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        live: "",
        repo: "",
      },
    ],
  },
} as const;

export type Fact = (typeof site.about.facts)[number];

export type Project = (typeof site.projects.items)[number];
