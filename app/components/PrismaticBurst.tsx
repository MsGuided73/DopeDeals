'use client';

import React, { useEffect, useRef, useState } from 'react';
import './PrismaticBurst.css';

type Offset = { x?: number | string; y?: number | string };
type AnimationType = 'rotate' | 'rotate3d' | 'hover';

export type PrismaticBurstProps = {
  intensity?: number;
  speed?: number;
  animationType?: AnimationType;
  colors?: string[];
  distort?: number;
  paused?: boolean;
  offset?: Offset;
  hoverDampness?: number;
  rayCount?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'] | 'none';
};

const PrismaticBurst = ({
  intensity = 3,
  speed = 0.5,
  animationType = 'rotate3d',
  colors = ['#ff007a', '#4d3dff', '#00ffff', '#ff1493', '#8a2be2', '#00ced1'],
  distort = 1.0,
  paused = false,
  offset = { x: 0, y: 0 },
  hoverDampness = 0.25,
  rayCount = 24,
  mixBlendMode = 'lighten'
}: PrismaticBurstProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Generate dynamic radial beams that respond to mouse position
  const generateBeamGradients = () => {
    const gradients = [];
    const beamCount = rayCount || 24;

    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * 360;
      const radianAngle = (angle * Math.PI) / 180;

      // Calculate beam tip position
      const tipX = 50 + Math.cos(radianAngle) * 60; // Extend further out
      const tipY = 50 + Math.sin(radianAngle) * 60;

      // Calculate distance from mouse to this beam tip
      const mouseXPercent = mousePosition.x * 100;
      const mouseYPercent = mousePosition.y * 100;
      const distance = Math.sqrt(
        Math.pow(mouseXPercent - tipX, 2) + Math.pow(mouseYPercent - tipY, 2)
      );

      // Closer distances = higher reactivity (inverted and scaled)
      const reactivity = Math.max(0, 1 - distance / 100);
      const beamIntensity = (0.3 + reactivity * 0.7) * (intensity || 1);

      // Create elongated radial gradients that extend to the edges
      gradients.push(`
        radial-gradient(ellipse ${300 + reactivity * 200}% 120% at ${tipX}% ${tipY}%,
          rgba(${Math.floor(255 * beamIntensity)}, ${Math.floor(146 * beamIntensity)}, ${Math.floor(199 * beamIntensity)}, ${0.6 * beamIntensity}) 0%,
          rgba(${Math.floor(77 * beamIntensity)}, ${Math.floor(61 * beamIntensity)}, ${Math.floor(255 * beamIntensity)}, ${0.4 * beamIntensity}) 15%,
          rgba(${Math.floor(0 * beamIntensity)}, ${Math.floor(255 * beamIntensity)}, ${Math.floor(255 * beamIntensity)}, ${0.3 * beamIntensity}) 30%,
          rgba(${Math.floor(255 * beamIntensity)}, ${Math.floor(20 * beamIntensity)}, ${Math.floor(147 * beamIntensity)}, ${0.25 * beamIntensity}) 45%,
          rgba(${Math.floor(138 * beamIntensity)}, ${Math.floor(43 * beamIntensity)}, ${Math.floor(226 * beamIntensity)}, ${0.2 * beamIntensity}) 60%,
          rgba(${Math.floor(0 * beamIntensity)}, ${Math.floor(206 * beamIntensity)}, ${Math.floor(209 * beamIntensity)}, ${0.15 * beamIntensity}) 75%,
          transparent 90%
        )
      `);
    }

    return gradients.join(', ');
  };

  // Create the main prismatic effect with reactive beam tips
  const prismaticStyle = {
    background: `
      /* Base colorful gradient background */
      conic-gradient(from 0deg at 50% 50%,
        ${colors[0] || '#ff007a'} 0deg,
        ${colors[1] || '#4d3dff'} 60deg,
        ${colors[2] || '#00ffff'} 120deg,
        ${colors[3] || '#ff1493'} 180deg,
        ${colors[4] || '#8a2be2'} 240deg,
        ${colors[5] || '#00ced1'} 300deg,
        ${colors[0] || '#ff007a'} 360deg
      ),
      /* Dynamic reactive light beams */
      ${generateBeamGradients()},
      /* Central glow that responds to mouse */
      radial-gradient(ellipse at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
        rgba(255, 255, 255, ${0.4 + (intensity || 1) * 0.2}) 0%,
        rgba(255, 255, 255, ${0.2 + (intensity || 1) * 0.1}) 15%,
        rgba(255, 0, 122, ${0.15 + (intensity || 1) * 0.1}) 30%,
        transparent 50%
      ),
      /* Animated color rotation */
      conic-gradient(from ${Date.now() * (speed || 0.5) * 0.01}deg at 50% 50%,
        transparent 0deg,
        rgba(255, 0, 122, 0.1) 30deg,
        transparent 60deg,
        rgba(77, 61, 255, 0.1) 90deg,
        transparent 120deg,
        rgba(0, 255, 255, 0.1) 150deg,
        transparent 180deg,
        rgba(255, 20, 147, 0.1) 210deg,
        transparent 240deg,
        rgba(138, 43, 226, 0.1) 270deg,
        transparent 300deg,
        rgba(0, 206, 209, 0.1) 330deg,
        transparent 360deg
      )
    `,
    filter: `
      brightness(${1 + (intensity || 1) * 0.3})
      saturate(${1 + (intensity || 1) * 0.5})
      blur(${0.5 + (distort || 1) * 0.5}px)
    `,
    transform: `
      scale(${isHovered ? 1.02 : 1})
      rotate(${mousePosition.x * 10 - 5}deg)
    `,
    animation: `prismaticPulse ${4 / (speed || 0.5)}s ease-in-out infinite alternate`,
  };

  return (
    <div className="prismatic-burst-container" ref={containerRef}>
      {/* CSS-based Prismatic Background */}
      <div
        className="prismatic-burst-effect"
        style={prismaticStyle}
      />

      {/* Additional shimmer layer focused on beam tips */}
      <div
        className="prismatic-burst-shimmer"
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
            ? `shimmer ${1.5 / (speed || 0.5)}s ease-in-out infinite`
            : `shimmer ${3 / (speed || 0.5)}s ease-in-out infinite`,
          opacity: isHovered ? 0.9 : 0.6,
          mixBlendMode: 'overlay',
        }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes prismaticPulse {
            0% {
              filter: brightness(${1 + (intensity || 1) * 0.2}) saturate(${1 + (intensity || 1) * 0.3});
            }
            100% {
              filter: brightness(${1 + (intensity || 1) * 0.5}) saturate(${1 + (intensity || 1) * 0.7});
            }
          }

          @keyframes shimmer {
            0% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.01);
            }
            100% {
              opacity: 0.4;
              transform: scale(1);
            }
          }
        `
      }} />
    </div>
  );
};

export default PrismaticBurst;
