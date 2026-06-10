import Link from "next/link";
import { Lock, ArrowLeft, Heart, Clock, Globe, Sparkles, Shield, Users, ExternalLink } from "lucide-react";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export const metadata = {
  title: "About — Laterloom",
  description: "Why we built Laterloom, and what we believe about time, memory, and connection.",
};

const values = [
  {
    icon: Heart,
    title: "Memories deserve to last",
    description:
      "A handwritten letter tucked in a drawer disappears. A photo on a hard drive corrupts. We built Laterloom so the things that matter most are preserved with intention — and delivered exactly when they should be.",
  },
  {
    icon: Clock,
    title: "Time is the medium",
    description:
      "The capsule itself isn't the gift. The distance in time is. There's something powerful about a message written today that you won't read for years — it captures who you were, not just what you said.",
  },
  {
    icon: Shield,
    title: "Privacy first",
    description:
      "Your capsules are private by default. We don't read your content. We don't train AI on your memories. Your messages belong to you and the people you choose to share them with.",
  },
  {
    icon: Globe,
    title: "Built for everyone",
    description:
      "Laterloom supports English, Japanese, Chinese, and Vietnamese — and the AI Memory Enhancer writes in whichever language you choose. Memory is universal; the language you use to express it shouldn't limit you.",
  },
  {
    icon: Sparkles,
    title: "AI that helps, not replaces",
    description:
      "The AI Memory Enhancer asks you meaningful questions and helps you find words when you're stuck. But it's your voice, your story. The AI just holds the door open.",
  },
  {
    icon: Users,
    title: "Connections across time",
    description:
      "Some capsules are solo — a note to your future self. Others are shared — a message from a group of friends to open together years later. Laterloom supports both.",
  },
];


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#1c1d2c] text-[#f5f2eb]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#1c1d2c]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 flex h-14 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-[#8b8aa0] hover:text-[#f5f2eb] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Laterloom
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#d9b76e] text-[#1c1d2c]">
              <Lock className="h-3 w-3" />
            </span>
            Laterloom
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#d9b76e]/8 blur-[120px]"
          />
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80 mb-4">
              About Laterloom
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-[1.1] mb-6 md:text-5xl">
              We believe some messages
              <br />
              <span className="text-[#d9b76e]">are worth waiting for.</span>
            </h1>
            <p className="mx-auto max-w-xl text-[#8b8aa0] leading-relaxed text-lg">
              Laterloom is a time capsule app that lets you seal memories today and deliver them
              to the future — to yourself, to someone you love, or to people who haven't grown
              up yet.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80">
              Our story
            </p>
          </div>
          <div className="prose prose-invert max-w-none text-[#8b8aa0] leading-relaxed space-y-5 text-base">
            <p>
              Laterloom started with a simple frustration: the digital things we care most about
              are the hardest to preserve with intention. We take thousands of photos but rarely
              pause to write anything down. We mean to send that letter to a friend, a parent, a
              child — and then years pass.
            </p>
            <p>
              The idea was to make that easy. Write it now. Seal it. Let it arrive when it matters.
            </p>
            <p>
              The initial UI was designed and scaffolded using{" "}
              <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="text-[#d9b76e]/80 hover:text-[#d9b76e] underline underline-offset-2">
                v0 by Vercel
              </a>
              {" "}— which let us go from idea to working interface in hours, not days. The backend
              is powered by Amazon Aurora DSQL, a distributed serverless SQL database that
              gives Laterloom the reliability and scale a long-term memory service demands.
            </p>
            <p>
              We added the AI Memory Enhancer because the hardest part of writing isn't the words
              — it's knowing where to start. The prompts help you dig deeper than you expected.
              Users tell us they end up writing things they didn't know they wanted to say.
            </p>
            <p>
              We built multilingual support because memory doesn't happen in one language.
              A grandmother in Vietnam should be able to seal a message in Tiếng Việt for her
              grandchildren. A family split across continents should each see Laterloom in their
              own language.
            </p>
            <p>
              We're a small, independent team. We don't have a flashy office or venture funding.
              We have a product we believe in, users who've trusted us with their most personal
              messages, and a commitment to keeping it that way.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-white/[0.06] bg-[#22233a]/40 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80 mb-3">
                What we believe
              </p>
              <h2 className="text-3xl font-bold tracking-tight">Our values</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-white/[0.06] bg-[#1c1d2c]/60 p-6 hover:border-[#d9b76e]/20 transition-colors"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#d9b76e]/10 text-[#d9b76e]">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-semibold text-[#f5f2eb] leading-snug">{v.title}</h3>
                  <p className="text-sm text-[#8b8aa0] leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Team */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80 mb-3">
              The team
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Built by one person</h2>
          </div>
          <div className="mx-auto max-w-lg">
            <div className="rounded-2xl border border-white/[0.06] bg-[#22233a] p-8">
              {/* Avatar + name */}
              <div className="flex items-center gap-5 mb-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#d9b76e]/15 text-[#d9b76e] text-2xl font-bold ring-1 ring-[#d9b76e]/20">
                  岡
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f2eb]">Okamoto Takashi</h3>
                  <p className="text-sm text-[#d9b76e]/80">Freelance Web &amp; AI Developer</p>
                  <p className="text-xs text-[#8b8aa0] mt-0.5">Based in Japan</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-[#8b8aa0] leading-relaxed mb-6">
                I build web apps and AI integrations for Japan&apos;s travel and hospitality sector.
                Father of three, fish keeper, camper. Laterloom came from a simple desire: to make
                it easy to leave something meaningful behind for the people you love.
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Next.js", "TypeScript", "Tailwind CSS", "Gemini AI", "Multilingual (EN/JA/ZH/VI)"].map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/[0.08] bg-[#1c1d2c]/60 px-3 py-1 text-xs text-[#8b8aa0]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/[0.06]">
                <a
                  href="https://okadev.jp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8b8aa0] hover:text-[#d9b76e] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  okadev.jp
                </a>
                <a
                  href="https://github.com/okamoto-takashi2601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8b8aa0] hover:text-[#d9b76e] transition-colors"
                >
                  <GithubIcon />
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/takashi-okamoto-378050411/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#8b8aa0] hover:text-[#d9b76e] transition-colors"
                >
                  <LinkedinIcon />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="border-y border-white/[0.06] bg-[#22233a]/40 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80 mb-3">
                Under the hood
              </p>
              <h2 className="text-3xl font-bold tracking-tight">Built for production</h2>
              <p className="mt-3 text-sm text-[#8b8aa0] max-w-lg mx-auto leading-relaxed">
                Laterloom is deployed on Vercel and backed by Amazon Aurora DSQL — a serverless,
                distributed SQL database built for global scale and high availability.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Aurora DSQL */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#1c1d2c]/60 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF9900]/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-[#FF9900]" aria-hidden="true"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 0 1-10.951-.577 17.88 17.88 0 0 1-5.43-3.35c-.1-.1-.154-.194-.165-.334-.01-.14.045-.254.16-.408zm6.552-2.218c-.166-.334-.166-.668 0-.977l2.88-5.057c.42-.743 1.172-1.112 2.253-1.112 1.08 0 1.832.37 2.253 1.112l2.88 5.057c.166.31.166.643 0 .977-.167.335-.432.5-.793.5H7.39c-.36 0-.627-.165-.793-.5zm2.09-.826h4.627l-2.314-4.078-2.312 4.078zm7.373-7.78c0-.376.14-.7.42-.97.28-.27.61-.406.99-.406.38 0 .71.135.99.406.28.27.42.594.42.97 0 .376-.14.7-.42.97-.28.27-.61.405-.99.405-.38 0-.71-.135-.99-.405-.28-.27-.42-.594-.42-.97zm-11.52 0c0-.376.14-.7.42-.97.28-.27.61-.406.99-.406.38 0 .71.135.99.406.28.27.42.594.42.97 0 .376-.14.7-.42.97-.28.27-.61.405-.99.405-.38 0-.71-.135-.99-.405-.28-.27-.42-.594-.42-.97z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#f5f2eb] text-sm">Amazon Aurora DSQL</h3>
                    <p className="text-xs text-[#8b8aa0]">Distributed Serverless SQL</p>
                  </div>
                </div>
                <p className="text-sm text-[#8b8aa0] leading-relaxed">
                  Time capsules need guarantees — a message sealed today must arrive years later,
                  exactly as written. Aurora DSQL&apos;s ACID transactions and multi-region
                  architecture make this reliable at any scale, without managing servers.
                </p>

                <ul className="mt-4 space-y-1.5 text-xs text-[#8b8aa0]/80">
                  {["ACID-compliant distributed transactions", "Serverless — scales to zero", "Multi-region active-active replication", "PostgreSQL-compatible via Prisma ORM"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#FF9900]/60 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vercel */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#1c1d2c]/60 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-white" aria-hidden="true"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#f5f2eb] text-sm">Vercel + Next.js 16</h3>
                    <p className="text-xs text-[#8b8aa0]">Edge-deployed App Router</p>
                  </div>
                </div>
                <p className="text-sm text-[#8b8aa0] leading-relaxed">
                  The entire frontend and API runs on Vercel&apos;s edge network. Next.js 16 App
                  Router enables server components, streaming, and ISR — keeping the app fast
                  for users anywhere in the world.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#8b8aa0]/80">
                  {["Next.js 16 App Router + Server Components", "Vercel Cron Jobs for capsule unlock delivery", "Edge-optimized API routes", "PWA — installable on iOS & Android"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-white/40 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full stack */}
              <div className="rounded-2xl border border-white/[0.06] bg-[#1c1d2c]/60 p-6 sm:col-span-2">
                <h3 className="font-semibold text-[#f5f2eb] text-sm mb-4">Full stack</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "v0 by Vercel", color: "text-white/90 border-white/20 bg-white/10" },
                    { label: "Aurora DSQL", color: "text-[#FF9900] border-[#FF9900]/20 bg-[#FF9900]/5" },
                    { label: "Vercel", color: "text-white/80 border-white/10 bg-white/5" },
                    { label: "Next.js 16", color: "text-white/80 border-white/10 bg-white/5" },
                    { label: "Prisma ORM", color: "text-[#5a67d8] border-[#5a67d8]/20 bg-[#5a67d8]/5" },
                    { label: "Clerk Auth", color: "text-[#6c47ff] border-[#6c47ff]/20 bg-[#6c47ff]/5" },
                    { label: "Stripe", color: "text-[#635BFF] border-[#635BFF]/20 bg-[#635BFF]/5" },
                    { label: "Gemini AI", color: "text-[#4285F4] border-[#4285F4]/20 bg-[#4285F4]/5" },
                    { label: "UploadThing (S3)", color: "text-red-400 border-red-400/20 bg-red-400/5" },
                    { label: "TypeScript", color: "text-[#3178c6] border-[#3178c6]/20 bg-[#3178c6]/5" },
                    { label: "Tailwind CSS", color: "text-[#38bdf8] border-[#38bdf8]/20 bg-[#38bdf8]/5" },
                  ].map((t) => (
                    <span key={t.label} className={`rounded-full border px-3 py-1 text-xs font-medium ${t.color}`}>
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/[0.06] bg-[#22233a] px-8 py-16 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[250px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9b76e]/10 blur-[80px]"
            />
            <div className="mb-5 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9b76e]/15 text-[#d9b76e] ring-1 ring-[#d9b76e]/20">
                <Lock className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Ready to seal your first memory?
            </h2>
            <p className="text-[#8b8aa0] text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              It takes a few minutes. The message lasts as long as you want it to.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-xl bg-[#d9b76e] text-[#1c1d2c] px-6 py-3 text-sm font-semibold hover:bg-[#d9b76e]/90 transition-colors"
            >
              Create your first capsule — it&apos;s free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-6 text-xs text-[#8b8aa0]/50 sm:flex-row">
          <span>© 2026 Laterloom. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#f5f2eb] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#f5f2eb] transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-[#f5f2eb] transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
