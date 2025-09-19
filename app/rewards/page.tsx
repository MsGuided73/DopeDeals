import Image from 'next/image';
import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import DopeClubSignup from '../../components/DopeClubSignup';

export const metadata = {
  title: 'DOPE CITY Rewards | VIP Club & Loyalty Program',
  description: 'Join the DOPE CITY VIP Club and earn exclusive rewards, early access to new products, birthday gifts, and more. Premium cannabis culture loyalty program.',
  keywords: 'DOPE CITY rewards, VIP club, loyalty program, cannabis rewards, exclusive access, birthday gifts',
};

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Global Masthead */}
      <GlobalMasthead />

      {/* DOPE CLUB Title Bar with Image */}
      <section className="relative bg-black py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/collections/msguided1618_32857_DOPE_CITY_Website_Hero_photo_realistic_skyli_541173d6-7a18-4b44-bb80-8b203b18d126.png"
              alt="DOPE CITY - Premium Cannabis Culture Hero Image"
              width={1200}
              height={300}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 py-16">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-chalets text-4xl lg:text-6xl text-white mb-6 tracking-tighter">
            VIP <span className="text-dope-orange-500">REWARDS PROGRAM</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the DOPE CLUB and unlock exclusive rewards, early access, and premium perks
          </p>
        </div>
      </section>

      {/* VIP Club Image Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/VIP%20Club%20Image%20Only.png"
              alt="DOPE CITY VIP Club - Exclusive Membership Benefits"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chalets text-4xl lg:text-5xl text-white mb-4 tracking-tight">
              VIP MEMBERSHIP TIERS
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your level of exclusivity and unlock premium benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bronze Tier */}
            <div className="bg-gradient-to-b from-amber-900/20 to-amber-800/10 border border-amber-600/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <h3 className="font-chalets text-2xl text-white mb-4 tracking-tight">BRONZE</h3>
              <p className="text-gray-300 mb-6">Entry level rewards and perks</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  5% back in rewards
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Birthday gift
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Member-only deals
                </li>
              </ul>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Join Bronze
              </button>
            </div>

            {/* Silver Tier */}
            <div className="bg-gradient-to-b from-gray-400/20 to-gray-500/10 border border-gray-400/30 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-black font-bold text-xl">S</span>
              </div>
              <h3 className="font-chalets text-2xl text-white mb-4 tracking-tight">SILVER</h3>
              <p className="text-gray-300 mb-6">Enhanced rewards and early access</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  8% back in rewards
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Early access to sales
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Premium birthday gift
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Free shipping on orders $75+
                </li>
              </ul>
              <button className="w-full bg-gray-400 hover:bg-gray-500 text-black font-bold py-3 px-6 rounded-lg transition-colors">
                Join Silver
              </button>
            </div>

            {/* Gold Tier - Featured */}
            <div className="bg-gradient-to-b from-dope-orange-500/20 to-dope-orange-600/10 border-2 border-dope-orange-500/50 rounded-xl p-8 text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-dope-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-dope-orange-500 to-dope-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h3 className="font-chalets text-2xl text-white mb-4 tracking-tight">GOLD VIP</h3>
              <p className="text-gray-300 mb-6">Ultimate VIP experience</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                  10% back in rewards
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                  Exclusive product access
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                  VIP birthday box
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                  Free shipping on all orders
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-dope-orange-500 rounded-full mr-3"></span>
                  Priority customer support
                </li>
              </ul>
              <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Join Gold VIP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chalets text-4xl lg:text-5xl text-white mb-4 tracking-tight">
              HOW IT WORKS
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Start earning rewards with every purchase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Sign Up</h3>
              <p className="text-gray-300">
                Create your DOPE CITY account and join our rewards program for free
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Shop & Earn</h3>
              <p className="text-gray-300">
                Earn points on every purchase and unlock higher tier benefits
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-dope-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Redeem Rewards</h3>
              <p className="text-gray-300">
                Use your points for discounts, exclusive products, and special perks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dope-orange-600 to-dope-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-chalets text-4xl lg:text-5xl text-white mb-6 tracking-tight">
            READY TO JOIN THE VIP CLUB?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start earning exclusive rewards and unlock premium benefits today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-dope-orange-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join Now - It's Free
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white hover:bg-white hover:text-dope-orange-600 font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
