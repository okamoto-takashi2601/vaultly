"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Sparkles, Plus, X } from "lucide-react";
import Link from "next/link";

const AI_PROMPTS = [
  "What are you most proud of right now?",
  "What are you worried about that you hope will be resolved?",
  "What do you want your future self to remember about today?",
  "What is your biggest hope for this person?",
  "Describe where you are in life in one sentence.",
];

export default function NewCapsulePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addRecipient = () => {
    const email = emailInput.trim();
    if (email && !recipients.includes(email)) {
      setRecipients((prev) => [...prev, email]);
      setEmailInput("");
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients((prev) => prev.filter((e) => e !== email));
  };

  const injectPrompt = (prompt: string) => {
    setBody((prev) => (prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          unlocksAt: new Date(unlockDate).toISOString(),
          recipients,
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
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create a capsule</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seal a message for the future.
        </p>
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
            <span className="text-xs text-muted-foreground">Text</span>
          </div>
          <Textarea
            id="body"
            placeholder="Write your message here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px] resize-y"
            required
          />

          {/* AI prompts */}
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">
                  AI Memory Enhancer
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Add a prompt to make your capsule more meaningful:
              </p>
              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => injectPrompt(prompt)}
                    className="text-xs px-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unlock date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="unlockDate">Unlock date</Label>
          <Input
            id="unlockDate"
            type="date"
            min={minDateStr}
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            required
            className="[color-scheme:dark]"
          />
          <p className="text-xs text-muted-foreground">
            Recipients will be notified when the capsule unlocks on this date.
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
                <Badge
                  key={email}
                  variant="secondary"
                  className="gap-1.5 pr-1.5"
                >
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
          <p className="text-xs text-muted-foreground">
            Leave empty to send only to yourself.
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Sealing..." : "Seal capsule"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            nativeButton={false}
            render={<Link href="/dashboard" />}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
