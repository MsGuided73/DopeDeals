'use client';

export default function DabRigsHero() {
  return (
    <div className="relative bg-black text-white overflow-hidden">
      {/* Compact Header Bar */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-chalets text-3xl md:text-4xl tracking-wider text-white">
              DAB RIGS & CONCENTRATE TOOLS
            </h1>
            <div className="hidden md:block w-16 h-0.5 bg-dope-orange-500"></div>
          </div>
          
          {/* Quick Stats - Compact */}
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">200+</div>
              <div className="text-xs text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">15+</div>
              <div className="text-xs text-gray-400">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dope-orange-500">FREE</div>
              <div className="text-xs text-gray-400">Shipping $50+</div>
            </div>
          </div>
        </div>
        
        {/* Compact Description */}
        <p className="text-sm text-gray-300 mt-2 max-w-2xl">
          Premium glass rigs, electric dab rigs, bangers, and concentrate accessories for the ultimate dabbing experience
        </p>
        
        {/* Quick Category Links - Compact */}
        <div className="flex flex-wrap gap-2 mt-4">
          <a 
            href="#glass-rigs" 
            className="px-3 py-1.5 bg-dope-orange-500 hover:bg-dope-orange-600 text-white text-xs rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,140,0,0.5)]"
          >
            Glass Rigs
          </a>
          <a 
            href="#electric-rigs" 
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            Electric Rigs
          </a>
          <a 
            href="#bangers" 
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            Bangers
          </a>
          <a 
            href="#dab-tools" 
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
          >
            Dab Tools
          </a>
        </div>
      </div>

      {/* Subtle Orange Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-dope-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
