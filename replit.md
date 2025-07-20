# VIP Smoke E-Commerce Platform

## Overview

VIP Smoke is a premium e-commerce platform designed for the paraphernalia, nicotine, and CBD market. The application is built as a full-stack web application with a React frontend and Express backend, emphasizing compliance, scalability, and premium user experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, local state for UI
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless database
- **API Pattern**: RESTful endpoints under `/api` prefix

### Development Environment
- **Monorepo Structure**: Unified client/server/shared code organization
- **Hot Reload**: Vite development server with middleware integration
- **Type Safety**: Shared TypeScript schemas between frontend and backend

## Key Components

### Database Schema (Drizzle)
- **Users**: User profiles with age verification status and membership tiers
- **Products**: Product catalog with pricing, inventory, and VIP exclusivity flags
- **Categories & Brands**: Hierarchical product organization
- **Orders & Order Items**: Transaction management
- **Cart Items**: Shopping cart persistence
- **Memberships & Loyalty Points**: VIP program implementation

### Age Verification System
- Modal-based age verification on first visit
- Local storage persistence for verified users
- Date-based age calculation with 21+ requirement
- Redirect mechanism for underage users

### Product Management
- Filtering system (category, brand, material, price range, VIP status)
- Product cards with wishlist functionality
- Featured products and VIP exclusive items
- Image management with fallback handling

### Shopping Experience
- Shopping cart sidebar with quantity management
- VIP membership integration
- Responsive design for mobile and desktop
- Toast notifications for user feedback

## Data Flow

1. **User Authentication**: Age verification → local storage → access granted
2. **Product Discovery**: API queries → filtered results → cached responses
3. **Shopping Cart**: Add to cart → session persistence → checkout flow
4. **Order Processing**: Cart items → order creation → fulfillment pipeline

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **express**: Web server framework

### UI/UX Libraries
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant system
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling

## Deployment Strategy

### Development
- Local development with Vite dev server
- Hot module replacement for rapid iteration
- TypeScript compilation checking
- Database schema migrations with Drizzle Kit

### Production Build
- Vite builds client assets to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single Node.js process serves both static assets and API
- Environment-based configuration

### Database Management
- Drizzle migrations stored in `./migrations`
- Schema definitions in `shared/schema.ts`
- Push-based deployment with `db:push` command

## User Preferences

Preferred communication style: Simple, everyday language.

## SEO Implementation

### Phase 1: Basic SEO Foundation (Completed)
- **Meta Tags**: Dynamic title, description, and keyword meta tags via useSEO hook
- **Open Graph Tags**: Social media sharing optimization with og:title, og:description, og:image
- **Twitter Cards**: Twitter-specific meta tags for better social sharing
- **Structured Data**: JSON-LD schema markup for products, organization, and website
- **Semantic HTML**: Proper heading hierarchy (H1, H2, H3) and article tags
- **Image Optimization**: Alt tags, lazy loading, and performance optimization
- **Robots.txt**: Search engine crawling directives with age verification compliance
- **XML Sitemap**: Dynamic sitemap generation including products and categories
- **Breadcrumb Navigation**: Structured navigation with schema.org markup

### SEO Components Created
- `useSEO` hook for dynamic meta tag management
- `SEOHead` component for page-specific SEO configuration
- `structuredData.ts` utility for schema.org markup generation
- `Breadcrumb` component for navigation and SEO
- `performance.ts` utilities for Core Web Vitals optimization

### Technical Features
- Age verification compliance in robots.txt
- Dynamic sitemap generation with products and categories
- Structured data for e-commerce (products, organization, offers)
- Performance optimization utilities
- Lazy loading for images
- Social media sharing optimization

### Compliance Considerations
- Age-restricted content handling
- Robots.txt compliance for 21+ verification
- Privacy and legal page structure
- Search engine guidelines adherence

## Product Templates

### SEO-Optimized Product Pages (Ready for Import)
- **Product Page Template**: Complete product detail page with SEO optimization
- **Category Page Template**: Category listing with filtering and SEO
- **Products Listing Page**: Full product catalog with search and filters
- **SEO Utilities**: Product SEO generation, meta tags, structured data
- **Import Guide**: Comprehensive guide for product import with SEO

