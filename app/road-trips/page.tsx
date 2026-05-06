import React from "react";
import GlobalMasthead from "../components/GlobalMasthead";
import EssentialsFooter from "../components/EssentialsFooter";
import { Waves, Mountain, Sun, Building2, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Road Trips | Highway 420",
  description: "Discover spots, scenes, and sessions across the country.",
};

const ASSETS = "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets";
const COMMUNITY = `${ASSETS}/Road-Trips/General%20Community`;
const TRIPS = `${ASSETS}/Road-Trips`;

const HERO_IMG = `${COMMUNITY}/Road%20Trips%20landing%20hero.png`;
const BANNER_IMG = `${COMMUNITY}/Road%20Trips%20bottom%20image.png`;

const FEATURED_BIG_IMG = `${COMMUNITY}/Coastal%20stroll%20at%20sunset.png`;
const FEATURED_MOUNTAIN_IMG = `${COMMUNITY}/Golden%20hour%20on%20the%20mountain%20rock.png`;
const FEATURED_DESERT_IMG = `${COMMUNITY}/Desert%20road%20trip%20at%20sunset.png`;

const EXPLORE_MALIBU_IMG = `${TRIPS}/Malibu%20Sessions.png`;
const EXPLORE_DENVER_IMG = `${TRIPS}/Denver%20Cannabis%20Sessions.png`;
const EXPLORE_AUSTIN_IMG = `${TRIPS}/Austin%20Chill%20Sessions.png`;
const EXPLORE_TAHOE_IMG = `${COMMUNITY}/Vintage%20camper%20van%20in%20mountain%20clearing.png`;

const COMMUNITY_PHOTOS = [
  `${COMMUNITY}/Coastal%20stroll%20at%20sunset.png`,
  `${COMMUNITY}/Vintage%20camper%20van%20in%20mountain%20clearing.png`,
  `${COMMUNITY}/Golden%20hour%20on%20the%20mountain%20rock.png`,
  `${COMMUNITY}/Friends%20enjoying%20sunset%20on%20rooftop.png`,
  `${COMMUNITY}/Desert%20road%20trip%20at%20sunset.png`,
  `${COMMUNITY}/Beach%20day%20with%20a%20relaxing%20view.png`,
  `${COMMUNITY}/Relaxing%20in%20the%20cannabis%20lounge.png`,
  `${COMMUNITY}/Cali%20Roots.png`,
  `${COMMUNITY}/Chicago%20SMoke%20and%20Sound.png`,
  `${COMMUNITY}/Friends%20enjoying%20sunset%20on%20rooftop.png`,
  `${COMMUNITY}/Beach%20day%20with%20a%20relaxing%20view.png`,
];

