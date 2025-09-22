import { Metadata } from 'next';
import Image from 'next/image';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';
import { Award, Users, Shield, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - DOPE CITY',
  description: 'Learn about DOPE CITY\'s mission to provide premium cannabis culture products and smoking accessories with exceptional service.',
};

export default function AboutPage() {
  return (
    <>
      <AgeVerification />
      <GlobalMasthead />
      
      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80')] bg-cover bg-center opacity-20"></div>
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-6xl md:text-8xl mb-6">
              ABOUT DOPE CITY
            </h1>
            <div className="w-32 h-1 bg-dope-orange-500 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Where premium meets street. We're more than a smoke shop – we're a culture, 
              a community, and your gateway to the finest cannabis accessories and lifestyle products.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Founded with a passion for cannabis culture and premium quality, DOPE CITY emerged 
                  from the streets with a mission to elevate the smoking experience. We understand 
                  that every session is personal, every piece tells a story, and every customer 
                  deserves the absolute best.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  From our carefully curated selection of glass pieces to cutting-edge vaporizers, 
                  we've built relationships with the most respected brands in the industry. Our team 
                  lives and breathes this culture, ensuring every product meets our exacting standards.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Today, DOPE CITY stands as a beacon for enthusiasts who demand authenticity, 
                  quality, and style in their cannabis accessories.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80"
                  alt="DOPE CITY Story"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our Values</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The principles that guide everything we do at DOPE CITY
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Award className="w-12 h-12 text-dope-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Premium Quality</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Only the finest materials and craftsmanship make it into our collection
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Users className="w-12 h-12 text-dope-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Community First</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We're built by the community, for the community, with respect and authenticity
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Shield className="w-12 h-12 text-dope-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Trust & Safety</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Secure transactions, age verification, and responsible business practices
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <Truck className="w-12 h-12 text-dope-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Fast & Reliable</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quick shipping, careful packaging, and exceptional customer service
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Meet the Team</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The passionate individuals behind DOPE CITY's success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">DC</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">DOPE CITY Founder</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Visionary leader with deep roots in cannabis culture and premium retail
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">CX</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Customer Experience</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Dedicated to ensuring every customer has an exceptional DOPE CITY experience
                </p>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">QC</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Quality Control</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Ensures every product meets our rigorous standards for quality and authenticity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-dope-orange-500 to-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Join the DOPE CITY Family</h2>
            <p className="text-xl mb-8 leading-relaxed">
              Experience the difference that passion, quality, and authenticity make. 
              Welcome to where premium meets street.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Shop Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-dope-orange-500 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
