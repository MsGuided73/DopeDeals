import Link from 'next/link';
import GlobalMasthead from '../components/GlobalMasthead';
import AgeVerification from '../components/AgeVerification';

interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
}

export default function CareersPage() {
  const jobListings: JobListing[] = [
    {
      id: '1',
      title: 'Senior E-commerce Developer',
      department: 'Technology',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Join our tech team to build and maintain our cutting-edge e-commerce platform. Work with modern technologies and help shape the future of online cannabis retail.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of full-stack development experience',
        'Proficiency in React, Node.js, and PostgreSQL',
        'Experience with e-commerce platforms',
        'Knowledge of payment processing systems'
      ],
      benefits: [
        'Competitive salary + equity',
        'Full health, dental, and vision insurance',
        'Flexible work arrangements',
        'Professional development budget',
        'Product discounts'
      ],
      posted: '2024-01-15'
    },
    {
      id: '2',
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Lead our digital marketing efforts across all channels. Drive customer acquisition and brand awareness in the cannabis industry.',
      requirements: [
        'Bachelor\'s degree in Marketing or related field',
        '3+ years of digital marketing experience',
        'Experience with cannabis industry regulations',
        'Proficiency in Google Ads, Facebook Ads, SEO',
        'Strong analytical and creative skills'
      ],
      benefits: [
        'Competitive salary',
        'Remote work flexibility',
        'Health insurance',
        'Marketing conference budget',
        'Performance bonuses'
      ],
      posted: '2024-01-12'
    },
    {
      id: '3',
      title: 'Customer Success Specialist',
      department: 'Customer Service',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Provide exceptional customer service and support to our growing customer base. Help customers navigate our products and resolve any issues.',
      requirements: [
        'High school diploma or equivalent',
        '2+ years of customer service experience',
        'Excellent communication skills',
        'Knowledge of cannabis products preferred',
        'Problem-solving mindset'
      ],
      benefits: [
        'Competitive hourly wage',
        'Health insurance',
        'Paid time off',
        'Employee discounts',
        'Growth opportunities'
      ],
      posted: '2024-01-10'
    }
  ];

  const companyValues = [
    {
      title: 'Quality First',
      description: 'We never compromise on product quality or customer experience.',
      icon: '🏆'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and creative solutions.',
      icon: '💡'
    },
    {
      title: 'Community',
      description: 'We build strong relationships with customers and each other.',
      icon: '🤝'
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and ethical business practices.',
      icon: '✨'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      <AgeVerification />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-chalets text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            JOIN THE DOPE CITY TEAM
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Be part of a growing company that's revolutionizing the cannabis retail experience. 
            We're looking for passionate, talented individuals to help us build the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#open-positions" className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              View Open Positions
            </Link>
            <Link href="#company-culture" className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Learn About Our Culture
            </Link>
          </div>
        </div>

        {/* Company Values */}
        <section id="company-culture" className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16 bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-center mb-8" style={{ letterSpacing: '-0.02em' }}>
            Why Work at DOPE CITY?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Benefits</h3>
              <p className="text-gray-300">Full health, dental, and vision insurance plus wellness programs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Flexible Work</h3>
              <p className="text-gray-300">Remote work options and flexible schedules to support work-life balance.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
              <p className="text-gray-300">Professional development budget and clear career advancement paths.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Amazing Team</h3>
              <p className="text-gray-300">Work with passionate, talented people who love what they do.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Competitive Pay</h3>
              <p className="text-gray-300">Competitive salaries, equity options, and performance bonuses.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Product Perks</h3>
              <p className="text-gray-300">Employee discounts and first access to new products.</p>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="open-positions" className="mb-16">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Open Positions
          </h2>
          <div className="space-y-6">
            {jobListings.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className="px-3 py-1 bg-dope-orange text-white text-sm rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {job.department}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.experience}
                      </span>
                      <span className="text-gray-500">
                        Posted {new Date(job.posted).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <button className="px-6 py-2 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-dope-orange mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {job.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* No positions message */}
          {jobListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                No open positions at the moment, but we're always looking for great talent!
              </p>
              <p className="text-gray-500 mb-6">
                Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <Link href="/contact" className="px-6 py-3 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Send Resume
              </Link>
            </div>
          )}
        </section>

        {/* Application Process */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-chalets text-gray-900 text-center mb-12" style={{ letterSpacing: '-0.02em' }}>
            Our Hiring Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600 text-sm">Submit your application and resume through our online portal.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Screen</h3>
              <p className="text-gray-600 text-sm">Initial phone or video screening with our HR team.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-gray-600 text-sm">In-depth interviews with team members and hiring managers.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-dope-orange text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Offer</h3>
              <p className="text-gray-600 text-sm">Reference checks, background verification, and job offer.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-3xl font-chalets text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Questions About Working Here?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to our HR team with any questions about careers at DOPE CITY.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/contact" className="px-8 py-4 bg-dope-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-lg">
              Contact HR
            </Link>
            <a href="mailto:careers@dopecity.com" className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors font-medium text-lg">
              Email Us
            </a>
          </div>
          <div className="text-gray-600">
            <p><strong>HR Department:</strong> careers@dopecity.com</p>
            <p><strong>Phone:</strong> 1-800-CAREERS</p>
          </div>
        </section>
      </div>
    </div>
  );
}