export default function RoadTripsPage() {
  return (
    <div style={{ backgroundColor: "#F5F5F0", minHeight: "100vh" }}>
      <GlobalMasthead />

      <style>{`
        /* Shared Container */
        .rt-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Typography Defaults */
        h2, h3 {
          font-family: "BebasNeue", "Bebas Neue", "Impact", sans-serif;
          letter-spacing: 0.02em;
          margin: 0;
        }
        .rt-eyebrow {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2F6B3A;
        }
        
        /* ─── Shared backdrop image ─── */
        .rt-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          display: block;
        }

        /* ─── Hero Section ─── */
        .rt-hero {
          position: relative;
          height: clamp(400px, 60vh, 600px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2a2b2a; /* Fallback */
          color: #ffffff;
          text-align: center;
          overflow: hidden;
        }
        .rt-hero-placeholder {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%);
        }
        .rt-hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 24px;
        }
        .rt-hero h1 {
          font-family: "BebasNeue", "Bebas Neue", "Impact", sans-serif;
          font-size: clamp(60px, 10vw, 130px);
          line-height: 0.9;
          margin: 0 0 16px;
          text-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .rt-hero p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: clamp(16px, 2vw, 22px);
          font-weight: 500;
          max-width: 600px;
          margin: 0 0 32px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }
        .rt-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1B7A4D;
          color: #fff;
          padding: 14px 28px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 4px;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .rt-btn:hover {
          background: #145C3C;
          transform: translateY(-2px);
        }

        /* ─── Section Headers ─── */
        .rt-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid #d1d5db;
        }
        .rt-section-title {
          font-size: clamp(32px, 4vw, 42px);
          color: #111111;
        }
        .rt-view-all {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          text-decoration: none;
        }
        .rt-view-all:hover {
          color: #1B7A4D;
        }

        /* ─── Featured Trips ─── */
        .rt-featured-section {
          padding: 60px 0 40px;
        }
        .rt-featured-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 1024px) {
          .rt-featured-grid {
            grid-template-columns: 1.6fr 1fr;
          }
        }
        .rt-card {
          position: relative;
          background: #2a2b2a; /* Placeholder */
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 32px;
          color: #fff;
          text-decoration: none;
          isolation: isolate;
        }
        .rt-card-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%);
          z-index: 1;
        }
        .rt-card-content {
          position: relative;
          z-index: 2;
        }
        .rt-card-title {
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
          margin: 0 0 8px;
        }
        .rt-card-desc {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 15px;
          color: rgba(255,255,255,0.9);
          margin: 0 0 20px;
        }
        .rt-card-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          padding: 10px 20px;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .rt-card:hover .rt-card-btn {
          background: #1B7A4D;
          border-color: #1B7A4D;
        }
        .rt-card.large {
          min-height: 480px;
        }
        .rt-featured-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .rt-card.small {
          flex: 1;
          min-height: 230px;
          padding: 24px;
        }

        /* ─── Category Nav ─── */
        .rt-cat-nav {
          background: #EFEFEA;
          border-top: 1px solid #d1d5db;
          border-bottom: 1px solid #d1d5db;
          padding: 24px 0;
        }
        .rt-cat-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .rt-cat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #111111;
          text-decoration: none;
          font-family: "Fira Sans", "Inter", sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .rt-cat-item:hover {
          color: #1B7A4D;
        }

        /* ─── Explore More ─── */
        .rt-explore-section {
          padding: 60px 0;
        }
        .rt-explore-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .rt-explore-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .rt-explore-grid { grid-template-columns: repeat(4, 1fr); }
        }
        .rt-explore-card {
          position: relative;
          background: #333; /* Placeholder */
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16/10;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          color: #fff;
          text-decoration: none;
          isolation: isolate;
        }
        .rt-explore-title {
          font-size: 26px;
          margin: 0 0 4px;
          position: relative;
          z-index: 2;
        }
        .rt-explore-label {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          position: relative;
          z-index: 2;
        }

        /* ─── Community ─── */
        .rt-community-section {
          padding: 20px 0 60px;
        }
        .rt-community-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }
        .rt-community-subtitle {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 14px;
          color: #4b5563;
          margin: 8px 0 0;
        }
        .rt-community-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          /* Adding a masonry-like staggered layout with explicit spans */
        }
        @media (min-width: 768px) {
          .rt-community-grid { grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; }
          .rt-photo:nth-child(1) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(2) { grid-column: span 1; grid-row: span 2; }
          .rt-photo:nth-child(3) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(4) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(5) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(6) { grid-column: span 2; grid-row: span 1; }
          .rt-photo:nth-child(7) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(8) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(9) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(10) { grid-column: span 1; grid-row: span 1; }
          .rt-photo:nth-child(11) { grid-column: span 1; grid-row: span 1; }
        }
        .rt-photo {
          background: #444;
          border-radius: 8px;
          width: 100%;
          height: 100%;
          min-height: 150px;
          overflow: hidden;
          position: relative;
        }
        .rt-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ─── Ride With Us Banner ─── */
        .rt-banner {
          background: #1a1a1a;
          color: #fff;
          text-align: center;
          padding: 80px 24px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .rt-banner-scrim {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.8) 100%);
        }
        .rt-banner > h2,
        .rt-banner > p,
        .rt-banner > a {
          position: relative;
          z-index: 2;
        }
        .rt-banner h2 {
          font-size: clamp(40px, 6vw, 64px);
          position: relative;
          z-index: 2;
          margin-bottom: 12px;
        }
        .rt-banner p {
          font-family: "Fira Sans", "Inter", sans-serif;
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          position: relative;
          z-index: 2;
          margin-bottom: 32px;
        }
      `}</style>

      {/* 1. Hero Section */}
      <section className="rt-hero">
        <img src={HERO_IMG} alt="" className="rt-bg-img" />
        <div className="rt-hero-placeholder" />
        <div className="rt-hero-content">
          <h1>ROAD TRIPS</h1>
          <p>Discover spots, scenes, and sessions across the country.</p>
          <Link href="#explore" className="rt-btn">
            START EXPLORING <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 2. Featured Trips */}
      <section className="rt-featured-section">
        <div className="rt-container">
          <div className="rt-section-header">
            <h2 className="rt-section-title">FEATURED TRIPS</h2>
            <Link href="#all" className="rt-view-all">VIEW ALL TRIPS <ArrowRight size={16} /></Link>
          </div>
          
          <div className="rt-featured-grid">
            {/* Left Large Card */}
            <Link href="#big-sur" className="rt-card large">
              <img src={FEATURED_BIG_IMG} alt="" className="rt-bg-img" />
              <div className="rt-card-scrim" />
              <div className="rt-card-content">
                <h3 className="rt-card-title">BIG SUR ADVENTURE</h3>
                <p className="rt-card-desc">Exploring the California Coast</p>
                <div className="rt-card-btn">EXPLORE <ArrowRight size={14} /></div>
              </div>
            </Link>

            {/* Right Stacked Cards */}
            <div className="rt-featured-right">
              <Link href="#mountain" className="rt-card small">
                <img src={FEATURED_MOUNTAIN_IMG} alt="" className="rt-bg-img" />
                <div className="rt-card-scrim" />
                <div className="rt-card-content">
                  <h3 className="rt-card-title">MOUNTAIN ESCAPE</h3>
                  <p className="rt-card-desc">Stunning Alpine Getaway</p>
                  <div className="rt-card-btn">EXPLORE <ArrowRight size={14} /></div>
                </div>
              </Link>
              <Link href="#desert" className="rt-card small">
                <img src={FEATURED_DESERT_IMG} alt="" className="rt-bg-img" />
                <div className="rt-card-scrim" />
                <div className="rt-card-content">
                  <h3 className="rt-card-title">DESERT CRUISIN&rsquo;</h3>
                  <p className="rt-card-desc">Into the Wild West</p>
                  <div className="rt-card-btn">EXPLORE <ArrowRight size={14} /></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Nav */}
      <section className="rt-cat-nav">
        <div className="rt-container">
          <div className="rt-cat-list">
            <Link href="#coastal" className="rt-cat-item">
              <Waves size={24} /> COASTAL CRUISES
            </Link>
            <Link href="#mountain" className="rt-cat-item">
              <Mountain size={24} /> MOUNTAIN RIDES
            </Link>
            <Link href="#desert" className="rt-cat-item">
              <Sun size={24} /> DESERT GETAWAYS
            </Link>
            <Link href="#city" className="rt-cat-item">
              <Building2 size={24} /> CITY SESSIONS
            </Link>
            <Link href="#events" className="rt-cat-item">
              <Calendar size={24} /> EVENTS
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Explore More Trips */}
      <section id="explore" className="rt-explore-section">
        <div className="rt-container">
          <div className="rt-section-header">
            <h2 className="rt-section-title">EXPLORE MORE TRIPS</h2>
            <Link href="#all" className="rt-view-all">VIEW ALL TRIPS <ArrowRight size={16} /></Link>
          </div>
          
          <div className="rt-explore-grid">
            <Link href="/road-trips/malibu" className="rt-explore-card">
              <img src={EXPLORE_MALIBU_IMG} alt="" className="rt-bg-img" />
              <div className="rt-card-scrim" />
              <h3 className="rt-explore-title">MALIBU</h3>
              <span className="rt-explore-label">Destination</span>
            </Link>
            <Link href="/road-trips/denver-fest" className="rt-explore-card">
              <img src={EXPLORE_DENVER_IMG} alt="" className="rt-bg-img" />
              <div className="rt-card-scrim" />
              <h3 className="rt-explore-title">DENVER CANNABIS FEST</h3>
              <span className="rt-explore-label">Event</span>
            </Link>
            <Link href="/road-trips/austin" className="rt-explore-card">
              <img src={EXPLORE_AUSTIN_IMG} alt="" className="rt-bg-img" />
              <div className="rt-card-scrim" />
              <h3 className="rt-explore-title">AUSTIN CHILL SPOT</h3>
              <span className="rt-explore-label">Community</span>
            </Link>
            <Link href="/road-trips/lake-tahoe" className="rt-explore-card">
              <img src={EXPLORE_TAHOE_IMG} alt="" className="rt-bg-img" />
              <div className="rt-card-scrim" />
              <h3 className="rt-explore-title">LAKE TAHOE</h3>
              <span className="rt-explore-label">Destination</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Community Gallery */}
      <section className="rt-community-section">
        <div className="rt-container">
          <div className="rt-community-header">
            <div>
              <h2 className="rt-section-title" style={{ color: '#2F6B3A' }}>FROM THE HIGHWAY COMMUNITY</h2>
              <p className="rt-community-subtitle">Real sessions from our community. Tag #RideHighway420 to be featured.</p>
            </div>
            <Link href="#share" className="rt-btn" style={{ background: '#2F6B3A' }}>
              SHARE YOUR SESSION <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rt-community-grid">
            {COMMUNITY_PHOTOS.map((src, i) => (
              <div key={i} className="rt-photo">
                <img src={src} alt={`Highway 420 community session ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Ride With Us Banner */}
      <section className="rt-banner">
        <img src={BANNER_IMG} alt="" className="rt-bg-img" />
        <div className="rt-banner-scrim" />
        <h2>RIDE WITH US</h2>
        <p>Join the journey and share your adventures.</p>
        <Link href="#featured" className="rt-btn" style={{ background: '#2F6B3A' }}>
          GET FEATURED <ArrowRight size={16} />
        </Link>
      </section>

      <EssentialsFooter />
    </div>
  );
}
