import React from 'react';
import { motion } from 'framer-motion';

interface LogoButtonProps {
  href: string;
  label?: string;
}

export default function CollectionsGrid() {
  const categories = [
    { name: 'THCA Flower', route: '/thca-flower', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/THCA_flower.jpeg' },
    { name: 'THCA Vapes & Concentrates', route: '/vapes', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/GiveMeAJ.jpeg' },
    { name: 'THCA Prerolls & More', route: '/pre-rolls', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Green%20Grid%20Sign.png' },
    { name: 'Bongs & Bong Attachments', route: '/bongs', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/RooR_6-bongs.png' },
    { name: 'Hand Pipes', route: '/pipes', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Grinder%20&%20Supplies.png' },
    { name: 'Dab-Rigs & Tools', route: '/dab-rigs', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Puffco_Zoom.png' },
    { name: 'Smoking Accessories', route: '/accessories', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/Green%20Grid%20Sign.png' },
    { name: 'Hookahs', route: '/hookahs', image: 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/Hookah.jpeg' },
  ];

  const logoPath = 'https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png';

  const LogoButton: React.FC<LogoButtonProps> = ({ href, label = 'SHOP NOW' }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = href;
        }}
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          px-6 py-2
          bg-green-600 hover:bg-white
          text-white hover:text-green-600
          border-2 border-green-600
          font-bold uppercase tracking-wide
          transition-all duration-300
          hover:scale-105 hover:shadow-lg
          text-sm
          z-30
          rounded-full
          highway-hover-lift
        "
        style={{
          backgroundColor: '#2d8f47',
          borderColor: '#2d8f47',
          fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
          fontWeight: 'normal',
          letterSpacing: '0.05em',
        }}
        aria-label={label}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 p-4 aspect-[4/2] items-stretch justify-stretch">
      <motion.a
        href="/thca-flower"
        className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg relative h-full w-full group"
        whileHover={{ scale: 1.01 }}
      >
        <img src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/ChatGPT%20Image%20Oct%2023,%202025,%2004_02_38%20PM.png" alt="Highway 420 Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <h2 className="font-highway text-white text-4xl font-bold tracking-wide mb-2"></h2>
          <p className="text-white/85 text-base pointer-events-none">Shop our signature flower</p>
        </div>
        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <LogoButton href="/thca-flower" label="SHOP NOW" />
        </div>
      </motion.a>

      {categories.map((cat, i) => (
        <motion.a
          key={i}
          href={cat.route}
          className="rounded-2xl overflow-hidden shadow-md relative w-full h-full flex group"
          whileHover={{ scale: 1.02 }}
        >
          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-end justify-center p-3 z-10 pointer-events-none">
            <h3 className="font-highway text-white text-xl font-bold text-center">{cat.name}</h3>
          </div>
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <LogoButton href={cat.route} label="SHOP NOW" />
          </div>
        </motion.a>
      ))}
    </div>
  );
}
