"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function UpgradeButton({ plan }: { plan: "PERSONAL" | "FAMILY" }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else {
      alert("Payment not available yet.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} disabled={loading} size="sm" className="gap-2">
      {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      Upgrade
    </Button>
  );
}
