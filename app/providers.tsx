"use client";

import React, { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import ToastProvider from "./components/ToastProvider";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ComplianceProvider } from "./contexts/ComplianceContext";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ComplianceProvider>
          <CartProvider>
            {children}
            <ToastProvider />
          </CartProvider>
        </ComplianceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
