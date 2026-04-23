"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const BANNER_SRC =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RideWithUs/Ride%20with%20Us.png";

export default function RideWithUsBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for actual signup logic
    alert("Welcome to the VIP Crew! Keep an eye on your inbox.");
    setIsModalOpen(false);
  };

  return (
    <section
      aria-label="Ride with Us"
      className="w-full relative"
      style={{ padding: "60px 20px", background: "transparent" }}
    >
      <div 
        style={{ 
          maxWidth: "900px", 
          margin: "0 auto", 
          cursor: "pointer", 
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.05)"
        }} 
        onClick={() => setIsModalOpen(true)} 
        className="group"
      >
        <Image
          src={BANNER_SRC}
          alt="Ride with Us — join the Highway 420 community"
          width={900}
          height={300}
          sizes="(max-width: 900px) 100vw, 900px"
          style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          className="block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
        {/* Overlay hover hint */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
          style={{ background: "rgba(0,0,0,0.4)", borderRadius: "8px", pointerEvents: "none" }}
        >
          <span style={{
            fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
            fontSize: "24px",
            letterSpacing: "0.06em",
            color: "#fff",
            background: "#52C41A",
            padding: "10px 24px",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            BECOME A VIP
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(4px)", padding: "20px" }}
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-md overflow-hidden"
            style={{ 
              background: "#1c1208", 
              border: "1px solid #1B7A4D",
              borderRadius: "12px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute text-gray-400 hover:text-white transition-colors"
              style={{ top: "16px", right: "20px", fontSize: "28px", lineHeight: 1, background: "transparent", border: "none", cursor: "pointer" }}
            >
              &times;
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", padding: "32px 32px 24px", borderBottom: "1px solid #2d241b" }}>
              <h3 style={{
                fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
                fontSize: "clamp(36px, 5vw, 48px)",
                lineHeight: 1,
                color: "#ffffff",
                margin: "0 0 8px 0"
              }}>
                RIDE WITH US
              </h3>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9ca3af", margin: 0, lineHeight: 1.4 }}>
                Join the VIP crew for exclusive drops, secret deals, and early access.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  required
                  style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#52C41A"}
                  onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  required
                  style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#52C41A"}
                  onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
                />
              </div>
              
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "#52C41A"}
                onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
              />

              <input 
                type="tel" 
                placeholder="Phone Number (Optional)" 
                style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "#52C41A"}
                onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
              />

              <button 
                type="submit"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  background: 'radial-gradient(ellipse at 50% 35%, #5FD01D 0%, #52C41A 55%, #42A416 100%)',
                  color: '#ffffff',
                  fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
                  fontSize: '22px',
                  letterSpacing: '0.06em',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(82, 196, 26, 0.2)',
                  transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                JOIN THE CREW
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
