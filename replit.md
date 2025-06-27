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

## Changelog

Changelog:
- June 27, 2025. Initial setup