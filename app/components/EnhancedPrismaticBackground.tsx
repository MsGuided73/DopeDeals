'use client';

import { useEffect, useRef, useState } from 'react';

interface EnhancedPrismaticBackgroundProps {
  children: React.ReactNode;
  className?: string;
  beamCount?: number;
  beamIntensity?: number;
}

export default function EnhancedPrismaticBackground({
  children,
  className = "",
  beamCount = 12,
  beamIntensity = 0.8
}: EnhancedPrismaticBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const backgroundElement = backgroundRef.current;
    if (backgroundElement) {
      backgroundElement.addEventListener('mousemove', handleMouseMove);
      backgroundElement.addEventListener('mouseenter', handleMouseEnter);
      backgroundElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (backgroundElement) {
        backgroundElement.removeEventListener('mousemove', handleMouseMove);
        backgroundElement.removeEventListener('mouseenter', handleMouseEnter);
        backgroundElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Calculate which beam tip should be most reactive based on mouse position
  const getBeamReactivity = (beamIndex: number) => {
    const angle = (beamIndex / beamCount) * Math.PI * 2;
    const beamX = Math.cos(angle);
    const beamY = Math.sin(angle);

    // Calculate distance from mouse position to this beam tip
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - (0.5 + beamX * 0.4), 2) +
      Math.pow(mousePosition.y - (0.5 + beamY * 0.4), 2)
    );

    // Closer distances = higher reactivity (inverted and scaled)
    return Math.max(0, 1 - distance * 2.5);
  };

  // Generate dynamic light beams that respond at their tips
  const generateBeamGradients = () => {
    const gradients = [];

    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * 360;
      const reactivity = getBeamReactivity(i);
      const intensity = beamIntensity * (0.3 + reactivity * 0.7);

      // Create elongated radial gradients that extend to the edges
      gradients.push(`
        radial-gradient(ellipse ${200 + reactivity * 100}% 80% at 50% 50%,
          rgba(${Math.floor(255 * intensity)}, ${Math.floor(146 * intensity)}, ${Math.floor(199 * intensity)}, ${0.4 * intensity}) 0%,
          rgba(${Math.floor(199 * intensity)}, ${Math.floor(146 * intensity)}, ${Math.floor(255 * intensity)}, ${0.3 * intensity}) 20%,
          rgba(${Math.floor(146 * intensity)}, ${Math.floor(199 * intensity)}, ${Math.floor(255 * intensity)}, ${0.25 * intensity}) 40%,
          rgba(${Math.floor(255 * intensity)}, ${Math.floor(199 * intensity)}, ${Math.floor(146 * intensity)}, ${0.2 * intensity}) 60%,
          transparent 80%
        )
      `);
    }

    return gradients.join(', ');
  };

  // Create the main prismatic effect with reactive beam tips
  const lightRayGradient = `
    /* Base colorful gradient background */
    conic-gradient(from 0deg at 50% 50%,
      rgba(255, 146, 199, 0.8) 0deg,
      rgba(199, 146, 255, 0.7) 60deg,
      rgba(146, 199, 255, 0.8) 120deg,
      rgba(255, 199, 146, 0.7) 180deg,
      rgba(255, 146, 199, 0.6) 240deg,
      rgba(199, 146, 255, 0.8) 300deg,
      rgba(255, 146, 199, 0.8) 360deg
    ),
    /* Dynamic reactive light beams */
    ${generateBeamGradients()},
    /* Central glow that responds to mouse */
    radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
      rgba(255, 255, 255, ${0.3 + beamIntensity * 0.3}) 0%,
      rgba(255, 255, 255, ${0.15 + beamIntensity * 0.2}) 15%,
      rgba(199, 146, 255, ${0.1 + beamIntensity * 0.15}) 30%,
      transparent 50%
    ),
    /* Beam tip highlights */
    conic-gradient(from ${mousePosition.x * 360}deg at 50% 50%,
      transparent 0deg,
      rgba(255, 255, 255, ${0.2 * beamIntensity}) 15deg,
      transparent 30deg,
      rgba(255, 146, 199, ${0.15 * beamIntensity}) 45deg,
      transparent 60deg,
      rgba(199, 146, 255, ${0.18 * beamIntensity}) 75deg,
      transparent 90deg,
      rgba(146, 199, 255, ${0.16 * beamIntensity}) 105deg,
      transparent 120deg,
      rgba(255, 199, 146, ${0.14 * beamIntensity}) 135deg,
      transparent 150deg,
      rgba(255, 146, 199, ${0.17 * beamIntensity}) 165deg,
      transparent 180deg,
      rgba(199, 146, 255, ${0.13 * beamIntensity}) 195deg,
      transparent 210deg,
      rgba(146, 199, 255, ${0.15 * beamIntensity}) 225deg,
      transparent 240deg,
      rgba(255, 199, 146, ${0.12 * beamIntensity}) 255deg,
      transparent 270deg,
      rgba(255, 146, 199, ${0.16 * beamIntensity}) 285deg,
      transparent 300deg,
      rgba(199, 146, 255, ${0.14 * beamIntensity}) 315deg,
      transparent 330deg,
      rgba(146, 199, 255, ${0.13 * beamIntensity}) 345deg,
      transparent 360deg
    )
  `;

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Base gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg,
              rgba(255, 146, 199, 0.9) 0%,
              rgba(199, 146, 255, 0.8) 25%,
              rgba(146, 199, 255, 0.9) 50%,
              rgba(255, 199, 146, 0.8) 75%,
              rgba(255, 146, 199, 0.9) 100%
            )
          `,
        }}
      />

      {/* Enhanced Prismatic Light Beams with Tip Reactivity */}
      <div
        ref={backgroundRef}
        className="absolute inset-0"
        style={{
          background: lightRayGradient,
          transform: `rotate(${mousePosition.x * 5 - 2.5}deg) scale(${isHovered ? 1.01 : 1})`,
          transition: 'transform 0.4s ease-out',
          mixBlendMode: 'screen',
          filter: `brightness(${1 + beamIntensity * 0.2}) saturate(${1 + beamIntensity * 0.3})`,
        }}
      />

      {/* Animated shimmer overlay focused on beam tips */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(255, 255, 255, 0.3) 8%,
              transparent 20%
            ),
            radial-gradient(ellipse at ${100 - mousePosition.x * 100}% ${100 - mousePosition.y * 100}%,
              rgba(255, 255, 255, 0.6) 0%,
              rgba(255, 255, 255, 0.2) 10%,
              transparent 25%
            ),
            radial-gradient(ellipse at ${mousePosition.y * 100}% ${100 - mousePosition.x * 100}%,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.15) 12%,
              transparent 28%
            ),
            radial-gradient(ellipse at ${100 - mousePosition.y * 100}% ${mousePosition.x * 100}%,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.1) 15%,
              transparent 30%
            )
          `,
          animation: isHovered
            ? 'beamTipShimmer 1.5s ease-in-out infinite alternate'
            : 'beamTipShimmer 3s ease-in-out infinite alternate',
          opacity: isHovered ? 0.9 : 0.6,
          transition: 'opacity 0.6s ease-in-out',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Depth and dimension layer */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 50%,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(255, 255, 255, 0.15) 25%,
              transparent 50%
            ),
            conic-gradient(from ${mousePosition.x * 180}deg at 50% 50%,
              rgba(199, 146, 255, 0.12) 0deg,
              rgba(255, 146, 199, 0.1) 90deg,
              rgba(146, 199, 255, 0.12) 180deg,
              rgba(255, 199, 146, 0.1) 270deg,
              rgba(199, 146, 255, 0.12) 360deg
            )
          `,
          transform: `rotate(${mousePosition.y * 3 - 1.5}deg)`,
          transition: 'transform 0.5s ease-out',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes beamTipShimmer {
            0% {
              opacity: 0.6;
              transform: scale(1);
            }
            100% {
              opacity: 0.9;
              transform: scale(1.005);
            }
          }
        `
      }} />
    </div>
  );
}
