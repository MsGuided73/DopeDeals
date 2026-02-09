"use client";

import { useEffect, useState, useRef } from "react";

interface FireEffectProps {
  /** Duration in ms for the initial "consume" phase */
  consumeDuration?: number;
  /** Duration in ms for the "recede" phase */
  recedeDuration?: number;
  /** Final height of the fire at the bottom (in pixels or %) */
  finalHeight?: string;
}

/**
 * START EXAMPLE USAGE
 * 
 * <FireEffect 
 *   consumeDuration={2000} 
 *   recedeDuration={1500} 
 *   finalHeight="120px" 
 * />
 * 
 * END EXAMPLE USAGE
 */

export default function FireEffect({
  consumeDuration = 2000,
  recedeDuration = 1500,
  finalHeight = "120px",
}: FireEffectProps) {
  const [phase, setPhase] = useState<"consume" | "recede" | "settled">("consume");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const recedeTimer = setTimeout(() => {
      setPhase("recede");
    }, consumeDuration);

    const settledTimer = setTimeout(() => {
      setPhase("settled");
    }, consumeDuration + recedeDuration);

    return () => {
      clearTimeout(recedeTimer);
      clearTimeout(settledTimer);
    };
  }, [consumeDuration, recedeDuration]);

  // Generate random flame positions
  const flames = useRef(
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: (i / 60) * 100 + (Math.random() - 0.5) * 3,
      delay: Math.random() * 0.5,
      duration: 0.4 + Math.random() * 0.4,
      scale: 0.6 + Math.random() * 0.8,
      sway: Math.random() * 10 - 5,
    }))
  ).current;

  const getContainerHeight = () => {
    switch (phase) {
      case "consume":
        return "100%";
      case "recede":
      case "settled":
        return finalHeight;
    }
  };

  return (
    <>
      {/* SVG Filter for realistic fire distortion */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="fire-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        @keyframes flame-dance {
          0%, 100% {
            transform: scaleX(1) scaleY(1) translateX(0) rotate(0deg);
          }
          20% {
            transform: scaleX(0.95) scaleY(1.05) translateX(-2px) rotate(-1deg);
          }
          40% {
            transform: scaleX(1.05) scaleY(0.95) translateX(2px) rotate(1deg);
          }
          60% {
            transform: scaleX(0.97) scaleY(1.03) translateX(-1px) rotate(-0.5deg);
          }
          80% {
            transform: scaleX(1.03) scaleY(0.97) translateX(1px) rotate(0.5deg);
          }
        }

        @keyframes flame-flicker {
          0%, 100% { opacity: 0.9; }
          25% { opacity: 1; }
          50% { opacity: 0.85; }
          75% { opacity: 0.95; }
        }

        @keyframes ember-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(var(--drift)) scale(0.3);
            opacity: 0;
          }
        }

        .fire-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          pointer-events: none;
          z-index: 5;
          overflow: visible;
          transition: height ${recedeDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flame {
          position: absolute;
          bottom: 0;
          transform-origin: center bottom;
          animation: flame-dance var(--duration) ease-in-out infinite,
                     flame-flicker 0.2s ease-in-out infinite;
        }

        /* Flame shape using clip-path - tapers to point at top */
        .flame-shape {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to top,
            #cc2200 0%,
            #ff4400 15%,
            #ff6600 30%,
            #ff8800 45%,
            #ffaa00 60%,
            #ffcc33 75%,
            #ffee66 88%,
            #ffffaa 95%,
            transparent 100%
          );
          clip-path: polygon(
            50% 0%,
            15% 35%,
            5% 60%,
            0% 100%,
            100% 100%,
            95% 60%,
            85% 35%
          );
          filter: blur(2px);
        }

        /* Inner brighter core */
        .flame-core {
          position: absolute;
          bottom: 0;
          left: 20%;
          width: 60%;
          height: 70%;
          background: linear-gradient(
            to top,
            #ffaa00 0%,
            #ffcc44 25%,
            #ffee77 50%,
            #ffffcc 75%,
            transparent 100%
          );
          clip-path: polygon(
            50% 0%,
            20% 40%,
            10% 70%,
            0% 100%,
            100% 100%,
            90% 70%,
            80% 40%
          );
          filter: blur(3px);
          opacity: 0.9;
        }

        .glow-layer {
          position: absolute;
          bottom: 0;
          left: -20%;
          right: -20%;
          height: 120%;
          background: radial-gradient(
            ellipse 80% 60% at 50% 100%,
            rgba(255, 120, 0, 0.7) 0%,
            rgba(255, 80, 0, 0.5) 25%,
            rgba(255, 50, 0, 0.3) 45%,
            rgba(255, 30, 0, 0.15) 65%,
            transparent 85%
          );
          filter: blur(15px);
          z-index: -1;
        }

        .ember {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #ffdd00 0%, #ff6600 50%, transparent 100%);
          border-radius: 50%;
          animation: ember-rise var(--duration) ease-out infinite;
          box-shadow: 0 0 6px 2px rgba(255, 150, 0, 0.9);
        }

        .base-glow {
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(
            to top,
            rgba(255, 100, 0, 0.8) 0%,
            rgba(255, 60, 0, 0.4) 50%,
            transparent 100%
          );
          filter: blur(8px);
        }
      `}</style>

      <div
        ref={containerRef}
        className="fire-container"
        style={{ height: getContainerHeight() }}
      >
        {/* Base glow at the very bottom */}
        <div className="base-glow" />

        {/* Ambient glow */}
        <div className="glow-layer" />

        {/* Main flames with realistic tapered shape */}
        {flames.map((flame) => (
          <div
            key={flame.id}
            className="flame"
            style={{
              left: `${flame.left}%`,
              width: `${20 + flame.scale * 25}px`,
              height: `${60 + flame.scale * 60}%`,
              animationDelay: `${flame.delay}s`,
              ["--duration" as any]: `${flame.duration}s`,
              marginLeft: `-${(20 + flame.scale * 25) / 2}px`,
            }}
          >
            <div className="flame-shape" />
            <div className="flame-core" />
          </div>
        ))}

        {/* Flying embers */}
        {(phase === "consume" || phase === "recede") &&
          Array.from({ length: 25 }).map((_, i) => (
            <div
              key={`ember-${i}`}
              className="ember"
              style={{
                left: `${5 + Math.random() * 90}%`,
                bottom: `${10 + Math.random() * 30}%`,
                animationDelay: `${Math.random() * 2}s`,
                ["--duration" as any]: `${1.5 + Math.random() * 1.5}s`,
                ["--drift" as any]: `${(Math.random() - 0.5) * 40}px`,
              }}
            />
          ))}
      </div>
    </>
  );
}
