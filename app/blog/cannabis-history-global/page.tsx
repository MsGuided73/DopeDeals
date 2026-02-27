'use client';
import { useState } from 'react';
import Link from 'next/link';
import AgeVerification from '../../components/AgeVerification';
import GlobalMasthead from '../../components/GlobalMasthead';
import { ArrowLeft, Clock, User, Share2, Bookmark, MessageCircle } from 'lucide-react';
import BlogFooter from '../../components/BlogFooter';

export default function CannabisHistoryArticle() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#000] text-white selection:bg-[#ff6b35] selection:text-black overflow-x-hidden font-sans pb-0 relative">
      {/* NOISE OVERLAY */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      <div className="relative z-10 mix-blend-difference">
        <GlobalMasthead />
      </div>
      <AgeVerification />

      {/* FULL WIDTH HERO BACKGROUND */}
      <div className="relative w-full pt-16 pb-48 flex flex-col items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/Highway420_assets/Blog/History%20of%20Cannabis.jpg')" }}
        />
        {/* Gradient Overlay for text readability & merging into black */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10 pointer-events-none" />
        
        {/* Content Container */}
        <div className="relative z-20 w-full mt-16">
          {/* Back Button */}
          <div className="mb-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-[#ff6b35] hover:text-white font-bold tracking-widest uppercase text-xs transition-colors group bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </div>

          {/* Article Header Container */}
          <header className="relative mb-0 py-20 md:py-28 flex justify-center">
            {/* Constrained width wrapper — glass panel + text both live here */}
            <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-8">
              {/* Glassmorphic Panel — same width as wrapper, fades out left & right */}
              <div 
                className="absolute -inset-x-40 -inset-y-28 bg-black/75 backdrop-blur-2xl"
                style={{
                  maskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 45%, transparent 80%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 50%, black 45%, transparent 80%)',
                }}
              />

            {/* Text Content — sits on top of the glass */}
            <div className="relative z-10 pl-8 md:pl-16">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-dope-orange text-white text-sm font-semibold rounded-full">
                  Culture
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                  History
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9]">
                The Wild Ride of <span className="text-[#ff6b35]">Weed</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light leading-relaxed border-l-2 border-[#ff6b35] pl-6 max-w-4xl">
                Look, cannabis has been getting people lifted for longer than most countries have been on maps.
                From ancient Chinese medicine to underground counterculture to today's multi-billion dollar industry –
                this plant has seen some serious history. Let's break down the wild journey of weed.
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-white/10 pb-8">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Highway 420 Crew</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>January 15, 2024 • 10 min read</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked ? 'text-dope-orange bg-orange-100' : 'text-gray-600 hover:text-dope-orange hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 rounded-full text-gray-600 hover:text-dope-orange hover:bg-gray-100 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Share on Twitter
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Share on Facebook
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Copy Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>  {/* end text content div */}
            </div>  {/* end constrained wrapper div */}
          </header>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 relative z-20 -mt-24">
        {/* Article Frame */}
        <div className="bg-white text-black p-8 md:p-12 lg:p-16 rounded-sm shadow-[0_0_40px_rgba(255,107,53,0.1)] border-4 border-[#ff6b35] relative mb-20 overflow-hidden">
          <article className="prose prose-lg prose-gray max-w-none">            {/* Ancient Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-0">Ancient Beginnings: The OG Days</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We're talking way back – like 10,000+ years ago. Archaeological evidence shows humans have been cultivating cannabis longer than we've had written language. This plant didn't just grow; it was one of our first agricultural experiments.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                <h3 className="text-xl font-bold text-amber-800 mb-3">🏯 China (2700 BCE)</h3>
                <p className="text-amber-700">
                  Ancient Chinese texts prescribe cannabis for pain relief, inflammation, and digestive issues.
                  Hemp fibers were already being used for rope, paper, and textiles. The Chinese basically invented the hemp industry.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🕉️ India (1000 BCE)</h3>
                <p className="text-blue-700">
                  In Vedic traditions, cannabis (bhang) was considered sacred, associated with Shiva.
                  Consumed as a drink or paste in religious rituals, believed to enhance meditation and spiritual enlightenment.
                </p>
              </div>
            </div>
          </div>
          
          {/* Colonial Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Colonial America: Hemp Hustle</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Fast forward to the 1600s, and cannabis hits North America through European colonization.
              But here's the plot twist – it wasn't about getting high. It was about getting rich.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-dope-orange">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💰 The Hemp Gold Rush</h3>
              <p className="text-gray-700 mb-4">
                Hemp was so crucial to the colonies that some areas required farmers to grow it by law.
                George Washington and Thomas Jefferson were hemp farmers themselves. The plant was used for:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-dope-orange mt-1">•</span>
                  <span><strong>Sails and rigging</strong> for ships (navy strength material)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dope-orange mt-1">•</span>
                  <span><strong>Ropes and cordage</strong> (stronger than manila hemp)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dope-orange mt-1">•</span>
                  <span><strong>Paper and textiles</strong> (early American currency was printed on hemp paper)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dope-orange mt-1">•</span>
                  <span><strong>Medicine</strong> (pain relief, sleep aids, migraine treatments)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Prohibition Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Dark Ages: Prohibition & Propaganda</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Despite thousands of years of productive use, the 20th century brought the hammer down.
              A combination of racism, politics, and corporate greed turned cannabis from medicine to menace.
            </p>

            <div className="bg-red-50 p-8 rounded-lg border border-red-200 mb-6">
              <h3 className="text-xl font-bold text-red-800 mb-4">🎭 The Real Story Behind Prohibition</h3>
              <p className="text-red-700 mb-4">
                The criminalization wasn't about public health – it was about control and profit:
              </p>
              <ul className="space-y-2 text-red-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Racial targeting</strong> – Propaganda specifically targeted Mexican immigrants and Black communities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Corporate competition</strong> – Hemp threatened cotton, timber, and pharmaceutical industries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Media manipulation</strong> – "Reefer Madness" style propaganda created public hysteria</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Counterculture Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Revolution: Counterculture & Comeback</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Cannabis never really went away. The 1960s and 1970s counterculture movement brought it back into the spotlight,
              and this time it wasn't going anywhere.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
                <div className="text-4xl mb-3">✌️</div>
                <h3 className="font-bold text-purple-800 mb-2">Hippie Movement</h3>
                <p className="text-sm text-purple-700">Symbol of rebellion and free love</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                <div className="text-4xl mb-3">🎵</div>
                <h3 className="font-bold text-green-800 mb-2">Music & Arts</h3>
                <p className="text-sm text-green-700">Jazz, rock, and creative inspiration</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="font-bold text-blue-800 mb-2">Scientific Discovery</h3>
                <p className="text-sm text-blue-700">Endocannabinoid system revealed</p>
              </div>
            </div>
          </div>

          {/* Modern Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Modern Renaissance: Legalization & Innovation</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Today, cannabis is experiencing a renaissance. From medical breakthroughs to technological innovations,
              the plant is being appreciated for its full potential.
            </p>

            <div className="bg-gradient-to-r from-dope-orange to-orange-600 text-white p-8 rounded-lg mb-6">
              <h3 className="text-2xl font-bold mb-4">🚀 Today's Cannabis Revolution</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Medical Advancements</h4>
                  <ul className="space-y-1 text-orange-100">
                    <li>• Chronic pain management</li>
                    <li>• Epilepsy treatment (CBD)</li>
                    <li>• Anxiety and PTSD therapy</li>
                    <li>• Cancer symptom relief</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Technological Innovation</h4>
                  <ul className="space-y-1 text-orange-100">
                    <li>• Precision vaporizers</li>
                    <li>• Solventless extracts</li>
                    <li>• Temperature control devices</li>
                    <li>• Lab-tested products</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Future Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Future: Where We're Headed</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Cannabis has come full circle – from ancient medicine to prohibition and back to mainstream acceptance.
              As legalization expands globally, new research and technology continue shaping how we use and understand this remarkable plant.
            </p>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">🌱 What's Next</h3>
              <p className="text-green-700">
                From vaporization and dabbing to solventless extracts and precision temperature control,
                modern cannabis consumption is more advanced than ever. Devices like Puffco's e-rigs allow users
                to experience concentrates with precision and efficiency, bringing thousands of years of cannabis
                history into the modern era.
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gray-900 text-white p-8 rounded-lg text-center mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-4">One Thing's Clear: Cannabis is Here to Stay</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              After 10,000+ years of human relationship with this plant, one thing is crystal clear:
              cannabis isn't going anywhere. It's evolved from ancient medicine to modern industry,
            </p>
          </div>
        </article>
      </div>

        {/* NEW BLOG FOOTER */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <BlogFooter />
        </div>
      </main>
    </div>
  );
}
