"use client";

import { useState } from 'react';
import {
  BarChart3,
  Search,
  RefreshCw,
  FileText,
  AlertTriangle,
  CheckCircle,
  Link as LinkIcon,
  TrendingUp,
  Map,
  Tag,
  Eye,
  Edit,
  ArrowRight,
  Globe,
  Settings
} from 'lucide-react';

const AdminSEOPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPage, setSelectedPage] = useState<any>(null);

  const seoPages = [
    { id: 1, url: '/bongs/grav-helix-beaker', title: 'GRAV Helix Beaker Bong 14" - Premium Borosilicate', score: 85, status: 'Good', issues: ['Meta description too short'] },
    { id: 2, url: '/dab-rigs/hemper-ufo-vortex', title: 'Hemper UFO Vortex Rig 6" Dual Chamber', score: 92, status: 'Excellent', issues: [] },
    { id: 3, url: '/pipes/calibear-crystal-arch', title: 'CaliBear Crystal Arch Glass Spoon Pipe', score: 67, status: 'Needs Work', issues: ['Missing alt text', 'No H1 tag', 'Thin content'] },
    { id: 4, url: '/category/bongs', title: 'Water Pipes & Bongs - Premium Glass Collection', score: 78, status: 'Good', issues: ['Duplicate H2 tags'] },
    { id: 5, url: '/brands/grav', title: 'GRAV Brand Collection - Scientific Glass Pipes & Bongs', score: 88, status: 'Good', issues: ['Internal linking could improve'] }
  ];

  const keywords = [
    { keyword: 'glass bongs', position: 3, volume: 8100, difficulty: 65, trend: 'up' },
    { keyword: 'dab rigs', position: 7, volume: 5400, difficulty: 58, trend: 'stable' },
    { keyword: 'water pipes', position: 12, volume: 3600, difficulty: 72, trend: 'down' },
    { keyword: 'smoking accessories', position: 5, volume: 2900, difficulty: 45, trend: 'up' },
    { keyword: 'hand pipes', position: 15, volume: 1800, difficulty: 52, trend: 'stable' }
  ];

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO & Content</h1>
          <p className="text-gray-600 mt-1">Optimize your store visibility and manage search engine performance</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium">
            <Map className="w-4 h-4" />
            Generate Sitemap
          </button>
          <button className="bg-dope-orange text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 font-semibold shadow-sm transition-all">
            <RefreshCw className="w-4 h-4" />
            Run SEO Audit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-2 w-fit mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'pages', label: 'Page Optimization', icon: <Globe className="w-4 h-4" /> },
          { id: 'keywords', label: 'Keywords', icon: <Search className="w-4 h-4" /> },
          { id: 'schema', label: 'Schema', icon: <Tag className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-dope-orange text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pages Indexed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +12 this week
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg. SEO Score</p>
              <p className="text-2xl font-bold text-green-600 mt-1">82</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +3 points
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Organic Traffic</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">15.4K</p>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> +8.2% this month
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Issues Found</p>
              <p className="text-2xl font-bold text-red-600 mt-1">23</p>
              <p className="text-xs text-red-600 mt-2 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" /> 5 critical
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> Critical SEO Issues
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-sm font-bold text-red-900">5 pages missing H1 tags</p>
                  <p className="text-xs text-red-700 mt-1">Product pages need proper heading structure for better indexing.</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-sm font-bold text-yellow-900">12 images missing alt text</p>
                  <p className="text-xs text-yellow-700 mt-1">Accessibility and image search rankings are negatively impacted.</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-sm font-bold text-orange-900">Slow Page Speed on Mobile</p>
                  <p className="text-xs text-orange-700 mt-1">6 high-traffic pages are taking longer than 2.5s to load.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> Recent Improvements
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Updated 25 meta descriptions</p>
                    <p className="text-xs text-gray-500">Optimized for high-volume glass pipes keywords.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <LinkIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Added 15 internal links</p>
                    <p className="text-xs text-gray-500">Improved site crawlability and page authority distribution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pages Optimization Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pages by URL or title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-dope-orange focus:border-dope-orange"
              />
            </div>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black">
              Bulk Edit Meta Tags
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Page Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Issues</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {seoPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 truncate max-w-md">{page.title}</p>
                      <p className="text-xs text-blue-600 font-mono mt-1">{page.url}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold border ${getSEOScoreColor(page.score)}`}>
                        {page.score}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {page.issues.length > 0 ? (
                          page.issues.map((issue, idx) => (
                            <span key={idx} className="bg-red-50 text-red-700 text-[10px] px-2 py-0.5 rounded border border-red-100 font-medium">
                              {issue}
                            </span>
                          ))
                        ) : (
                          <span className="text-green-600 text-xs flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> No issues
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-dope-orange transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === 'keywords' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900">Keyword Performance</h3>
            <button className="text-sm text-dope-orange font-bold hover:underline">+ Add Tracking Keywords</button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {keywords.map((keyword, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{keyword.keyword}</p>
                  <p className="text-xs text-gray-500 mt-1">{keyword.volume.toLocaleString()} searches/mo</p>
                </div>
                <div className="flex items-center gap-12">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Position</p>
                    <div className="text-lg font-bold text-dope-orange">#{keyword.position}</div>
                  </div>
                  <div className="text-center w-24">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Difficulty</p>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full mt-2">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${keyword.difficulty}%` }}></div>
                    </div>
                  </div>
                  <div className="text-right w-12 text-lg">
                    {keyword.trend === 'up' ? '📈' : keyword.trend === 'down' ? '📉' : '➖'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSEOPage;
