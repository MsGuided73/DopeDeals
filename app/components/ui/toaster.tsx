"use client";
import { useEffect, useState } from 'react';

export function Toaster() {
  // Minimal no-op Toaster to unblock build; wire to shadcn toast later
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? null : null;
}

