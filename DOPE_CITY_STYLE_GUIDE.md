# DOPE CITY - Brand Style Guide & Design System

**Premium Cannabis Culture | Street Aesthetic | Luxury Experience**

---

## 🎨 **BRAND IDENTITY**

### **Brand Positioning**
- **Premium Cannabis Culture**: High-end, sophisticated cannabis lifestyle
- **Street Aesthetic**: Urban, authentic, real culture
- **Luxury Experience**: VIP treatment, exclusive access, quality products
- **Community Focused**: Building the dopest community in cannabis

### **Brand Voice & Tone**
- **Authentic**: Real, genuine, no corporate BS
- **Confident**: We know what's good, we're the experts
- **Inclusive**: Everyone's welcome in DOPE CITY
- **Premium**: Quality over quantity, always
- **Street Smart**: Urban culture, hip-hop influence, street credibility

---

## 🎯 **VISUAL IDENTITY**

### **Logo & Typography**

#### **Primary Logo**
```
DOPE CITY
```
- **Font**: Chalets (custom premium font)
- **Treatment**: "DOPE" in white, "CITY" in gold (#fbbf24)
- **Spacing**: 2-character space between words
- **Weight**: Black (900)
- **Tracking**: Wider (0.1em)

#### **Typography Hierarchy**

**Headlines (H1-H2)**
- **Font**: Chalets Black
- **Sizes**: 
  - H1: 3xl-6xl (mobile-desktop)
  - H2: 2xl-4xl (mobile-desktop)
- **Color**: White or Gold
- **Treatment**: All caps, wide tracking

**Subheadings (H3-H4)**
- **Font**: Chalets Regular
- **Sizes**: xl-2xl
- **Color**: White, Gray-100, or Gold
- **Treatment**: Sentence case or Title Case

**Body Text**
- **Font**: Inter (fallback to system fonts)
- **Sizes**: sm-lg
- **Color**: Gray-100, Gray-300
- **Line Height**: Relaxed (1.6)

**Labels & UI Text**
- **Font**: Inter Medium/Semibold
- **Sizes**: xs-sm
- **Color**: Gray-400, White
- **Treatment**: Uppercase for labels

### **Color Palette**

#### **Primary Colors**
```css
--dope-orange: #ff6b35;      /* Primary accent color - glowing orange */
--dope-orange-dark: #e55a2b; /* Hover states, darker orange */
--dope-orange-light: #ff8c5a; /* Light orange for subtle accents */
--dope-black: #000000;       /* Primary background */
--dope-white: #ffffff;       /* Primary text on dark */
```

#### **Secondary Colors**
```css
--dope-gray-900: #111827;    /* Card backgrounds */
--dope-gray-800: #1f2937;    /* Secondary backgrounds */
--dope-gray-100: #f3f4f6;    /* Light text */
--dope-gray-400: #9ca3af;    /* Muted text */
```

#### **Accent Colors**
```css
--success: #10b981;          /* Success states */
--warning: #f59e0b;          /* Warning states */
--error: #ef4444;            /* Error states */
--info: #3b82f6;             /* Info states */
```

#### **Usage Guidelines**
- **Orange**: Primary CTAs, highlights, brand elements, active states, hover effects
- **Orange Dark**: Hover states, pressed states, active elements
- **Orange Light**: Subtle accents, borders, focus states
- **Black**: Primary backgrounds, headers, premium sections
- **White**: Primary text on dark backgrounds, clean sections
- **Gray-900**: Card backgrounds, secondary sections
- **Gray-800**: Hover states, borders, dividers

#### **Border Radius System**
```css
--radius-sm: 0.375rem;    /* 6px - Small elements, badges */
--radius-md: 0.5rem;      /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;     /* 12px - Cards, modals */
--radius-xl: 1rem;        /* 16px - Large cards, sections */
--radius-2xl: 1.5rem;     /* 24px - Hero sections, major components */
--radius-full: 9999px;    /* Full rounded - Pills, avatars */
```

#### **Hover Effects System**
```css
/* Standard hover transition */
.dope-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glow effect for orange elements */
.dope-glow-orange {
  box-shadow: 0 0 0 0 rgba(255, 107, 53, 0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dope-glow-orange:hover {
  box-shadow: 0 0 20px 5px rgba(255, 107, 53, 0.3);
  transform: translateY(-2px);
}

/* Scale hover effect */
.dope-scale-hover:hover {
  transform: scale(1.05);
}
```

---

## 🎨 **DESIGN PATTERNS**

### **Layout System**

#### **Grid System**
- **Container**: max-w-7xl mx-auto px-4
- **Breakpoints**: 
  - Mobile: 320px-768px
  - Tablet: 768px-1024px
  - Desktop: 1024px+
- **Spacing**: 4px base unit (Tailwind spacing scale)

#### **Component Spacing**
- **Section Padding**: py-12 lg:py-20
- **Card Padding**: p-6 lg:p-8
- **Element Margins**: mb-4, mb-6, mb-8
- **Grid Gaps**: gap-4, gap-6, gap-8

### **Visual Effects**

#### **Glassmorphism**
```css
.dope-glass {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### **Gradients**
```css
.dope-gradient-gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.dope-gradient-dark {
  background: linear-gradient(135deg, #000000, #1f2937);
}
```

#### **Text Effects**
```css
.dope-text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
```

#### **Animations**
- **Hover Transitions**: transition-all duration-300
- **Button Hovers**: Scale 105%, color changes
- **Card Hovers**: Subtle lift with shadow
- **Loading States**: Pulse animations

---

## 🧩 **COMPONENT LIBRARY**

### **Buttons**

#### **Primary Button**
```tsx
<button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25">
  Shop Now
</button>
```

#### **Secondary Button**
```tsx
<button className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25">
  Learn More
</button>
```

#### **Ghost Button**
```tsx
<button className="text-white hover:text-orange-500 font-medium transition-all duration-300 hover:scale-105">
  Browse All
</button>
```

### **Cards**

#### **Product Card**
```tsx
<div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
  {/* Product content */}
</div>
```

#### **Feature Card**
```tsx
<div className="bg-black/80 border border-yellow-400/20 rounded-xl p-8 text-center">
  {/* Feature content */}
</div>
```

### **Navigation**

#### **Header**
- **Background**: bg-black/90 backdrop-blur-md
- **Border**: border-b border-white/10
- **Height**: h-16 lg:h-20
- **Logo**: Chalets font, DOPE (white) CITY (gold)
- **Links**: White text, gold hover

#### **Mobile Menu**
- **Background**: bg-black/95 backdrop-blur-lg
- **Animation**: Slide in from right
- **Links**: Large text, gold accents

### **Forms**

#### **Input Fields**
```tsx
<input className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" />
```

#### **Select Dropdowns**
```tsx
<select className="w-full bg-gray-900/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20">
```

---

## 📱 **RESPONSIVE DESIGN**

### **Mobile-First Approach**
- Design for mobile (320px) first
- Progressive enhancement for larger screens
- Touch-friendly interactions (44px minimum touch targets)
- Simplified navigation and content hierarchy

### **Breakpoint Strategy**
- **Mobile**: Single column, stacked navigation, large touch targets
- **Tablet**: 2-3 column grids, horizontal navigation, medium spacing
- **Desktop**: Multi-column layouts, hover states, generous spacing

### **Performance Considerations**
- Optimize images for different screen densities
- Use Next.js Image component with proper sizing
- Lazy load below-the-fold content
- Minimize layout shifts

---

## 🎭 **CONTENT GUIDELINES**

### **Photography Style**
- **High-contrast**: Bold shadows and highlights
- **Urban aesthetic**: Street photography influence
- **Product focus**: Clean, premium product shots
- **Lifestyle**: Real people, authentic moments
- **Color grading**: Warm tones, gold accents

### **Iconography**
- **Style**: Lucide React icons (consistent stroke width)
- **Size**: 20px-24px for UI, 32px+ for features
- **Color**: White, gold, or gray-400
- **Usage**: Functional, not decorative

### **Copywriting Voice**
- **Headlines**: Bold, confident, street-smart
- **Product descriptions**: Detailed but accessible
- **CTAs**: Action-oriented, urgent but not pushy
- **Error messages**: Helpful, not condescending
- **Success messages**: Celebratory, community-focused

---

## ♿ **ACCESSIBILITY STANDARDS**

### **Color Contrast**
- **Text on dark backgrounds**: Minimum 4.5:1 ratio
- **Gold on black**: Verified AA compliance
- **Interactive elements**: Clear focus states
- **Error states**: Color + text indicators

### **Navigation**
- **Keyboard navigation**: Full tab support
- **Screen readers**: Proper ARIA labels
- **Focus management**: Logical tab order
- **Skip links**: Jump to main content

### **Content**
- **Alt text**: Descriptive image alternatives
- **Headings**: Proper hierarchy (H1-H6)
- **Forms**: Clear labels and error messages
- **Links**: Descriptive link text

---

## 🔧 **IMPLEMENTATION NOTES**

### **CSS Architecture**
- **Tailwind CSS**: Utility-first approach
- **Custom CSS**: Minimal, component-specific
- **CSS Variables**: For theme consistency
- **PostCSS**: For optimization and vendor prefixes

### **Component Structure**
- **Atomic Design**: Atoms → Molecules → Organisms
- **Reusable Components**: Maximum code reuse
- **Props Interface**: TypeScript for type safety
- **Default Props**: Sensible defaults for all components

### **Performance Optimization**
- **Critical CSS**: Inline above-the-fold styles
- **Font Loading**: Preload Chalets font
- **Image Optimization**: WebP format, proper sizing
- **Bundle Splitting**: Code splitting for better loading

---

## 🎨 **SPECIFIC COMPONENT EXAMPLES**

### **Product Cards**

#### **Standard Product Card**
```tsx
<div className="group bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
  <div className="aspect-square relative overflow-hidden">
    <Image
      src={product.imageUrl}
      alt={product.name}
      fill
      className="object-cover group-hover:scale-110 transition-transform duration-500"
    />
    {product.featured && (
      <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-md text-xs font-bold">
        FEATURED
      </div>
    )}
    {product.vipExclusive && (
      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 py-1 rounded-md text-xs font-bold">
        VIP ONLY
      </div>
    )}
  </div>
  <div className="p-6">
    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{product.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-yellow-400 font-bold text-xl">${product.price}</span>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

#### **Compact Product Card** (for grids)
```tsx
<div className="bg-gray-900/30 border border-white/10 rounded-lg p-4 hover:border-yellow-400/50 transition-all duration-300">
  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
    <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
  </div>
  <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
  <p className="text-yellow-400 font-bold">${product.price}</p>
</div>
```

### **Navigation Components**

#### **Breadcrumb Navigation**
```tsx
<nav className="flex items-center space-x-2 text-sm mb-6">
  <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
  <ChevronRight className="w-4 h-4 text-gray-600" />
  <Link href="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link>
  <ChevronRight className="w-4 h-4 text-gray-600" />
  <span className="text-yellow-400">Glass Bongs</span>
</nav>
```

#### **Category Filter Pills**
```tsx
<div className="flex flex-wrap gap-2 mb-6">
  {categories.map((category) => (
    <button
      key={category.id}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        activeCategory === category.id
          ? 'bg-yellow-400 text-black'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {category.name}
    </button>
  ))}
</div>
```

### **Form Components**

#### **Search Bar**
```tsx
<div className="relative max-w-md">
  <input
    type="text"
    placeholder="Search products..."
    className="w-full bg-gray-900/50 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
  />
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
</div>
```

#### **Quantity Selector**
```tsx
<div className="flex items-center border border-white/20 rounded-lg overflow-hidden">
  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white transition-colors">
    <Minus className="w-4 h-4" />
  </button>
  <span className="px-4 py-2 bg-gray-900 text-white min-w-[60px] text-center">{quantity}</span>
  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white transition-colors">
    <Plus className="w-4 h-4" />
  </button>
</div>
```

### **Status Components**

#### **Stock Status**
```tsx
<div className="flex items-center space-x-2">
  {inStock ? (
    <>
      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
      <span className="text-green-400 text-sm font-medium">In Stock</span>
    </>
  ) : (
    <>
      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
      <span className="text-red-400 text-sm font-medium">Out of Stock</span>
    </>
  )}
</div>
```

#### **VIP Badge**
```tsx
<div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
  <Crown className="w-3 h-3" />
  <span>VIP EXCLUSIVE</span>
</div>
```

#### **Age Restriction Warning**
```tsx
<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
  <div className="flex items-center space-x-2 mb-2">
    <AlertTriangle className="w-5 h-5 text-red-400" />
    <h4 className="text-red-400 font-semibold">Age Restricted Product</h4>
  </div>
  <p className="text-red-300 text-sm">
    This product contains nicotine and is restricted to customers 21+ years old.
    Age verification required at checkout.
  </p>
</div>
```

---

## 🎯 **PAGE-SPECIFIC PATTERNS**

### **Homepage Hero Section**
```tsx
<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
  <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
    <h1 className="font-chalets text-6xl lg:text-8xl font-black text-white mb-6 dope-text-shadow">
      WELCOME TO <span className="text-yellow-400">DOPE CITY</span>
    </h1>
    <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
      Premium cannabis culture meets street authenticity.
      Discover the dopest products in the game.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 hover:scale-105">
        Shop Now
      </button>
      <button className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300">
        Explore Brands
      </button>
    </div>
  </div>
</section>
```

### **Product Grid Layout**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

### **Loading States**
```tsx
<div className="animate-pulse">
  <div className="bg-gray-800 aspect-square rounded-lg mb-4"></div>
  <div className="bg-gray-800 h-4 rounded mb-2"></div>
  <div className="bg-gray-800 h-4 rounded w-3/4 mb-4"></div>
  <div className="bg-gray-800 h-6 rounded w-1/2"></div>
</div>
```

---

## 🚨 **COMPLIANCE DESIGN PATTERNS**

### **Age Verification Modal**
```tsx
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="bg-gray-900 border border-yellow-400/30 rounded-xl p-8 max-w-md w-full text-center">
    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
      <Shield className="w-8 h-8 text-black" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-4">Age Verification Required</h2>
    <p className="text-gray-300 mb-6">
      You must be 21 or older to access this content.
      Please verify your age to continue.
    </p>
    <div className="flex gap-4">
      <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all">
        I'm 21+
      </button>
      <button className="flex-1 border border-gray-600 text-gray-300 hover:bg-gray-800 font-bold py-3 px-6 rounded-lg transition-all">
        Under 21
      </button>
    </div>
  </div>
</div>
```

### **State Restriction Notice**
```tsx
<div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
  <div className="flex items-start space-x-3">
    <MapPin className="w-5 h-5 text-orange-400 mt-0.5" />
    <div>
      <h4 className="text-orange-400 font-semibold mb-1">Shipping Restriction</h4>
      <p className="text-orange-300 text-sm">
        This product cannot be shipped to your location due to local regulations.
        <Link href="/legal/state-restrictions" className="text-yellow-400 hover:underline ml-1">
          Learn more
        </Link>
      </p>
    </div>
  </div>
</div>
```
