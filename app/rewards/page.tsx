import Image from 'next/image';
import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';

export const metadata = {
  title: 'DOPE REWARDS | VIP Club That Pays You Back - DOPE CITY',
  description: 'Join the most exclusive cannabis rewards program. Earn serious cash back, get VIP perks, exclusive drops, and birthday gifts that get better every year. The higher you climb, the more DOPE it gets.',
  keywords: 'DOPE CITY rewards, VIP club, cannabis loyalty program, cash back rewards, exclusive cannabis products, VIP perks, birthday gifts',
};

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Global Masthead */}
      <GlobalMasthead />

      {/* Hero Section - Full Screen Impact */}
      <section className="relative min-h-screen bg-black overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <Image
            src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/msguided1618_32857_DOPE_CITY_Website_Hero_photo_realistic_skyli_541173d6-7a18-4b44-bb80-8b203b18d126.png"
            alt="DOPE CITY - Premium Cannabis Culture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-6xl mx-auto px-6">
            {/* Main Title */}
            <div className="mb-8">
              <h1
                className="font-chalets text-6xl lg:text-8xl text-white mb-4 leading-none"
                style={{
                  letterSpacing: '-0.02em',
                  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7)'
                }}
              >
                DOPE
              </h1>
              <h1
                className="font-chalets text-6xl lg:text-8xl text-dope-orange-500 mb-6 leading-none"
                style={{
                  letterSpacing: '-0.02em',
                  textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(250, 105, 52, 0.5)'
                }}
              >
                REWARDS
              </h1>
            </div>

            {/* Tagline */}
            <p
              className="text-2xl lg:text-3xl text-white mb-8 font-bold max-w-4xl mx-auto"
              style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
            >
              THE VIP CLUB THAT ACTUALLY PAYS YOU BACK
            </p>

            <p
              className="text-lg lg:text-xl text-gray-200 mb-12 max-w-3xl mx-auto"
              style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}
            >
              Spend more, earn more, get treated like royalty. This isn't your average rewards program –
              this is the VIP experience you've been waiting for.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/auth/signup"
                className="group relative bg-gradient-to-r from-dope-orange-500 to-dope-orange-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <span className="relative z-10">JOIN THE VIP CLUB</span>
                <div className="absolute inset-0 bg-gradient-to-r from-dope-orange-600 to-dope-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <div className="text-center">
                <div className="text-white font-bold text-lg mb-1">IT'S 100% FREE</div>
                <div className="text-gray-300 text-sm">Start earning points immediately</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Promise Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chalets text-4xl lg:text-6xl text-white mb-6 tracking-tight">
              HERE'S THE <span className="text-dope-orange-500">DEAL</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Most loyalty programs are trash. Ours isn't. We actually give you real money back,
              real perks, and real VIP treatment. The more you spend, the more we hook you up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Real Cash Back */}
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">REAL CASH BACK</h3>
              <p className="text-gray-300 text-lg">
                Not points that expire. Not store credit. Actual money back that you can spend however you want.
              </p>
            </div>

            {/* VIP Treatment */}
            <div className="bg-gradient-to-b from-dope-orange-500/20 to-dope-orange-600/10 border border-dope-orange-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-dope-orange-500 to-dope-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👑</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">VIP TREATMENT</h3>
              <p className="text-gray-300 text-lg">
                Skip the lines, get early access, and enjoy perks that make you feel like cannabis royalty.
              </p>
            </div>

            {/* Exclusive Drops */}
            <div className="bg-gradient-to-b from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">EXCLUSIVE DROPS</h3>
              <p className="text-gray-300 text-lg">
                Get first dibs on limited releases, rare finds, and products that sell out in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Points Work - Simplified */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chalets text-4xl lg:text-6xl text-white mb-6 tracking-tight">
              SIMPLE AS <span className="text-dope-orange-500">HELL</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              No complicated math, no confusing conversions. Just straight-up rewards that make sense.
            </p>
          </div>

          {/* Main Points Formula */}
          <div className="bg-gradient-to-r from-dope-orange-500/10 to-dope-orange-600/10 border-2 border-dope-orange-500/30 rounded-3xl p-12 mb-12 text-center">
            <div className="text-7xl lg:text-8xl font-bold text-dope-orange-500 mb-6">
              $1 = 1 POINT
            </div>
            <p className="text-2xl text-white font-bold mb-4">
              Spend a dollar, earn a point. Use points like cash.
            </p>
            <p className="text-lg text-gray-300">
              100 points = $5 off your next order. It's that simple.
            </p>
          </div>

          {/* Bonus Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-b from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">📝</div>
              <div className="text-2xl font-bold text-white mb-2">+50 POINTS</div>
              <div className="text-green-400 font-semibold mb-2">Write a Review</div>
              <div className="text-sm text-gray-300">Help others, get rewarded</div>
            </div>

            <div className="bg-gradient-to-b from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">👥</div>
              <div className="text-2xl font-bold text-white mb-2">+100 POINTS</div>
              <div className="text-blue-400 font-semibold mb-2">Refer a Friend</div>
              <div className="text-sm text-gray-300">They get 10% off, you get points</div>
            </div>

            <div className="bg-gradient-to-b from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">🎂</div>
              <div className="text-2xl font-bold text-white mb-2">+200 POINTS</div>
              <div className="text-purple-400 font-semibold mb-2">Birthday Bonus</div>
              <div className="text-sm text-gray-300">Plus your tier birthday gift</div>
            </div>

            <div className="bg-gradient-to-b from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">📱</div>
              <div className="text-2xl font-bold text-white mb-2">+25 POINTS</div>
              <div className="text-pink-400 font-semibold mb-2">Follow Us</div>
              <div className="text-sm text-gray-300">Instagram, TikTok, Twitter</div>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Tiers Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chalets text-5xl lg:text-7xl text-white mb-6 tracking-tight">
              THE <span className="text-dope-orange-500">VIP LADDER</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-4">
              The more you spend, the more DOPE it gets.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Your annual spending automatically upgrades your status. No applications, no waiting – just pure VIP treatment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* STARTER Tier */}
            <div className="bg-gradient-to-b from-gray-700/30 to-gray-800/20 border border-gray-600/40 rounded-2xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-chalets text-2xl text-white mb-3 tracking-tight">STARTER</h3>
                <div className="text-dope-orange-500 font-bold text-lg mb-2">$0 - $249</div>
                <div className="text-gray-400 text-sm mb-6">Everyone starts here</div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                    <span className="text-sm">5% cash back</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                    <span className="text-sm">$25 birthday gift</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                    <span className="text-sm">Member flash sales</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-3"></span>
                    <span className="text-sm">Free shipping $100+</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  AUTO-ENROLLED
                </div>
              </div>
            </div>

            {/* SILVER Tier */}
            <div className="bg-gradient-to-b from-gray-300/20 to-gray-400/10 border border-gray-300/40 rounded-2xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-300/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl">🥈</span>
                </div>
                <h3 className="font-chalets text-2xl text-white mb-3 tracking-tight">SILVER</h3>
                <div className="text-dope-orange-500 font-bold text-lg mb-2">$250 - $749</div>
                <div className="text-gray-400 text-sm mb-6">Getting warmed up</div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                    <span className="text-sm">7% cash back</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                    <span className="text-sm">$50 birthday gift</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                    <span className="text-sm">Early sale access</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                    <span className="text-sm">Free shipping $75+</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-gray-300 rounded-full mr-3"></span>
                    <span className="text-sm">Quarterly surprise box</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  SPEND $250 THIS YEAR
                </div>
              </div>
            </div>

            {/* GOLD Tier - Featured */}
            <div className="bg-gradient-to-b from-yellow-500/25 to-yellow-600/15 border-2 border-yellow-500/60 rounded-2xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  🔥 MOST POPULAR 🔥
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl">🥇</span>
                </div>
                <h3 className="font-chalets text-2xl text-white mb-3 tracking-tight">GOLD</h3>
                <div className="text-dope-orange-500 font-bold text-lg mb-2">$750 - $1,999</div>
                <div className="text-yellow-400 text-sm mb-6 font-semibold">Now we're talking!</div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-sm font-medium">10% cash back</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-sm">$100 birthday gift</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-sm">48hr early access</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-sm font-bold text-yellow-400">FREE shipping always</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-sm">Monthly VIP box</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    <span className="text-sm">Exclusive drops</span>
                  </div>
                </div>

                <div className="text-xs text-yellow-500 font-bold">
                  SPEND $750 THIS YEAR
                </div>
              </div>
            </div>

            {/* PLATINUM Tier - Ultimate */}
            <div className="bg-gradient-to-b from-dope-orange-500/30 to-dope-orange-600/20 border-2 border-dope-orange-500/70 rounded-2xl p-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <span className="bg-gradient-to-r from-dope-orange-500 to-dope-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  💎 ULTIMATE VIP 💎
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-dope-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-dope-orange-500/5 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-dope-orange-500 to-dope-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="font-chalets text-2xl text-white mb-3 tracking-tight">PLATINUM</h3>
                <div className="text-dope-orange-500 font-bold text-lg mb-2">$2,000+</div>
                <div className="text-dope-orange-400 text-sm mb-6 font-bold">ABSOLUTE LEGEND STATUS</div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3 animate-pulse"></span>
                    <span className="text-sm font-bold text-dope-orange-400">15% cash back</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                    <span className="text-sm font-semibold">$200 birthday gift</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                    <span className="text-sm">72hr VIP early access</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                    <span className="text-sm font-bold text-dope-orange-400">FREE priority shipping</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                    <span className="text-sm">Weekly VIP box</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                    <span className="text-sm font-semibold">Personal concierge</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                    <span className="text-sm">Invite-only events</span>
                  </div>
                </div>

                <div className="text-xs text-dope-orange-500 font-bold animate-pulse">
                  SPEND $2,000+ THIS YEAR
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - DOPE Style */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chalets text-5xl lg:text-7xl text-white mb-6 tracking-tight">
              IT'S <span className="text-dope-orange-500">STUPID SIMPLE</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-4">
              No hoops to jump through. No fine print bullsh*t. Just pure rewards.
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Here's exactly how we hook you up with the VIP treatment you deserve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Sign Up Free</h3>
              <p className="text-gray-300">
                Create your DOPE CITY account and automatically join our STARTER tier
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Earn Points</h3>
              <p className="text-gray-300">
                Get 1 point for every $1 spent, plus bonus points for reviews and referrals
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Level Up</h3>
              <p className="text-gray-300">
                Your annual spending automatically upgrades your tier and unlocks better rewards
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Redeem & Enjoy</h3>
              <p className="text-gray-300">
                Use points for discounts, get exclusive products, and enjoy VIP perks
              </p>
            </div>
          </div>

          {/* Bonus Ways to Earn */}
          <div className="mt-16 bg-gradient-to-r from-dope-orange-500/10 to-dope-orange-600/10 border border-dope-orange-500/20 rounded-xl p-8">
            <h3 className="font-chalets text-2xl text-white mb-6 text-center tracking-tight">
              BONUS WAYS TO EARN POINTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-lg font-bold text-white">+50 Points</div>
                <div className="text-sm text-gray-300">Write a Product Review</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-lg font-bold text-white">+100 Points</div>
                <div className="text-sm text-gray-300">Refer a Friend</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎂</div>
                <div className="text-lg font-bold text-white">+200 Points</div>
                <div className="text-sm text-gray-300">Birthday Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <div className="text-lg font-bold text-white">+25 Points</div>
                <div className="text-sm text-gray-300">Follow Social Media</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - DOPE Style */}
      <section className="py-24 bg-gradient-to-r from-dope-orange-600 via-dope-orange-500 to-dope-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-chalets text-5xl lg:text-8xl text-white mb-8 tracking-tight" style={{ textShadow: '3px 3px 12px rgba(0, 0, 0, 0.5)' }}>
            READY TO GET <span className="text-black">DOPE</span>?
          </h2>
          <p className="text-2xl lg:text-3xl text-white/95 mb-4 font-bold max-w-4xl mx-auto" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' }}>
            Join thousands of VIP members already living the high life
          </p>
          <p className="text-lg text-white/80 mb-12 max-w-3xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)' }}>
            Start earning points immediately. No waiting period, no minimum purchase. Just pure rewards from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Link
              href="/auth/signup"
              className="group relative bg-black text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">JOIN THE VIP CLUB</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <div className="text-center">
              <div className="text-white font-bold text-xl mb-1" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>100% FREE FOREVER</div>
              <div className="text-white/80 text-sm" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>No hidden fees, no BS</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">15,000+</div>
              <div className="text-white/80 text-sm">VIP Members</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">$2.3M+</div>
              <div className="text-white/80 text-sm">Cash Back Paid</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-white/80 text-sm">Member Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
