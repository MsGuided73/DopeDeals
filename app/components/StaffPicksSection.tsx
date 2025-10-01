"use client";
import { useEffect, useState } from 'react';

interface StaffPickProduct {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  vip_price?: number;
  image_url?: string;
  sku: string;
  stock_quantity: number;
  brand_name?: string;
  materials?: string[];
  featured: boolean;
  created_at: string;
  is_staff_pick: boolean;
}

interface StaffPicksResponse {
  products: StaffPickProduct[];
  message: string;
  total: number;
}

export default function StaffPicksSection() {
  const [products, setProducts] = useState<StaffPickProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Timer for Staff Picks - resets daily at midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const difference = tomorrow.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchStaffPicks() {
      try {
        setLoading(true);
        const response = await fetch('/api/featured/staff-picks?limit=2');

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // If we can't parse JSON, use the status text
          }
          console.error('Staff picks API error:', errorMessage);
          throw new Error(`Failed to fetch staff picks: ${errorMessage}`);
        }

        const data: StaffPicksResponse = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching staff picks:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStaffPicks();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getProductDescription = (product: StaffPickProduct) => {
    return product.short_description || product.description || 'Premium quality product';
  };

  if (loading) {
    return (
      <section className="mt-16">
        {/* Full-screen title bar with backdrop */}
        <div
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-32 bg-cover bg-center flex items-center justify-center mb-8"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/msguided1618_32857_DOPE_CITY_Website_Hero_photo_realistic_skyli_541173d6-7a18-4b44-bb80-8b203b18d126.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-chalets text-white mb-2" style={{ letterSpacing: '-0.02em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}>
              🔥 DOPE DEALS 🔥
            </h2>
            <p className="text-xl text-white/90" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
              Limited time deals - New picks every day!
            </p>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg animate-pulse">
            <span className="text-sm font-medium">Loading deals...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white relative overflow-hidden animate-pulse">
              <div className="h-6 bg-white/20 rounded mb-2 w-24"></div>
              <div className="h-8 bg-white/20 rounded mb-2 w-48"></div>
              <div className="h-6 bg-white/20 rounded mb-4 w-32"></div>
              <div className="h-12 bg-white/20 rounded w-40"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-16">
        {/* Full-screen title bar with backdrop */}
        <div
          className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-32 bg-cover bg-center flex items-center justify-center mb-8"
          style={{
            backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/msguided1618_32857_DOPE_CITY_Website_Hero_photo_realistic_skyli_541173d6-7a18-4b44-bb80-8b203b18d126.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-5xl font-chalets text-white mb-2" style={{ letterSpacing: '-0.02em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}>
              🔥 DOPE DEALS 🔥
            </h2>
          </div>
        </div>
        <div className="text-center">
          <p className="text-red-500">Error loading deals: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      {/* Full-screen title bar with backdrop */}
      <div
        className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-32 bg-cover bg-center flex items-center justify-center mb-8"
        style={{
          backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/msguided1618_32857_DOPE_CITY_Website_Hero_photo_realistic_skyli_541173d6-7a18-4b44-bb80-8b203b18d126.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-chalets text-white mb-2" style={{ letterSpacing: '-0.02em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}>
            🔥 DOPE DEALS 🔥
          </h2>
          <p className="text-xl text-white/90" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
            Limited time deals - New picks every day!
          </p>
        </div>
      </div>

      <div className="text-center mb-8">
        {/* Countdown Timer */}
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg">
          <span className="text-sm font-medium">SALE ENDS IN:</span>
          <div className="flex gap-2">
            <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
              <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs opacity-80">HOURS</div>
            </div>
            <div className="text-2xl font-bold">:</div>
            <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
              <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs opacity-80">MINS</div>
            </div>
            <div className="text-2xl font-bold">:</div>
            <div className="bg-black/20 px-3 py-2 rounded-lg text-center min-w-[60px]">
              <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs opacity-80">SECS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Picks Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`${
              index === 0 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : 'bg-gradient-to-br from-purple-500 to-pink-500'
            } rounded-xl p-6 text-white relative overflow-hidden`}
          >
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.discount_percentage}% OFF
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-lg opacity-90 mb-4 line-clamp-2">{getProductDescription(product)}</p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                <span className="text-xl line-through opacity-70">{formatPrice(product.original_price)}</span>
              </div>
              <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                GRAB THIS DEAL
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
