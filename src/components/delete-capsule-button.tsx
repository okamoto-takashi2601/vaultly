"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteCapsuleButton({ capsuleId }: { capsuleId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this capsule? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/capsules/${capsuleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Failed to delete capsule. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleDelete}
      disabled={loading}
      className="gap-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
