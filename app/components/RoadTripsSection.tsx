"use client";

import Link from "next/link";

// ─── Road Trip data ───────────────────────────────────────────────────────────
// One featured trip (large left card) + three secondary trips (stacked right).
// Leave `image` empty while uploading — a dark placeholder will render.

type RoadTrip = {
  name: string;
  tagline: string;
  route: string;
  image: string;
};

const FEATURED: RoadTrip = {
  name: "Oregon Coast Sessions",
  tagline: "Where ocean views meet smooth sessions.",
  route: "/road-trips/oregon-coast",
  image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RoadTrips_Home/Oregon%20Coastal%20Sessions.png",
};

const SECONDARY: RoadTrip[] = [
  {
    name: "Malibu Sessions",
    tagline: "Coastal views. Easy vibes.",
    route: "/road-trips/malibu",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RoadTrips_Home/Malibu%20Sessions.png",
  },
  {
    name: "Denver Cannabis Fest",
    tagline: "Crowds, music, and elevated energy.",
    route: "/road-trips/denver-fest",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RoadTrips_Home/Denver%20Cannabis%20Sessions.png",
  },
  {
    name: "Austin Chill Spot",
    tagline: "Laid-back hangs. Local flavor.",
    route: "/road-trips/austin",
    image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RoadTrips_Home/Austin%20Chill%20Sessions.png",
  },
];

const EXPLORE_ALL_ROUTE = "/road-trips";

