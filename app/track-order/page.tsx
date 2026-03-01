import { Metadata } from 'next';
import GlobalMasthead from '../components/GlobalMasthead';
import TrackOrderForm from './TrackOrderForm';

export const metadata: Metadata = {
  title: 'Track Your Order - Highway 420',
  description: 'Track your Highway 420 order status and shipping information in real-time.',
};

export default function TrackOrderPage() {
  return (
    <>
      <GlobalMasthead />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl mb-4 font-sans">
              TRACK YOUR ORDER
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-sans">
              Real-time shipping updates and order status
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Connected to Shipstation for accurate tracking information
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <TrackOrderForm />
        </div>
      </div>
    </>
  );
}
