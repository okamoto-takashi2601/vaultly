import sharp from "sharp";
import { writeFileSync } from "fs";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#8b8aa0"/>
    </marker>
    <marker id="arr-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#d9b76e"/>
    </marker>
  </defs>

  <!-- BG -->
  <rect width="900" height="560" fill="#13141f"/>

  <!-- Title -->
  <text x="450" y="36" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="18" font-weight="700" fill="#f5f2eb">Laterloom — Architecture Diagram</text>
  <text x="450" y="56" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" fill="#8b8aa0">H0: Hack the Zero Stack · Vercel v0 + Amazon Aurora DSQL</text>
  <line x1="60" y1="70" x2="840" y2="70" stroke="#ffffff" stroke-width="0.3" stroke-opacity="0.1"/>

  <!-- USER -->
  <rect x="390" y="88" width="120" height="50" rx="10" fill="#22233a" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.2"/>
  <text x="450" y="109" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="600" fill="#f5f2eb">User</text>
  <text x="450" y="127" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" fill="#8b8aa0">Browser / PWA (iOS &amp; Android)</text>

  <!-- user -> vercel -->
  <line x1="450" y1="138" x2="450" y2="188" stroke="#8b8aa0" stroke-width="1.2" stroke-dasharray="4,3" marker-end="url(#arr)"/>
  <text x="456" y="168" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#8b8aa0">HTTPS</text>

  <!-- VERCEL / NEXT.JS -->
  <rect x="295" y="192" width="310" height="66" rx="12" fill="#1e1f30" stroke="#d9b76e" stroke-width="2"/>
  <text x="450" y="216" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="700" fill="#f5f2eb">Vercel</text>
  <text x="450" y="233" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9.5" fill="#d9b76e">Next.js 16 App Router · Edge Functions · Cron Jobs</text>
  <text x="450" y="249" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8.5" fill="#8b8aa0">Server Components · API Routes · PWA · i18n (EN/JA/ZH/VI)</text>

  <!-- v0 badge -->
  <rect x="302" y="197" width="68" height="16" rx="5" fill="#ffffff" fill-opacity="0.1"/>
  <text x="336" y="208" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" font-weight="700" fill="#ffffff">v0 by Vercel</text>

  <!-- Vercel -> Aurora DSQL (gold, main) -->
  <line x1="380" y1="278" x2="232" y2="336" stroke="#d9b76e" stroke-width="2" marker-end="url(#arr-gold)"/>
  <text x="285" y="316" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#d9b76e">Prisma ORM</text>

  <!-- Vercel -> Clerk -->
  <line x1="318" y1="276" x2="126" y2="336" stroke="#6c47ff" stroke-width="1" marker-end="url(#arr)"/>
  <text x="168" y="316" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#6c47ff">JWT verify</text>

  <!-- Vercel -> UploadThing -->
  <line x1="450" y1="258" x2="450" y2="336" stroke="#8b8aa0" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arr)"/>

  <!-- Vercel -> Stripe -->
  <line x1="530" y1="276" x2="636" y2="336" stroke="#635BFF" stroke-width="1" marker-end="url(#arr)"/>
  <text x="596" y="316" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#635BFF">webhook</text>

  <!-- Vercel -> Gemini AI -->
  <line x1="572" y1="272" x2="742" y2="336" stroke="#10a37f" stroke-width="1" marker-end="url(#arr)"/>
  <text x="685" y="310" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#10a37f">prompt</text>

  <!-- AURORA DSQL -->
  <rect x="140" y="340" width="200" height="74" rx="12" fill="#1a150a" stroke="#FF9900" stroke-width="2.5"/>
  <rect x="140" y="340" width="200" height="74" rx="12" fill="#FF9900" fill-opacity="0.05"/>
  <text x="240" y="363" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" font-weight="700" fill="#FF9900">Amazon Aurora DSQL</text>
  <text x="240" y="379" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" fill="#c8860a">Distributed Serverless SQL</text>
  <text x="240" y="394" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#8b8aa0">Users · Capsules · Recipients · Media refs</text>
  <text x="240" y="407" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#6b6a7a">ACID transactions · PostgreSQL-compatible</text>

  <!-- Cron label -->
  <text x="354" y="296" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#d9b76e">Cron: unlock check</text>
  <path d="M380,290 Q320,320 280,338" stroke="#d9b76e" stroke-width="1" stroke-dasharray="3,2" fill="none" marker-end="url(#arr-gold)"/>

  <!-- CLERK -->
  <rect x="46" y="340" width="86" height="64" rx="10" fill="#1a1830" stroke="#6c47ff" stroke-width="1.5"/>
  <text x="89" y="363" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="600" fill="#f5f2eb">Clerk</text>
  <text x="89" y="378" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#8b8aa0">Auth &amp; Sessions</text>
  <text x="89" y="392" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#6c47ff">Sign-in · Sign-up · MFA</text>

  <!-- UPLOADTHING -->
  <rect x="354" y="340" width="192" height="64" rx="10" fill="#22233a" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.2"/>
  <text x="450" y="363" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="600" fill="#f5f2eb">UploadThing / S3</text>
  <text x="450" y="378" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#8b8aa0">Capsule Media Storage</text>
  <text x="450" y="392" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#8b8aa0">Photos · Videos · Voice Notes</text>

  <!-- STRIPE -->
  <rect x="560" y="340" width="104" height="64" rx="10" fill="#1a1a2e" stroke="#635BFF" stroke-width="1.5"/>
  <text x="612" y="363" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="600" fill="#f5f2eb">Stripe</text>
  <text x="612" y="378" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#8b8aa0">Subscription Billing</text>
  <text x="612" y="392" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#635BFF">Free · $5/mo · $15/mo</text>

  <!-- OPENAI -->
  <rect x="678" y="340" width="112" height="64" rx="10" fill="#0a0f1f" stroke="#4285F4" stroke-width="1.5"/>
  <text x="734" y="360" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11" font-weight="600" fill="#f5f2eb">Gemini AI</text>
  <text x="734" y="378" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#8b8aa0">AI Memory Enhancer</text>
  <text x="734" y="392" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#4285F4">EN · JA · ZH · VI output</text>

  <!-- LEGEND -->
  <rect x="46" y="452" width="808" height="82" rx="10" fill="#22233a" fill-opacity="0.6"/>
  <line x1="46" y1="452" x2="854" y2="452" stroke="#d9b76e" stroke-width="0.5" stroke-opacity="0.3"/>

  <text x="450" y="471" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" font-weight="700" letter-spacing="2" fill="#8b8aa0">KEY DESIGN DECISIONS</text>

  <rect x="66" y="482" width="12" height="2" fill="#d9b76e"/>
  <text x="84" y="487" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8.5" fill="#d9b76e">Aurora DSQL chosen for ACID guarantees — capsule content must remain intact years after creation</text>

  <rect x="66" y="500" width="12" height="2" fill="#8b8aa0"/>
  <text x="84" y="505" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8.5" fill="#8b8aa0">Vercel Cron Jobs poll Aurora DSQL on schedule; status update triggers recipient notification</text>

  <rect x="66" y="518" width="12" height="2" fill="#ffffff" fill-opacity="0.3"/>
  <text x="84" y="523" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8.5" fill="#f5f2eb" fill-opacity="0.5">UI scaffolded with v0 by Vercel · All API routes protected by Clerk JWT · TLS everywhere</text>
</svg>`;

const buf = Buffer.from(svg);
sharp(buf)
  .resize(1800, 1120)
  .png()
  .toFile("C:/Users/okamo/Downloads/laterloom-architecture.png")
  .then(() => console.log("✓ Saved: laterloom-architecture.png"))
  .catch((e) => console.error(e));