// ─── Section ──────────────────────────────────────────────────────────────────
export default function RoadTripsSection() {
  return (
    <section className="rt-section">
      <style>{`
        .rt-section {
          background: #F5F5F0;
          padding: 56px 0;
        }
        .rt-wrap {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 16px;
        }
        @media (min-width: 640px) {
          .rt-wrap { padding: 0 24px; }
        }

        /* ── Header ── */
        .rt-header { margin-bottom: 22px; }
        .rt-eyebrow {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2F6B3A;
          margin: 0 0 4px;
          display: inline-block;
          border-bottom: 2px solid #2F6B3A;
          padding-bottom: 4px;
        }
        .rt-title {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(34px, 5vw, 64px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.02;
          color: #111111;
          margin: 10px 0 6px;
        }
        .rt-tagline {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 15px;
          color: #5B6560;
          margin: 0;
        }

        /* ── Grid ── */
        .rt-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 1024px) {
          .rt-grid {
            grid-template-columns: 1.7fr 1fr;
            gap: 18px;
          }
        }

        /* Featured (large) */
        .rt-featured {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 12px;
          background: #1A1A1A;
          aspect-ratio: 4 / 3;
          text-decoration: none;
          color: #ffffff;
          isolation: isolate;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        @media (min-width: 1024px) {
          .rt-featured { aspect-ratio: auto; height: 100%; min-height: 560px; }
        }
        .rt-featured:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.22);
        }

        /* Secondary column */
        .rt-secondary {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .rt-secondary { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .rt-secondary { gap: 18px; }
        }

        .rt-card {
          position: relative;
          display: block;
          overflow: hidden;
          border-radius: 12px;
          background: #1A1A1A;
          aspect-ratio: 16 / 9;
          text-decoration: none;
          color: #ffffff;
          isolation: isolate;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        @media (min-width: 1024px) {
          .rt-card { aspect-ratio: auto; flex: 1; min-height: 175px; }
        }
        .rt-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.22);
        }

        /* Shared media / scrim */
        .rt-media {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .rt-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .rt-featured:hover .rt-media img,
        .rt-card:hover .rt-media img {
          transform: scale(1.04);
        }
        .rt-placeholder {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2A2B2A 0%, #1A1B1A 100%);
        }
        .rt-placeholder::after {
          content: "Image coming soon";
          position: absolute;
          top: 12px;
          right: 12px;
          font-family: "Fira Sans", sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .rt-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0) 40%,
            rgba(0,0,0,0.35) 70%,
            rgba(0,0,0,0.80) 100%
          );
          z-index: 1;
        }

        /* Featured body */
        .rt-featured__body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 28px 32px;
        }
        .rt-featured__title {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.05;
          color: #ffffff;
          margin: 0 0 6px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .rt-featured__tagline {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          margin: 0 0 18px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .rt-featured__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: rgba(255,255,255,0.95);
          color: #111111;
          border-radius: 4px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .rt-featured:hover .rt-featured__cta {
          background: #ffffff;
        }
        .rt-featured__cta span {
          transition: transform 0.2s ease;
        }
        .rt-featured:hover .rt-featured__cta span {
          transform: translateX(3px);
        }

        /* Secondary card body */
        .rt-card__body {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          padding: 18px 20px;
          padding-right: 64px;
        }
        .rt-card__title {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(18px, 1.6vw, 22px);
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.1;
          color: #ffffff;
          margin: 0 0 4px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .rt-card__tagline {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.88);
          line-height: 1.3;
          margin: 0;
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .rt-card__arrow {
          position: absolute;
          right: 16px;
          bottom: 16px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111;
          font-size: 16px;
          font-weight: 700;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .rt-card:hover .rt-card__arrow {
          transform: translateX(3px);
        }

        /* ── Footer CTA bar ── */
        .rt-footer {
          margin-top: 20px;
          background: #EFEFEA;
          border-radius: 10px;
          padding: 18px 24px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .rt-footer {
            grid-template-columns: auto 1fr auto;
            gap: 20px;
          }
        }
        .rt-footer__left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .rt-footer__icon {
          font-size: 28px;
          line-height: 1;
          color: #2F6B3A;
          flex-shrink: 0;
        }
        .rt-footer__copy {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 14px;
          color: #3C3C3A;
          line-height: 1.35;
          margin: 0;
        }
        .rt-footer__divider {
          display: none;
        }
        @media (min-width: 768px) {
          .rt-footer__divider {
            display: block;
            width: 1px;
            height: 38px;
            background: #D9D9D3;
            justify-self: start;
          }
        }
        .rt-footer__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          background: #1F4D2E;
          color: #ffffff;
          border-radius: 6px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .rt-footer__cta:hover {
          background: #2F6B3A;
        }
        .rt-footer__cta span {
          transition: transform 0.2s ease;
        }
        .rt-footer__cta:hover span {
          transform: translateX(3px);
        }
      `}</style>

      <div className="rt-wrap">
        {/* ── Header ── */}
        <header className="rt-header">
          <span className="rt-eyebrow">Road Trips</span>
          <h2 className="rt-title">Find Your Next Session</h2>
          <p className="rt-tagline">Spots. Scenes. Sessions. Across the Highway.</p>
        </header>

        {/* ── Grid: Featured + Secondary ── */}
        <div className="rt-grid">
          {/* Featured card */}
          <Link href={FEATURED.route} className="rt-featured" aria-label={`Explore ${FEATURED.name}`}>
            <div className="rt-media">
              {FEATURED.image ? (
                <img src={FEATURED.image} alt={FEATURED.name} loading="lazy" />
              ) : (
                <div className="rt-placeholder" aria-hidden="true" />
              )}
              <div className="rt-scrim" />
            </div>
            <div className="rt-featured__body">
              <h3 className="rt-featured__title">{FEATURED.name}</h3>
              <p className="rt-featured__tagline">{FEATURED.tagline}</p>
              <span className="rt-featured__cta">
                Explore This Trip <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          {/* Secondary column */}
          <div className="rt-secondary">
            {SECONDARY.map((trip) => (
              <Link
                key={trip.route}
                href={trip.route}
                className="rt-card"
                aria-label={`Explore ${trip.name}`}
              >
                <div className="rt-media">
                  {trip.image ? (
                    <img src={trip.image} alt={trip.name} loading="lazy" />
                  ) : (
                    <div className="rt-placeholder" aria-hidden="true" />
                  )}
                  <div className="rt-scrim" />
                </div>
                <div className="rt-card__body">
                  <h3 className="rt-card__title">{trip.name}</h3>
                  <p className="rt-card__tagline">{trip.tagline}</p>
                </div>
                <span className="rt-card__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Footer CTA bar ── */}
        <div className="rt-footer">
          <div className="rt-footer__left">
            <span className="rt-footer__icon" aria-hidden="true">🚐</span>
            <p className="rt-footer__copy">
              Curated spots, community picks,<br />
              and setups for every ride.
            </p>
          </div>
          <span className="rt-footer__divider" aria-hidden="true" />
          <Link href={EXPLORE_ALL_ROUTE} className="rt-footer__cta">
            Explore All Road Trips <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
