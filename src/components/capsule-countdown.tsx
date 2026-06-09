"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Unlock, Users, Calendar, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/share-buttons";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

function calcTimeLeft(unlocksAt: Date): TimeLeft {
  const total = unlocksAt.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60) % 24);
  const days = Math.floor(total / 1000 / 60 / 60 / 24);
  return { days, hours, minutes, seconds, total };
}

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center rounded-2xl border border-[#d9b76e]/20 bg-[#22233a] px-4 py-3 min-w-[72px] shadow-[0_0_32px_-8px_rgba(217,183,110,0.2)]">
        <span className="font-mono text-4xl font-bold tracking-tight text-[#f5f2eb] tabular-nums">
          {str}
        </span>
        {/* subtle gold shimmer line */}
        <span className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#d9b76e]/30 to-transparent" />
      </div>
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8b8aa0]">
        {label}
      </span>
    </div>
  );
}

type Recipient = { id: string; email: string };

type Props = {
  capsuleId: string;
  shareUrl: string;
  title: string;
  description?: string | null;
  unlocksAt: Date;
  createdAt: Date;
  recipients: Recipient[];
};

export function CapsuleLockedView({
  capsuleId,
  shareUrl,
  title,
  description,
  unlocksAt,
  createdAt,
  recipients,
}: Props) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this capsule? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await fetch(`/api/capsules/${capsuleId}`, { method: "DELETE" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Failed to delete. Please try again.");
      setDeleting(false);
    }
  };

  useEffect(() => {
    // Init on client only to avoid SSR/client hydration mismatch
    const t = calcTimeLeft(unlocksAt);
    setTimeLeft(t);
    if (t.total <= 0) return;
    const id = setInterval(() => {
      const next = calcTimeLeft(unlocksAt);
      setTimeLeft(next);
      if (next.total <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [unlocksAt]);

  const isExpired = timeLeft !== null && timeLeft.total <= 0;
  const unlockLabel = unlocksAt.toLocaleDateString("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-full flex-col">
      {/* Back nav */}
      <div className="px-6 pt-6 md:px-10 md:pt-8 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#8b8aa0] hover:text-[#f5f2eb] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 text-sm text-red-400/70 hover:text-red-300 transition-colors disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      {/* Main sealed area */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        {/* Vault icon */}
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#d9b76e]/30 bg-[#22233a] shadow-[0_0_60px_-10px_rgba(217,183,110,0.35)]">
            {isExpired ? (
              <Unlock className="h-10 w-10 text-[#d9b76e]" />
            ) : (
              <Lock className="h-10 w-10 text-[#d9b76e]" />
            )}
          </div>
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full border border-[#d9b76e]/10 scale-125 pointer-events-none" />
          <div className="absolute inset-0 rounded-full border border-[#d9b76e]/5 scale-150 pointer-events-none" />
        </div>

        {/* Status */}
        <Badge
          className="mb-4 gap-1.5 border-[#d9b76e]/30 bg-[#d9b76e]/10 text-[#d9b76e]"
        >
          {isExpired ? (
            <><Unlock className="h-3 w-3" /> Ready to open</>
          ) : (
            <><Lock className="h-3 w-3" /> Sealed</>
          )}
        </Badge>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#f5f2eb] max-w-md">
          {title}
        </h1>
        {description && (
          <p className="mb-6 text-sm text-[#8b8aa0] max-w-sm leading-relaxed">{description}</p>
        )}

        {/* Countdown or unlocked message */}
        {isExpired ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-8 py-6">
            <p className="text-lg font-semibold text-emerald-300">This capsule is ready to open</p>
            <p className="mt-1 text-sm text-[#8b8aa0]">The seal has lifted on {unlockLabel}</p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[#8b8aa0]">
              Opens in
            </p>
            {timeLeft === null ? (
              /* SSR placeholder — same layout, zeros, no flash */
              <div className="flex items-start gap-3 sm:gap-5 opacity-0">
                <Digit value={0} label="days" />
                <span className="mt-4 text-2xl font-thin text-[#8b8aa0]">:</span>
                <Digit value={0} label="hours" />
                <span className="mt-4 text-2xl font-thin text-[#8b8aa0]">:</span>
                <Digit value={0} label="min" />
                <span className="mt-4 text-2xl font-thin text-[#8b8aa0]">:</span>
                <Digit value={0} label="sec" />
              </div>
            ) : (
              <div className="flex items-start gap-3 sm:gap-5">
                <Digit value={timeLeft.days} label="days" />
                <span className="mt-4 text-2xl font-thin text-[#8b8aa0]">:</span>
                <Digit value={timeLeft.hours} label="hours" />
                <span className="mt-4 text-2xl font-thin text-[#8b8aa0]">:</span>
                <Digit value={timeLeft.minutes} label="min" />
                <span className="mt-4 text-2xl font-thin text-[#8b8aa0]">:</span>
                <Digit value={timeLeft.seconds} label="sec" />
              </div>
            )}
            <p className="mt-6 text-sm text-[#8b8aa0]">
              Sealed until{" "}
              <span className="font-medium text-[#f5f2eb]">{unlockLabel}</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer meta */}
      <div className="mx-auto w-full max-w-lg border-t border-white/[0.06] px-6 py-6 md:px-10">
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex items-center gap-3 text-[#8b8aa0]">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              Created{" "}
              {createdAt.toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {recipients.length > 0 && (
            <div className="flex items-start gap-3 text-[#8b8aa0]">
              <Users className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-2">
                {recipients.map((r) => (
                  <span
                    key={r.id}
                    className="rounded-full border border-white/10 bg-[#22233a] px-3 py-0.5 text-xs text-[#f5f2eb]/80"
                  >
                    {r.email}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="pt-2 border-t border-white/[0.06]">
            <p className="text-xs text-[#8b8aa0] mb-2">Share this capsule</p>
            <ShareButtons
              url={shareUrl}
              title={title}
              unlocksAt={unlocksAt}
              isLocked={!isExpired}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
