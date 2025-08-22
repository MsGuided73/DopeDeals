"use client";
import { ReactNode } from 'react';

export function TooltipProvider({ children }: { children: ReactNode }) {
  // Minimal placeholder provider to unblock build. Replace with shadcn or radix implementation later.
  return <>{children}</>;
}

