
export const site = {
  brand: "SHAILJA",
  brandKana: "シャイリャ",
  name: "Shailja Yadav",
  email: "shailjayadav7275@gmail.com",
  github: "https://github.com/shailjayadav30",
  linkedin: "https://www.linkedin.com/in/shailja-yadav-643853252",

  assets: {
    room: "/images/room.svg",

    portrait: "/images/utako.svg",
    roomNight: "/images/room-night.svg",
    roomNightLamp: "/images/room-night-lamp.svg",
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
      // { value: contributions.totalCommits, label: "Github Commits" },
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
  contact: {
    kicker: "Say hello",
    headline: ["Leave a note", "on the desk"],
    intro:
      "Have a project, a question, or just a good book to recommend? Write it here. I read everything myself.",
    reply: "I usually reply within a few days.",
    // ja: "夜の部屋で、あなたを待っています。", // "I'm waiting for you in the night room."
    topics: ["A project", "Working together", "Just saying hi"],

    lampOn: "Switch the lamp on",
    lampOff: "Switch the lamp off",
    projectsEndHint: "That’s the last book. Scroll on to write to me.",

    form: {
      postmark: "night post",
      topicLabel: "What's it about?",
      nameLabel: "Shailja Yadav",
      emailLabel: "shailjayadav7275@gmail.com",
      messageLabel: "Your message",
      messagePlaceholder: "Tell me what you have in mind…",
      send: "Send the note",
      sending: "Sending…",
      sentKicker: "Note delivered",
      sentTitle: "Thank you for writing.",
      sentText: "Your note is on my desk. I'll reply to the email you gave me.",
      again: "Write another note",
    },
  },
} as const;

export type Fact = (typeof site.about.facts)[number];

export type Project = (typeof site.projects.items)[number];
