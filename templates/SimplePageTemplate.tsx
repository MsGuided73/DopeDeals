/**
 * DOPE CITY Simple Page Template
 * 
 * A streamlined template for quickly creating new pages.
 * Includes only the essential global components.
 * 
 * Usage:
 * 1. Copy this file to your page location (e.g., app/my-page/page.tsx)
 * 2. Rename the component
 * 3. Update metadata
 * 4. Add your content
 */

import { Metadata } from 'next';
import GlobalMasthead from '../app/components/GlobalMasthead';
import DopeCityFooter from '../components/DopeCityFooter';

// Update this metadata for your page
export const metadata: Metadata = {
  title: 'Page Title | DOPE CITY',
  description: 'Page description for SEO',
  keywords: 'relevant, keywords, here',
};

export default function SimplePageTemplate() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Global Masthead with Search & Navigation */}
      <GlobalMasthead />
      
      {/* Main Content */}
      <main>
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-900 to-black text-white py-20">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-6xl mb-6">
              PAGE TITLE
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Your page description goes here. Update with relevant content.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* Add your page content here */}
            <div className="prose max-w-none">
              <h2>Content Section</h2>
              <p>Add your page content here.</p>
            </div>
            
          </div>
        </section>

      </main>

      {/* Global Footer */}
      <DopeCityFooter />
      
    </div>
  );
}
