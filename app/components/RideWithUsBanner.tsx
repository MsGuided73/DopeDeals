"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const BANNER_SRC =
  "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/RideWithUs/RIDE%20WITH%20US%20HOME%20PAGE%20IMAGE.png";

export default function RideWithUsBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
    };

    try {
      const response = await fetch("/api/vip-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-label="Ride with Us"
      className="w-full relative"
      style={{ background: "transparent" }}
    >
      <div
        style={{
          width: "100%",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setIsModalOpen(true)}
        className="group"
      >
        <Image
          src={BANNER_SRC}
          alt="Ride with Us — join the Highway 420 community"
          width={2400}
          height={800}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="block transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          priority
        />
        {/* Overlay hover hint */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: "rgba(0,0,0,0.35)", pointerEvents: "none" }}
        >
          <span style={{
            fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
            fontSize: "32px",
            letterSpacing: "0.06em",
            color: "#fff",
            background: "#2d8f47",
            padding: "14px 32px",
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
            {success ? (
              <div style={{ padding: "40px 32px", textAlign: "center" }}>
                <div style={{ color: "#2d8f47", fontSize: "48px", marginBottom: "16px" }}>✓</div>
                <h4 style={{ fontFamily: "'BebasNeue','Bebas Neue',sans-serif", fontSize: "32px", color: "#fff", margin: "0 0 8px 0" }}>YOU'RE ON THE LIST</h4>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9ca3af", margin: 0 }}>Keep an eye on your inbox for exclusive drops.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {error && (
                  <div style={{ padding: "12px", background: "rgba(255, 0, 0, 0.1)", border: "1px solid rgba(255, 0, 0, 0.3)", borderRadius: "4px", color: "#ff6b6b", fontSize: "14px", fontFamily: "Inter, sans-serif" }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="First Name" 
                  required
                  style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2d8f47"}
                  onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
                />
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Last Name" 
                  required
                  style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2d8f47"}
                  onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
                />
              </div>
              
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                required
                style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "#2d8f47"}
                onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
              />

              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number (Optional)" 
                style={{ width: "100%", background: "#0D0D0B", color: "#ffffff", padding: "12px 16px", borderRadius: "4px", border: "1px solid #2d241b", fontFamily: "Inter, sans-serif", fontSize: "14px", outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "#2d8f47"}
                onBlur={e => e.currentTarget.style.borderColor = "#2d241b"}
              />

              <button 
                type="submit"
                disabled={isLoading}
                style={{ 
                  width: "100%", 
                  background: isLoading ? "#3d9614" : "#2d8f47", 
                  color: "#ffffff", 
                  padding: "16px", 
                  borderRadius: "4px", 
                  border: "none",
                  fontFamily: "'BebasNeue','Bebas Neue',sans-serif",
                  fontSize: "24px",
                  letterSpacing: "0.06em",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                  transition: "background 0.2s"
                }}
                onMouseOver={e => { if (!isLoading) e.currentTarget.style.background = "#45a815"; }}
                onMouseOut={e => { if (!isLoading) e.currentTarget.style.background = "#2d8f47"; }}
              >
                {isLoading ? "JOINING..." : "JOIN THE CREW"}
              </button>
            </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
