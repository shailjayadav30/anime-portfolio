import Link from "next/link";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <main className="soon">
      <span className="soon__script">still being written…</span>
      <h1>{title}</h1>
      <Link href="/">Back to the room</Link>
    </main>
  );
}
