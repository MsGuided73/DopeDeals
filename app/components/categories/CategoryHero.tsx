"use client";
import { useState } from 'react';
import Link from 'next/link';

interface CategoryHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  gradient?: string;
  categoryName?: string;
}

export default function CategoryHero({
  title,
  subtitle,
  backgroundImage,
  gradient = "from-gray-600 to-gray-800",
  categoryName
}: CategoryHeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${backgroundImage}')`
          }}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        // Default gradient background
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`} />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-dope-orange-500/10 rounded-full animate-pulse animation-delay-1000" />
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-500/10 rounded-full animate-pulse animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Category Label */}
        {categoryName && (
          <div className="inline-block mb-6">
            <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium border border-white/30">
              {categoryName}
            </span>
          </div>
        )}

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/products">
            <button className="px-8 py-4 bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-dope-orange-500/30 transform">
              Shop All Products
            </button>
          </Link>
          <Link href="#products">
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold text-lg rounded-full transition-all duration-300 hover:scale-105">
              Browse Collection ↓
            </button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Add custom animation delays for staggered effects
const style = document.createElement('style');
style.textContent = `
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`;
document.head.appendChild(style);
