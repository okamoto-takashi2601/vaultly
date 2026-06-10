import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — Laterloom",
  description: "The terms and conditions governing your use of Laterloom.",
};

const articles = [
  {
    title: "Article 1 — Acceptance of Terms",
    body: `By creating an account or using the Laterloom service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.

We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms. We will notify you of material changes via email or in-app notice.`,
  },
  {
    title: "Article 2 — Account Registration",
    body: `To use most features of Laterloom, you must create an account. You agree to:

- Provide accurate and complete information during registration
- Keep your account credentials secure and confidential
- Notify us promptly at support@laterloom.com if you suspect unauthorized access to your account
- Be responsible for all activity that occurs under your account

You must be at least 13 years of age to use this Service.`,
  },
  {
    title: "Article 3 — The Service",
    body: `Laterloom allows you to create, store, and schedule the delivery of digital "time capsules" — collections of messages, photos, videos, and other media — to yourself or designated recipients at a future date you specify.

We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with reasonable notice. We are not liable for any modification, suspension, or discontinuation.`,
  },
  {
    title: "Article 4 — Subscription Plans and Billing",
    body: `Laterloom offers the following plans:

**Free plan** — Up to 3 capsules, basic features, no credit card required.

**Personal plan** — $5/month. Unlimited capsules, 5 GB storage, unlimited AI Memory Enhancer.

**Family plan** — $15/month. Everything in Personal plus Family Vault, 20 GB shared storage, collaborative capsules, up to 6 members.

Paid subscriptions are billed monthly in advance. Billing is processed by Stripe. By subscribing, you authorize us to charge your payment method on a recurring basis until you cancel.

Prices may change with 30 days' notice via email.`,
  },
  {
    title: "Article 5 — Cancellation and Refunds",
    body: `You may cancel your subscription at any time from the Billing section of your account Settings. Cancellation takes effect at the end of the current billing period. You will retain access to paid features until then.

We do not offer refunds for partial billing periods or unused service, except where required by applicable law.

If we terminate your account due to a violation of these Terms, no refund will be issued.`,
  },
  {
    title: "Article 6 — Your Content",
    body: `You retain ownership of all content you upload to Laterloom ("Your Content"). By using the Service, you grant Laterloom a limited, non-exclusive license to store, process, and transmit Your Content solely for the purpose of providing the Service to you and your designated recipients.

You are solely responsible for the content you create and share. You represent and warrant that:

- You own or have the rights to all content you upload
- Your content does not infringe any third-party intellectual property rights
- Your content complies with all applicable laws`,
  },
  {
    title: "Article 7 — Prohibited Activities",
    body: `You agree not to use the Service to:

- Upload or distribute illegal, harmful, threatening, abusive, defamatory, or obscene content
- Harass, stalk, or harm any individual
- Impersonate any person or entity
- Upload malware, viruses, or any malicious code
- Attempt to gain unauthorized access to any part of the Service or its infrastructure
- Use the Service to send unsolicited communications (spam)
- Reverse engineer, decompile, or disassemble any part of the Service
- Circumvent any usage limits, security features, or access controls
- Use the Service for any commercial purpose not expressly permitted

Violation of these rules may result in immediate account suspension or termination.`,
  },
  {
    title: "Article 8 — AI Features",
    body: `Laterloom includes an AI Memory Enhancer feature powered by OpenAI. This feature generates suggestions and enhancements based on your prompts.

AI-generated content is provided as-is. We make no guarantees about the accuracy, completeness, or appropriateness of AI-generated suggestions. You are responsible for reviewing and editing any AI-generated content before saving it to your capsule.

We are not liable for any issues arising from the use or reliance on AI-generated content.`,
  },
  {
    title: "Article 9 — Capsule Delivery",
    body: `Laterloom will make reasonable efforts to deliver capsules to designated recipients on the scheduled unlock date. However, we do not guarantee delivery if:

- The recipient's email address is invalid or inactive
- The recipient's mail service blocks our notifications
- The Service is unavailable due to circumstances outside our control

We are not liable for late or failed delivery resulting from causes beyond our reasonable control.

If you delete your account before a capsule's unlock date, the capsule and all scheduled deliveries will be permanently cancelled.`,
  },
  {
    title: "Article 10 — Disclaimer of Warranties",
    body: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.

We do not warrant that the Service will be uninterrupted, error-free, or completely secure.`,
  },
  {
    title: "Article 11 — Limitation of Liability",
    body: `To the maximum extent permitted by applicable law, Laterloom and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, arising out of or related to your use of the Service.

Our total liability to you for any claims arising out of or related to these Terms or the Service shall not exceed the amount you paid us in the 12 months preceding the claim, or $50, whichever is greater.`,
  },
  {
    title: "Article 12 — Governing Law",
    body: `These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or the Service that cannot be resolved amicably shall be submitted to the courts of competent jurisdiction.

If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#1c1d2c] text-[#f5f2eb]">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#1c1d2c]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-6 flex h-14 items-center justify-between">
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

      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80 mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-[#8b8aa0] leading-relaxed">
            Please read these Terms carefully before using Laterloom. They govern your rights and
            obligations when using our service.
          </p>
          <p className="mt-4 text-sm text-[#8b8aa0]/60">Last updated: June 10, 2026</p>
        </div>

        {/* Articles */}
        <div className="flex flex-col gap-10">
          {articles.map((a) => (
            <section key={a.title}>
              <h2 className="text-lg font-semibold mb-3 text-[#f5f2eb]">{a.title}</h2>
              <div className="text-[#8b8aa0] leading-relaxed text-sm space-y-3">
                {a.body.split("\n\n").map((para, i) => {
                  if (para.startsWith("- ")) {
                    const items = para.split("\n").filter((l) => l.startsWith("- "));
                    return (
                      <ul key={i} className="list-disc list-inside space-y-1 pl-1">
                        {items.map((item, j) => (
                          <li key={j}>{item.slice(2)}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: para.replace(
                          /\*\*(.+?)\*\*/g,
                          '<strong class="text-[#f5f2eb]/80 font-medium">$1</strong>'
                        ),
                      }}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 rounded-2xl border border-white/[0.06] bg-[#22233a] px-8 py-8 text-center">
          <p className="text-sm text-[#8b8aa0] mb-1">Questions about these Terms?</p>
          <a
            href="mailto:support@laterloom.com"
            className="text-[#d9b76e] hover:underline text-sm font-medium"
          >
            support@laterloom.com
          </a>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-8 mt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-6 text-xs text-[#8b8aa0]/50 sm:flex-row">
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
