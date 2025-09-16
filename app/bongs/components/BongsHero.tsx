import Image from 'next/image';

export default function BongsHero() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/bongs-hero-bg.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-chalets font-bold text-white mb-6">
            BONGS & WATER PIPES
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium glass collection featuring beaker bongs, straight tubes, percolator pieces, and scientific glass from top brands
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">500+</div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">50+</div>
              <div className="text-sm text-gray-400">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">FREE</div>
              <div className="text-sm text-gray-400">Shipping $50+</div>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#beaker-bongs" 
              className="px-6 py-3 bg-dope-orange-500 hover:bg-dope-orange-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              Beaker Bongs
            </a>
            <a 
              href="#straight-tubes" 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Straight Tubes
            </a>
            <a 
              href="#percolator-bongs" 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Percolator Bongs
            </a>
            <a 
              href="#mini-bongs" 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Mini Bongs
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-dope-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-dope-orange-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
