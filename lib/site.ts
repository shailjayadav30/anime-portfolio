/**
 * Everything you'll want to edit lives here.
 * Swap the two image paths below when you have your own artwork.
 */
export const site = {
  brand: "UKATO",
  brandKana: "うかと",
  name: "Your Name", // <- put your real name here
  email: "hello@example.com",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",

  assets: {
    // Full-bleed room scene (landing page + blurred "past" behind About).
    // Replace with /images/room.jpg (or .png / .webp) once you generate one.
    room: "/images/room.svg",
    // Portrait shown in the bottom-right circle of the About page.
    portrait: "/images/about-girl.svg",
  },

  home: {
    heroLines: ["Building things that matter.", "One commit at a time."],
    jaLines: ["わたしは少し変わってる", "でも、それでいい"],
    tagline: ["A bit", "different", "and that's", "okay"],
    motto: ["Build", "Learn", "Create", "Repeat"],
  },

  about: {
    kicker: "About Me",
    headline: ["Just a girl who builds", "things she", "cares", "about."],
    bio: "a full stack developer who loves turning ideas into real products. I enjoy working at the intersection of design, technology and meaningful problems. When I'm not coding, you'll probably find me watching anime, at the gym, or taking care of my plants.",
    quote: "A bit different, and that's okay.",
    note: ["same girl,", "different tab :)"],
    facts: [
      { icon: "code", title: "Development", text: "Full Stack Web Apps that work and scale." },
      { icon: "palette", title: "Design", text: "Clean, thoughtful user experiences." },
      { icon: "book", title: "Learning", text: "Always curious, always building." },
      { icon: "leaf", title: "Life", text: "Anime, gym, plants and good coffee." },
    ],
    stats: [
      { value: "23", label: "Years old" },
      { value: "BCA", label: "Graduate" },
      { value: "∞", label: "Curiosity" },
    ],
  },
} as const;

export type Fact = (typeof site.about.facts)[number];
