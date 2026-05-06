"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import {
  Tag,
  DollarSign,
  Package,
  Gift,
  Users,
  ArrowRight,
  Mail,
  Phone,
  ShieldCheck,
  X,
  Star,
  User as UserIcon,
  Lock,
  ShoppingBag,
} from "lucide-react";
import GlobalMasthead from "../components/GlobalMasthead";

const ASSETS =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets";

// Hero hero photo — closest existing atmospheric shot in our library.
// Swap to a dedicated VIP hero (model + van + sunset per the mockup) when one
// is uploaded to Highway420_assets.
const HERO_IMAGE = `${ASSETS}/Road-Trips/General%20Community/Vintage%20camper%20van%20in%20mountain%20clearing.png`;
// VIP form product shot (H420 hat + THCA flower bag composition)
const FORM_PRODUCT_IMAGE = `${ASSETS}/RideWithUs/420%20emembership%20product%20image.png`;

export default function H420VipClient() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/community/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Use the local part of the email as a friendly fallback name.
          // Existing endpoint requires fullName; phone is sent as additional
          // metadata and currently ignored server-side.
          fullName: email.split("@")[0] || "VIP Member",
          email,
          phone: phone || undefined,
          source: "h420-vip",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to join. Please try again.");
      }
      setSuccess(true);
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function scrollToForm() {
    document.getElementById("vip-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <GlobalMasthead />

      <style>{`
        :root {
          --vip-cream: #F4EFE3;
          --vip-cream-2: #EAE3D2;
          --vip-ink: #1c1208;
          --vip-muted: #5b6560;
          --vip-forest: #1F4D2E;
          --vip-forest-mid: #2F6B3A;
          --vip-forest-bright: #1B7A4D;
          --vip-line: rgba(31, 77, 46, 0.18);
        }

        .vip-shell { background: #ffffff; min-height: 100vh; }

        /* ── Hero ──────────────────────────────────────── */
        .vip-hero {
          position: relative;
          min-height: clamp(520px, 75vh, 720px);
          color: #fff;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          align-items: center;
          background: #1a1a1a;
        }
        .vip-hero-bg, .vip-hero-bg img {
          position: absolute; inset: 0; z-index: -2;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
        }
        .vip-hero-scrim {
          position: absolute; inset: 0; z-index: -1;
          background:
            linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0) 100%),
            linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
        }
        .vip-hero-inner {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 56px 24px;
        }
        .vip-hero-shield {
          display: inline-block;
          margin-bottom: 36px;
        }
        .vip-hero-shield img {
          height: 84px;
          width: auto;
          filter: drop-shadow(0 4px 14px rgba(0,0,0,0.4));
        }
        .vip-hero h1 {
          font-family: 'BebasNeue','Bebas Neue','Impact',sans-serif;
          font-weight: 400;
          font-size: clamp(56px, 9vw, 110px);
          line-height: 0.92;
          letter-spacing: 0.01em;
          margin: 0 0 20px;
          text-shadow: 0 4px 22px rgba(0,0,0,0.45);
          max-width: 720px;
          text-transform: uppercase;
        }
        .vip-hero h1 span.accent {
          color: #C8D5B9;
        }
        .vip-hero-tagline {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: clamp(15px, 1.6vw, 18px);
          font-weight: 500;
          margin: 0 0 30px;
          max-width: 460px;
          color: rgba(255,255,255,0.92);
          line-height: 1.45;
        }
        .vip-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 32px;
          background: var(--vip-forest);
          color: #fff;
          border-radius: 4px;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .vip-hero-cta:hover { background: var(--vip-forest-bright); transform: translateY(-1px); }

        /* Trust pills row under CTA */
        .vip-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 28px;
          margin-top: 40px;
        }
        .vip-trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-family: 'Fira Sans','Inter',sans-serif;
        }
        .vip-trust-pill-icon {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1.5px solid rgba(200, 213, 185, 0.6);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #C8D5B9;
          flex-shrink: 0;
        }
        .vip-trust-pill-text {
          color: rgba(255,255,255,0.9);
          font-size: 12px;
          font-weight: 600;
          line-height: 1.3;
          letter-spacing: 0.02em;
        }
        .vip-trust-pill-text strong {
          color: #fff;
          font-weight: 700;
        }
        .vip-trust-pill-text small {
          display: block;
          color: rgba(255,255,255,0.7);
          font-weight: 400;
          font-size: 11px;
        }

        /* ── Section: Perks ─────────────────────────────── */
        .vip-perks {
          background: var(--vip-cream);
          padding: 80px 24px;
        }
        .vip-section-header {
          text-align: center;
          margin: 0 auto 56px;
          max-width: 760px;
        }
        .vip-eyebrow {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--vip-forest-mid);
          margin: 0 0 14px;
        }
        .vip-section-title {
          font-family: 'BebasNeue','Bebas Neue','Impact',sans-serif;
          font-weight: 400;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1;
          letter-spacing: 0.02em;
          color: var(--vip-ink);
          margin: 0 0 14px;
        }
        .vip-section-deck {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 15px;
          color: var(--vip-muted);
          margin: 0;
          line-height: 1.5;
        }
        .vip-perks-grid {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px 28px;
        }
        @media (min-width: 640px) {
          .vip-perks-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .vip-perks-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 28px;
          }
          .vip-perks-grid > * + *::before {
            content: '';
            position: absolute;
            left: -14px;
            top: 8px;
            bottom: 8px;
            width: 1px;
            background: var(--vip-line);
          }
        }
        .vip-perk {
          position: relative;
          text-align: center;
          padding: 0 14px;
        }
        .vip-perk-icon {
          width: 78px; height: 78px;
          border-radius: 50%;
          background: rgba(31, 77, 46, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--vip-forest);
          margin: 0 auto 18px;
        }
        .vip-perk h3 {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--vip-forest);
          margin: 0 0 12px;
        }
        .vip-perk p {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 14px;
          color: var(--vip-ink);
          margin: 0;
          line-height: 1.5;
        }

        /* ── Community trust card ─────────────────────── */
        .vip-community-wrap {
          max-width: 1120px;
          margin: 56px auto 0;
          padding: 0 24px;
        }
        .vip-community {
          background: #ffffff;
          border: 1px solid var(--vip-line);
          border-radius: 12px;
          padding: 22px 28px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          align-items: center;
          box-shadow: 0 2px 12px rgba(31, 77, 46, 0.04);
        }
        @media (min-width: 768px) {
          .vip-community { grid-template-columns: auto 1fr auto; gap: 22px; }
        }
        .vip-community-icon {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(31, 77, 46, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--vip-forest);
          flex-shrink: 0;
        }
        .vip-community-copy h4 {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--vip-ink);
          margin: 0 0 4px;
        }
        .vip-community-copy p {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 14px;
          color: var(--vip-muted);
          margin: 0;
          line-height: 1.4;
        }
        .vip-community-stat {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .vip-community-avatars {
          display: inline-flex;
        }
        .vip-community-avatars span {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid #fff;
          background: linear-gradient(135deg, #2F6B3A, #1B7A4D);
          margin-left: -8px;
          display: inline-block;
        }
        .vip-community-avatars span:first-child { margin-left: 0; }
        .vip-community-stat-text {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--vip-forest);
        }

        /* ── Form Section ──────────────────────────────── */
        .vip-form-section {
          background: var(--vip-cream);
          padding: 0 0 80px;
        }
        .vip-form-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
          align-items: stretch;
        }
        @media (min-width: 900px) {
          .vip-form-grid { grid-template-columns: 1fr 1fr; }
        }
        .vip-form-image {
          position: relative;
          background: linear-gradient(135deg, #2A2B2A 0%, #1A1B1A 100%);
          min-height: 420px;
          overflow: hidden;
        }
        .vip-form-image img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .vip-form-card {
          background: #fff;
          padding: 56px 48px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .vip-form-eyebrow {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--vip-forest-mid);
          text-align: center;
          margin: 0 0 12px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .vip-form-eyebrow::before,
        .vip-form-eyebrow::after {
          content: '';
          flex: 0 0 28px;
          height: 1px;
          background: var(--vip-forest-mid);
        }
        .vip-form-card h2 {
          font-family: 'BebasNeue','Bebas Neue','Impact',sans-serif;
          font-weight: 400;
          font-size: clamp(34px, 4vw, 46px);
          line-height: 1;
          letter-spacing: 0.02em;
          text-align: center;
          color: var(--vip-ink);
          margin: 0 0 16px;
        }
        .vip-form-card .lead {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 15px;
          color: var(--vip-muted);
          text-align: center;
          margin: 0 0 28px;
          line-height: 1.5;
        }
        .vip-form-card .lead strong {
          color: var(--vip-ink);
          font-weight: 700;
        }
        .vip-input-row {
          position: relative;
          margin-bottom: 12px;
        }
        .vip-input-row input {
          width: 100%;
          padding: 14px 44px 14px 16px;
          border: 1px solid var(--vip-line);
          border-radius: 4px;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 15px;
          color: var(--vip-ink);
          background: #fff;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .vip-input-row input::placeholder {
          color: rgba(91, 101, 96, 0.6);
        }
        .vip-input-row input:focus {
          border-color: var(--vip-forest-mid);
        }
        .vip-input-row .icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--vip-muted);
          pointer-events: none;
        }
        .vip-form-submit {
          width: 100%;
          padding: 16px;
          margin-top: 6px;
          background: var(--vip-forest);
          color: #fff;
          border: none;
          border-radius: 4px;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .vip-form-submit:hover { background: var(--vip-forest-bright); }
        .vip-form-submit[disabled] { opacity: 0.6; cursor: not-allowed; }
        .vip-form-fineprint {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 18px 0 0;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 12px;
          color: var(--vip-muted);
          line-height: 1.4;
        }
        .vip-form-fineprint svg { flex-shrink: 0; margin-top: 2px; color: var(--vip-forest-mid); }
        .vip-form-error {
          padding: 10px 12px;
          margin-bottom: 12px;
          background: rgba(178, 58, 72, 0.08);
          border: 1px solid rgba(178, 58, 72, 0.3);
          border-radius: 4px;
          color: #B23A48;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 13px;
        }
        .vip-form-success {
          text-align: center;
          padding: 40px 16px;
        }
        .vip-form-success-check {
          width: 64px; height: 64px;
          border-radius: 50%;
          background: var(--vip-forest);
          color: #fff;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 800;
        }
        .vip-form-success h3 {
          font-family: 'BebasNeue','Bebas Neue','Impact',sans-serif;
          font-weight: 400;
          font-size: 32px;
          letter-spacing: 0.02em;
          margin: 0 0 8px;
          color: var(--vip-forest);
        }
        .vip-form-success p {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 14px;
          color: var(--vip-muted);
          margin: 0;
        }

        /* ── How It Works ──────────────────────────────── */
        .vip-how {
          background: linear-gradient(180deg, #1B4332 0%, #0E2A1F 100%);
          color: #fff;
          padding: 80px 24px;
        }
        .vip-how .vip-eyebrow {
          color: #C8D5B9;
          text-align: center;
          display: block;
        }
        .vip-how .vip-eyebrow::before,
        .vip-how .vip-eyebrow::after {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: rgba(200, 213, 185, 0.6);
          vertical-align: middle;
          margin: 0 12px;
        }
        .vip-how-title {
          font-family: 'BebasNeue','Bebas Neue','Impact',sans-serif;
          font-weight: 400;
          font-size: clamp(36px, 5vw, 56px);
          letter-spacing: 0.02em;
          text-align: center;
          color: #fff;
          margin: 0 0 56px;
        }
        .vip-how-grid {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          position: relative;
        }
        @media (min-width: 768px) {
          .vip-how-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }
        .vip-how-step {
          text-align: center;
          position: relative;
        }
        .vip-how-step-num {
          position: absolute;
          left: 50%;
          transform: translateX(-50%) translateY(-12px);
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #C8D5B9;
          color: var(--vip-forest);
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .vip-how-step-icon {
          width: 90px; height: 90px;
          border-radius: 50%;
          border: 1.5px solid rgba(200, 213, 185, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C8D5B9;
          margin: 0 auto 22px;
        }
        .vip-how-step h4 {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #C8D5B9;
          margin: 0 0 12px;
        }
        .vip-how-step p {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.78);
          margin: 0;
          line-height: 1.5;
          max-width: 240px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Bottom trust strip ───────────────────────── */
        .vip-trust-strip {
          background: #0E2A1F;
          padding: 32px 24px;
          border-top: 1px solid rgba(200, 213, 185, 0.16);
        }
        .vip-trust-strip-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }
        @media (min-width: 768px) {
          .vip-trust-strip-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .vip-trust-strip-item {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #fff;
        }
        .vip-trust-strip-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(200, 213, 185, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C8D5B9;
          flex-shrink: 0;
        }
        .vip-trust-strip-text {
          font-family: 'Fira Sans','Inter',sans-serif;
        }
        .vip-trust-strip-text strong {
          display: block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C8D5B9;
          margin-bottom: 2px;
        }
        .vip-trust-strip-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.78);
          line-height: 1.3;
        }
      `}</style>

      <div className="vip-shell">
        {/* ── 1. Hero ────────────────────────────── */}
        <section className="vip-hero">
          <div className="vip-hero-bg">
            <img src={HERO_IMAGE} alt="Highway 420 community at sunset" />
          </div>
          <div className="vip-hero-scrim" />
          <div className="vip-hero-inner">
            <div className="vip-hero-shield" aria-hidden="true">
              <img
                src={`${ASSETS}/assets/Highway420%20Sign.png`}
                alt="Highway 420 sign"
              />
            </div>
            <h1>
              Join the Ride.<br />
              <span className="accent">Unlock VIP Perks.</span>
            </h1>
            <p className="vip-hero-tagline">
              Early access. Exclusive drops.<br />
              Better prices. Better sessions.
            </p>
            <button
              type="button"
              className="vip-hero-cta"
              onClick={scrollToForm}
            >
              Get VIP Access — It&rsquo;s Free <ArrowRight size={16} />
            </button>

            <div className="vip-trust-row">
              <span className="vip-trust-pill">
                <span className="vip-trust-pill-icon"><Tag size={14} strokeWidth={1.8} /></span>
                <span className="vip-trust-pill-text"><strong>100% FREE</strong><small>to join</small></span>
              </span>
              <span className="vip-trust-pill">
                <span className="vip-trust-pill-icon"><DollarSign size={14} strokeWidth={1.8} /></span>
                <span className="vip-trust-pill-text"><strong>No spam.</strong><small>Just perks.</small></span>
              </span>
              <span className="vip-trust-pill">
                <span className="vip-trust-pill-icon"><Lock size={14} strokeWidth={1.8} /></span>
                <span className="vip-trust-pill-text"><strong>Opt out</strong><small>anytime.</small></span>
              </span>
              <span className="vip-trust-pill">
                <span className="vip-trust-pill-icon"><ShieldCheck size={14} strokeWidth={1.8} /></span>
                <span className="vip-trust-pill-text"><strong>No purchase</strong><small>required.</small></span>
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. Perks ───────────────────────────── */}
        <section className="vip-perks">
          <header className="vip-section-header">
            <p className="vip-eyebrow">VIP Perks</p>
            <h2 className="vip-section-title">More Perks. Better Sessions.</h2>
            <p className="vip-section-deck">
              Exclusive benefits that elevate every part of your journey.
            </p>
          </header>

          <div className="vip-perks-grid">
            <article className="vip-perk">
              <div className="vip-perk-icon"><Tag size={32} strokeWidth={1.6} /></div>
              <h3>Early Access</h3>
              <p>Be the first to shop new drops before anyone else.</p>
            </article>
            <article className="vip-perk">
              <div className="vip-perk-icon"><DollarSign size={32} strokeWidth={1.6} /></div>
              <h3>Member Pricing</h3>
              <p>Get exclusive pricing and guaranteed lowest prices.</p>
            </article>
            <article className="vip-perk">
              <div className="vip-perk-icon"><Package size={32} strokeWidth={1.6} /></div>
              <h3>Exclusive Drops</h3>
              <p>Access members-only products, bundles, and limited editions.</p>
            </article>
            <article className="vip-perk">
              <div className="vip-perk-icon"><Gift size={32} strokeWidth={1.6} /></div>
              <h3>Free Gifts &amp; Testers</h3>
              <p>Enjoy free gifts and tester products on select orders.</p>
            </article>
          </div>

          {/* ── Community trust card ── */}
          <div className="vip-community-wrap">
            <div className="vip-community">
              <span className="vip-community-icon"><Users size={28} strokeWidth={1.6} /></span>
              <div className="vip-community-copy">
                <h4>Join a Community That Rides Together.</h4>
                <p>More than discounts &mdash; join thousands of members who live for the ride.</p>
              </div>
              <div className="vip-community-stat">
                <span className="vip-community-avatars" aria-hidden="true">
                  <span /><span /><span /><span /><span />
                </span>
                <span className="vip-community-stat-text">Thousands<br />of Members</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Form ─────────────────────────────── */}
        <section id="vip-form" className="vip-form-section">
          <div className="vip-form-grid">
            <div className="vip-form-image">
              <img src={FORM_PRODUCT_IMAGE} alt="Highway 420 VIP gear and travel kit" />
            </div>
            <div className="vip-form-card">
              <p className="vip-form-eyebrow">Join the Ride</p>
              <h2>Become a VIP Member</h2>

              {success ? (
                <div className="vip-form-success">
                  <div className="vip-form-success-check">✓</div>
                  <h3>You&rsquo;re on the list.</h3>
                  <p>Watch your inbox for early access, drops, and member-only perks.</p>
                </div>
              ) : (
                <>
                  <p className="lead">
                    <strong>Sign up free</strong> and start unlocking exclusive perks, early access, and more.
                  </p>
                  <form onSubmit={handleSubmit}>
                    {error && <div className="vip-form-error">{error}</div>}

                    <div className="vip-input-row">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                      <Mail className="icon" size={18} strokeWidth={1.6} />
                    </div>

                    <div className="vip-input-row">
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="Phone Number (optional)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                      />
                      <Phone className="icon" size={18} strokeWidth={1.6} />
                    </div>

                    <button
                      type="submit"
                      className="vip-form-submit"
                      disabled={loading}
                    >
                      {loading ? "Signing You Up…" : <>Get VIP Access — It&rsquo;s Free <ArrowRight size={14} /></>}
                    </button>

                    <p className="vip-form-fineprint">
                      <Lock size={14} strokeWidth={1.8} />
                      <span>No spam. Just early access and exclusive perks. Opt out anytime.</span>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── 4. How It Works ─────────────────────── */}
        <section className="vip-how">
          <p className="vip-eyebrow">How It Works</p>
          <h2 className="vip-how-title">Join. Unlock. Enjoy.</h2>

          <div className="vip-how-grid">
            <div className="vip-how-step">
              <span className="vip-how-step-num">1</span>
              <div className="vip-how-step-icon"><UserIcon size={36} strokeWidth={1.4} /></div>
              <h4>Join For Free</h4>
              <p>Sign up in seconds and become a VIP member.</p>
            </div>
            <div className="vip-how-step">
              <span className="vip-how-step-num">2</span>
              <div className="vip-how-step-icon"><Lock size={36} strokeWidth={1.4} /></div>
              <h4>Unlock Perks</h4>
              <p>Get early access, exclusive deals, and member-only benefits.</p>
            </div>
            <div className="vip-how-step">
              <span className="vip-how-step-num">3</span>
              <div className="vip-how-step-icon"><ShoppingBag size={36} strokeWidth={1.4} /></div>
              <h4>Shop Smarter</h4>
              <p>Score the best products, prices, and perks every time you shop.</p>
            </div>
          </div>
        </section>

        {/* ── 5. Bottom trust strip ──────────────── */}
        <section className="vip-trust-strip">
          <div className="vip-trust-strip-grid">
            <div className="vip-trust-strip-item">
              <span className="vip-trust-strip-icon"><ShieldCheck size={20} strokeWidth={1.8} /></span>
              <div className="vip-trust-strip-text">
                <strong>100% Secure</strong>
                <span>Your information is safe with us.</span>
              </div>
            </div>
            <div className="vip-trust-strip-item">
              <span className="vip-trust-strip-icon"><DollarSign size={20} strokeWidth={1.8} /></span>
              <div className="vip-trust-strip-text">
                <strong>Free To Join</strong>
                <span>It&rsquo;s free to join and always will be.</span>
              </div>
            </div>
            <div className="vip-trust-strip-item">
              <span className="vip-trust-strip-icon"><X size={20} strokeWidth={1.8} /></span>
              <div className="vip-trust-strip-text">
                <strong>Cancel Anytime</strong>
                <span>No commitments. Cancel anytime.</span>
              </div>
            </div>
            <div className="vip-trust-strip-item">
              <span className="vip-trust-strip-icon"><Star size={20} strokeWidth={1.8} /></span>
              <div className="vip-trust-strip-text">
                <strong>Member Only</strong>
                <span>Perks and products just for you.</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
