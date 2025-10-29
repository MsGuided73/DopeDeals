'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Save,
  X,
  Upload,
  ExternalLink
} from 'lucide-react';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image_url: string;
  text_color: string;
  overlay_opacity: number;
  is_active: boolean;
  sort_order: number;
  display_duration: number;
  created_at: string;
  updated_at: string;
}

const TEXT_COLOR_OPTIONS = [
  { value: 'text-white', label: 'White', preview: 'bg-white' },
  { value: 'text-black', label: 'Black', preview: 'bg-black' },
  { value: 'text-gray-900', label: 'Dark Gray', preview: 'bg-gray-900' },
  { value: 'text-gray-100', label: 'Light Gray', preview: 'bg-gray-100' }
];

export default function CarouselAdminPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch slides from database
  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseBrowser
        .from('carousel_slides')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch slides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Create new slide
  const createSlide = async (slideData: Omit<CarouselSlide, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('carousel_slides')
        .insert([slideData])
        .select()
        .single();

      if (error) throw error;
      
      setSlides(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create slide');
    }
  };

  // Update slide
  const updateSlide = async (id: string, updates: Partial<CarouselSlide>) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('carousel_slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSlides(prev => prev.map(slide => 
        slide.id === id ? data : slide
      ).sort((a, b) => a.sort_order - b.sort_order));
      
      setEditingSlide(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update slide');
    }
  };

  // Delete slide
  const deleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      const { error } = await supabaseBrowser
        .from('carousel_slides')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSlides(prev => prev.filter(slide => slide.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete slide');
    }
  };

  // Toggle slide active status
  const toggleSlideActive = async (id: string, isActive: boolean) => {
    await updateSlide(id, { is_active: isActive });
  };

  // Move slide up/down
  const moveSlide = async (id: string, direction: 'up' | 'down') => {
    const slide = slides.find(s => s.id === id);
    if (!slide) return;

    const newSortOrder = direction === 'up' ? slide.sort_order - 1 : slide.sort_order + 1;
    const swapSlide = slides.find(s => s.sort_order === newSortOrder);

    if (swapSlide) {
      // Swap sort orders
      await updateSlide(slide.id, { sort_order: newSortOrder });
      await updateSlide(swapSlide.id, { sort_order: slide.sort_order });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dope-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-chalets-legweb text-gray-900" style={{ letterSpacing: '-0.02em' }}>
            CAROUSEL MANAGEMENT
          </h1>
          <p className="text-gray-600 mt-2">
            Manage homepage carousel slides - control content, images, and display settings
          </p>
        </div>
        
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-dope-orange hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Slide
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No carousel slides found</p>
            <p className="text-gray-400 text-sm mt-2">Create your first slide to get started</p>
          </div>
        ) : (
          slides.map((slide) => (
            <div key={slide.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                {/* Slide Preview */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-24 h-16 bg-cover bg-center rounded-lg border"
                      style={{ backgroundImage: `url(${slide.background_image_url})` }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{slide.title}</h3>
                      {slide.subtitle && (
                        <p className="text-gray-600">{slide.subtitle}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Order: {slide.sort_order}</span>
                        <span>Duration: {slide.display_duration}ms</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          slide.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {slide.description && (
                    <p className="text-gray-700 mb-3">{slide.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">CTA:</span>
                    <span className="bg-dope-orange text-white px-3 py-1 rounded text-sm">
                      {slide.cta_text}
                    </span>
                    <span className="text-sm text-gray-500">→</span>
                    <a 
                      href={slide.cta_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      {slide.cta_link}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => toggleSlideActive(slide.id, !slide.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.is_active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                    title={slide.is_active ? 'Deactivate slide' : 'Activate slide'}
                  >
                    {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => moveSlide(slide.id, 'up')}
                    disabled={slide.sort_order === 1}
                    className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => moveSlide(slide.id, 'down')}
                    disabled={slide.sort_order === slides.length}
                    className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    title="Edit slide"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Link */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Preview Changes</h3>
            <p className="text-blue-700 text-sm">View how your carousel looks on the homepage</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Homepage
          </a>
        </div>
      </div>

      {/* Slide Editor Modal */}
      {(editingSlide || isCreating) && (
        <SlideEditorModal
          slide={editingSlide}
          isOpen={true}
          onClose={() => {
            setEditingSlide(null);
            setIsCreating(false);
          }}
          onSave={editingSlide ?
            (updates) => updateSlide(editingSlide.id, updates) :
            (slideData) => createSlide(slideData)
          }
        />
      )}
    </div>
  );
}

// Slide Editor Modal Component
interface SlideEditorModalProps {
  slide: CarouselSlide | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

function SlideEditorModal({ slide, isOpen, onClose, onSave }: SlideEditorModalProps) {
  const [formData, setFormData] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    description: slide?.description || '',
    cta_text: slide?.cta_text || 'Learn More',
    cta_link: slide?.cta_link || '/',
    background_image_url: slide?.background_image_url || '',
    text_color: slide?.text_color || 'text-white',
    overlay_opacity: slide?.overlay_opacity || 0.4,
    display_duration: slide?.display_duration || 5000,
    sort_order: slide?.sort_order || 1,
    is_active: slide?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {slide ? 'Edit Slide' : 'Create New Slide'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                placeholder="Enter slide title"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                placeholder="Enter slide subtitle"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                placeholder="Enter slide description"
              />
            </div>

            {/* CTA Text & Link */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cta_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                  placeholder="Learn More"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cta_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                  placeholder="/products"
                />
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.background_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, background_image_url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                placeholder="https://..."
              />
              {formData.background_image_url && (
                <div className="mt-2">
                  <img
                    src={formData.background_image_url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TEXT_COLOR_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="text_color"
                      value={option.value}
                      checked={formData.text_color === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
                      className="text-dope-orange-500"
                    />
                    <div className={`w-4 h-4 rounded-full border ${option.preview}`}></div>
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Duration (ms)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="30000"
                  step="500"
                  value={formData.display_duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overlay Opacity
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.overlay_opacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlay_opacity: parseFloat(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-dope-orange-500 rounded focus:ring-dope-orange-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active (visible on homepage)
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-dope-orange hover:bg-dope-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {slide ? 'Update Slide' : 'Create Slide'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
