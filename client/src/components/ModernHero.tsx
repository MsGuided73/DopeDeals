import { useState, useEffect } from "react";
import { ChevronRight, Sparkles, Crown, Star, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Premium Glass Collection",
      subtitle: "Handcrafted Excellence",
      description: "Discover our curated selection of artisan glass pieces, crafted by master glassblowers with decades of experience.",
      cta: "Explore Collection",
      link: "/products?category=glass-pipes",
      image: "🔥",
      accent: "from-amber-400 to-orange-500"
    },
    {
      title: "VIP Exclusive Access",
      subtitle: "Members Only Benefits",
      description: "Join our VIP program for exclusive access to limited editions, early releases, and member-only discounts.",
      cta: "Join VIP Program",
      link: "/membership",
      image: "👑",
      accent: "from-yellow-400 to-amber-500"
    },
    {
      title: "Latest Arrivals",
      subtitle: "Fresh & Trending",
      description: "Stay ahead with our newest arrivals and trending pieces from top-tier manufacturers worldwide.",
      cta: "View New Arrivals",
      link: "/products?featured=true",
      image: "✨",
      accent: "from-purple-400 to-pink-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo Animation */}
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
              <div className={`w-full h-full bg-gradient-to-br ${currentSlideData.accent} rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300`}>
                <Crown className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                VIP Smoke
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
              Premium Smoking Accessories & Paraphernalia
            </p>
          </div>

          {/* Dynamic Content Slider */}
          <div className="mb-12 animate-fade-in-up animation-delay-200">
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl max-w-4xl mx-auto">
              <div className="text-6xl mb-6 animate-bounce">{currentSlideData.image}</div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {currentSlideData.title}
              </h2>
              
              <p className={`text-lg md:text-xl font-semibold bg-gradient-to-r ${currentSlideData.accent} bg-clip-text text-transparent mb-6`}>
                {currentSlideData.subtitle}
              </p>
              
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                {currentSlideData.description}
              </p>
              
              <Link href={currentSlideData.link}>
                <Button 
                  size="lg" 
                  className={`bg-gradient-to-r ${currentSlideData.accent} hover:scale-105 transform transition-all duration-300 text-white font-semibold px-8 py-4 rounded-full shadow-2xl group`}
                >
                  {currentSlideData.cta}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-400 mb-2">4,500+</div>
              <div className="text-gray-300">Premium Products</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-400 mb-2">21+</div>
              <div className="text-gray-300">Age Verified</div>
            </div>
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-400 mb-2">VIP</div>
              <div className="text-gray-300">Exclusive Access</div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-yellow-400 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-8 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
      </div>
    </section>
  );
}