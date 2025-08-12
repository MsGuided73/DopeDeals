"use client";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NicotineToggle() {
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const url = new URL(window.location.href);
    const v = url.searchParams.get("nicotine");
    if (v === "true") setEnabled(true);
    else if (v === "false") setEnabled(false);
    else setEnabled(undefined);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (enabled === undefined) {
      url.searchParams.delete("nicotine");
    } else {
      url.searchParams.set("nicotine", String(enabled));
    }
    // Replace URL without reload; fetch layer (react-query) will refetch by key if used that way
    window.history.replaceState({}, "", url.toString());
  }, [enabled]);

  return (
    <div className="flex items-center space-x-3">
      <Switch
        id="nicotine-toggle"
        checked={enabled === true}
        onCheckedChange={(checked) => setEnabled(checked ? true : undefined)}
      />
      <Label htmlFor="nicotine-toggle">Nicotine products only</Label>
      {enabled === false && (
        <span className="text-xs text-muted-foreground">(Showing nicotine-free only)</span>
      )}
      {enabled === undefined && (
        <span className="text-xs text-muted-foreground">(All products)</span>
      )}
    </div>
  );
}

