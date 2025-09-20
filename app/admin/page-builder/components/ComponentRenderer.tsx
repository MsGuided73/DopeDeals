'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-browser';

interface ComponentRendererProps {
  component: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
}

export default function ComponentRenderer({ component, isSelected, onUpdate }: ComponentRendererProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load data if component has a data source
  useEffect(() => {
    if (component.dataSource) {
      loadComponentData();
    }
  }, [component.dataSource]);

  const loadComponentData = async () => {
    if (!component.dataSource?.sourceType) return;

    try {
      setLoading(true);
      let query = supabase.from(component.dataSource.sourceType).select('*');

      // Apply filters
      if (component.dataSource.filters) {
        component.dataSource.filters.forEach((filter: any) => {
          if (filter.field && filter.operator && filter.value) {
            switch (filter.operator) {
              case 'eq':
                query = query.eq(filter.field, filter.value);
                break;
              case 'neq':
                query = query.neq(filter.field, filter.value);
                break;
              case 'like':
                query = query.like(filter.field, `%${filter.value}%`);
                break;
              case 'ilike':
                query = query.ilike(filter.field, `%${filter.value}%`);
                break;
            }
          }
        });
      }

      // Apply sorting
      if (component.dataSource.sorting) {
        component.dataSource.sorting.forEach((sort: any) => {
          if (sort.field) {
            query = query.order(sort.field, { ascending: sort.direction === 'asc' });
          }
        });
      }

      // Apply limit
      if (component.dataSource.limit) {
        query = query.limit(component.dataSource.limit);
      }

      const { data: result, error } = await query;
      if (error) throw error;

      setData(result || []);
    } catch (error) {
      console.error('Error loading component data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComponentStyles = () => {
    const styles = component.styles || {};
    const cssStyles: React.CSSProperties = {};

    // Typography
    if (styles.fontSize) cssStyles.fontSize = styles.fontSize;
    if (styles.fontWeight) cssStyles.fontWeight = styles.fontWeight;
    if (styles.fontFamily) cssStyles.fontFamily = styles.fontFamily;
    if (styles.lineHeight) cssStyles.lineHeight = styles.lineHeight;
    if (styles.letterSpacing) cssStyles.letterSpacing = styles.letterSpacing;
    if (styles.textAlign) cssStyles.textAlign = styles.textAlign as any;
    if (styles.textTransform) cssStyles.textTransform = styles.textTransform as any;

    // Colors
    if (styles.color) cssStyles.color = styles.color;
    if (styles.backgroundColor) cssStyles.backgroundColor = styles.backgroundColor;

    // Spacing
    if (styles.margin) cssStyles.margin = styles.margin;
    if (styles.padding) cssStyles.padding = styles.padding;

    // Size
    if (styles.width) cssStyles.width = styles.width;
    if (styles.height) cssStyles.height = styles.height;

    // Border & Effects
    if (styles.borderRadius) cssStyles.borderRadius = styles.borderRadius;
    if (styles.border) cssStyles.border = styles.border;
    if (styles.boxShadow) cssStyles.boxShadow = styles.boxShadow;
    if (styles.opacity) cssStyles.opacity = styles.opacity;

    // Transform & Position
    if (styles.transform) cssStyles.transform = styles.transform;
    if (styles.position) cssStyles.position = styles.position as any;
    if (styles.top) cssStyles.top = styles.top;
    if (styles.left) cssStyles.left = styles.left;
    if (styles.zIndex) cssStyles.zIndex = styles.zIndex;

    // Background & Filters
    if (styles.backgroundImage) cssStyles.backgroundImage = styles.backgroundImage;
    if (styles.filter) cssStyles.filter = styles.filter;
    if (styles.backdropFilter) cssStyles.backdropFilter = styles.backdropFilter;

    return cssStyles;
  };

  const renderComponent = () => {
    const styles = getComponentStyles();

    switch (component.type) {
      case 'hero':
        return (
          <div 
            className="relative min-h-96 flex items-center justify-center bg-cover bg-center"
            style={{
              ...styles,
              backgroundImage: component.defaultProps?.backgroundImage 
                ? `url(${component.defaultProps.backgroundImage})` 
                : 'linear-gradient(135deg, #000000, #1f2937)'
            }}
          >
            {component.defaultProps?.overlay && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: component.defaultProps.overlay }}
              />
            )}
            <div className="relative text-center text-white z-10 max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-chalets tracking-wider">
                {component.defaultProps?.title || 'Hero Title'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {component.defaultProps?.subtitle || 'Hero subtitle goes here'}
              </p>
              {component.defaultProps?.ctaText && (
                <button className="bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105">
                  {component.defaultProps.ctaText}
                </button>
              )}
            </div>
          </div>
        );

      case 'heading':
        const HeadingTag = component.defaultProps?.level || 'h2';
        return (
          <HeadingTag style={styles} className="font-chalets tracking-wider">
            {component.defaultProps?.text || 'Your Heading Here'}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p style={styles}>
            {component.defaultProps?.text || 'Your paragraph text goes here.'}
          </p>
        );

      case 'button':
        const variant = component.defaultProps?.variant || 'primary';
        const buttonClass = variant === 'primary' 
          ? 'bg-dope-orange-500 hover:bg-dope-orange-600 text-white'
          : 'border-2 border-dope-orange-500 text-dope-orange-500 hover:bg-dope-orange-500 hover:text-white';
        
        return (
          <button 
            style={styles}
            className={`font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 ${buttonClass}`}
          >
            {component.defaultProps?.text || 'Button Text'}
          </button>
        );

      case 'product-grid':
        if (loading) {
          return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={styles}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
              ))}
            </div>
          );
        }

        return (
          <div style={styles}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.slice(0, component.defaultProps?.itemsPerPage || 6).map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name || item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name || item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    )}
                    {item.price && (
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-dope-orange-500">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                        <button className="bg-dope-orange-500 text-white px-4 py-2 rounded hover:bg-dope-orange-600 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'brand-showcase':
        if (loading) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={styles}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
              ))}
            </div>
          );
        }

        return (
          <div style={styles}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.map((brand, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  {brand.logo_url && (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name}
                      className="w-full h-16 object-contain mb-3"
                    />
                  )}
                  <h3 className="font-semibold">{brand.name}</h3>
                  {component.defaultProps?.showDescriptions && brand.description && (
                    <p className="text-sm text-gray-600 mt-2">{brand.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'image':
        return (
          <img 
            src={component.defaultProps?.src || 'https://via.placeholder.com/400x300'} 
            alt={component.defaultProps?.alt || 'Image'}
            style={styles}
            className="max-w-full h-auto"
          />
        );

      case 'container':
        return (
          <div 
            style={{
              ...styles,
              maxWidth: component.defaultProps?.maxWidth || '1200px',
              margin: component.defaultProps?.centerContent ? '0 auto' : styles.margin,
              padding: component.defaultProps?.padding || '2rem'
            }}
            className="container"
          >
            <div className="text-center text-gray-400 py-8">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm">Container - Drop components here</p>
            </div>
          </div>
        );

      case 'contact-form':
        return (
          <form style={styles} className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dope-orange-500 focus:border-dope-orange-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dope-orange-500 focus:border-dope-orange-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-dope-orange-500 focus:border-dope-orange-500"
                placeholder="Your message..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {component.defaultProps?.submitText || 'Send Message'}
            </button>
          </form>
        );

      default:
        return (
          <div 
            style={styles}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500"
          >
            <div className="text-2xl mb-2">🧩</div>
            <p className="font-medium">Unknown Component</p>
            <p className="text-sm">Type: {component.type}</p>
          </div>
        );
    }
  };

  return (
    <div className={`${component.hidden ? 'opacity-50' : ''} ${component.locked ? 'pointer-events-none' : ''}`}>
      {renderComponent()}
    </div>
  );
}
