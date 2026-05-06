import { Metadata } from 'next';
import GlobalMasthead from '../components/GlobalMasthead';
import GlobalBreadcrumbs from '../components/GlobalBreadcrumbs';
import { Mail, Phone, MapPin, Clock, MessageCircle, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - Highway 420',
  description: 'Get in touch with Highway 420. Customer service, support, and business inquiries welcome.',
};

export default function ContactPage() {
  return (
    <>
      <GlobalMasthead />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="mb-8 flex justify-start">
              <GlobalBreadcrumbs paths={[{ name: 'Contact Us' }]} />
            </div>
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              CONTACT US
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-inter">
              Questions, feedback, or need support? We're here to help.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-inter">Send us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                    Subject *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white">
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Product Question</option>
                    <option>Shipping Issue</option>
                    <option>Return/Exchange</option>
                    <option>Business Partnership</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-inter">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              
              {/* Contact Methods */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-inter">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-dope-orange-500 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white font-inter">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-inter">
                        <a href="mailto:info@highway420store.com" className="hover:text-dope-orange-500 transition-colors">
                          info@highway420store.com
                        </a>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-dope-orange-500 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white font-inter">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-inter">(626) 656-6287</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MessageCircle className="w-6 h-6 text-dope-orange-500 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white font-inter">Live Chat</h3>
                      <p className="text-gray-600 dark:text-gray-300 font-inter">Available on our website</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">Real-time support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white font-inter">Business Hours</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-inter">Monday - Friday</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-inter">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-inter">Saturday</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-inter">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300 font-inter">Sunday</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-inter">Closed</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-dope-orange-50 dark:bg-dope-orange-900/20 rounded-lg">
                  <p className="text-sm text-dope-orange-800 dark:text-dope-orange-200 font-inter">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Response times may be longer during weekends and holidays
                  </p>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white">
                <div className="flex items-center mb-4">
                  <Headphones className="w-8 h-8 mr-3" />
                  <h2 className="text-2xl font-bold font-inter">Need Quick Help?</h2>
                </div>
                <p className="mb-6 font-inter">
                  Check our FAQ section for instant answers to common questions about orders,
                  shipping, returns, and more.
                </p>
                <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors font-inter">
                  Visit FAQ
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
