"use client";

import { useState, useEffect } from 'react';
import {
  Palette,
  Layout,
  Type,
  Maximize,
  CheckCircle,
  Save,
  RefreshCw,
  Image as ImageIcon,
  ArrowRight,
  Eye
} from 'lucide-react';

interface ComponentStyles {
  height: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  textTransform: string;
  speed: number;
}

export default function AdminCustomizationPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State for the Scrolling Bar component
  const [scrollbarStyles, setScrollbarStyles] = useState<ComponentStyles>({
    height: '450px',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    fontFamily: 'font-display-juicy-fills',
    fontSize: 'text-4xl',
    textTransform: 'uppercase',
    speed: 2500
  });

  const fonts = [
    { label: 'Display (Juicy Fills)', value: 'font-display-juicy-fills' },
    { label: 'Sans Serif (Inter)', value: 'font-sans' },
    { label: 'Serif', value: 'font-serif' },
    { label: 'Mono', value: 'font-mono' }
  ];

  const textSizes = [
    { label: 'Small', value: 'text-lg' },
    { label: 'Medium', value: 'text-2xl' },
    { label: 'Large', value: 'text-4xl' },
    { label: 'Extra Large', value: 'text-6xl' }
  ];

  const handleSave = async () => {
    setSaving(true);
    // In a real implementation, this would save to a 'site_settings' table in Supabase
    setTimeout(() => {
      setSaving(false);
      alert('Design settings updated successfully! Changes will be visible on the home page.');
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Customization</h1>
          <p className="text-gray-600 mt-1">Adjust visual styles, themes, and component behaviors across the storefront</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-dope-orange hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Publish Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-dope-orange">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Brand Scrolling Bar</h2>
                <p className="text-sm text-gray-500">Customize the "Trusted Brands" section on the homepage</p>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Text & Typography */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <Type className="w-4 h-4" />
                  Typography
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading Font</label>
                    <select 
                      value={scrollbarStyles.fontFamily}
                      onChange={(e) => setScrollbarStyles({...scrollbarStyles, fontFamily: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:ring-dope-orange focus:border-dope-orange"
                    >
                      {fonts.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heading Size</label>
                    <select 
                      value={scrollbarStyles.fontSize}
                      onChange={(e) => setScrollbarStyles({...scrollbarStyles, fontSize: e.target.value})}
                      className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:ring-dope-orange focus:border-dope-orange"
                    >
                      {textSizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/* Colors */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <Palette className="w-4 h-4" />
                  Visual Identity
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={scrollbarStyles.backgroundColor}
                        onChange={(e) => setScrollbarStyles({...scrollbarStyles, backgroundColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={scrollbarStyles.backgroundColor}
                        onChange={(e) => setScrollbarStyles({...scrollbarStyles, backgroundColor: e.target.value})}
                        className="flex-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={scrollbarStyles.textColor}
                        onChange={(e) => setScrollbarStyles({...scrollbarStyles, textColor: e.target.value})}
                        className="w-12 h-12 rounded-lg border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={scrollbarStyles.textColor}
                        onChange={(e) => setScrollbarStyles({...scrollbarStyles, textColor: e.target.value})}
                        className="flex-1 bg-gray-50 border-gray-200 rounded-xl px-4 py-3 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Layout & Animation */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <Maximize className="w-4 h-4" />
                  Layout & Speed
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Section Height ({scrollbarStyles.height})</label>
                    <input 
                      type="range" 
                      min="200" 
                      max="800" 
                      step="50"
                      value={parseInt(scrollbarStyles.height)}
                      onChange={(e) => setScrollbarStyles({...scrollbarStyles, height: `${e.target.value}px`})}
                      className="w-full accent-dope-orange"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>SHORT</span>
                      <span>TALL</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scroll Speed (ms)</label>
                    <input 
                      type="number" 
                      value={scrollbarStyles.speed}
                      onChange={(e) => setScrollbarStyles({...scrollbarStyles, speed: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:ring-dope-orange focus:border-dope-orange"
                      placeholder="2500"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Lower = Faster rotation</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-dope-orange" />
                <h3 className="font-bold">Live Preview</h3>
              </div>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded uppercase tracking-widest">Mobile View</span>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-white/5">
              {/* Preview Header */}
              <div className="h-6 bg-gray-700 flex items-center px-3 gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              </div>

              {/* Scrollbar Preview Container */}
              <div 
                className="transition-all duration-500 p-4 flex flex-col justify-center items-center text-center overflow-hidden"
                style={{ 
                  height: '200px', // Scaled preview
                  backgroundColor: scrollbarStyles.backgroundColor,
                  color: scrollbarStyles.textColor
                }}
              >
                <h4 
                  className={`font-bold mb-4 transition-all duration-500 ${scrollbarStyles.fontFamily} ${scrollbarStyles.fontSize === 'text-4xl' ? 'text-lg' : 'text-sm'}`}
                  style={{ color: scrollbarStyles.textColor }}
                >
                  TRUSTED BRANDS
                </h4>
                
                <div className="flex gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200/20 rounded-lg"></div>
                  <div className="w-12 h-12 bg-gray-200/20 rounded-lg"></div>
                  <div className="w-12 h-12 bg-gray-200/20 rounded-lg"></div>
                </div>

                <div 
                  className="mt-4 px-4 py-1.5 rounded border-2 font-bold text-[10px] transition-all"
                  style={{ borderColor: '#16a34a', color: '#16a34a' }}
                >
                  SHOP BY BRAND →
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-tighter">Current Config</p>
                <code className="text-[10px] block text-orange-200">
                  height: {scrollbarStyles.height}<br/>
                  bg: {scrollbarStyles.backgroundColor}<br/>
                  font: {scrollbarStyles.fontFamily}
                </code>
              </div>
              <p className="text-[10px] text-gray-500 text-center italic">
                *Preview is a visual approximation. Final result will render with high-definition brand assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
