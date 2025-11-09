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
          <h1 className="text-4xl md:text-6xl font-chalets-legweb text-white mb-6 tracking-wider" style={{ fontFamily: "'Chalets', 'Inter', system-ui, sans-serif", fontWeight: 'normal', letterSpacing: '-0.1em' }}>
            ALL THCA PRODUCTS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium THCA products for the modern cannabis enthusiast. From flower to edibles, concentrates to vapes - elevate your experience.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">THCA</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Flower & Edibles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">Premium</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Quality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">Lab Tested</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Products</div>
            </div>
          </div>

          {/* THCA Product Category Quick Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#thca_flower"
              className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Flower
            </a>
            <a
              href="#thca-edibles"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Edibles
            </a>
            <a
              href="#thca-prerolls"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Prerolls
            </a>
            <a
              href="#thca-concentrates"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Concentrates
            </a>
            <a
              href="#thca-vapes"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Vapes
            </a>
            <a
              href="#thca-accessories"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Accessories
            </a>
            <a
              href="#thca-topicals"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Topicals
            </a>
            <a
              href="#thca-bundles"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              THCA Bundles
            </a>
          </div>
        </div>
      </div>


    </div>
  );
}
