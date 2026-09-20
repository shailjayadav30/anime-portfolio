import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ukato — A quiet room where code lives",
  description:
    "A full stack developer's portfolio, told as a quiet room that changes with the light. Building things that matter, one commit at a time.",
};

export const viewport: Viewport = {
  themeColor: "#2a1a10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500&family=Zen+Old+Mincho:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
