import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {/* Home link */}
        <li>
          <Link href="/" className="text-steel-400 hover:text-yellow-400 transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-steel-500 mx-2" />
            {item.href && !item.current ? (
              <Link 
                href={item.href}
                className="text-steel-400 hover:text-yellow-400 transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span 
                className={`${item.current ? 'text-yellow-400 font-medium' : 'text-steel-300'}`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}