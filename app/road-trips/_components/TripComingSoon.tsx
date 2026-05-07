import Link from "next/link";
import { ArrowRight, ArrowLeft, Bookmark } from "lucide-react";
import GlobalMasthead from "../../components/GlobalMasthead";

type Pill = { label: string; dot: "amber" | "teal" | "green" };

export type TripComingSoonProps = {
  /** Display name e.g. "LAKE TAHOE ESCAPE" — shown as the hero h1 (forced uppercase by CSS). */
  name: string;
  /** Short tagline under the title. */
  tagline: string;
  /** Full-bleed hero image URL (Supabase). Empty string renders the dark placeholder. */
  heroImage: string;
  /** alt text for the hero image. */
  heroAlt: string;
  /** Tag pills under the tagline. 1-3 work best. */
  pills?: Pill[];
  /** Body paragraph(s) describing what's coming. */
  description?: string;
  /** Optional ETA text shown in the "Coming Soon" badge. */
  eta?: string;
};

/**
 * Stub page used while a road-trip detail page is being built. Renders the same
 * editorial chrome as the finished Oregon Coast template (hero + pills + dark
 * stat band placeholder + back-to-index CTA) so investors see something polished
 * instead of a 404 when they click a homepage road-trip card.
 *
 * Replace with a full template when content + photography land.
 */
export default function TripComingSoon({
  name,
  tagline,
  heroImage,
  heroAlt,
  pills = [],
  description,
  eta = "Coming Soon",
}: TripComingSoonProps) {
  return (
    <div style={{ backgroundColor: "#F5F5F0", minHeight: "100vh" }}>
      <GlobalMasthead />

      <style>{`
        :root {
          --rt-cream: #F5F5F0;
          --rt-ink: #111111;
          --rt-muted: #4b5563;
          --rt-green: #1F4D2E;
          --rt-green-mid: #2F6B3A;
          --rt-green-bright: #1B7A4D;
          --rt-amber: #D4A03E;
        }
        .tcs-hero {
          position: relative;
          min-height: clamp(440px, 70vh, 640px);
          color: #fff;
          overflow: hidden;
          isolation: isolate;
          display: flex;
          align-items: flex-end;
          background: #1a1a1a;
        }
        .tcs-hero-bg, .tcs-hero-bg img {
          position: absolute; inset: 0; z-index: -2;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }
        .tcs-hero-placeholder {
          position: absolute; inset: 0; z-index: -2;
          background: linear-gradient(135deg, #243a2c 0%, #1a1a1a 100%);
        }
        .tcs-hero-scrim {
          position: absolute; inset: 0; z-index: -1;
          background:
            linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0) 100%);
        }
        .tcs-hero-inner {
          width: 100%; max-width: 1440px;
          margin: 0 auto;
          padding: 48px 24px 64px;
        }
        .tcs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 160, 62, 0.18);
          border: 1px solid rgba(212, 160, 62, 0.6);
          color: #F4D58D;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 100px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          margin-bottom: 14px;
        }
        .tcs-eyebrow::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #D4A03E;
          box-shadow: 0 0 8px rgba(212, 160, 62, 0.8);
        }
        .tcs-hero h1 {
          font-family: 'BebasNeue','Bebas Neue','Impact',sans-serif;
          font-weight: 400;
          font-size: clamp(56px, 9vw, 116px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          margin: 0 0 14px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.45);
          max-width: 720px;
          text-transform: uppercase;
        }
        .tcs-tagline {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: clamp(15px, 1.6vw, 18px);
          font-weight: 500;
          margin: 0 0 18px;
          max-width: 520px;
          color: rgba(255,255,255,0.92);
        }
        .tcs-pills {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin: 0 0 22px;
        }
        .tcs-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 6px 12px;
          border-radius: 100px;
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .tcs-pill-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }
        .tcs-pill-dot.amber { background: #E08A33; }
        .tcs-pill-dot.teal  { background: #4FA3A6; }
        .tcs-pill-dot.green { background: var(--rt-green-bright); }

        /* Body */
        .tcs-body {
          max-width: 720px;
          margin: 0 auto;
          padding: 64px 24px 80px;
          text-align: center;
        }
        .tcs-body h2 {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--rt-ink);
          margin: 0 0 14px;
        }
        .tcs-body p {
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #3C3C3A;
          margin: 0 0 24px;
        }
        .tcs-actions {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          margin-top: 8px;
        }
        .tcs-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 4px;
          font-family: 'Fira Sans','Inter',sans-serif;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .tcs-btn-primary {
          background: var(--rt-green);
          color: #fff;
        }
        .tcs-btn-primary:hover {
          background: var(--rt-green-bright);
        }
        .tcs-btn-ghost {
          background: transparent;
          color: var(--rt-green);
          border: 1.5px solid var(--rt-green);
        }
        .tcs-btn-ghost:hover {
          background: var(--rt-green);
          color: #fff;
        }
      `}</style>

      <section className="tcs-hero">
        {heroImage ? (
          <div className="tcs-hero-bg">
            <img src={heroImage} alt={heroAlt} />
          </div>
        ) : (
          <div className="tcs-hero-placeholder" aria-hidden="true" />
        )}
        <div className="tcs-hero-scrim" />
        <div className="tcs-hero-inner">
          <span className="tcs-eyebrow">{eta}</span>
          <h1>{name}</h1>
          <p className="tcs-tagline">{tagline}</p>
          {pills.length > 0 && (
            <div className="tcs-pills">
              {pills.map(p => (
                <span key={p.label} className="tcs-pill">
                  <span className={`tcs-pill-dot ${p.dot}`} /> {p.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="tcs-body">
        <h2>This trip is in the works.</h2>
        <p>
          {description ??
            "We're collecting the photography, mapping the stops, and dialing in the gear recommendations. Want a heads-up when it's live? Subscribe below — or roll into one of our finished trips in the meantime."}
        </p>
        <div className="tcs-actions">
          <Link href="/road-trips/oregon-coast" className="tcs-btn tcs-btn-primary">
            <Bookmark size={14} /> See a Finished Trip
          </Link>
          <Link href="/road-trips" className="tcs-btn tcs-btn-ghost">
            <ArrowLeft size={14} /> All Road Trips
          </Link>
        </div>
      </section>
    </div>
  );
}
