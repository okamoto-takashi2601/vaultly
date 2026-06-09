import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="flex flex-col min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
          <span className="text-xl font-semibold tracking-tight">Vaultly</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-600">
            <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" render={<Link href="/sign-in" />}>
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/sign-up" />}>
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-28 text-center">
          <Badge variant="secondary" className="mb-6 text-xs font-medium">
            Built for the moments that matter
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight leading-tight md:text-6xl lg:text-7xl">
            Seal today.
            <br />
            <span className="text-zinc-400">Open tomorrow.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Create time capsules for your future self and loved ones — letters,
            photos, videos, and voice messages delivered on the exact day you
            choose.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8" render={<Link href="/sign-up" />}>
              Create your first capsule
            </Button>
            <Button size="lg" variant="outline" className="px-8" render={<a href="#how-it-works" />}>
              See how it works
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-400">Free to start. No credit card required.</p>
        </section>

        <Separator />

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-zinc-500">Three steps to send a gift across time.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Card key={i} className="border-zinc-100 shadow-none">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400">Step {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Use cases */}
        <section className="bg-zinc-50 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Some messages are worth waiting for
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
                    <item.icon className="h-5 w-5 text-zinc-700" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Simple pricing</h2>
            <p className="mt-3 text-zinc-500">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative shadow-none ${
                  plan.highlight
                    ? "border-zinc-900 ring-1 ring-zinc-900"
                    : "border-zinc-100"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-zinc-900 text-white text-xs">Most popular</Badge>
                  </div>
                )}
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-zinc-500">{plan.name}</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-zinc-400 text-sm">{plan.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
                        <Check className="h-4 w-4 text-zinc-900 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    render={<Link href="/sign-up" />}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zinc-900 text-white py-24">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <div className="flex justify-center mb-6">
              <Users className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to send a message to the future?
            </h2>
            <p className="mt-4 text-zinc-400 max-w-md mx-auto">
              Create your first capsule in minutes. The best time to start is today.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 px-8" render={<Link href="/sign-up" />}>
              Create your first capsule — it&apos;s free
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <span>© 2026 Vaultly. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
