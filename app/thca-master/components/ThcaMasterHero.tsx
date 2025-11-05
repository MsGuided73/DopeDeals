import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function ThcaMasterHero() {
  return (
    <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-dope-orange-500/20 border border-dope-orange-500/30 mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-dope-orange-400" />
            <span className="text-sm font-medium text-dope-orange-300">Complete Cannabinoid Collection</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="block">THCA Master</span>
            <span className="block text-dope-orange-400">Collection</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Explore the complete spectrum of THCA and cannabinoid products.
            From premium flower and concentrates to edibles, vapes, and wellness products.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-400">500+</div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-400">10+</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dope-orange-400">50+</div>
              <div className="text-sm text-gray-400">Brands</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#categories"
              className="inline-flex items-center px-8 py-4 bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-dope-orange-500/30"
            >
              Explore Categories
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="#featured"
              className="inline-flex items-center px-8 py-4 border-2 border-white/30 hover:border-white text-white font-bold rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              View Featured
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24">
          <path
            fill="#ffffff"
            d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}
