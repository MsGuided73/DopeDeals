import Image from 'next/image';

export default function BubblersHero() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=1200&h=600&fit=crop&crop=entropy&auto=format&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-chalets-legweb font-bold text-white mb-6">
            BUBBLERS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Compact water pipes that deliver smooth hits. Perfect blend of portability and water filtration from premium glass artists
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">100+</div>
              <div className="text-sm text-gray-400">Bubblers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-500">25+</div>
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
              href="#mini-bubblers" 
              className="px-6 py-3 bg-dope-orange-500 hover:bg-dope-orange-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              Mini Bubblers
            </a>
            <a 
              href="#sherlock-bubblers" 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Sherlock Bubblers
            </a>
            <a 
              href="#hammer-bubblers" 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Hammer Bubblers
            </a>
            <a 
              href="#sidecar-bubblers" 
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Sidecar Bubblers
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
