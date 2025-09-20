-- Page Builder Seed Data
-- Populates initial design themes and component library based on DOPE CITY design system

-- Insert DOPE CITY Design Themes
INSERT INTO design_themes (name, description, primary_color, secondary_color, accent_color, background_color, text_color, primary_font, secondary_font, heading_font, theme_config, is_default) VALUES

-- Default DOPE CITY Theme
('DOPE CITY Classic', 'The signature DOPE CITY theme with black backgrounds and orange accents', 
 '#fa6934', '#fbbf24', '#f59e0b', '#000000', '#ffffff', 
 'Chalets', 'Inter', 'Chalets',
 '{
   "colors": {
     "primary": "#fa6934",
     "secondary": "#fbbf24", 
     "accent": "#f59e0b",
     "background": "#000000",
     "surface": "#1f2937",
     "text": "#ffffff",
     "textSecondary": "#d1d5db",
     "border": "rgba(255,255,255,0.1)"
   },
   "typography": {
     "fontFamily": {
       "primary": "Chalets, Inter, system-ui, sans-serif",
       "secondary": "Inter, system-ui, sans-serif",
       "heading": "Chalets, Inter, system-ui, sans-serif"
     },
     "fontSize": {
       "xs": "0.75rem",
       "sm": "0.875rem", 
       "base": "1rem",
       "lg": "1.125rem",
       "xl": "1.25rem",
       "2xl": "1.5rem",
       "3xl": "1.875rem",
       "4xl": "2.25rem",
       "5xl": "3rem",
       "6xl": "3.75rem"
     },
     "letterSpacing": {
       "tight": "-0.02em",
       "normal": "0em",
       "wide": "0.1em"
     }
   },
   "spacing": {
     "xs": "0.25rem",
     "sm": "0.5rem",
     "md": "1rem", 
     "lg": "1.5rem",
     "xl": "2rem",
     "2xl": "3rem"
   },
   "borderRadius": {
     "sm": "0.375rem",
     "md": "0.5rem",
     "lg": "0.75rem",
     "xl": "1rem",
     "2xl": "1.5rem"
   },
   "effects": {
     "glassmorphism": {
       "background": "rgba(255, 255, 255, 0.1)",
       "backdropFilter": "blur(10px)",
       "border": "1px solid rgba(255, 255, 255, 0.2)"
     },
     "shadows": {
       "sm": "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
       "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
       "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
       "glow": "0 0 20px rgba(250, 105, 52, 0.3)"
     },
     "gradients": {
       "primary": "linear-gradient(135deg, #fa6934, #f59e0b)",
       "secondary": "linear-gradient(135deg, #fbbf24, #f59e0b)",
       "dark": "linear-gradient(135deg, #000000, #1f2937)"
     }
   }
 }', true),

-- Neo-Brutalism Theme
('DOPE CITY Neo-Brutalism', 'Bold, high-contrast theme with sharp edges and vibrant colors',
 '#fa6934', '#10b981', '#8b5cf6', '#ffffff', '#000000',
 'Chalets', 'DM Sans', 'Chalets',
 '{
   "colors": {
     "primary": "#fa6934",
     "secondary": "#10b981",
     "accent": "#8b5cf6", 
     "background": "#ffffff",
     "surface": "#f9fafb",
     "text": "#000000",
     "textSecondary": "#6b7280",
     "border": "#000000"
   },
   "borderRadius": {
     "sm": "0px",
     "md": "0px", 
     "lg": "0px",
     "xl": "0px",
     "2xl": "0px"
   },
   "effects": {
     "shadows": {
       "sm": "4px 4px 0px 0px #000000",
       "md": "6px 6px 0px 0px #000000",
       "lg": "8px 8px 0px 0px #000000"
     }
   }
 }', false),

