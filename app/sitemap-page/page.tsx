"use client";

import Link from 'next/link';
import { useState } from 'react';
import EnhancedSearchBar from '../components/EnhancedSearchBar';

interface PageInfo {
  path: string;
  name: string;
  status: 'completed' | 'needs-work' | 'missing';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export default function SiteMapPage() {
  const [filter, setFilter] = useState<'all' | 'completed' | 'needs-work' | 'missing'>('all');

  const pages: PageInfo[] = [
    // COMPLETED PAGES
    { path: '/', name: 'Homepage', status: 'completed', description: 'Landing page with enhanced search, collections grid, testimonials', priority: 'high' },
    { path: '/pre-rolls', name: 'Pre-Rolls Page', status: 'completed', description: 'Dedicated pre-rolls product page with Supabase integration', priority: 'high' },
    { path: '/pipes', name: 'Hand Pipes Page', status: 'completed', description: 'Hand pipes collection with product grid', priority: 'high' },
    { path: '/bongs', name: 'Bongs Page', status: 'completed', description: 'Bongs and water pipes collection', priority: 'high' },
    { path: '/products', name: 'All Products', status: 'completed', description: 'Main products listing with filters and search', priority: 'high' },
    { path: '/cart', name: 'Shopping Cart', status: 'needs-work', description: 'Cart page with masthead/nav (partially updated)', priority: 'high' },
    { path: '/checkout', name: 'Checkout', status: 'needs-work', description: 'Checkout process - needs masthead/nav and KajaPay integration', priority: 'high' },
    { path: '/auth', name: 'Authentication', status: 'completed', description: 'Sign in/up page with Supabase auth', priority: 'high' },
    { path: '/admin', name: 'Admin Dashboard', status: 'completed', description: 'Comprehensive admin panel with all management features', priority: 'medium' },
    
    // PAGES THAT NEED WORK
    { path: '/product/[id]', name: 'Product Detail', status: 'needs-work', description: 'Individual product pages - needs real data integration', priority: 'high' },
    { path: '/orders', name: 'Order History', status: 'needs-work', description: 'User order history - needs masthead/nav and real data', priority: 'medium' },
    { path: '/orders/[id]', name: 'Order Detail', status: 'needs-work', description: 'Individual order details - needs masthead/nav', priority: 'medium' },
    { path: '/brands', name: 'Brands Listing', status: 'needs-work', description: 'Brand directory - needs masthead/nav', priority: 'medium' },
    { path: '/brands/[id]', name: 'Brand Pages', status: 'needs-work', description: 'Individual brand pages - needs implementation', priority: 'medium' },
    { path: '/categories', name: 'Categories', status: 'needs-work', description: 'Category listing - needs masthead/nav', priority: 'medium' },
    { path: '/rewards', name: 'Loyalty Program', status: 'needs-work', description: 'Rewards/loyalty page - needs full implementation', priority: 'medium' },

    // MISSING PAGES - HIGH PRIORITY
    { path: '/account', name: 'User Account', status: 'missing', description: 'User profile, preferences, order history, payment methods', priority: 'high' },
    { path: '/account/profile', name: 'Profile Settings', status: 'missing', description: 'Edit profile, preferences, age verification status', priority: 'high' },
    { path: '/account/addresses', name: 'Address Book', status: 'missing', description: 'Manage shipping and billing addresses', priority: 'high' },
    { path: '/account/payment-methods', name: 'Payment Methods', status: 'missing', description: 'Saved payment methods, KajaPay integration', priority: 'high' },
    { path: '/search', name: 'Search Results', status: 'missing', description: 'Dedicated search results page with advanced filters', priority: 'high' },
    { path: '/wishlist', name: 'Wishlist', status: 'missing', description: 'User wishlist/favorites functionality', priority: 'high' },

    // MISSING PAGES - MEDIUM PRIORITY  
    { path: '/about', name: 'About Us', status: 'missing', description: 'Company story, mission, team information', priority: 'medium' },
    { path: '/contact', name: 'Contact Us', status: 'missing', description: 'Contact form, store locations, customer service', priority: 'medium' },
    { path: '/help', name: 'Help Center', status: 'missing', description: 'FAQ, support articles, troubleshooting', priority: 'medium' },
    { path: '/shipping', name: 'Shipping Info', status: 'missing', description: 'Shipping policies, rates, tracking information', priority: 'medium' },
    { path: '/returns', name: 'Returns Policy', status: 'missing', description: 'Return/refund policies and process', priority: 'medium' },
    { path: '/privacy', name: 'Privacy Policy', status: 'missing', description: 'Privacy policy and data handling', priority: 'medium' },
    { path: '/terms', name: 'Terms of Service', status: 'missing', description: 'Terms and conditions, user agreements', priority: 'medium' },
    { path: '/age-verification', name: 'Age Verification', status: 'missing', description: 'Age verification process and compliance', priority: 'medium' },
    { path: '/compliance', name: 'Compliance Info', status: 'missing', description: 'Legal compliance, regulations, disclaimers', priority: 'medium' },

    // MISSING PAGES - LOW PRIORITY
    { path: '/blog', name: 'Blog/News', status: 'missing', description: 'Content marketing, product news, industry updates', priority: 'low' },
    { path: '/reviews', name: 'Customer Reviews', status: 'missing', description: 'Product reviews and ratings system', priority: 'low' },
    { path: '/gift-cards', name: 'Gift Cards', status: 'missing', description: 'Purchase and redeem gift cards', priority: 'low' },
    { path: '/wholesale', name: 'Wholesale Portal', status: 'missing', description: 'B2B wholesale ordering and account management', priority: 'low' },
    { path: '/affiliate', name: 'Affiliate Program', status: 'missing', description: 'Affiliate/referral program signup and tracking', priority: 'low' },
    { path: '/careers', name: 'Careers', status: 'missing', description: 'Job listings and company culture', priority: 'low' },
    { path: '/press', name: 'Press Kit', status: 'missing', description: 'Media resources, press releases, brand assets', priority: 'low' },
  ];

  const filteredPages = pages.filter(page => filter === 'all' || page.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'needs-work': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Masthead */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-normal tracking-[-0.1em]" style={{ fontFamily: 'Chalets, sans-serif' }}>
                DOPE CITY
              </Link>
            </div>
            <div className="flex-1 max-w-2xl mx-8">
              <EnhancedSearchBar />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/account" className="p-2 hover:bg-gray-800 rounded-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <Link href="/cart" className="p-2 hover:bg-gray-800 rounded-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 h-12">
            <Link href="/brands" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Shop by Brand</Link>
            <Link href="/products?category=thca" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">THCA & More</Link>
            <Link href="/bongs" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Bongs</Link>
            <Link href="/pipes" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Pipes</Link>
            <Link href="/products?category=dab-rigs" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Dab Rigs</Link>
            <Link href="/products?category=vaporizers" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Vaporizers</Link>
            <Link href="/products?category=accessories" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Accessories</Link>
            <Link href="/products?category=edibles" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">Munchies</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-normal text-gray-900 mb-4" style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
            DOPE CITY Site Map
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete overview of all pages on the DOPE CITY platform - existing, in progress, and planned.
          </p>

          {/* Filter Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              All Pages ({pages.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Completed ({pages.filter(p => p.status === 'completed').length})
            </button>
            <button
              onClick={() => setFilter('needs-work')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'needs-work' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Needs Work ({pages.filter(p => p.status === 'needs-work').length})
            </button>
            <button
              onClick={() => setFilter('missing')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'missing' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Missing ({pages.filter(p => p.status === 'missing').length})
            </button>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPages.map((page, index) => (
            <div key={index} className={`border rounded-lg p-4 ${getPriorityColor(page.priority)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {page.status === 'completed' ? (
                    <Link href={page.path} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                      {page.name}
                    </Link>
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900">{page.name}</h3>
                  )}
                  <p className="text-sm text-gray-500 font-mono">{page.path}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                    {page.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    page.priority === 'high' ? 'bg-red-100 text-red-700' :
                    page.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {page.priority}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{page.description}</p>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Development Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{pages.filter(p => p.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{pages.filter(p => p.status === 'needs-work').length}</div>
              <div className="text-sm text-gray-600">Needs Work</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{pages.filter(p => p.status === 'missing').length}</div>
              <div className="text-sm text-gray-600">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{pages.filter(p => p.priority === 'high').length}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
