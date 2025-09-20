# 🚀 DOPE CITY Page Templates

This directory contains standardized page templates for creating new pages on the DOPE CITY website. Each template includes all necessary global components and follows the established design patterns.

## 📋 Available Templates

### 1. **PageTemplate.tsx** - Full-Featured Template
**Use for:** Complex pages with multiple features
**Includes:**
- All global components imported
- Complete state management setup
- Product integration
- AI chat capability
- Toast notifications
- Age verification
- Comprehensive UI components

### 2. **SimplePageTemplate.tsx** - Basic Template
**Use for:** Simple static pages, about pages, policy pages
**Includes:**
- Global masthead and footer
- Basic hero section
- Minimal imports
- Clean structure

### 3. **InteractivePageTemplate.tsx** - Dynamic Template
**Use for:** Pages with search, filtering, dynamic content
**Includes:**
- Client-side interactivity
- Search and filtering
- Supabase integration
- Loading states
- Data management

## 🛠️ How to Use Templates

### Step 1: Choose Your Template
- **Static content page** → Use `SimplePageTemplate.tsx`
- **Interactive page with data** → Use `InteractivePageTemplate.tsx`
- **Complex page with all features** → Use `PageTemplate.tsx`

### Step 2: Copy Template
```bash
# Example: Creating a new "About" page
cp templates/SimplePageTemplate.tsx app/about/page.tsx
```

### Step 3: Customize
1. **Rename the component**
2. **Update metadata**
3. **Modify content**
4. **Remove unused imports**

### Step 4: Update Metadata
```typescript
export const metadata: Metadata = {
  title: 'Your Page Title | DOPE CITY',
  description: 'SEO description for your page',
  keywords: 'relevant, keywords, here',
};
```

## 📁 File Structure Examples

### Static Page (About Us)
```
app/about/
├── page.tsx (copied from SimplePageTemplate)
└── components/ (optional page-specific components)
```

### Interactive Page (Product Catalog)
```
app/catalog/
├── page.tsx (imports CatalogPageContent)
├── CatalogPageContent.tsx (copied from InteractivePageTemplate)
└── components/
    ├── CatalogFilters.tsx
    └── ProductGrid.tsx
```

### Complex Page (Brand Page)
```
app/brands/brand-name/
├── page.tsx (imports BrandPageContent)
├── BrandPageContent.tsx (copied from PageTemplate)
└── components/
    ├── BrandHero.tsx
    ├── ProductShowcase.tsx
    └── BrandStory.tsx
```

## 🎨 Global Components Reference

### Essential Components (Always Include)
- `GlobalMasthead` - Header with search and navigation
- `DopeCityFooter` - Footer with links and info

### Optional Components (Include as Needed)
- `AgeVerification` - Age verification modal
- `PersonalizedGreeting` - User greeting
- `EnhancedSearchBar` - Advanced search
- `AIProductChat` - AI chat widget
- `ProductRecommendations` - Product suggestions
- `DopeClubSignup` - Newsletter signup

### UI Components
- `Button`, `Input`, `Label` - Form elements
- `Toast`, `Toaster` - Notifications
- `Tooltip` - Help text
- `Switch` - Toggle controls

## 🔧 Common Patterns

### 1. Page with Product Data
```typescript
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  async function fetchProducts() {
    const { data } = await supabaseBrowser
      .from('products')
      .select('*')
      .eq('is_active', true);
    setProducts(data || []);
  }
  fetchProducts();
}, []);
```

### 2. Search and Filtering
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [filters, setFilters] = useState({ category: 'all' });

const filteredData = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesFilter = filters.category === 'all' || item.category === filters.category;
  return matchesSearch && matchesFilter;
});
```

### 3. Loading States
```typescript
const [loading, setLoading] = useState(true);

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-dope-orange-500" />
    </div>
  );
}
```

## 🎯 DOPE CITY Design Standards

### Typography
- **Page Titles**: Use `dope-city-title` class
- **Headings**: Use Tailwind typography classes
- **Body Text**: Use gray-600 for secondary text

### Colors
- **Primary Orange**: `dope-orange-500`, `dope-orange-600`
- **Text**: `text-gray-900` (primary), `text-gray-600` (secondary)
- **Backgrounds**: `bg-white`, `bg-gray-50`, `bg-gray-900`

### Layout
- **Max Width**: `max-w-6xl mx-auto` for content containers
- **Padding**: `px-6` for horizontal padding
- **Sections**: `py-16` for vertical spacing

### Components
- **Buttons**: Use `Button` component with DOPE CITY styling
- **Cards**: White background with `border border-gray-200 rounded-lg`
- **Hover Effects**: `hover:shadow-lg transition-shadow`

## 📝 Quick Start Checklist

- [ ] Choose appropriate template
- [ ] Copy to new location
- [ ] Rename component
- [ ] Update metadata
- [ ] Customize hero section
- [ ] Add page-specific content
- [ ] Remove unused imports
- [ ] Test responsive design
- [ ] Verify all links work
- [ ] Check SEO metadata

## 🚨 Important Notes

1. **Always use `'use client'`** for interactive components
2. **Import paths** may need adjustment based on your file location
3. **Remove unused imports** to keep bundle size small
4. **Test on mobile** - all templates are responsive
5. **Follow naming conventions** - use PascalCase for components

## 🔗 Related Files

- `app/components/GlobalMasthead.tsx` - Main navigation
- `components/DopeCityFooter.tsx` - Site footer
- `app/lib/supabase-browser.tsx` - Database client
- `DOPE_CITY_STYLE_GUIDE.md` - Design guidelines

## 💡 Tips

- Start with the simplest template that meets your needs
- Add complexity gradually
- Reuse existing components when possible
- Follow the established patterns
- Test thoroughly before deploying

---

**Need help?** Check existing pages for examples or refer to the component documentation.
