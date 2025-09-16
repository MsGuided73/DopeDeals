import Image from 'next/image';

export default function ProductsHero() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/products-hero-bg.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-chalets font-bold text-white mb-6 tracking-tighter">
            ALL PRODUCTS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium cannabis accessories and glass pieces from top brands. Everything you need for the ultimate experience.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">1000+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">50+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">24/7</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Support</div>
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

      {/* Compliance Notice */}
      <div className="absolute bottom-0 left-0 right-0 bg-yellow-500/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-900">
                <strong>Compliance Notice:</strong> Products filtered by location for CBD/Hemp availability. Age verification required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