### Template Features
- Dynamic meta tags for each product
- JSON-LD structured data for e-commerce
- Breadcrumb navigation with schema markup
- Image optimization with proper alt tags
- Mobile-responsive design
- Age verification compliance
- Performance optimization

### Product Import Workflow
1. Product data preparation with SEO fields
2. Automatic SEO metadata generation
3. Structured data creation
4. URL optimization
5. Image optimization
6. Performance monitoring

## Personalized Product Recommendation Engine

### Core Features
- **Multiple Recommendation Types**: Trending, personalized, similar products, and category-based recommendations
- **User Behavior Tracking**: Tracks view, add_to_cart, purchase, wishlist, and search actions
- **Automatic Preference Learning**: Updates user preferences based on interaction patterns
- **Performance Optimization**: Caching system with 24-hour expiration for recommendation results
- **Real-time Updates**: Recommendations adapt based on user behavior and product interactions

### Database Schema
- **UserBehavior**: Tracks all user interactions with products and metadata
- **UserPreferences**: Stores learned preferences for categories, brands, materials, and price ranges
- **ProductSimilarity**: Matrix for collaborative filtering and product relationships
- **RecommendationCache**: Performance optimization with TTL-based caching

### Recommendation Algorithms
1. **Trending Products**: Most popular items based on recent user interactions (7-day window)
2. **Personalized**: Score-based algorithm considering user preferences, behavior patterns, and product attributes
3. **Similar Products**: Collaborative filtering based on user viewing history and product similarity scores
4. **Category-Based**: Recommendations from user's most interacted categories

### Technical Implementation
- **Frontend Components**: RecommendationEngine component with tabbed interface and horizontal scrolling
- **React Hooks**: useRecommendations, useAutoTrackBehavior for seamless integration
- **API Endpoints**: Complete REST API for recommendations, user behavior, and preferences
- **Performance**: Automatic caching, efficient querying, and real-time behavior tracking

### User Experience Features
- Tabbed interface for different recommendation types
- Horizontal scrolling product grid
- Automatic behavior tracking on product interactions
- Session-based tracking for guest users
- Responsive design with mobile optimization

## Zoho Inventory Integration

### Complete Integration Infrastructure
- **API Client**: ZohoInventoryClient with OAuth 2.0 authentication and automatic token refresh
- **Sync Manager**: Comprehensive synchronization with conflict resolution and retry mechanisms
- **Database Schema**: Dedicated tables for sync status, webhook events, products, and orders
- **API Routes**: Complete REST API for all Zoho operations and synchronization
- **Configuration**: Environment-based setup with validation and error handling

### Technical Features
- Real-time inventory updates via webhooks
- Bidirectional order synchronization
- Product catalog sync with category and brand mapping
- Customer creation and management
- Health monitoring and performance metrics
- Configurable sync intervals and batch processing
- Comprehensive error handling and retry logic

### Integration Status
- Infrastructure: ✅ Complete (types, client, sync manager, routes)
- Database Schema: ✅ Complete (sync status, webhooks, products, orders)
- API Endpoints: ✅ Complete (all CRUD operations and sync functions)
- Documentation: ✅ Complete (checklist and setup guide)
- Ready for Secrets: ⏳ Awaiting Zoho API credentials

## Changelog

Changelog:
- July 20, 2025. Zoho Inventory integration infrastructure implemented - Complete API client, sync manager, database schema, and comprehensive REST endpoints for real-time inventory management
- July 20, 2025. "Vaporizers" category renamed to "Glass Bongs" - Updated both database and frontend to accurately reflect product types
- July 9, 2025. Navigation dropdown system fixed - Resolved transparency issues, improved positioning, and eliminated scrolling problems for all navigation menus
- July 9, 2025. Personalized product recommendation engine implemented - Complete system with behavior tracking, user preferences, and multiple recommendation algorithms
- July 9, 2025. SEO-optimized product page templates created - Ready for product import with complete SEO implementation
- July 9, 2025. SEO implementation Phase 1 completed - Basic SEO foundation with meta tags, structured data, robots.txt, and sitemap
- June 27, 2025. Initial setup