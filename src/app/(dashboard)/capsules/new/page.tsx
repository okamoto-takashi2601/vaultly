"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Lock, Sparkles, Plus, X, ImagePlus,
  FileVideo, Loader2, CheckCircle2, Users,
} from "lucide-react";
import Link from "next/link";
import { useUploadThing } from "@/lib/uploadthing";

const AI_PROMPTS = [
  "What are you most proud of right now?",
  "What are you worried about that you hope will be resolved?",
  "What do you want your future self to remember about today?",
  "What is your biggest hope for this person?",
  "Describe where you are in life in one sentence.",
];

type MediaItem = { url: string; key: string; type: "IMAGE" | "VIDEO"; name: string; previewUrl?: string };

export default function NewCapsulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

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

  const addRecipient = () => {
    const email = emailInput.trim();
    if (email && !recipients.includes(email)) {
      setRecipients((prev) => [...prev, email]);
      setEmailInput("");
    }
  };

  const removeRecipient = (email: string) =>
    setRecipients((prev) => prev.filter((e) => e !== email));

  const injectPrompt = async (prompt: string) => {
    setAiLoading(prompt);
    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, currentBody: body }),
      });
      if (res.status === 503 || res.status === 429) {
        // Not configured or rate limited — insert prompt as writing guide
        setBody((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`));
        return;
      }
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setBody(data.text);
    } catch {
      setBody((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`));
    } finally {
      setAiLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body && media.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body: body || undefined,
          unlocksAt: new Date(unlockDate).toISOString(),
          recipients,
          media: media.map(({ url, key, type }) => ({ url, key, type })),
          isShared,
        }),
      });
      if (!res.ok) throw new Error("Failed to create capsule");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  const minDateStr = `${minDate.getFullYear()}-${pad(minDate.getMonth() + 1)}-${pad(minDate.getDate())}T${pad(minDate.getHours())}:${pad(minDate.getMinutes())}`;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create a capsule</h1>
        <p className="text-sm text-muted-foreground mt-1">Seal a message for the future.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Letter to my future self"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="body">Message</Label>
            <span className="text-xs text-muted-foreground">Optional if you add photos/videos</span>
          </div>
          <Textarea
            id="body"
            placeholder="Write your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[160px] resize-y"
          />
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">AI Memory Enhancer</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => injectPrompt(prompt)}
                    disabled={aiLoading !== null}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading === prompt && (
                      <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                    )}
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media upload */}
        <div className="flex flex-col gap-3">
          <Label>Photos &amp; Videos</Label>

          {/* Previews */}
          {media.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {media.map((m) => (
                <div
                  key={m.key}
                  className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-[#22233a] group"
                >
                  {m.type === "IMAGE" && m.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.previewUrl}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-2">
                      <FileVideo className="h-6 w-6 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground text-center line-clamp-2 leading-tight">
                        {m.name}
                      </span>
                    </div>
                  )}
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeMedia(m.key)}
                    className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {/* Uploaded check */}
                  <div className="absolute bottom-1 left-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <label
            className={[
              "flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-5 px-4 cursor-pointer transition-colors",
              isUploading
                ? "opacity-60 pointer-events-none"
                : "hover:border-primary/40 hover:bg-white/5",
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
                <span className="text-sm text-muted-foreground">
                  Add photos or videos
                </span>
                <span className="text-xs text-muted-foreground/60">
                  · Images up to 8 MB, videos up to 256 MB
                </span>
              </>
            )}
          </label>
        </div>

        {/* Unlock date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="unlockDate">Unlock date</Label>
          <Input
            id="unlockDate"
            type="datetime-local"
            min={minDateStr}
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            required
            className="[color-scheme:dark]"
          />
          <p className="text-xs text-muted-foreground">
            Recipients will be notified when the capsule unlocks at this exact date and time.
          </p>
        </div>

        {/* Recipients */}
        <div className="flex flex-col gap-2">
          <Label>Recipients</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="friend@email.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())}
            />
            <Button type="button" variant="outline" onClick={addRecipient} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {recipients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {recipients.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1.5 pr-1.5">
                  {email}
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Leave empty to send only to yourself.</p>
        </div>

        {/* Collaborative toggle */}
        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#d9b76e]/10 border border-[#d9b76e]/20 shrink-0 mt-0.5">
            <Users className="h-4 w-4 text-[#d9b76e]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Collaborative capsule</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allow friends to add their own messages before it unlocks
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isShared}
                onClick={() => setIsShared((v) => !v)}
                className={[
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isShared ? "bg-[#d9b76e]" : "bg-white/20",
                ].join(" ")}
              >
                <span
                  className={[
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
                    isShared ? "translate-x-5" : "translate-x-0",
                  ].join(" ")}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={loading || isUploading} className="gap-2">
            <Lock className="h-4 w-4" />
            {loading ? "Sealing..." : "Seal capsule"}
          </Button>
          <Button type="button" variant="ghost" nativeButton={false} render={<Link href="/dashboard" />}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
