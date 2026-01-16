"use client";
import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, FileText, Shield, Beaker } from 'lucide-react';
import GlobalMasthead from '../components/GlobalMasthead';

interface COAFile {
  id: string;
  product_name: string;
  product_sku: string;
  brand_name: string;
  lab_name: string;
  test_date: string;
  file_url: string;
  file_name: string;
  created_at: string;
}

export default function LabResultsPage() {
  const [coaFiles, setCoaFiles] = useState<COAFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoa, setSelectedCoa] = useState<COAFile | null>(null);

  useEffect(() => {
    fetchCOAFiles();
  }, [searchTerm]);

  const fetchCOAFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coa-files?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data.coaFiles) {
        setCoaFiles(data.coaFiles);
      } else {
        // Fallback to empty array if no files
        setCoaFiles([]);
      }
    } catch (error) {
      console.error('Error fetching COA files:', error);
      setCoaFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoas = coaFiles.filter(coa =>
    coa.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coa.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coa.product_sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Beaker className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 uppercase tracking-widest">
            Certificate of Analysis
          </h1>
          <p className="text-xl text-gray-600 font-bold max-w-3xl mx-auto leading-relaxed">
            Transparency is our promise. Every product undergoes rigorous third-party lab testing.
            View detailed Certificates of Analysis (COAs) for all our tested products below.
          </p>
        </div>
      </section>

      {/* Search and Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-bold"
              />
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-black text-green-600">{coaFiles.length}</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Lab Tested Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-blue-600">100%</div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Third-Party Tested</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COA Files Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-bold">Loading lab results...</p>
            </div>
          ) : filteredCoas.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">No Results Found</h3>
              <p className="text-gray-600 font-bold max-w-md mx-auto">
                We couldn't find any COA files matching your search. Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoas.map((coa) => (
                <div
                  key={coa.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-black text-lg text-gray-900 mb-2 leading-tight">
                        {coa.product_name}
                      </h3>
                      <p className="text-sm font-bold text-gray-500 mb-1">{coa.brand_name}</p>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        SKU: {coa.product_sku}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-600">Lab:</span>
                      <span className="text-sm font-black text-gray-900">{coa.lab_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-600">Test Date:</span>
                      <span className="text-sm font-black text-gray-900">
                        {new Date(coa.test_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => window.open(coa.file_url, '_blank')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View PDF
                    </button>
                    <button
                      onClick={() => window.open(coa.file_url, '_blank')}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Lab Testing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-8 uppercase tracking-widest">
            Why Lab Testing Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                Every product is tested for contaminants, pesticides, heavy metals, and microbial impurities to ensure your safety.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Beaker className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Accurate Potency</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                Precise cannabinoid and terpene profiles so you know exactly what you're getting in every product.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Full Transparency</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                Complete access to all lab results. No hidden information, just pure transparency you can trust.
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-600 font-bold max-w-2xl mx-auto">
            All our products are tested by accredited third-party laboratories using state-of-the-art equipment
            and methodologies. Results are updated regularly to reflect the most current testing data.
          </p>
        </div>
      </section>

      {/* Modal for viewing COA (placeholder) */}
      {selectedCoa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900">{selectedCoa.product_name}</h3>
                <button
                  onClick={() => setSelectedCoa(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-bold">
                  COA viewer would be embedded here. In production, this would display the PDF inline or provide download options.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
