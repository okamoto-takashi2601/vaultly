"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock, Unlock, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n-client";

type Capsule = {
  id: string;
  title: string;
  status: string;
  unlocksAt: Date;
  recipients: { id: string }[];
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_DOT: Record<string, string> = {
  LOCKED: "bg-amber-400",
  UNLOCKED: "bg-emerald-400",
  DRAFT: "bg-white/30",
};

// Left-border accent + pill tint per status, used in side panel + day pills
const STATUS_ACCENT: Record<string, string> = {
  LOCKED: "border-l-amber-400/70",
  UNLOCKED: "border-l-emerald-400/70",
  DRAFT: "border-l-white/30",
};

const PILL_STYLE: Record<string, string> = {
  LOCKED: "bg-amber-400/10 text-amber-200/90 ring-1 ring-inset ring-amber-400/20",
  UNLOCKED: "bg-emerald-400/10 text-emerald-200/90 ring-1 ring-inset ring-emerald-400/20",
  DRAFT: "bg-white/[0.06] text-white/55 ring-1 ring-inset ring-white/10",
};

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function StatusBadge({ status, labels }: { status: string; labels: { locked: string; unlocked: string; draft: string } }) {
  if (status === "LOCKED")
    return (
      <Badge variant="secondary" className="gap-1 text-xs shrink-0">
        <Lock className="h-3 w-3" /> {labels.locked}
      </Badge>
    );
  if (status === "UNLOCKED")
    return (
      <Badge className="gap-1 text-xs shrink-0 bg-emerald-400/15 text-emerald-200 border-emerald-400/25">
        <Unlock className="h-3 w-3" /> {labels.unlocked}
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-xs shrink-0">
      <Clock className="h-3 w-3" /> {labels.draft}
    </Badge>
  );
}

export function CapsuleCalendar({ capsules }: { capsules: Capsule[] }) {
  const { tr, lang } = useLanguage();
  const locale = lang === "ja" ? "ja-JP" : lang === "zh" ? "zh-CN" : lang === "vi" ? "vi-VN" : "en";
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState<string | null>(toDateKey(today));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Group capsules by unlock date key
  const byDate: Record<string, Capsule[]> = {};
  for (const c of capsules) {
    const d = new Date(c.unlocksAt);
    const k = toDateKey(d);
    if (!byDate[k]) byDate[k] = [];
    byDate[k].push(c);
  }

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedCapsules = selectedKey ? (byDate[selectedKey] ?? []) : [];
  const selectedLabel = selectedKey
    ? (() => {
        const [y, m, d] = selectedKey.split("-").map(Number);
        return new Date(y, m, d).toLocaleDateString(locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      })()
    : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10 lg:flex-row">
      {/* ── Calendar ─────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1">
        {/* Month nav */}
        <div className="mb-4 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#8b8aa0]">
              {viewDate.toLocaleDateString(locale, { year: "numeric" })}
            </span>
            <h2 className="text-3xl font-semibold leading-none tracking-tight text-[#f5f2eb]">
              {viewDate.toLocaleDateString(locale, { month: "long" })}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#8b8aa0] hover:text-[#f5f2eb]"
              aria-label="Previous month"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs tracking-wide text-[#8b8aa0] hover:text-[#f5f2eb]"
              onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            >
              {tr.cal_today}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#8b8aa0] hover:text-[#f5f2eb]"
              aria-label="Next month"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Separator under header */}
        <div className="mb-4 h-px w-full bg-gradient-to-r from-[#d9b76e]/30 via-white/10 to-transparent" />

        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7">
          {DAYS.map((d) => (
            <div
              key={d}
              className="py-1 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-[#8b8aa0]"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => {
            if (!day)
              return (
                <div
                  key={`empty-${i}`}
                  className="min-h-[56px] md:min-h-[84px] rounded-xl border border-white/[0.03] bg-white/[0.01]"
                />
              );
            const key = `${year}-${month}-${day}`;
            const isToday =
              today.getFullYear() === year &&
              today.getMonth() === month &&
              today.getDate() === day;
            const isSelected = selectedKey === key;
            const dayCapsules = byDate[key] ?? [];

            return (
              <button
                key={key}
                onClick={() => setSelectedKey(isSelected ? null : key)}
                className={[
                  "group relative flex min-h-[56px] md:min-h-[84px] flex-col gap-1.5 rounded-xl border p-2 text-left transition-all duration-200",
                  "bg-[#22233a]/60 hover:bg-[#22233a] hover:border-white/10",
                  isSelected
                    ? "border-[#d9b76e]/50 bg-[#22233a] shadow-[0_0_0_1px_rgba(217,183,110,0.25),0_0_24px_-6px_rgba(217,183,110,0.45)]"
                    : "border-white/[0.06]",
                ].join(" ")}
              >
                {/* Day number — today gets a glowing gold filled circle */}
                <span
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors",
                    isToday
                      ? "bg-[#d9b76e] text-[#1a1b2e] shadow-[0_0_14px_-2px_rgba(217,183,110,0.7)]"
                      : isSelected
                        ? "text-[#d9b76e]"
                        : "text-[#f5f2eb]/80 group-hover:text-[#f5f2eb]",
                  ].join(" ")}
                >
                  {day}
                </span>

                {/* Capsule pills — hidden on mobile (dots only), shown on md+ */}
                {dayCapsules.length > 0 && (
                  <>
                    {/* Mobile: colored dots only */}
                    <div className="mt-auto flex md:hidden flex-wrap gap-1">
                      {dayCapsules.slice(0, 3).map((c) => (
                        <span
                          key={c.id}
                          className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[c.status] ?? "bg-white/30"}`}
                        />
                      ))}
                    </div>
                    {/* Desktop: full pills */}
                    <div className="mt-auto hidden md:flex flex-col gap-1">
                      {dayCapsules.slice(0, 2).map((c) => (
                        <span
                          key={c.id}
                          className={[
                            "flex items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-tight",
                            PILL_STYLE[c.status] ?? PILL_STYLE.DRAFT,
                          ].join(" ")}
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[c.status] ?? "bg-white/30"}`}
                          />
                          <span className="truncate">{c.title}</span>
                        </span>
                      ))}
                      {dayCapsules.length > 2 && (
                        <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium leading-tight text-[#8b8aa0]">
                          +{dayCapsules.length - 2} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-xs text-[#8b8aa0]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_-1px] shadow-amber-400/60" />
            Locked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_-1px] shadow-emerald-400/60" />
            Unlocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            Draft
          </span>
        </div>
      </div>

      {/* ── Side panel ───────────────────────────────────────────── */}
      <div className="shrink-0 lg:w-[300px]">
        <div className="lg:sticky lg:top-6">
          {selectedLabel ? (
            <>
              <div className="mb-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#d9b76e]/80">
                  {tr.cal_selected_day}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-[#f5f2eb]">
                  {selectedLabel}
                </p>
              </div>

              {selectedCapsules.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-[#22233a]/40 px-6 py-12 text-center">
                  <span
                    className="text-3xl opacity-50 grayscale"
                    role="img"
                    aria-hidden="true"
                  >
                    &#128274;
                  </span>
                  <p className="text-sm font-medium text-[#f5f2eb]/70">
                    {tr.cal_empty_title}
                  </p>
                  <p className="text-xs leading-relaxed text-[#8b8aa0]">
                    {tr.cal_empty_desc}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {selectedCapsules.map((c) => {
                    const unlock = new Date(c.unlocksAt).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    return (
                      <Link
                        key={c.id}
                        href={`/capsules/${c.id}`}
                        className={[
                          "flex flex-col gap-2.5 rounded-xl border border-white/[0.06] border-l-2 bg-[#22233a] p-4 transition-all duration-200",
                          "hover:border-white/15 hover:bg-[#26273f] hover:shadow-[0_0_20px_-8px_rgba(217,183,110,0.4)]",
                          STATUS_ACCENT[c.status] ?? STATUS_ACCENT.DRAFT,
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="line-clamp-2 text-sm font-medium leading-snug text-[#f5f2eb]">
                            {c.title}
                          </span>
                          <StatusBadge status={c.status} labels={{ locked: tr.status_locked, unlocked: tr.status_unlocked, draft: tr.status_draft }} />
                        </div>
                        <div className="flex items-center justify-between gap-2 text-xs text-[#8b8aa0]">
                          <span className="flex items-center gap-1.5">
                            <Unlock className="h-3 w-3" />
                            {unlock}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            {c.recipients.length}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-[#22233a]/40 px-6 py-12 text-center">
              <span className="text-3xl opacity-50" role="img" aria-hidden="true">
                &#128302;
              </span>
              <p className="text-sm font-medium text-[#f5f2eb]/70">
                {tr.cal_select_title}
              </p>
              <p className="text-xs leading-relaxed text-[#8b8aa0]">
                {tr.cal_select_desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
