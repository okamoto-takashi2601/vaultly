"use client";

import { useState, useCallback } from "react";
import { Lock, ImagePlus, Loader2, CheckCircle2, Send, X, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";

type MediaItem = { url: string; key: string; type: "IMAGE" | "VIDEO"; name: string; previewUrl?: string };

interface ContributeFormProps {
  capsuleId: string;
  capsuleTitle: string;
  unlocksAt: Date;
  authorId: string;
  currentUserId: string;
}

export function ContributeForm({
  capsuleId,
  capsuleTitle,
  unlocksAt,
}: ContributeFormProps) {
  const [body, setBody] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("capsuleMedia", {
    onClientUploadComplete: (res) => {
      const items: MediaItem[] = res.map((f) => ({
        url: f.ufsUrl,
        key: f.key,
        name: f.name,
        type: f.type.startsWith("video/") ? "VIDEO" : "IMAGE",
        previewUrl: f.type.startsWith("image/") ? f.ufsUrl : undefined,
      }));
      setMedia((prev) => [...prev, ...items]);
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;
      await startUpload(files);
      e.target.value = "";
    },
    [startUpload],
  );

  const removeMedia = (key: string) =>
    setMedia((prev) => prev.filter((m) => m.key !== key));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body && media.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/capsules/${capsuleId}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body || undefined,
          media: media.map(({ url, key, type }) => ({ url, key, type })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to submit contribution");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const unlockDateStr = unlocksAt.toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-400" />
        <h2 className="text-xl font-semibold">Your contribution has been added! 🎉</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your message has been sealed inside <span className="text-foreground font-medium">{capsuleTitle}</span>.
          It will be revealed on <span className="text-foreground font-medium">{unlockDateStr}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Message */}
      <div className="flex flex-col gap-2">
        <label htmlFor="contribute-body" className="text-sm font-medium">
          Your message
          <span className="ml-2 text-xs text-muted-foreground font-normal">Optional if you add photos/videos</span>
        </label>
        <Textarea
          id="contribute-body"
          placeholder="Write something for the future..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[160px] resize-y bg-[#1c1d2c] border-white/10"
        />
      </div>

      {/* Media upload */}
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">Photos &amp; Videos</span>

        {media.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {media.map((m) => (
              <div
                key={m.key}
                className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-[#22233a] group"
              >
                {m.type === "IMAGE" && m.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.previewUrl} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-2">
                    <FileVideo className="h-6 w-6 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground text-center line-clamp-2 leading-tight">
                      {m.name}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(m.key)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-1 left-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow" />
                </div>
              </div>
            ))}
          </div>
        )}

        <label
          className={[
            "flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-5 px-4 cursor-pointer transition-colors",
            isUploading
              ? "opacity-60 pointer-events-none"
              : "hover:border-[#d9b76e]/40 hover:bg-white/5",
          ].join(" ")}
        >
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add photos or videos</span>
              <span className="text-xs text-muted-foreground/60">
                · Images up to 8 MB, videos up to 256 MB
              </span>
            </>
          )}
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-400 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={loading || isUploading || (!body && media.length === 0)}
          className="gap-2 bg-[#d9b76e] hover:bg-[#d9b76e]/90 text-[#1c1d2c] font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Add my contribution
            </>
          )}
        </Button>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          Sealed until {unlockDateStr}
        </div>
      </div>
    </form>
  );
}
