import { Metadata } from 'next';
import GlobalMasthead from '../../components/GlobalMasthead';
import ReturnForm from './ReturnForm';

export const metadata: Metadata = {
  title: 'Start a Return - Highway 420',
  description: 'Initiate a return request for your Highway 420 order. Easy online return process.',
};

export default function StartReturnPage() {
  return (
    <>
      <GlobalMasthead />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-fira-heading">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl mb-4 font-sans">
              START A RETURN
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 font-sans">
              We'll help you through the return process step by step
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Most returns are processed within 24 hours
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <ReturnForm />
        </div>
      </div>
    </>
  );
}
