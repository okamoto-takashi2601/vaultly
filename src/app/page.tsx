import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lock,
  Unlock,
  Users,
  Sparkles,
  Clock,
  Heart,
  GraduationCap,
  Baby,
  Check,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: Sparkles,
    title: "Create your capsule",
    description:
      "Write a message, add photos, videos, or voice notes. Our AI suggests meaningful questions to make your capsule more personal.",
  },
  {
    icon: Lock,
    title: "Seal it",
    description:
      "Choose who receives it and when it unlocks — 1 year, 5 years, or a specific date like a wedding anniversary.",
  },
  {
    icon: Unlock,
    title: "It arrives",
    description:
      "On the unlock date, recipients are notified and the capsule opens. A gift from the past, delivered exactly when it should be.",
  },
];

const useCases = [
  { icon: Baby, label: "Letter to your child at 18" },
  { icon: Heart, label: "Anniversary message to your partner" },
  { icon: GraduationCap, label: "Graduation capsule with your class" },
  { icon: Clock, label: "A note to your future self" },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out",
    features: ["3 capsules", "Text only", "1 recipient per capsule"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Personal",
    price: "$5",
    period: "/month",
    description: "For individuals",
    features: [
      "Unlimited capsules",
      "Photos & videos",
      "5 GB storage",
      "Multiple recipients",
      "AI Memory Enhancer",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Family",
    price: "$15",
    period: "/month",
    description: "For families",
    features: [
      "Everything in Personal",
      "Family Vault",
      "20 GB shared storage",
      "Collaborative capsules",
      "Up to 6 members",
    ],
    cta: "Start free trial",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <span className="flex items-center gap-2 text-xl font-semibold tracking-tight font-heading">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Lock className="h-4 w-4" />
            </span>
            Laterloom
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/sign-in" />}>
              Sign in
            </Button>
            <Button size="sm" nativeButton={false} render={<Link href="/sign-up" />}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
          />
          <div className="mx-auto max-w-6xl px-6 py-28 text-center md:py-36">
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 border-border/60 bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              Built for the moments that matter
            </Badge>
            <h1 className="text-balance text-5xl font-bold tracking-tight leading-[1.05] font-heading md:text-7xl">
              Seal today.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Open tomorrow.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Create time capsules for your future self and loved ones — letters,
              photos, videos, and voice messages delivered on the exact day you
              choose.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="group px-8" nativeButton={false} render={<Link href="/sign-up" />}>
                Create your first capsule
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/60 bg-card/40 px-8 backdrop-blur-sm"
                nativeButton={false} render={<a href="#how-it-works" />}
              >
                See how it works
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground/70">
              Free to start. No credit card required.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading md:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three steps to send a gift across time.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border-border/60 bg-card/60 transition-colors hover:border-primary/40"
              >
                <CardContent className="px-6 py-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground/70">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use cases */}
        <section className="border-y border-border/60 bg-card/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight font-heading md:text-4xl">
                Some messages are worth waiting for
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {useCases.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/40 p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground/90">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight font-heading md:text-4xl">
              Simple pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.highlight
                    ? "border-primary/50 bg-card shadow-[0_0_60px_-20px] shadow-primary/40"
                    : "border-border/60 bg-card/60"
                }`}
              >
                {plan.highlight && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                )}
                {plan.highlight && (
                  <div className="absolute right-4 top-4">
                    <Badge className="bg-primary text-xs text-primary-foreground">
                      Most popular
                    </Badge>
                  </div>
                )}
                <CardContent className="px-6 py-8">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-muted-foreground">
                      {plan.name}
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground/70">
                      {plan.description}
                    </p>
                  </div>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-foreground/80"
                      >
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    nativeButton={false} render={<Link href="/sign-up" />}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border/60 bg-card/60 px-6 py-20 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[100px]"
            />
            <div className="mb-6 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                <Users className="h-7 w-7" />
              </div>
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight font-heading md:text-4xl">
              Ready to send a message to the future?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Create your first capsule in minutes. The best time to start is
              today.
            </p>
            <Button size="lg" className="group mt-8 px-8" nativeButton={false} render={<Link href="/sign-up" />}>
              Create your first capsule — it&apos;s free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground/70 sm:flex-row">
          <span>© 2026 Laterloom. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
