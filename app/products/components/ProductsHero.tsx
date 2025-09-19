import Image from 'next/image';

export default function ProductsHero() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/SkylinefrmRafters.png')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-chalets text-white mb-6 tracking-tighter" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '-0.1em' }}>
            ALL PRODUCTS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Where premium meets street. Discover the finest smoking accessories, glass pieces, and cannabis culture essentials.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">1000+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Dope Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Street Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">24/7</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Culture</div>
            </div>
          </div>

          {/* Category Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#water-bongs"
              className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Water Bongs
            </a>
            <a
              href="#pipes"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Pipes
            </a>
            <a
              href="#glass"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Glass Pieces
            </a>
            <a
              href="#vaporizers"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Vaporizers
            </a>
            <a
              href="#grinders"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Grinders
            </a>
            <a
              href="#papers"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Papers
            </a>
            <a
              href="#accessories"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Accessories
            </a>
            <a
              href="#thca-flower-more"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Flower & More
            </a>
          </div>
        </div>
      </div>


    </div>
  );
}
