import { Metadata } from 'next';
import Image from 'next/image';
import GlobalMasthead from '../components/GlobalMasthead';
import { Users, Star, Truck, Shield, Gift, Heart } from 'lucide-react';

// Slow-changing rewards info — refresh daily.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Ride with Us - Join the Highway 420 Community',
  description: 'Become part of the Highway 420 community. Enjoy exclusive membership benefits, premium products, and connect with fellow cannabis enthusiasts.',
  keywords: 'Highway 420 membership, cannabis community, premium benefits, exclusive access, smoke shop rewards',
  openGraph: {
    title: 'Ride with Us - Join the Highway 420 Community',
    description: 'Become part of the Highway 420 community. Enjoy exclusive membership benefits, premium products, and connect with fellow cannabis enthusiasts.',
    type: 'website',
  },
};

export default function RideWithUsPage() {
  return (
    <>
      <GlobalMasthead />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <h1 className="chalets-title text-6xl md:text-8xl mb-6 highway-text-shadow">
              RIDE THE HIGHWAY.<br />
              <span className="text-green-600">JOIN THE COMMUNITY.</span>
            </h1>
            <div className="w-32 h-1 bg-green-600 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Highway 420 isn't just a smoke shop – it's a movement. A community of
              passionate individuals who live for the culture, celebrate the craft,
              and share the ultimate smoking experience.
            </p>
          </div>
        </div>

        {/* Community Description */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="chalets-title text-4xl font-normal mb-6 text-gray-900 dark:text-white">
                  More Than Just Shopping
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  At Highway 420, we believe that the best experiences happen when great
                  minds and passionate hearts come together. Our community isn't just about
                  products – it's about connection, education, and celebrating the art of
                  cannabis culture.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  Whether you're a seasoned enthusiast or just beginning your journey,
                  you'll find a welcoming space where knowledge is shared, experiences
                  are celebrated, and the bonds of community run deep.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  Join us on this highway of discovery, where every mile brings new
                  friends, unforgettable experiences, and the finest selection of
                  premium cannabis products available anywhere.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80"
                  alt="Highway 420 Community"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="chalets-title text-4xl font-normal mb-4 text-gray-900 dark:text-white">
                Membership Benefits
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Exclusive perks and premium experiences await those who ride with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 highway-hover-lift">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">VIP Access</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Be the first to know about new product drops, exclusive releases,
                  and limited-edition items before they hit the general market.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 highway-hover-lift">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Gift className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Exclusive Discounts</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Enjoy member-only pricing on premium products, special bundle deals,
                  and seasonal promotions that aren't available to the public.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 highway-hover-lift">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Community Events</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join exclusive member-only events, workshops, and gatherings where
                  you can connect with fellow enthusiasts and industry experts.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 highway-hover-lift">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Truck className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Priority Shipping</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Skip the line with expedited shipping and free delivery on orders
                  over $100. Your premium products arrive faster than ever.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 highway-hover-lift">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Personal Concierge</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get personalized recommendations and expert guidance from our team
                  of cannabis specialists who know your preferences inside out.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-800 highway-hover-lift">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Loyalty Rewards</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Earn points on every purchase that can be redeemed for exclusive
                  merchandise, experiences, and premium product upgrades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-green-400 to-green-700 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="chalets-title text-4xl font-normal mb-6 highway-text-shadow">
              Ready to Ride?
            </h2>
            <p className="text-xl mb-8 leading-relaxed max-w-2xl mx-auto">
              Join the Highway 420 community today and experience the difference
              that comes with being part of something bigger. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/h420-vip" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 highway-glow-green text-center">
                Join the Community
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
