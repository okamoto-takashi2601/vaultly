"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { LANGUAGES, Language } from "@/lib/i18n";

export function LanguageSelector({ currentLang }: { currentLang: Language }) {
  const [selected, setSelected] = useState<Language>(currentLang);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = async (lang: Language) => {
    if (lang === selected || saving) return;
    setSelected(lang);
    setSaving(true);
    try {
      await fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(LANGUAGES) as [Language, { label: string; flag: string }][]).map(
          ([code, { label, flag }]) => {
            const isActive = selected === code;
            return (
              <button
                key={code}
                onClick={() => handleChange(code)}
                disabled={saving}
                className={[
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                  isActive
                    ? "border-[#d9b76e]/50 bg-[#d9b76e]/10 text-[#f5f2eb]"
                    : "border-white/10 bg-[#1c1d2c]/60 text-muted-foreground hover:border-white/20 hover:text-foreground",
                  saving && !isActive ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <span className="text-xl leading-none">{flag}</span>
                <span className="text-sm font-medium flex-1">{label}</span>
                {isActive && !saving && <Check className="h-4 w-4 text-[#d9b76e] shrink-0" />}
                {isActive && saving && <Loader2 className="h-4 w-4 text-[#d9b76e] animate-spin shrink-0" />}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
