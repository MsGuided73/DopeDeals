import React from 'react';

// A tiny design system wrapper inspired by Nike industrial vibes
// - Light theme, bold typography, geometric grids
// - Subtle metal/concrete textures via CSS vars

export function Hero({ title, subtitle, children }: { title: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-white text-neutral-900">
      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.04),transparent_40%),repeating-linear-gradient(45deg,rgba(0,0,0,0.03),rgba(0,0,0,0.03)_2px,transparent_2px,transparent_6px)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 grid gap-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight uppercase">{title}</h1>
        {subtitle && <p className="text-lg text-neutral-600 max-w-2xl">{subtitle}</p>}
        <div>{children}</div>
      </div>
    </section>
  );
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-[0_6px_30px_rgba(0,0,0,0.06)] rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function MetalDivider() {
  return <hr className="my-8 h-[2px] border-0 bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200 rounded" />
}

