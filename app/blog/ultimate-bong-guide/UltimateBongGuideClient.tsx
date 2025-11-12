'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, Share2, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import AgeVerification from '../../components/AgeVerification';
import GlobalMasthead from '../../components/GlobalMasthead';
import BlogComments from '../../components/comments/BlogComments';

export default function UltimateBongGuideClient() {
  const [isCommunityMember, setIsCommunityMember] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  // Check community membership status
  useEffect(() => {
    const checkCommunityMembership = async () => {
      try {
        // Check community membership using server-side authentication
        const membershipResponse = await fetch('/api/community/membership');
        if (membershipResponse.ok) {
          const membershipData = await membershipResponse.json();
          setIsCommunityMember(membershipData.isMember || false);
          setUserId(membershipData.userId || undefined);
        } else {
          setIsCommunityMember(false);
          setUserId(undefined);
        }
      } catch (error) {
        console.error('Error checking membership:', error);
        setIsCommunityMember(false);
        setUserId(undefined);
      }
    };

    checkCommunityMembership();
  }, []);

  return (
    <>
      <AgeVerification />
      <GlobalMasthead />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl mb-6 font-bold tracking-tight">
              The Ultimate Guide to Picking the Perfect Bong
            </h1>
            <div className="w-32 h-1 bg-dope-orange-500 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From desktop beasts to pocket rockets — bongs that hit different. Water filtration, massive rips, and glass art that belongs in museums (or your living room).
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-8">
              <span className="flex items-center gap-2">
                <span className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">👤</span>
                DOPE CITY Team
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                📖 12 min read
              </span>
              <span>•</span>
              <span>January 15, 2024</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center gap-2 text-dope-orange hover:text-orange-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>

          {/* Social Share & Actions */}
          <div className="flex justify-between items-center mb-12 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-dope-orange transition-colors">
                <ThumbsUp className="w-5 h-5" />
                <span className="text-sm">Helpful</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-dope-orange transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Education</span>
              <span>•</span>
              <span>📖 Updated January 15, 2024</span>
            </div>
          </div>

          {/* Article Body */}
          <article className="prose prose-lg max-w-none dark:prose-invert">
            <h2>Types of Bongs Explained</h2>
            <p>The world of bongs is surprisingly vast. Here's the breakdown you need to navigate it successfully.</p>

            <h3>Beaker Bongs</h3>
            <p>The classic choice. Wide base means bigger rips, more water for filtration. Perfect for heavy hitters who want that deep breathing session feel.</p>
            <p><strong>Best For:</strong> Daily use, large groups, heavy smokers</p>

            <h3>Straight Tube Bongs</h3>
            <p>The minimalist approach. Less water, more direct hits. Less diffusion means more intense rips. Mobile-friendly and great for quick sessions.</p>
            <p><strong>Best For:</strong> Travel, personal use, intense hitting</p>

            <h2>What to Look For in Quality</h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Pro Tip</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Always check the thickness of the glass at the bottom. Thin glass heats up too fast and can break more easily.
              </p>
            </div>

            <ul>
              <li><strong>Glass Quality:</strong> Schott or German glass is king. American-made glass is a solid second.</li>
              <li><strong>Weight Distribution:</strong> Feel the balance. Heavy bottom with wide base = stable.</li>
              <li><strong>Joint Size:</strong> 14mm male is standard. 18mm male for those monster pieces.</li>
              <li><strong>Workmanship:</strong> Look for smooth rims, evenly distributed colors.</li>
            </ul>

            <h2>Beginner vs Advanced Bong Styles</h2>
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200">
                <h3 className="text-green-800 dark:text-green-200 mb-4">🌱 Beginner Bong Styles</h3>
                <ul className="text-green-700 dark:text-green-300 space-y-2">
                  <li>• Basic beaker bongs ($20-50)</li>
                  <li>• Simple straight tubes</li>
                  <li>• No complex percs or features</li>
                  <li>• Quadruple-walled for durability</li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200">
                <h3 className="text-red-800 dark:text-red-200 mb-4">🔥 Advanced Bong Styles</h3>
                <ul className="text-red-700 dark:text-red-300 space-y-2">
                  <li>• Multi-percolator pieces ($100+)</li>
                  <li>• Scientific glass (multiple chambers)</li>
                  <li>• Custom artwork and designs</li>
                  <li>• Rare materials and techniques</li>
                </ul>
              </div>
            </div>

            <h2>Size Matters: Choosing the Right Scale</h2>
            <table className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm my-8">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4">Size Category</th>
                  <th className="text-left p-4">Height Range</th>
                  <th className="text-left p-4">Best For</th>
                  <th className="text-left p-4">Water Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium">Mini/Travel</td>
                  <td className="p-4">6-12 inches</td>
                  <td className="p-4">On-the-go, discreet use</td>
                  <td className="p-4">50-100ml</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium">Standard</td>
                  <td className="p-4">12-18 inches</td>
                  <td className="p-4">Personal use, home sessions</td>
                  <td className="p-4">100-300ml</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Large/Master</td>
                  <td className="p-4">18+ inches</td>
                  <td className="p-4">Group sessions, display pieces</td>
                  <td className="p-4">300ml+</td>
                </tr>
              </tbody>
            </table>

            <h2>Percolators: Smooth Hits or Marketing BS?</h2>
            <p>Percolators add diffusion that reduces harshness and filters plant material better. However, they cost more and are harder to clean.</p>

            <h2>The Art of Glass: Aesthetic vs Functionality</h2>
            <p>Great glass works first and looks good second. Function determines quality - aesthetics are the bonus.</p>

            <h2>Budget Breakdown & What to Expect</h2>
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$20-50</div>
                <h3 className="font-semibold mb-4">Beginner Level</h3>
                <p className="text-sm">Basic functional bongs. Good for trying out the hobby.</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$50-150</div>
                <h3 className="font-semibold mb-4">Mid-Range</h3>
                <p className="text-sm">Quality glass with good airflow and durability. Best value.</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">$150+</div>
                <h3 className="font-semibold mb-4">Premium</h3>
                <p className="text-sm">Art pieces with advanced percs and rare materials.</p>
              </div>
            </div>

            <h2>Maintenance & Care Tips</h2>
            <ul>
              <li>• Always clean after use</li>
              <li>• Use proper cleaning solutions</li>
              <li>• Store in dry, safe place</li>
              <li>• Handle glass pieces carefully</li>
              <li>• Regular deep cleaning prevents buildup</li>
            </ul>

            <h2>Common Mistakes to Avoid</h2>
            <ol>
              <li>Buying based on looks alone</li>
              <li>Not testing airflow before purchase</li>
              <li>Skipping regular cleaning</li>
              <li>Purchasing from untrustworthy sources</li>
              <li>Assuming all glass is created equal</li>
              <li>Not considering joint size compatibility</li>
            </ol>

            <h2>Final Thoughts: Your Bong Selection</h2>
            <p>Choosing the perfect bong depends on your needs, budget, and experience level. Take your time, research carefully, and don't be afraid to ask questions. The right bong enhances your smoking experience for years to come.</p>

            <p className="text-center py-8">
              <Link href="/products?q=bong" className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
                Shop Bongs at DOPE CITY
              </Link>
            </p>
          </article>

          {/* Comments Section */}
          <div className="mt-16">
            <BlogComments
              blogSlug="ultimate-bong-guide"
              isCommunityMember={isCommunityMember}
              userId={userId}
            />
          </div>
        </div>
      </div>
    </>
  );
}
