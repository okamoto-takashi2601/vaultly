import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Laterloom",
  description: "How Laterloom collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    body: `When you create an account and use Laterloom, we collect the following information:

**Account information:** Name, email address, and authentication data provided through our sign-in service (Clerk).

**Capsule content:** Messages, photos, videos, and voice recordings you choose to store in your capsules. This content is stored securely and only accessible to you and the recipients you designate.

**Usage data:** Information about how you use the service, such as pages visited, features used, and interaction timestamps. This helps us improve the product.

**Payment information:** If you subscribe to a paid plan, billing is handled by Stripe. We do not store your credit card details on our servers.

**Language preference:** Your selected display language is stored to personalize your experience.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to:

- Provide, operate, and maintain the Laterloom service
- Deliver your capsules to designated recipients on the scheduled date
- Send service-related notifications (capsule unlocked, new contributor, etc.)
- Process payments and manage subscriptions via Stripe
- Personalize your experience based on language and preferences
- Prevent fraud and ensure the security of accounts
- Improve the service based on aggregated usage patterns`,
  },
  {
    title: "3. Third-Party Services",
    body: `Laterloom relies on the following trusted third-party providers to operate:

**Clerk** — Authentication and account management. Handles sign-in, sign-up, and session security.

**Stripe** — Payment processing. Manages subscriptions and billing. Your card data is stored by Stripe under PCI-DSS compliance standards.

**Amazon Web Services (S3 / Aurora DSQL)** — Secure storage for capsule files and application database.

**Vercel** — Hosting and deployment infrastructure.

**OpenAI** — Powers the AI Memory Enhancer feature. Prompt content sent to the AI is not stored by us beyond the processing request. Please refer to OpenAI's privacy policy for their data handling practices.

Each provider operates under their own privacy policy and data protection standards.`,
  },
  {
    title: "4. Data Retention",
    body: `Your capsule content and account data are retained for as long as your account is active.

If you delete your account, all associated data including capsule content, messages, and media files will be permanently deleted within 30 days, except for payment records which Stripe retains for legal and tax compliance purposes.

Unsent capsules scheduled for future delivery will also be deleted upon account deletion.`,
  },
  {
    title: "5. Sharing Your Data",
    body: `We do not sell, rent, or trade your personal information to any third parties for marketing purposes.

Your capsule content is shared only with recipients you explicitly designate, and only after the unlock date you set. No employee of Laterloom accesses your capsule content except as required to resolve a technical support issue at your request.

We may disclose information if required by applicable law, regulation, or valid legal process.`,
  },
  {
    title: "6. Cookies",
    body: `We use cookies and similar technologies solely for:

- Authentication session management (required for you to stay signed in)
- User preference storage (e.g., language selection)

We do not use third-party advertising cookies or cross-site tracking technologies. No analytics cookies are deployed without your consent.`,
  },
  {
    title: "7. Security",
    body: `We take reasonable technical and organizational measures to protect your data:

- All data in transit is encrypted via HTTPS/TLS
- Capsule content files are stored in access-controlled cloud storage
- Authentication is delegated to Clerk, which provides industry-standard security practices including MFA support
- Database access is restricted and uses IAM-based authentication

No system can guarantee 100% security. If you believe your account has been compromised, please contact us immediately.`,
  },
  {
    title: "8. Your Rights",
    body: `You have the right to:

- **Access** the personal data we hold about you
- **Correct** inaccurate data
- **Delete** your account and all associated data
- **Export** your capsule content before deletion

To exercise any of these rights, contact us at support@laterloom.com. We will respond within 30 days.`,
  },
  {
    title: "9. Children's Privacy",
    body: `Laterloom is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and, for significant changes, notify you via email or an in-app notice.

Continued use of the service after changes take effect constitutes acceptance of the revised policy.`,
  },
];

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-[#8b8aa0] leading-relaxed">
            Your privacy matters to us. This policy explains what data we collect, how we use it,
            and how we keep it safe.
          </p>
          <p className="mt-4 text-sm text-[#8b8aa0]/60">Last updated: June 10, 2026</p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-semibold mb-3 text-[#f5f2eb]">{s.title}</h2>
              <div className="text-[#8b8aa0] leading-relaxed text-sm space-y-3">
                {s.body.split("\n\n").map((para, i) => {
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
          <p className="text-sm text-[#8b8aa0] mb-1">Questions about this policy?</p>
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
