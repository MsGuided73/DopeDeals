'use client';

import { useState, useEffect } from 'react';

interface StyleEditorProps {
  selectedComponent: string | null;
  components: any[];
  onStyleUpdate: (componentId: string, styles: any) => void;
}

interface StyleState {
  // Typography
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  textTransform: string;
  
  // Colors
  color: string;
  backgroundColor: string;
  
  // Spacing
  margin: string;
  padding: string;
  
  // Size
  width: string;
  height: string;
  
  // Border & Radius
  borderRadius: string;
  border: string;
  
  // Shadow Effects
  boxShadow: string;
  textShadow: string;
  
  // Transform & Position
  transform: string;
  position: string;
  top: string;
  left: string;
  zIndex: string;
  
  // Background & Effects
  backgroundImage: string;
  filter: string;
  backdropFilter: string;
  opacity: string;
}

const defaultStyles: StyleState = {
  fontSize: '16px',
  fontWeight: '400',
  fontFamily: 'Inter',
  lineHeight: '1.5',
  letterSpacing: '0em',
  textAlign: 'left',
  textTransform: 'none',
  color: '#000000',
  backgroundColor: 'transparent',
  margin: '0px',
  padding: '0px',
  width: 'auto',
  height: 'auto',
  borderRadius: '0px',
  border: 'none',
  boxShadow: 'none',
  textShadow: 'none',
  transform: 'none',
  position: 'static',
  top: 'auto',
  left: 'auto',
  zIndex: 'auto',
  backgroundImage: 'none',
  filter: 'none',
  backdropFilter: 'none',
  opacity: '1'
};

export default function StyleEditor({ selectedComponent, components, onStyleUpdate }: StyleEditorProps) {
  const [styles, setStyles] = useState<StyleState>(defaultStyles);
  const [activeTab, setActiveTab] = useState<'typography' | 'layout' | 'effects' | 'advanced'>('typography');

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  useEffect(() => {
    if (selectedComponentData?.styles) {
      setStyles({ ...defaultStyles, ...selectedComponentData.styles });
    } else {
      setStyles(defaultStyles);
    }
  }, [selectedComponent, selectedComponentData]);

  const handleStyleChange = (property: keyof StyleState, value: string) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    
    if (selectedComponent) {
      onStyleUpdate(selectedComponent, newStyles);
    }
  };

  const presetShadows = [
    { name: 'None', value: 'none' },
    { name: 'Small', value: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' },
    { name: 'Medium', value: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' },
    { name: 'Large', value: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)' },
    { name: 'Glow Orange', value: '0 0 20px rgba(250, 105, 52, 0.5)' },
    { name: 'Glow Blue', value: '0 0 20px rgba(59, 130, 246, 0.5)' }
  ];

  const presetFonts = [
    'Chalets', 'Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat', 
    'Outfit', 'Plus Jakarta Sans', 'DM Sans', 'Geist', 'JetBrains Mono'
  ];

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="mb-4">🎨</div>
        <p className="text-sm">Select a component to edit its styles</p>
      </div>
    );
  }

  const renderTypographyTab = () => (
    <div className="space-y-4">
      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
        <select
          value={styles.fontFamily}
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {presetFonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="8"
            max="72"
            value={parseInt(styles.fontSize) || 16}
            onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
            className="flex-1"
          />
          <input
            type="text"
            value={styles.fontSize}
            onChange={(e) => handleStyleChange('fontSize', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Weight</label>
        <select
          value={styles.fontWeight}
          onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="100">Thin (100)</option>
          <option value="200">Extra Light (200)</option>
          <option value="300">Light (300)</option>
          <option value="400">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi Bold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
          <option value="900">Black (900)</option>
        </select>
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Letter Spacing</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="-0.1"
            max="0.2"
            step="0.01"
            value={parseFloat(styles.letterSpacing) || 0}
            onChange={(e) => handleStyleChange('letterSpacing', `${e.target.value}em`)}
            className="flex-1"
          />
          <input
            type="text"
            value={styles.letterSpacing}
            onChange={(e) => handleStyleChange('letterSpacing', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0.8"
            max="3"
            step="0.1"
            value={parseFloat(styles.lineHeight) || 1.5}
            onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
            className="flex-1"
          />
          <input
            type="text"
            value={styles.lineHeight}
            onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Align</label>
        <div className="flex gap-1">
          {['left', 'center', 'right', 'justify'].map(align => (
            <button
              key={align}
              onClick={() => handleStyleChange('textAlign', align)}
              className={`flex-1 px-3 py-2 text-sm rounded ${
                styles.textAlign === align
                  ? 'bg-dope-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styles.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="w-10 h-8 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={styles.color}
              onChange={(e) => handleStyleChange('color', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styles.backgroundColor === 'transparent' ? '#ffffff' : styles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="w-10 h-8 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={styles.backgroundColor}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              placeholder="transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEffectsTab = () => (
    <div className="space-y-4">
      {/* Box Shadow Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Box Shadow</label>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {presetShadows.map(shadow => (
            <button
              key={shadow.name}
              onClick={() => handleStyleChange('boxShadow', shadow.value)}
              className={`p-2 text-sm rounded border ${
                styles.boxShadow === shadow.value
                  ? 'border-dope-orange-500 bg-dope-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {shadow.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={styles.boxShadow}
          onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          placeholder="Custom shadow..."
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="50"
            value={parseInt(styles.borderRadius) || 0}
            onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
            className="flex-1"
          />
          <input
            type="text"
            value={styles.borderRadius}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={parseFloat(styles.opacity) || 1}
            onChange={(e) => handleStyleChange('opacity', e.target.value)}
            className="flex-1"
          />
          <input
            type="text"
            value={styles.opacity}
            onChange={(e) => handleStyleChange('opacity', e.target.value)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      {/* Backdrop Filter (Glassmorphism) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Backdrop Filter</label>
        <div className="space-y-2">
          <button
            onClick={() => handleStyleChange('backdropFilter', 'blur(10px)')}
            className="w-full p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
          >
            Glass Effect
          </button>
          <input
            type="text"
            value={styles.backdropFilter}
            onChange={(e) => handleStyleChange('backdropFilter', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            placeholder="blur(10px)"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="font-medium text-gray-900 mb-3">Style Editor</h3>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          {[
            { key: 'typography', label: 'Text', icon: '📝' },
            { key: 'layout', label: 'Layout', icon: '📐' },
            { key: 'effects', label: 'Effects', icon: '✨' },
            { key: 'advanced', label: 'Advanced', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-dope-orange-600 border-b-2 border-dope-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'typography' && renderTypographyTab()}
        {activeTab === 'effects' && renderEffectsTab()}
        {activeTab === 'layout' && (
          <div className="text-center text-gray-500 py-8">
            Layout controls coming soon...
          </div>
        )}
        {activeTab === 'advanced' && (
          <div className="text-center text-gray-500 py-8">
            Advanced controls coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
