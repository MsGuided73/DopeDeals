'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PipesInfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-dope-orange-500 transition-colors">
                Online Headshop
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">Hand Pipes</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              🌀 Glass Pipes — The Real Ones Know
            </h1>

            {/* Initial Description */}
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                From the thinkers to the tokers — some of history's brightest minds sparked their best ideas through a pipe.
                Around here, that tradition's alive and well. Whether you're after a clean glass spoon, a wild piece of hand-blown art,
                or a no-nonsense one-hitter for the road, Highway 420's got your back.
              </p>
            </div>

            {/* Expandable Content */}
            <div className="mt-8">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center text-dope-orange-500 hover:text-dope-orange-600 font-medium transition-colors text-lg"
              >
                {isExpanded ? 'Show less about pipes' : 'Learn everything about pipes'}
                <svg
                  className={`ml-2 h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Expandable Content */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-8 text-gray-700">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">💭 Why Pipes Still Reign Supreme</h2>
                    <p className="text-lg">
                      Some things never go out of style — glass pipes are one of 'em. They're easy, portable, and they just work.
                      No batteries, no wires, no tech—just you, your herb, and a little fire. Plus, the designs these days?
                      Straight-up art. Every color, every shape, every mood.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 How to Light It Right</h2>
                    <p className="text-lg mb-4">
                      If you're new to pipes, don't stress — they're built for simplicity.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6 mb-4">
                      <div className="font-mono text-sm space-y-1">
                        <div>Grind it. Pack it. Cover the carb hole. Spark it. Inhale. Uncover and clear.</div>
                      </div>
                    </div>
                    <p className="text-lg">
                      That's all there is to it.<br />
                      Even first-timers catch on fast — it's like muscle memory for relaxation.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🌍 Why You'll Always Keep One Around</h2>
                    <p className="text-lg">
                      Bongs are bulky. Papers burn fast. Pipes? They go everywhere.<br />
                      Pocket, purse, glove box, backpack — doesn't matter.<br />
                      They're the go-to move when you want a quick hit without setting up a whole scene.
                      Perfect for campfires, concerts, or that "five minutes before the movie starts" moment.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🧩 The Lineup</h2>
                    <p className="text-lg mb-4">
                      Not all pipes hit the same. Here's how to find your match:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Spoon Pipes</strong> – The everyday classic. Deep bowl, side carb, clean draw.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>One-Hitters</strong> – Tiny. Discreet. Built for stealth seshes and quick hits.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Double Bowls</strong> – Two bowls, one mission: less refilling, more chilling.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Steamrollers</strong> – Big airflow, bold flavor. Not for the faint-hearted.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Dugouts</strong> – Slide-out stash, built-in pipe. Ultimate pocket setup.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Chillums</strong> – Simple, straight shooters. No frills, all fire.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Glass Blunts</strong> – The joint's smarter cousin. Same vibe, less hassle.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Sherlock Pipes</strong> – Curved, classy, and undeniably iconic.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">⚗️ Pick Your Material</h2>
                    <p className="text-lg mb-4">
                      Different materials, different moods — all dope.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Hand-Blown Glass</strong> – Unique, heat-safe, and straight-up gorgeous.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Ceramic</strong> – Cool to the touch, artsy as hell.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Metal</strong> – Drop-proof durability with a smooth finish.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Clay</strong> – Handmade, painted, and packed with personality.
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <strong>Silicone</strong> – Virtually unbreakable. Perfect for road trips and festivals.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🔥 Featured Brands</h2>

                    <div className="mb-6">
                      <p className="text-lg mb-4">
                        <strong>Marley Natural</strong> — sleek, durable, timeless. Every piece feels intentional.
                        The walnut accents hit that perfect blend of class and comfort. From the compact Taster to the bold Smoked Glass Spoon,
                        these pipes prove function and beauty can share the same bowl.
                      </p>

                      <p className="text-lg mb-4">
                        <strong>Other Favorites:</strong>
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <strong>Marley Natural Rise Up Steamroller</strong> — pure power with a message.
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <strong>Stash Pipe</strong> — stash spot included. Portable genius.
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <strong>Horton Glass Pipe</strong> — pink elephant magic for the whimsical ones.
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <strong>Silicone Ice Cream Cone</strong> — because smoking can be fun too.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Pipes That Don't Break the Bank</h2>
                    <p className="text-lg">
                      Good glass doesn't have to cost a fortune.<br />
                      Silicone pipes start at $4.20 (yeah, we see what we did there), and we've got high-quality glass pieces under $50 that'll last you years.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">🧼 Keep It Fresh</h2>
                    <p className="text-lg mb-4">
                      A dirty pipe's a sad pipe.<br />
                      Quick clean guide:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6 mb-4">
                      <div className="font-mono text-sm space-y-1">
                        <div>Drop it in a bag with rubbing alcohol and salt.</div>
                        <div>Let it soak overnight.</div>
                        <div>Shake it like you mean it.</div>
                        <div>Rinse, dry, done.</div>
                      </div>
                    </div>
                    <p className="text-lg">
                      Your next hit will thank you.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">📍 Where to Find the Good Stuff</h2>
                    <p className="text-lg">
                      We're not hiding — Highway 420's got all the spoons, one-hitters, and art pieces you could dream of.
                      Order online, kick back, and we'll bring the smoke gear to your door. No guessing, no gatekeeping — just good glass and good times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                HAND PIPES CATEGORIES
                <svg className="ml-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h3>

              <ul className="space-y-3">
                <li>
                  <Link
                    href="/pipes?category=dab-straws"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Dab Straws
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipes?category=glass-pipes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Glass Pipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipes?category=metal-pipes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Metal Pipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipes?category=wood-pipes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Wood Pipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipes?category=silicone-pipes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Silicone Pipes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pipes?category=stone-pipes"
                    className="text-gray-600 hover:text-dope-orange-500 transition-colors"
                  >
                    Stone Pipes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
