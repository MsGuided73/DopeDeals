import { Suspense } from 'react';
import PageBuilderInterface from './components/PageBuilderInterface';

export const metadata = {
  title: 'Visual Page Builder | DOPE CITY Admin',
  description: 'Create and edit pages with the visual page builder',
};

export default function PageBuilderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visual Page Builder</h1>
            <p className="text-sm text-gray-600">Create stunning pages with drag-and-drop simplicity</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
              Templates
            </button>
            <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
              New Page
            </button>
          </div>
        </div>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange-500"></div>
        </div>
      }>
        <PageBuilderInterface />
      </Suspense>
    </div>
  );
}
