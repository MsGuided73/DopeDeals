import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Sun,
  Route,
  Clock,
  Waves,
  Sparkles,
} from "lucide-react";
import GlobalMasthead from "../../components/GlobalMasthead";

export const metadata = {
  title: "Oregon Coast Sessions | Highway 420 Road Trips",
  description:
    "Cruise the Pacific Coast Highway. Cliffside pull-offs, forest overlooks, and hidden beaches — laid-back, scenic, social.",
};

const HERO_IMAGE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/oregon%20sessions%20hero.png";

const COMMUNITY_BASE =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/General%20Community";

const COMMUNITY_PHOTOS = [
  `${COMMUNITY_BASE}/Coastal%20stroll%20at%20sunset.png`,
  `${COMMUNITY_BASE}/Vintage%20camper%20van%20in%20mountain%20clearing.png`,
  `${COMMUNITY_BASE}/Golden%20hour%20on%20the%20mountain%20rock.png`,
  `${COMMUNITY_BASE}/Friends%20enjoying%20sunset%20on%20rooftop.png`,
  `${COMMUNITY_BASE}/Desert%20road%20trip%20at%20sunset.png`,
  `${COMMUNITY_BASE}/Beach%20day%20with%20a%20relaxing%20view.png`,
  `${COMMUNITY_BASE}/Relaxing%20in%20the%20cannabis%20lounge.png`,
];

type Stop = {
  n: string;
  name: string;
  bullets: string[];
  image: string;
};

const STOPS: Stop[] = [
  {
    n: "01",
    name: "Cliffside Pull-Off",
    bullets: ["Wide ocean views", "Space to set up", "Low traffic"],
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Oregon%20stop%201.png",
  },
  {
    n: "02",
    name: "Forest Overlook",
    bullets: ["More private", "Wind protection", "Chill vibe"],
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Oregon%20stop%202.png",
  },
  {
    n: "03",
    name: "Hidden Beach Access",
    bullets: ["Short walk", "Best at sunset", "Bring good shoes"],
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Oregon%20stop%203.png",
  },
];

type Kit = {
  name: string;
  blurb: string;
  cta: string;
  href: string;
  icon: "leaf" | "flask" | "drop";
  image: string;
};

const KITS: Kit[] = [
  {
    name: "Pre-Roll Kit",
    blurb: "Simple. Portable. Ready anywhere.",
    cta: "Shop Pre-Roll Gear",
    href: "/bundles?kit=preroll",
    icon: "leaf",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Preroll%20Kit%20Oregon.png",
  },
  {
    name: "Bong Kit",
    blurb: "Smooth sessions, wherever you stop.",
    cta: "Shop Bong Setups",
    href: "/bundles?kit=bong",
    icon: "flask",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Bong%20Kit%20Oregon.png",
  },
  {
    name: "Dab Kit",
    blurb: "High-performance, road-ready.",
    cta: "Shop Dab Rigs",
    href: "/bundles?kit=dab",
    icon: "drop",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Dab%20Kit%20Oregon.png",
  },
];

type KeepRiding = {
  name: string;
  region: string;
  href: string;
  image: string;
};

const KEEP_RIDING: KeepRiding[] = [
  {
    name: "Malibu Sessions",
    region: "California",
    href: "/road-trips/malibu",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Malbu%20Keep%20Riding.png",
  },
  {
    name: "Big Sur Adventure",
    region: "California",
    href: "/road-trips/big-sur",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Big%20Sur%20Keep%20Riding.png",
  },
  {
    name: "PDX Day Sessions",
    region: "Oregon",
    href: "/road-trips/pdx",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/PDX%20Keep%20riding.png",
  },
  {
    name: "Lake Tahoe Escape",
    region: "California / Nevada",
    href: "/road-trips/lake-tahoe",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Tahoe%20Keep%20riding.png",
  },
];

