"use client";

import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

type Mode = "hidden" | "android" | "ios";

// iOS share icon (exact shape used in Safari)
function IosShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M8.684 8.316 12 5l3.316 3.316M12 5v10M5 14v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AddToHomeBanner() {
  const [mode, setMode] = useState<Mode>("hidden");

  useEffect(() => {
    if (localStorage.getItem("pwa-dismissed") === "1") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if ((navigator as { standalone?: boolean }).standalone === true) return;
    if (window.innerWidth >= 768) return;

    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) && !/crios/i.test(ua);

    if (isIOS) {
      const t = setTimeout(() => setMode("ios"), 2500);
      return () => clearTimeout(t);
    }

    // Android Chrome: wait for beforeinstallprompt
    const w = window as unknown as Record<string, unknown>;
    if (w.__pwaPrompt) {
      setMode("android");
    } else {
      const handler = () => setMode("android");
      window.addEventListener("pwa-ready", handler);
      return () => window.removeEventListener("pwa-ready", handler);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("pwa-dismissed", "1");
    setMode("hidden");
  };

  const install = async () => {
    const w = window as unknown as Record<string, unknown>;
    const prompt = w.__pwaPrompt as { prompt: () => void; userChoice: Promise<{ outcome: string }> } | undefined;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setMode("hidden");
    else dismiss();
  };

  if (mode === "hidden") return null;

  return (
    <div className="fixed bottom-[88px] md:bottom-4 left-3 right-3 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative rounded-2xl border border-[#d9b76e]/30 bg-[#22233a] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(217,183,110,0.12)] overflow-hidden">
        {/* Gold top line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d9b76e]/50 to-transparent" />

        <div className="p-4">
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[#8b8aa0] hover:bg-white/15 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            {/* App icon */}
            <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1c1d2c] border border-[#d9b76e]/20 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/icon.svg" alt="Laterloom" className="h-10 w-10 rounded-xl" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#f5f2eb]">Add Laterloom to Home Screen</p>

              {mode === "android" && (
                <>
                  <p className="mt-0.5 text-xs text-[#8b8aa0] leading-relaxed">
                    Install the app for a better experience — works offline and opens instantly.
                  </p>
                  <button
                    onClick={install}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#d9b76e] px-4 py-1.5 text-xs font-semibold text-[#1c1d2c] hover:bg-[#e8c87a] transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Install
                  </button>
                </>
              )}

              {mode === "ios" && (
                <>
                  <p className="mt-0.5 text-xs text-[#8b8aa0] leading-relaxed">
                    Tap{" "}
                    <span className="inline-flex items-center gap-0.5 rounded bg-white/10 px-1.5 py-0.5 text-[#d9b76e]">
                      <Share className="h-3 w-3" />
                      <IosShareIcon />
                    </span>
                    {" "}then{" "}
                    <span className="font-medium text-[#f5f2eb]">
                      &ldquo;Add to Home Screen&rdquo;
                    </span>
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#8b8aa0]/70">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-white/5 text-[#d9b76e]">1</span>
                    Tap the Share button at the bottom of Safari
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#8b8aa0]/70">
                    <span className="flex h-4 w-4 items-center justify-center rounded bg-white/5 text-[#d9b76e]">2</span>
                    Scroll down and tap &ldquo;Add to Home Screen&rdquo;
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
