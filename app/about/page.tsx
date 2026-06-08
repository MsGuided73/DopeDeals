import { Metadata } from 'next';
import Image from 'next/image';
import GlobalMasthead from '../components/GlobalMasthead';
import GlobalBreadcrumbs from '../components/GlobalBreadcrumbs';

export const metadata: Metadata = {
  title: 'About Us - Highway 420',
  description: 'Learn about Highway 420\'s mission to provide premium cannabis culture products at the best prices.',
};

// Brand page rarely changes — refresh once a day.
export const revalidate = 86400;

export default function AboutPage() {
  return (
    <>
      <GlobalMasthead />
      
      <div className="min-h-screen bg-white text-gray-900 py-12 md:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-8 flex justify-start">
            <GlobalBreadcrumbs paths={[{ name: 'About Us' }]} />
          </div>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-16 md:mb-24">
            <div className="relative w-32 h-32 md:w-48 md:h-48 flex-shrink-0">
              <Image
                src="https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/assets/logo_Highway420-official_transparent.png"
                alt="Highway 420 Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center text-center md:text-left md:-ml-2">
              <h1 className="text-[60px] md:text-[90px] font-display-twilight leading-tight mb-0 text-black whitespace-nowrap">
                ABOUT US
              </h1>
              <p className="text-lg md:text-2xl font-bold text-black tracking-tight whitespace-nowrap italic">
                Geared for Value. Driven by Culture.
              </p>
            </div>
          </div>

          {/* Mission Statement Content */}
          <div className="max-w-4xl space-y-12 text-xl md:text-2xl leading-snug font-medium text-gray-900">
            <p className="text-2xl md:text-3xl font-bold leading-tight">
              Smoking supplies cost too much….so we started Highway 420.
            </p>
            
            <p>
              We’ve streamlined supply and cut out layers of middleman mark-ups to bring people the dopest products at the best prices.
            </p>

            <p>
              But price is only part of the story because we’re more than a store.
            </p>

            <p>
              Highway 420 is a hub for culture, community, and elevated living. We champion our customers, work directly with trusted brands, share knowledge, and collaborate with the community to drive the culture forward.
            </p>

            <div className="pt-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 text-black">
                When you ride with us, you get more than products:
              </h2>
              
              <ul className="space-y-4 text-gray-950 font-semibold">
                {[
                  "Better pricing",
                  "Early access to new drops",
                  "Exclusive offers and private sales",
                  "Free product testers and other free perks",
                  "Invites to special events and private sales",
                  "Exclusive content and entertainment",
                  "Discreet packaging and dependable service"
                ].map((perk, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <span className="w-2 h-2 bg-black rounded-full flex-shrink-0" />
                    <span className="text-xl md:text-2xl tracking-tight">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-12 border-t border-gray-100">
              <p className="text-2xl md:text-3xl font-bold text-black leading-tight italic">
                We’re building a smarter way to shop — and a better community to ride with.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