export default function OregonCoastPage() {
  return (
    <div style={{ backgroundColor: "#F5F5F0", minHeight: "100vh" }}>
      <GlobalMasthead />

      <style>{`
        /* ── Tokens ──────────────────────────────────────── */
        :root {
          --rt-cream: #F5F5F0;
          --rt-cream-2: #EFEFEA;
          --rt-ink: #111111;
          --rt-muted: #4b5563;
          --rt-line: #d1d5db;
          --rt-green: #1F4D2E;
          --rt-green-mid: #2F6B3A;
          --rt-green-bright: #1B7A4D;
        }
        .rtd-wrap {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        @media (min-width: 640px)  { .rtd-wrap { padding: 0 24px; } }
        @media (min-width: 1024px) { .rtd-wrap { padding: 0 40px; } }
        @media (min-width: 1440px) { .rtd-wrap { padding: 0 64px; } }
        h2.rtd-title, h3.rtd-card-title {
          font-family: "BebasNeue", "Bebas Neue", "Impact", sans-serif;
          font-weight: 400;
          letter-spacing: 0.02em;
          margin: 0;
        }
        .rtd-eyebrow {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--rt-green-mid);
        }

        /* ── 1. Hero ─────────────────────────────────────── */
        .rtd-hero {
          position: relative;
          min-height: clamp(440px, 70vh, 640px);
          color: #fff;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          align-items: flex-end;
        }
        .rtd-hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          background: #1a1a1a;
        }
        .rtd-hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .rtd-hero-scrim {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0.0) 0%,
            rgba(0,0,0,0.0) 35%,
            rgba(0,0,0,0.35) 100%
          ),
          linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.03) 60%, rgba(0,0,0,0) 100%);
        }
        .rtd-hero-inner {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 32px 16px 40px;
          box-sizing: border-box;
        }
        @media (min-width: 640px)  { .rtd-hero-inner { padding: 40px 24px 48px; } }
        @media (min-width: 1024px) { .rtd-hero-inner { padding: 48px 40px 56px; } }
        @media (min-width: 1440px) { .rtd-hero-inner { padding: 56px 64px 64px; } }
        .rtd-hero h1 {
          font-family: "BebasNeue", "Bebas Neue", "Impact", sans-serif;
          font-weight: 400;
          font-size: clamp(56px, 9vw, 116px);
          line-height: 0.92;
          margin: 0 0 14px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.45);
          max-width: 720px;
        }
        .rtd-hero-tagline {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(15px, 1.6vw, 18px);
          font-weight: 500;
          margin: 0 0 18px;
          max-width: 520px;
          color: rgba(255,255,255,0.92);
        }
        .rtd-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0 0 22px;
        }
        .rtd-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 6px 12px;
          border-radius: 100px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .rtd-pill .rtd-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .rtd-pill .rtd-pill-dot.amber { background: #E08A33; }
        .rtd-pill .rtd-pill-dot.teal { background: #4FA3A6; }
        .rtd-pill .rtd-pill-dot.green { background: var(--rt-green-bright); }
        .rtd-save-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff;
          border-radius: 4px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .rtd-save-btn:hover { background: rgba(0,0,0,0.7); }

        /* ── 2. Stat strip ───────────────────────────────── */
        .rtd-stats {
          background: var(--rt-green);
          color: #fff;
          margin-top: -56px;
          position: relative;
          z-index: 2;
          border-radius: 4px;
          padding: 24px 16px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }
        @media (min-width: 768px) {
          .rtd-stats { grid-template-columns: repeat(4, 1fr); padding: 28px 32px; }
        }
        .rtd-stat {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 8px;
          position: relative;
        }
        @media (min-width: 768px) {
          .rtd-stat:not(:last-child)::after {
            content: '';
            position: absolute;
            right: 0;
            top: 10%;
            bottom: 10%;
            width: 1px;
            background: rgba(255,255,255,0.2);
          }
        }
        .rtd-stat-icon {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          color: #fff;
        }
        .rtd-stat-label {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.72);
          margin: 0 0 2px;
        }
        .rtd-stat-value {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          line-height: 1.3;
          margin: 0;
        }

        /* ── 3. The Ride + Map ───────────────────────────── */
        .rtd-ride {
          padding: 64px 0 24px;
        }
        .rtd-ride-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .rtd-ride-grid { grid-template-columns: 1fr 2fr; gap: 48px; }
        }
        .rtd-ride-copy h2 {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          line-height: 1.2;
          color: var(--rt-ink);
          margin: 8px 0 14px;
        }
        .rtd-ride-copy p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #3C3C3A;
          margin: 0 0 20px;
        }
        .rtd-ride-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rt-green-mid);
          text-decoration: none;
          border-bottom: 2px solid var(--rt-green-mid);
          padding-bottom: 4px;
          width: fit-content;
        }
        .rtd-ride-link:hover { color: var(--rt-green-bright); border-bottom-color: var(--rt-green-bright); }

        /* Route map placeholder — corridor variant */
        .rtd-map {
          position: relative;
          aspect-ratio: 21/9;
          border-radius: 12px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 60% 80% at 0% 50%, rgba(167, 200, 211, 0.55) 0%, rgba(167, 200, 211, 0) 70%),
            radial-gradient(ellipse 50% 60% at 80% 100%, rgba(180, 200, 165, 0.4) 0%, rgba(180, 200, 165, 0) 70%),
            #EAE2D2;
        }
        .rtd-map::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              60deg,
              rgba(120, 110, 90, 0.08) 0,
              rgba(120, 110, 90, 0.08) 1px,
              transparent 1px,
              transparent 22px
            );
          opacity: 0.6;
        }
        .rtd-map-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .rtd-map-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          background: var(--rt-green);
          color: #fff;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 6px 10px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
        }
        .rtd-map-pin::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--rt-green-bright);
          border: 2px solid #fff;
        }
        .rtd-map-label {
          position: absolute;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(60, 60, 58, 0.55);
        }

        /* ── 4. Featured Stops ───────────────────────────── */
        .rtd-stops {
          padding: 56px 0 24px;
          border-top: 1px solid var(--rt-line);
          margin-top: 16px;
        }
        .rtd-stops-header {
          text-align: center;
          margin-bottom: 26px;
        }
        .rtd-stops-header .rtd-eyebrow { display: inline-block; }
        .rtd-stops-header h2 {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--rt-ink);
          margin: 6px 0 0;
        }
        .rtd-stops-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 768px) {
          .rtd-stops-grid { grid-template-columns: repeat(3, 1fr); gap: 22px; }
        }
        .rtd-stop {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
        }
        .rtd-stop-img {
          position: relative;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #2A2B2A 0%, #1A1B1A 100%);
          overflow: hidden;
        }
        .rtd-stop-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rtd-stop-num {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--rt-green);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .rtd-stop-body {
          padding: 18px 20px 16px;
        }
        .rtd-stop h3 {
          font-family: "Inter", "Fira Sans", sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--rt-ink);
          margin: 0 0 10px;
        }
        .rtd-stop ul {
          list-style: none;
          padding: 0;
          margin: 0 0 14px;
        }
        .rtd-stop li {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          color: #3C3C3A;
          line-height: 1.45;
          padding: 2px 0 2px 14px;
          position: relative;
        }
        .rtd-stop li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 9px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--rt-green-mid);
        }
        .rtd-stop-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--rt-green-mid);
          text-decoration: none;
        }
        .rtd-stop-cta:hover { color: var(--rt-green-bright); }

        /* ── 5. Pack Your Ride (kits) ────────────────────── */
        .rtd-kits {
          background: #1a1a1a;
          color: #fff;
          padding: 56px 0;
          margin-top: 48px;
        }
        /* Section background stays edge-to-edge; content is capped + centered. */
        .rtd-kits .rtd-wrap {
          max-width: 1200px;
        }
        .rtd-kits-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .rtd-kits-header h2 {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 6px;
        }
        .rtd-kits-header p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }
        .rtd-kits-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }
        @media (min-width: 768px) {
          .rtd-kits-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .rtd-kit {
          position: relative;
          background: #2A2B2A;
          border-radius: 10px;
          overflow: hidden;
          aspect-ratio: 4/5;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          isolation: isolate;
        }
        .rtd-kit-img {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .rtd-kit-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .rtd-kit-img.placeholder {
          background:
            radial-gradient(ellipse at 50% 65%, rgba(31,77,46,0.55) 0%, rgba(31,77,46,0) 60%),
            linear-gradient(135deg, #2A2B2A 0%, #1A1B1A 100%);
        }
        .rtd-kit-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%);
        }
        .rtd-kit-icon {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 2;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(31, 77, 46, 0.85);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rtd-kit-body {
          position: relative;
          z-index: 2;
          padding: 20px;
        }
        .rtd-kit h3 {
          font-family: "Inter", "Fira Sans", sans-serif;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 6px;
        }
        .rtd-kit p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.78);
          line-height: 1.4;
          margin: 0 0 16px;
        }
        .rtd-kit-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          background: rgba(31, 77, 46, 0.9);
          color: #fff;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .rtd-kit-cta:hover { background: var(--rt-green-bright); }

        /* ── 6. Community gallery ────────────────────────── */
        .rtd-community {
          padding: 56px 0 40px;
        }
        .rtd-community-header {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 22px;
        }
        .rtd-community-header h2 {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--rt-ink);
          margin: 4px 0 6px;
        }
        .rtd-community-header p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 14px;
          color: var(--rt-muted);
          margin: 0;
        }
        .rtd-community-share {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: var(--rt-green-mid);
          color: #fff;
          border-radius: 4px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s;
        }
        .rtd-community-share:hover { background: var(--rt-green-bright); }
        .rtd-community-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 768px) {
          .rtd-community-grid {
            grid-template-columns: repeat(7, 1fr);
            gap: 12px;
          }
        }
        .rtd-photo {
          aspect-ratio: 3/4;
          background: linear-gradient(135deg, #3a3b3a 0%, #1a1b1a 100%);
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        .rtd-photo img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .rtd-photo::after {
          content: 'Photo coming soon';
          position: absolute;
          bottom: 8px;
          left: 8px;
          font-family: "Fira Sans", sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .rtd-photo.has-img::after { content: none; }

        /* ── 7. Keep Riding ──────────────────────────────── */
        .rtd-keep {
          padding: 28px 0 56px;
        }
        .rtd-keep-header {
          text-align: center;
          margin-bottom: 22px;
        }
        .rtd-keep-header h2 {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--rt-ink);
          margin: 0;
        }
        .rtd-keep-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .rtd-keep-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
        }
        .rtd-keep-card {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 10px;
          overflow: hidden;
          background: #2A2B2A;
          color: #fff;
          text-decoration: none;
          isolation: isolate;
          display: block;
        }
        .rtd-keep-card img {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 0;
          transition: transform 0.4s ease;
        }
        .rtd-keep-card:hover img { transform: scale(1.04); }
        .rtd-keep-card-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%);
        }
        .rtd-keep-card-body {
          position: absolute;
          left: 16px;
          right: 56px;
          bottom: 14px;
          z-index: 2;
        }
        .rtd-keep-card-name {
          font-family: "Inter", "Fira Sans", sans-serif;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 2px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .rtd-keep-card-region {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          margin: 0;
        }
        .rtd-keep-card-arrow {
          position: absolute;
          right: 14px;
          bottom: 14px;
          z-index: 2;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── 8. Join the Ride ────────────────────────────── */
        .rtd-join {
          position: relative;
          color: #fff;
          padding: 70px 24px;
          text-align: center;
          overflow: hidden;
          isolation: isolate;
          background: #1a1a1a;
        }
        .rtd-join-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(180deg, rgba(20,20,20,0.55), rgba(20,20,20,0.85)),
            url("https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Oregon%20session%20the%20Ride.png") center/cover no-repeat,
            linear-gradient(135deg, #243a2c 0%, #1a1a1a 100%);
        }
        .rtd-join h2 {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 3.5vw, 44px);
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: #fff;
          margin: 0 0 8px;
        }
        .rtd-join p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 15px;
          color: rgba(255,255,255,0.78);
          margin: 0 0 24px;
        }
        .rtd-join-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--rt-green-mid);
          color: #fff;
          border-radius: 4px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s;
        }
        .rtd-join-cta:hover { background: var(--rt-green-bright); }
      `}</style>

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="rtd-hero">
        <div className="rtd-hero-bg">
          <img src={HERO_IMAGE} alt="Oregon Coast Sessions" />
        </div>
        <div className="rtd-hero-scrim" />
        <div className="rtd-hero-inner">
          <h1>OREGON COAST<br />SESSIONS</h1>
          <p className="rtd-hero-tagline">Where ocean views meet smooth sessions.</p>
          <div className="rtd-pills">
            <span className="rtd-pill"><span className="rtd-pill-dot amber" /> Oregon Coast</span>
            <span className="rtd-pill"><span className="rtd-pill-dot teal" /> Coastal</span>
            <span className="rtd-pill"><span className="rtd-pill-dot green" /> Featured Trip</span>
          </div>
          <button type="button" className="rtd-save-btn">
            <Bookmark size={14} /> Save Trip
          </button>
        </div>
      </section>

      {/* ── 2. Stat strip ───────────────────────────────── */}
      <div className="rtd-wrap">
        <div className="rtd-stats" aria-label="Trip overview">
          <div className="rtd-stat">
            <Sun className="rtd-stat-icon" strokeWidth={1.6} />
            <div>
              <p className="rtd-stat-label">Best For</p>
              <p className="rtd-stat-value">Sunsets, scenic stops,<br />relaxed sessions</p>
            </div>
          </div>
          <div className="rtd-stat">
            <Route className="rtd-stat-icon" strokeWidth={1.6} />
            <div>
              <p className="rtd-stat-label">Route Type</p>
              <p className="rtd-stat-value">Highway 101<br />coastal drive</p>
            </div>
          </div>
          <div className="rtd-stat">
            <Clock className="rtd-stat-icon" strokeWidth={1.6} />
            <div>
              <p className="rtd-stat-label">Duration</p>
              <p className="rtd-stat-value">1–3 days</p>
            </div>
          </div>
          <div className="rtd-stat">
            <Waves className="rtd-stat-icon" strokeWidth={1.6} />
            <div>
              <p className="rtd-stat-label">Vibe</p>
              <p className="rtd-stat-value">Laid-back /<br />scenic / social</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. The Ride + Map ───────────────────────────── */}
      <section className="rtd-ride">
        <div className="rtd-wrap rtd-ride-grid">
          <div className="rtd-ride-copy">
            <span className="rtd-eyebrow">The Ride</span>
            <h2>Cruise the coast. Stop where it feels right.</h2>
            <p>
              Pacific Coast Highway as cliffs drop into the ocean and every turn opens
              up another view worth stopping for. This trip isn&rsquo;t about
              rushing&mdash;it&rsquo;s about finding your spots, setting up, and letting
              the day unfold.
            </p>
            <Link href="#stops" className="rtd-ride-link">
              That&rsquo;s the session way <ArrowRight size={14} />
            </Link>
          </div>

          {/* Route map — Oregon coast session photo standing in for the
              illustrated map placeholder. Inherits .rtd-map's aspect-ratio
              16/10, border-radius, and overflow:hidden so the image fits
              the same slot the SVG corridor used to occupy. */}
          <div className="rtd-map" aria-label="Oregon Coast route">
            <img
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Road-Trips/Oregon/Oregon%20session%20the%20Ride.png"
              alt="Oregon Coast Sessions — the ride"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── 4. Featured Stops ───────────────────────────── */}
      <section id="stops" className="rtd-stops">
        <div className="rtd-wrap">
          <div className="rtd-stops-header">
            <span className="rtd-eyebrow">Featured Stops</span>
            <h2>Three pull-offs. One unforgettable drive.</h2>
          </div>
          <div className="rtd-stops-grid">
            {STOPS.map(stop => (
              <article key={stop.n} className="rtd-stop">
                <div className="rtd-stop-img">
                  {stop.image ? <img src={stop.image} alt={stop.name} /> : null}
                  <span className="rtd-stop-num">{stop.n}</span>
                </div>
                <div className="rtd-stop-body">
                  <h3>{stop.name}</h3>
                  <ul>
                    {stop.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                  <Link href={`#${stop.n}`} className="rtd-stop-cta">
                    View Details <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Pack Your Ride ───────────────────────────── */}
      <section className="rtd-kits">
        <div className="rtd-wrap">
          <div className="rtd-kits-header">
            <h2>PACK YOUR RIDE</h2>
            <p>Everything you need for this trip.</p>
          </div>
          <div className="rtd-kits-grid">
            {KITS.map(kit => (
              <article key={kit.name} className="rtd-kit">
                <div className={`rtd-kit-img ${kit.image ? '' : 'placeholder'}`}>
                  {kit.image ? <img src={kit.image} alt={kit.name} /> : null}
                </div>
                <div className="rtd-kit-scrim" />
                <span className="rtd-kit-icon" aria-hidden="true">
                  <Sparkles size={16} strokeWidth={1.8} />
                </span>
                <div className="rtd-kit-body">
                  <h3>{kit.name}</h3>
                  <p>{kit.blurb}</p>
                  <Link href={kit.href} className="rtd-kit-cta">
                    {kit.cta} <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Community gallery ────────────────────────── */}
      <section className="rtd-community">
        <div className="rtd-wrap">
          <div className="rtd-community-header">
            <div>
              <h2>From the Highway 420 Community</h2>
              <p>Real sessions from the road. Tag #RideHighway420 to be featured.</p>
            </div>
            <Link href="#share" className="rtd-community-share">
              Share Your Session <ArrowRight size={12} />
            </Link>
          </div>
          <div className="rtd-community-grid">
            {COMMUNITY_PHOTOS.map((src, i) => (
              <div key={src} className="rtd-photo has-img">
                <img src={src} alt={`Highway 420 community session ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Keep Riding ──────────────────────────────── */}
      <section className="rtd-keep">
        <div className="rtd-wrap">
          <div className="rtd-keep-header">
            <h2>KEEP RIDING</h2>
          </div>
          <div className="rtd-keep-grid">
            {KEEP_RIDING.map(t => (
              <Link key={t.href} href={t.href} className="rtd-keep-card" aria-label={`Explore ${t.name}`}>
                {t.image ? <img src={t.image} alt={t.name} /> : null}
                <div className="rtd-keep-card-scrim" />
                <div className="rtd-keep-card-body">
                  <p className="rtd-keep-card-name">{t.name}</p>
                  <p className="rtd-keep-card-region">{t.region}</p>
                </div>
                <span className="rtd-keep-card-arrow" aria-hidden="true">
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Join the Ride ────────────────────────────── */}
      <section className="rtd-join">
        <div className="rtd-join-bg" />
        <h2>JOIN THE RIDE</h2>
        <p>Discover new spots. Share your own.</p>
        <Link href="#featured" className="rtd-join-cta">
          Get Featured <ArrowRight size={14} />
        </Link>
      </section>

    </div>
  );
}
