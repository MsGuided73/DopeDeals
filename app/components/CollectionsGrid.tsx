"use client";




import Link from "next/link";

export default function CollectionsGrid() {
  const categories = [
    { 
      name: "FLOWER", 
      route: "/thca_flower", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/thca_flower_no_text.png",
      color: "#10b981", // Emerald
      bgGradient: "from-emerald-900/40 via-black to-black",
      isPromo: false
    },
    { 
      name: "PREROLLS", 
      route: "/pre-rolls", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/prerolls_no_text.png",
      color: "#f59e0b", // Amber
      bgGradient: "from-amber-900/40 via-black to-black",
      isPromo: false
    },
    { 
      name: "VAPES\n& CARTS", 
      route: "/vapes", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/vapesncarts_no_text.png",
      color: "#06b6d4", // Cyan
      bgGradient: "from-cyan-900/40 via-black to-black",
      isPromo: false
    },
    { 
      name: "SHROOMS", 
      route: "/mushrooms", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/edibles_no_text.png",
      color: "#a855f7", // Purple
      bgGradient: "from-purple-900/40 via-black to-black",
      isPromo: false
    },
    { 
      name: "HOT\nPRODUCTS", 
      route: "/hot-products",
      image: "/images/promo/hot_products_bg.png",
      color: "#f43f5e", // Rose
      bgGradient: "from-rose-600 via-rose-900 to-black", 
      isPromo: true
    },
    { 
      name: "FRESH\nDROPS", 
      route: "/fresh-drops",
      image: "/images/promo/fresh_drops_bg.png",
      color: "#14b8a6", // Teal
      bgGradient: "from-teal-600 via-teal-900 to-black",
      isPromo: true
    },
    { 
      name: "DOPE\nDEALS", 
      route: "/#dope-deals",
      image: "/images/promo/dope_deals_bg.png",
      color: "#ef4444", // Red for Deals
      bgGradient: "from-red-600 via-red-900 to-black",
      isPromo: true
    },
    { 
      name: "EDIBLES", 
      route: "/edibles", 
      image: "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Collections%20Grid/Edibles_non-mush.png",
      color: "#f97316", // Orange
      bgGradient: "from-orange-900/40 via-black to-black",
      isPromo: false
    },
  ];

  const logoPath =
    "https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/AdobeStock_1060112988.jpeg";

  return (
    // Lower z-index so dropdown menus can appear on top. Added margins properly.
    <div className="relative w-full px-0 pb-4 mt-4">
      
      {/* Mobile: Stack vertically with Grid */}
      <div className="block lg:hidden space-y-2">
        {/* Large hero image first on mobile */}
        <Link
          href="/ride-with-us"
          className="block w-full aspect-[2/1] rounded-2xl overflow-hidden shadow-lg relative group active:scale-95 transition-all duration-300"
        >
          {/* Hero background - Rich Dark */}
          <div className="absolute inset-0 bg-neutral-900" />
          
          <img
            src={logoPath}
            alt="Highway 420"
            className="w-full h-full object-cover max-w-full mx-auto relative z-10 transition-transform duration-300"
          />
          {/* Decorative overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/30 transition-all duration-300 z-20" />
        </Link>

        {/* Categories in 3-column grid on mobile (Compact) */}
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={cat.route}
              className="aspect-square rounded-2xl overflow-hidden shadow-md relative group active:scale-95 transition-all duration-300 block"
              style={{
                background: cat.isPromo 
                  ? "" // Use utility class for gradient if it's promo
                  : `linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #121212 100%)`, 
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.4)",
              }}
            >
              {/* Dynamic Border Glow */}
              <div className={`absolute inset-0 rounded-2xl border ${cat.isPromo ? 'border-white/20' : 'border-white/10 group-hover:border-white/20'} transition-all duration-300 z-30 pointer-events-none`} />

              {cat.isPromo ? (
                // Promo Tile Content (Mobile - Option 3 Editorial Lifestyle)
                <>
                  <div className="absolute inset-0 bg-neutral-900 z-0" />
                  {cat.image && (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="absolute inset-0 w-full h-full object-cover z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" 
                    />
                  )}
                  {/* Overlay for text readability */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.bgGradient} opacity-50 mix-blend-multiply z-10 pointer-events-none`} />
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-20 pointer-events-none" />
                  
                  {/* Text alignment to bottom-left */}
                  <div className="absolute bottom-3 left-3 z-30 pointer-events-none flex flex-col justify-end">
                    <div className="w-5 h-[3px] mb-1.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:w-8" style={{ backgroundColor: cat.color }}></div>
                    <div className={`text-white text-left text-[24px] xs:text-[28px] font-display-twilight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,1)] tracking-widest group-hover:text-[${cat.color}] transition-colors duration-300`}>
                      {cat.name.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Regular Tile Content (Mobile)
                <>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="absolute bottom-2 right-2 w-[85%] max-h-[85%] object-contain z-10 group-hover:scale-110 transition-transform duration-500 ease-out" 
                  />
                  {/* Text Visibility Gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent z-10" />
                  {/* Category Name Label */}
                  <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <div className="text-white text-[24px] xs:text-[28px] font-display-twilight leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-widest">
                      {cat.name.split('\n').map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop: Full-width grid layout */}
      <div className="hidden lg:block w-full">
        <div className="max-w-screen-2xl mx-auto px-2">
          {/* Main Grid: 4 Columns, Mosaic Layout */}
          <div className="grid grid-cols-4 grid-rows-3 gap-3 h-[85vh] w-full">
            
            {/* Hero Tile - Spans 2x2 */}
            <Link
              href="/ride-with-us"
              className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-2xl relative group hover:scale-[1.01] transition-transform duration-500 block"
            >
              <div className="absolute inset-0 bg-neutral-900" />
              <img 
                src={logoPath} 
                alt="Highway 420" 
                className="w-full h-full object-cover relative z-10 transition-all duration-500" 
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-500" />
              
              {/* Hero Text Overlay */}
              <div className="absolute bottom-8 left-8 z-30">
                 <h2 className="text-white font-display-twilight text-4xl tracking-widest drop-shadow-2xl">RIDE WITH US</h2>
                 <p className="text-gray-200 font-sans mt-2 tracking-wide text-sm uppercase">Be part of the movement</p>
              </div>
            </Link>

            {/* Category Tiles */}
            {categories.map((cat, i) => (
              <Link
                key={i}
                href={cat.route}
                className="rounded-2xl overflow-hidden shadow-xl relative group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 block"
                style={{
                  background: cat.isPromo 
                    ? "" 
                    : `linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #121212 100%)`, 
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 15px 30px -5px ${cat.color}66`; // 66 = 40% opacity
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Glassy Border with Pulse for Promo */}
                <div className={`absolute inset-0 rounded-2xl border ${cat.isPromo ? 'border-white/20' : 'border-white/10 group-hover:border-white/30'} transition-all duration-300 z-30 pointer-events-none`} />

                {cat.isPromo ? (
                   // Promo Tile Content (Desktop - Option 3 Editorial Lifestyle)
                   <>
                     {/* Base Background */}
                     <div className="absolute inset-0 bg-neutral-900 z-0" />
                     {cat.image && (
                       <img 
                         src={cat.image} 
                         alt={cat.name} 
                         className="absolute inset-0 w-full h-full object-cover z-10 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none" 
                       />
                     )}
                     
                     {/* Rich Gradient Overlays */}
                     <div className={`absolute inset-0 bg-gradient-to-t ${cat.bgGradient} opacity-50 mix-blend-multiply z-10 transition-opacity duration-500 pointer-events-none`} />
                     <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-20 pointer-events-none group-hover:h-full group-hover:via-black/70 transition-all duration-500" />

                     {/* Editorial Text Block */}
                     <div className="absolute bottom-6 left-6 z-30 pointer-events-none flex flex-col justify-end">
                        <div className="w-8 h-1 mb-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-500 group-hover:w-16" style={{ backgroundColor: cat.color }}></div>
                        <div className={`text-white text-left text-[42px] xl:text-[52px] font-display-twilight leading-[0.9] drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] tracking-[0.1em] group-hover:text-[${cat.color}] transition-all duration-500`}>
                          {cat.name.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </div>
                     </div>
                     
                     {/* Dark pulsing glow on hover for mood */}
                     <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-all duration-700 z-10 pointer-events-none" style={{ backgroundColor: cat.color }}></div>
                   </>
                ) : (
                  // Regular Tile Content (Desktop)
                  <>
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="absolute bottom-4 right-4 w-[75%] max-h-[75%] object-contain z-10 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500 ease-out" 
                    />
                    
                    {/* Text Visibility Gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-transparent z-10" />

                    {/* Category Name Label */}
                    <div className="absolute top-6 left-6 z-20 pointer-events-none transition-all duration-300">
                      <div className={`text-white text-[42px] xl:text-[52px] font-display-twilight leading-[0.9] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-[0.1em] shadow-black group-hover:text-[${cat.color}]`}>
                        {cat.name.split('\n').map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Hover Flash Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 pointer-events-none z-10" />

              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