-- Dark Modern Theme  
('DOPE CITY Dark Modern', 'Sleek dark theme with subtle gradients and modern aesthetics',
 '#6366f1', '#8b5cf6', '#ec4899', '#0f172a', '#f8fafc',
 'Inter', 'Inter', 'Inter',
 '{
   "colors": {
     "primary": "#6366f1",
     "secondary": "#8b5cf6",
     "accent": "#ec4899",
     "background": "#0f172a", 
     "surface": "#1e293b",
     "text": "#f8fafc",
     "textSecondary": "#cbd5e1",
     "border": "rgba(248, 250, 252, 0.1)"
   },
   "effects": {
     "glassmorphism": {
       "background": "rgba(30, 41, 59, 0.8)",
       "backdropFilter": "blur(16px)",
       "border": "1px solid rgba(248, 250, 252, 0.1)"
     }
   }
 }', false);

-- Insert Component Library Items
INSERT INTO component_library (name, category, description, component_type, default_props, config_schema, style_variants) VALUES

-- Layout Components
('Hero Section', 'layout', 'Full-width hero section with background image and call-to-action', 'hero',
 '{
   "title": "Welcome to DOPE CITY",
   "subtitle": "Premium cannabis culture meets street authenticity",
   "backgroundImage": "",
   "ctaText": "Shop Now",
   "ctaLink": "/products",
   "overlay": 0.5,
   "textAlign": "center"
 }',
 '{
   "type": "object",
   "properties": {
     "title": {"type": "string", "title": "Hero Title"},
     "subtitle": {"type": "string", "title": "Hero Subtitle"},
     "backgroundImage": {"type": "string", "title": "Background Image URL"},
     "ctaText": {"type": "string", "title": "CTA Button Text"},
     "ctaLink": {"type": "string", "title": "CTA Button Link"},
     "overlay": {"type": "number", "title": "Overlay Opacity", "minimum": 0, "maximum": 1},
     "textAlign": {"type": "string", "enum": ["left", "center", "right"], "title": "Text Alignment"}
   }
 }',
 '[
   {"name": "Classic", "className": "bg-black text-white"},
   {"name": "Gradient", "className": "bg-gradient-to-br from-black via-gray-900 to-black text-white"},
   {"name": "Image Overlay", "className": "relative bg-cover bg-center text-white"}
 ]'),

('Product Grid', 'ecommerce', 'Responsive grid layout for displaying products', 'product-grid',
 '{
   "columns": 3,
   "gap": "1.5rem",
   "showFilters": true,
   "showSorting": true,
   "itemsPerPage": 12
 }',
 '{
   "type": "object", 
   "properties": {
     "columns": {"type": "number", "title": "Number of Columns", "minimum": 1, "maximum": 4},
     "gap": {"type": "string", "title": "Grid Gap"},
     "showFilters": {"type": "boolean", "title": "Show Filters"},
     "showSorting": {"type": "boolean", "title": "Show Sorting"},
     "itemsPerPage": {"type": "number", "title": "Items Per Page"}
   }
 }',
 '[
   {"name": "Standard", "className": "grid gap-6"},
   {"name": "Compact", "className": "grid gap-4"},
   {"name": "Spacious", "className": "grid gap-8"}
 ]'),

-- Content Components
('Text Block', 'content', 'Rich text content block with formatting options', 'text-block',
 '{
   "content": "<p>Your content here...</p>",
   "textAlign": "left",
   "fontSize": "base",
   "fontWeight": "normal"
 }',
 '{
   "type": "object",
   "properties": {
     "content": {"type": "string", "title": "Content (HTML)"},
     "textAlign": {"type": "string", "enum": ["left", "center", "right"], "title": "Text Alignment"},
     "fontSize": {"type": "string", "enum": ["sm", "base", "lg", "xl", "2xl"], "title": "Font Size"},
     "fontWeight": {"type": "string", "enum": ["normal", "medium", "semibold", "bold"], "title": "Font Weight"}
   }
 }',
 '[]'),

