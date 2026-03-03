"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbPath {
  name: string;
  href?: string;
}

interface GlobalBreadcrumbsProps {
  paths: BreadcrumbPath[];
}

export default function GlobalBreadcrumbs({ paths }: GlobalBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 mb-8 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Home Link */}
      <Link 
        href="/"
        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline uppercase tracking-widest text-xs font-bold">Home</span>
      </Link>

      {/* Dynamic Paths */}
      {paths.map((path, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {path.href ? (
             <Link 
               href={path.href}
               className="text-gray-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
             >
               {path.name}
             </Link>
          ) : (
             <span className="text-white uppercase tracking-widest text-xs font-bold">
               {path.name}
             </span>
          )}
        </div>
      ))}
    </nav>
  );
}
