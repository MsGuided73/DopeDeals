'use client';

import { useState } from 'react';
import { useDrag } from 'react-dnd';

interface ComponentLibraryProps {
  onComponentAdd: (component: any) => void;
}

interface ComponentItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  type: string;
  defaultProps: any;
}

const componentCategories = [
  { id: 'all', name: 'All Components', icon: '🧩' },
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'content', name: 'Content', icon: '📝' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'media', name: 'Media', icon: '🖼️' },
  { id: 'form', name: 'Forms', icon: '📋' },
  { id: 'navigation', name: 'Navigation', icon: '🧭' }
];

const componentLibrary: ComponentItem[] = [
  // Layout Components
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'layout',
    icon: '🎯',
    description: 'Full-width hero with background and CTA',
    type: 'hero',
    defaultProps: {
      title: 'Welcome to DOPE CITY',
      subtitle: 'Premium cannabis culture meets street authenticity',
      backgroundImage: '',
      ctaText: 'Shop Now',
      ctaLink: '/products',
      textAlign: 'center',
      overlay: 0.5
    }
  },
  {
    id: 'container',
    name: 'Container',
    category: 'layout',
    icon: '📦',
    description: 'Responsive container for content',
    type: 'container',
    defaultProps: {
      maxWidth: '1200px',
      padding: '2rem',
      centerContent: true
    }
  },
  {
    id: 'grid-layout',
    name: 'Grid Layout',
    category: 'layout',
    icon: '⚏',
    description: 'Flexible grid system',
    type: 'grid',
    defaultProps: {
      columns: 3,
      gap: '1.5rem',
      responsive: true
    }
  },

  // Content Components
  {
    id: 'heading',
    name: 'Heading',
    category: 'content',
    icon: '📰',
    description: 'Customizable heading text',
    type: 'heading',
    defaultProps: {
      text: 'Your Heading Here',
      level: 'h2',
      fontSize: '2rem',
      fontWeight: '700',
      color: '#000000'
    }
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    category: 'content',
    icon: '📄',
    description: 'Rich text paragraph',
    type: 'paragraph',
    defaultProps: {
      text: 'Your paragraph text goes here. You can customize the styling and content.',
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#333333'
    }
  },
  {
    id: 'button',
    name: 'Button',
    category: 'content',
    icon: '🔘',
    description: 'Call-to-action button',
    type: 'button',
    defaultProps: {
      text: 'Click Me',
      href: '#',
      variant: 'primary',
      size: 'medium'
    }
  },

  // E-commerce Components
  {
    id: 'product-grid',
    name: 'Product Grid',
    category: 'ecommerce',
    icon: '🛍️',
    description: 'Display products in a grid with Zoho images',
    type: 'product-grid',
    defaultProps: {
      columns: 3,
      showFilters: true,
      showSorting: true,
      itemsPerPage: 12,
      dataSource: 'products',
      showImages: true,
      showPrices: true
    }
  },
  {
    id: 'zoho-product-showcase',
    name: 'Zoho Product Showcase',
    category: 'ecommerce',
    icon: '🏆',
    description: 'Premium showcase with your 4000+ Zoho product images',
    type: 'zoho-product-showcase',
    defaultProps: {
      layout: 'featured',
      showHeroImages: true,
      showGallery: false,
      itemsPerPage: 8,
      dataSource: 'products',
      filterByCategory: '',
      sortBy: 'name'
    }
  },
  {
    id: 'product-card',
    name: 'Product Card',
    category: 'ecommerce',
    icon: '🏷️',
    description: 'Individual product display card',
    type: 'product-card',
    defaultProps: {
      showPrice: true,
      showDescription: true,
      showAddToCart: true,
      imageAspectRatio: 'square'
    }
  },
  {
    id: 'brand-showcase',
    name: 'Brand Showcase',
    category: 'ecommerce',
    icon: '🏢',
    description: 'Display brand logos and info',
    type: 'brand-showcase',
    defaultProps: {
      layout: 'grid',
      showLogos: true,
      showDescriptions: false,
      dataSource: 'brands'
    }
  },

  // Media Components
  {
    id: 'image',
    name: 'Image',
    category: 'media',
    icon: '🖼️',
    description: 'Responsive image with options',
    type: 'image',
    defaultProps: {
      src: '',
      alt: 'Image description',
      aspectRatio: 'auto',
      objectFit: 'cover'
    }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    category: 'media',
    icon: '🖼️',
    description: 'Multi-image gallery with lightbox',
    type: 'gallery',
    defaultProps: {
      images: [],
      layout: 'grid',
      columns: 3,
      showCaptions: true
    }
  },

  // Form Components
  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'form',
    icon: '📧',
    description: 'Contact form with validation',
    type: 'contact-form',
    defaultProps: {
      fields: ['name', 'email', 'message'],
      submitText: 'Send Message',
      successMessage: 'Thank you for your message!'
    }
  },

  // Navigation Components
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    category: 'navigation',
    icon: '🍞',
    description: 'Navigation breadcrumb trail',
    type: 'breadcrumbs',
    defaultProps: {
      separator: '/',
      showHome: true
    }
  }
];

function DraggableComponent({ component, onAdd }: { component: ComponentItem; onAdd: (comp: any) => void }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg cursor-move hover:border-dope-orange-300 hover:bg-dope-orange-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onAdd(component)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{component.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm">{component.name}</h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{component.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ComponentLibrary({ onComponentAdd }: ComponentLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = componentLibrary.filter(component => {
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Component Library</h3>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-dope-orange-500 focus:border-dope-orange-500"
          />
        </div>

        {/* Categories */}
        <div className="space-y-1 mb-4">
          {componentCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-dope-orange-100 text-dope-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="ml-auto text-xs text-gray-400">
                {componentLibrary.filter(c => category.id === 'all' || c.category === category.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Components Grid */}
      <div className="space-y-3">
        {filteredComponents.length > 0 ? (
          filteredComponents.map(component => (
            <DraggableComponent
              key={component.id}
              component={component}
              onAdd={onComponentAdd}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">🔍</div>
            <p className="text-sm">No components found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-dope-orange-600 text-sm mt-2 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 text-sm mb-2">How to use:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click a component to add it to the canvas</li>
          <li>• Drag components to reorder them</li>
          <li>• Use the Data tab to connect to your database</li>
          <li>• Style components with the Styles tab</li>
        </ul>
      </div>
    </div>
  );
}