('Image Gallery', 'media', 'Responsive image gallery with lightbox functionality', 'image-gallery',
 '{
   "images": [],
   "layout": "grid",
   "columns": 3,
   "aspectRatio": "square",
   "showCaptions": true
 }',
 '{
   "type": "object",
   "properties": {
     "images": {"type": "array", "title": "Images", "items": {"type": "string"}},
     "layout": {"type": "string", "enum": ["grid", "masonry", "carousel"], "title": "Layout Type"},
     "columns": {"type": "number", "title": "Columns", "minimum": 1, "maximum": 6},
     "aspectRatio": {"type": "string", "enum": ["square", "landscape", "portrait", "auto"], "title": "Aspect Ratio"},
     "showCaptions": {"type": "boolean", "title": "Show Captions"}
   }
 }',
 '[]'),

-- Form Components
('Contact Form', 'form', 'Contact form with validation and submission handling', 'contact-form',
 '{
   "fields": [
     {"name": "name", "type": "text", "label": "Name", "required": true},
     {"name": "email", "type": "email", "label": "Email", "required": true},
     {"name": "message", "type": "textarea", "label": "Message", "required": true}
   ],
   "submitText": "Send Message",
   "successMessage": "Thank you for your message!"
 }',
 '{
   "type": "object",
   "properties": {
     "fields": {"type": "array", "title": "Form Fields"},
     "submitText": {"type": "string", "title": "Submit Button Text"},
     "successMessage": {"type": "string", "title": "Success Message"}
   }
 }',
 '[]'),

-- Navigation Components
('Navigation Menu', 'navigation', 'Responsive navigation menu with dropdown support', 'nav-menu',
 '{
   "items": [
     {"label": "Home", "href": "/"},
     {"label": "Products", "href": "/products"},
     {"label": "About", "href": "/about"},
     {"label": "Contact", "href": "/contact"}
   ],
   "logo": "",
   "style": "horizontal"
 }',
 '{
   "type": "object",
   "properties": {
     "items": {"type": "array", "title": "Menu Items"},
     "logo": {"type": "string", "title": "Logo URL"},
     "style": {"type": "string", "enum": ["horizontal", "vertical"], "title": "Menu Style"}
   }
 }',
 '[]');

-- Insert Sample Page Templates
INSERT INTO page_templates (name, description, category, design_config) VALUES

('DOPE CITY Landing Page', 'Classic DOPE CITY landing page with hero, features, and CTA sections', 'landing',
 '{
   "sections": [
     {
       "id": "hero",
       "type": "hero",
       "props": {
         "title": "Welcome to DOPE CITY",
         "subtitle": "Premium cannabis culture meets street authenticity",
         "backgroundImage": "/images/hero-bg.jpg",
         "ctaText": "Shop Now",
         "ctaLink": "/products"
       }
     },
     {
       "id": "features",
       "type": "feature-grid",
       "props": {
         "title": "Why Choose DOPE CITY",
         "features": [
           {"title": "Premium Quality", "description": "Only the finest products", "icon": "star"},
           {"title": "Fast Shipping", "description": "Quick and discreet delivery", "icon": "truck"},
           {"title": "Expert Support", "description": "Knowledgeable customer service", "icon": "support"}
         ]
       }
     }
   ],
   "theme": "dope-city-classic",
   "layout": "full-width"
 }'),

('Product Collection Page', 'Template for showcasing product collections with filters and grid layout', 'collection',
 '{
   "sections": [
     {
       "id": "collection-header",
       "type": "collection-hero",
       "props": {
         "title": "Collection Name",
         "description": "Discover our premium selection",
         "backgroundImage": ""
       }
     },
     {
       "id": "product-grid",
       "type": "product-grid", 
       "props": {
         "columns": 3,
         "showFilters": true,
         "showSorting": true
       }
     }
   ],
   "theme": "dope-city-classic",
   "layout": "container"
 }');

-- Update usage counts (simulated)
UPDATE component_library SET usage_count = FLOOR(RANDOM() * 50) + 1;
