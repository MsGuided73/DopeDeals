"use client";
import * as React from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "./toast";

// Standard Toaster mounting point for shadcn toast primitives
export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
      {/* Individual Toasts are rendered by the use-toast hook via portals */}
    </ToastProvider>
  );
}

