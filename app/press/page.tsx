import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: 'Company News' | 'Product Launch' | 'Partnership' | 'Industry';
}

interface MediaAsset {
  id: string;
  name: string;
  type: 'logo' | 'product' | 'team' | 'lifestyle';
  format: string;
  size: string;
  downloadUrl: string;
}

export default function PressPage() {
  const pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'DOPE CITY Launches Revolutionary E-commerce Platform for Premium Cannabis Accessories',
      date: '2024-01-15',
      excerpt: 'New platform features advanced age verification, AI-powered recommendations, and seamless checkout experience for cannabis enthusiasts nationwide.',
      category: 'Company News'
    },
    {
      id: '2',
      title: 'DOPE CITY Partners with Leading Glass Artists for Exclusive Collection',
      date: '2024-01-10',
      excerpt: 'Partnership brings limited-edition, handcrafted glass pieces to customers seeking premium smoking accessories.',
      category: 'Partnership'
    },
    {
      id: '3',
      title: 'DOPE CITY Expands THCA Product Line with Lab-Tested Premium Flower',
      date: '2024-01-05',
      excerpt: 'New product line features third-party lab testing and compliance with federal hemp regulations.',
      category: 'Product Launch'
    }
  ];

  const mediaAssets: MediaAsset[] = [
    {
      id: '1',
      name: 'DOPE CITY Logo - Primary',
      type: 'logo',
      format: 'PNG, SVG',
      size: 'Various',
      downloadUrl: '/press/logo-primary.zip'
    },
    {
      id: '2',
      name: 'DOPE CITY Logo - White',
      type: 'logo',
      format: 'PNG, SVG',
      size: 'Various',
      downloadUrl: '/press/logo-white.zip'
    },
    {
      id: '3',
      name: 'Product Photography',
      type: 'product',
      format: 'JPG',
      size: 'High-res',
      downloadUrl: '/press/product-photos.zip'
    },
    {
      id: '4',
      name: 'Team Photos',
      type: 'team',
      format: 'JPG',
      size: 'High-res',
      downloadUrl: '/press/team-photos.zip'
    }
  ];

  const companyFacts = [
    { label: 'Founded', value: '2023' },
    { label: 'Headquarters', value: 'Los Angeles, CA' },
    { label: 'Industry', value: 'Cannabis Retail & E-commerce' },
    { label: 'Products', value: '1000+ SKUs' },
    { label: 'Customers', value: '50,000+' },
    { label: 'States Served', value: '35+' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      <AgeVerification />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-chalets text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            PRESS KIT
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Media resources, press releases, and brand assets for journalists, bloggers, and media professionals 
            covering DOPE CITY and the cannabis industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              Download Full Press Kit
            </button>
            <Link href="/contact" className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Contact Media Team
            </Link>
          </div>
        </div>

        {/* Company Overview */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-8" style={{ letterSpacing: '-0.02em' }}>
            About DOPE CITY
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              DOPE CITY is a premium online retailer specializing in high-quality smoking accessories, THCA products, 
              and cannabis culture essentials. Founded in 2023, we've quickly become a trusted destination for 
              cannabis enthusiasts seeking premium products and exceptional customer service.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our mission is to elevate the cannabis experience through carefully curated products, educational content, 
              and a commitment to quality that sets us apart in the industry. We serve customers across 35+ states 
              with a focus on compliance, safety, and customer satisfaction.
            </p>
            
            {/* Company Facts */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {companyFacts.map((fact, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-dope-orange mb-1">{fact.value}</div>
                  <div className="text-sm text-gray-600">{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Latest Press Releases
          </h2>
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <article key={release.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {release.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(release.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-dope-orange transition-colors cursor-pointer">
                      {release.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{release.excerpt}</p>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Read Full Release
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors">
              View All Press Releases
            </button>
          </div>
        </section>

        {/* Media Assets */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Brand Assets & Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((asset) => (
              <div key={asset.id} className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {asset.type === 'logo' && (
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {asset.type === 'product' && (
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {asset.type === 'team' && (
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {asset.type === 'lifestyle' && (
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{asset.name}</h3>
                <div className="text-sm text-gray-600 mb-4">
                  <p>{asset.format}</p>
                  <p>{asset.size}</p>
                </div>
                <button className="w-full px-4 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-16 bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-center mb-8" style={{ letterSpacing: '-0.02em' }}>
            Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Alex Johnson</h3>
              <p className="text-dope-orange mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-300">
                Former tech executive with 15+ years in e-commerce and cannabis industry experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Sarah Chen</h3>
              <p className="text-dope-orange mb-2">CTO</p>
              <p className="text-sm text-gray-300">
                Technology leader specializing in scalable e-commerce platforms and user experience.
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Marcus Williams</h3>
              <p className="text-dope-orange mb-2">Head of Operations</p>
              <p className="text-sm text-gray-300">
                Supply chain and operations expert with deep knowledge of cannabis regulations.
              </p>
            </div>
          </div>
        </section>

        {/* Media Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Media Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Brand Usage</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use official DOPE CITY logos and brand assets</li>
                <li>• Maintain proper spacing and proportions</li>
                <li>• Do not alter colors or modify logos</li>
                <li>• Use high-resolution images when possible</li>
                <li>• Include proper attribution and copyright notices</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Content Guidelines</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Focus on legal, compliant cannabis products</li>
                <li>• Emphasize quality, safety, and customer service</li>
                <li>• Include age verification and legal disclaimers</li>
                <li>• Respect privacy of customers and employees</li>
                <li>• Contact us for fact-checking and quotes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Media Inquiries
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            For press inquiries, interview requests, or additional information, 
            please contact our media relations team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Press Contact</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> press@dopecity.com</p>
                <p><strong>Phone:</strong> 1-800-PRESS-DC</p>
                <p><strong>Response Time:</strong> 24-48 hours</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Partnership Inquiries</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> partnerships@dopecity.com</p>
                <p><strong>Phone:</strong> 1-800-PARTNER</p>
                <p><strong>Response Time:</strong> 2-3 business days</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg mr-4">
              Download Press Kit
            </button>
            <Link href="/contact" className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Contact Us
            </Link>
          </div>
        </section>

        {/* Legal Notice */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Media Notice:</strong> All content, images, and materials in this press kit are proprietary to DOPE CITY 
            and are provided for editorial use only. Commercial use requires written permission. Cannabis laws vary by state - 
            please ensure compliance with local regulations when covering cannabis-related topics.
          </p>
        </div>
      </div>
    </div>
  );
}
