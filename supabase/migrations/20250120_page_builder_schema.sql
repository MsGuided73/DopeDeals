-- Page Builder System Migration
-- Creates tables for visual page builder functionality

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Page Templates - Predefined layouts and designs
CREATE TABLE page_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('landing', 'product', 'collection', 'content', 'custom')),
    thumbnail TEXT,
    is_active BOOLEAN DEFAULT true,
    design_config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- User Created Pages - Pages built using the visual editor
CREATE TABLE user_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    template_id UUID REFERENCES page_templates(id),
    design_config JSONB NOT NULL,
    
    -- SEO and Meta
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    
    -- Publishing
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_page_id UUID REFERENCES user_pages(id),
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- Component Library - Reusable UI components
CREATE TABLE component_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('layout', 'content', 'form', 'media', 'navigation', 'ecommerce')),
    description TEXT,
    thumbnail TEXT,
    
    -- Component Definition
    component_type TEXT NOT NULL,
    default_props JSONB NOT NULL,
    config_schema JSONB NOT NULL,
    
    -- Styling Options
    style_variants JSONB,
    customizable BOOLEAN DEFAULT true,
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Design Themes - Color schemes, fonts, and styling presets
CREATE TABLE design_themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Color Palette
    primary_color TEXT NOT NULL,
    secondary_color TEXT,
    accent_color TEXT,
    background_color TEXT,
    text_color TEXT,
    
    -- Typography
    primary_font TEXT NOT NULL,
    secondary_font TEXT,
    heading_font TEXT,
    
    -- Spacing and Layout
    border_radius TEXT DEFAULT '0.5rem',
    spacing TEXT DEFAULT '1rem',
    
    -- Effects
    glassmorphism JSONB,
    gradients JSONB,
    shadows JSONB,
    
    -- Theme Configuration
    theme_config JSONB NOT NULL,
    
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page Analytics - Track page performance
CREATE TABLE page_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES user_pages(id) ON DELETE CASCADE,
    
    -- Traffic Data
    date TIMESTAMPTZ NOT NULL,
    views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate INTEGER DEFAULT 0,
    avg_time_on_page INTEGER DEFAULT 0,
    
    -- Conversion Data
    conversions INTEGER DEFAULT 0,
    conversion_rate INTEGER DEFAULT 0,
    
    -- Device/Browser Data
    device_data JSONB,
    traffic_sources JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate entries for same page/date
    UNIQUE(page_id, date)
);

-- Media Assets - Images, videos, and other media for the page builder
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    
    -- Storage
    bucket_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    
    -- Metadata
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    
    -- Organization
    category TEXT CHECK (category IN ('hero', 'product', 'background', 'icon', 'logo', 'content')),
    tags JSONB,
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by UUID NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_page_templates_category ON page_templates(category);
CREATE INDEX idx_page_templates_active ON page_templates(is_active);

CREATE INDEX idx_user_pages_slug ON user_pages(slug);
CREATE INDEX idx_user_pages_status ON user_pages(status);
CREATE INDEX idx_user_pages_created_by ON user_pages(created_by);
CREATE INDEX idx_user_pages_template ON user_pages(template_id);

CREATE INDEX idx_component_library_category ON component_library(category);
CREATE INDEX idx_component_library_type ON component_library(component_type);
CREATE INDEX idx_component_library_active ON component_library(is_active);

CREATE INDEX idx_design_themes_default ON design_themes(is_default);
CREATE INDEX idx_design_themes_active ON design_themes(is_active);

CREATE INDEX idx_page_analytics_page_date ON page_analytics(page_id, date);
CREATE INDEX idx_page_analytics_date ON page_analytics(date);

CREATE INDEX idx_media_assets_category ON media_assets(category);
CREATE INDEX idx_media_assets_mime_type ON media_assets(mime_type);
CREATE INDEX idx_media_assets_uploaded_by ON media_assets(uploaded_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_page_templates_updated_at BEFORE UPDATE ON page_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_pages_updated_at BEFORE UPDATE ON user_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_component_library_updated_at BEFORE UPDATE ON component_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_design_themes_updated_at BEFORE UPDATE ON design_themes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies (adjust based on your auth system)
CREATE POLICY "Admin full access to page_templates" ON page_templates FOR ALL USING (true);
CREATE POLICY "Admin full access to user_pages" ON user_pages FOR ALL USING (true);
CREATE POLICY "Admin full access to component_library" ON component_library FOR ALL USING (true);
CREATE POLICY "Admin full access to design_themes" ON design_themes FOR ALL USING (true);
CREATE POLICY "Admin full access to page_analytics" ON page_analytics FOR ALL USING (true);
CREATE POLICY "Admin full access to media_assets" ON media_assets FOR ALL USING (true);

-- Public read access for published pages (for frontend rendering)
CREATE POLICY "Public read access to published pages" ON user_pages FOR SELECT USING (status = 'published');

-- Comments for documentation
COMMENT ON TABLE page_templates IS 'Predefined page layouts and designs for the visual page builder';
COMMENT ON TABLE user_pages IS 'User-created pages built with the visual page builder';
COMMENT ON TABLE component_library IS 'Reusable UI components available in the page builder';
COMMENT ON TABLE design_themes IS 'Color schemes, fonts, and styling presets';
COMMENT ON TABLE page_analytics IS 'Analytics data for tracking page performance';
COMMENT ON TABLE media_assets IS 'Images, videos, and other media assets for the page builder';
