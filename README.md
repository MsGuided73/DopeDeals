# HIGHWAY 420 - E-commerce Store

## 🚨 IMPORTANT: This is the Highway 420 E-commerce Store

This repository contains the **Highway 420** e-commerce platform - a premium online store specializing in cannabis culture products, smoking accessories, CBD products, and related lifestyle essentials. This is **NOT** a generic application - it is specifically designed for the cannabis industry with age verification, compliance features, and product categories tailored for smoke shop and cannabis accessories retailers.

**Any developer or agent working on this code must understand:**
- This is a real e-commerce business platform
- It handles sensitive cannabis-related products
- All features must comply with cannabis retail regulations
- Age verification and compliance are critical requirements
- The branding and design must maintain "Highway 420" identity

## Project Overview

Premium cannabis culture meets street authenticity. Welcome to Highway 420 - your destination for the finest smoking accessories, CBD products, and cannabis culture essentials.

## 🚀 Features

- **Premium Product Catalog**: Curated selection of high-quality smoking accessories, vaporizers, and lifestyle products
- **Advanced Search & Filtering**: Find exactly what you're looking for with our intelligent search system
- **Responsive Design**: Optimized for all devices - desktop, tablet, and mobile
- **Secure Checkout**: Safe and secure payment processing
- **Age Verification**: Compliant with legal requirements
- **AI Product Assistant**: Get personalized recommendations and expert advice

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (Database & Auth)
- **State Management**: React Query, Context API
- **Deployment**: Railway/Nixpacks with Docker
- **Package Manager**: pnpm 9.15.9

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd highway-420
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your Supabase credentials and other configuration.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript types
├── components/            # Shared components
├── lib/                   # Utility functions
├── public/                # Static assets
├── supabase/              # Database migrations
└── docs/                  # Documentation
```

## 🎨 Design System

Highway 420 features a premium design system with:
- **Color Palette**: Professional blacks, premium oranges, and accent colors
- **Typography**: Highway Gothic font family for brand consistency
- **Components**: Reusable UI components built with Radix UI
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run check` - Run TypeScript checks

### Code Quality

- **ESLint**: Configured for Next.js and TypeScript
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (via ESLint)

## 🌟 Key Features

### Product Management
- Dynamic product catalog with filtering and search
- Product variants and inventory management
- Brand showcase and categorization
- Advanced product recommendations

### User Experience
- Seamless navigation with responsive header
- Shopping cart with persistent state
- User accounts and order history
- Newsletter signup and rewards program

### Performance
- Server-side rendering (SSR)
- Image optimization
- Code splitting and lazy loading
- Database query optimization

## 🚀 Deployment

### Docker Build Configuration

This project uses a multi-stage Docker build with pnpm for optimized deployments:

- **Base Image**: `ghcr.io/railwayapp/nixpacks:ubuntu-1745885067`
- **Package Manager**: pnpm 9.15.9 (pinned for consistency)
- **Build Output**: Next.js standalone for minimal runtime image
- **Caching**: pnpm store cache for faster rebuilds

### Environment Variables & Secrets

**Important**: Secrets are NOT embedded in the Dockerfile. All sensitive configuration must be provided as environment variables at deploy time through your platform's secrets management.

#### Required Runtime Environment Variables

Set these in your deployment platform (Railway, Coolify, etc.):

```bash
# Supabase Configuration (Public - safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Server-side Secrets (NEVER expose to client)
OPENAI_API_KEY=your_openai_api_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Additional secrets (if used):
# ZOHO_CLIENT_ID=...
# ZOHO_CLIENT_SECRET=...
# KAJAPAY_API_KEY=...
# SHIPSTATION_API_KEY=...
# NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=...
```

#### Local Development Setup

To match production pnpm version locally:

```bash
# Install and pin pnpm version
npm install -g pnpm@9.15.9
pnpm -v  # Should output 9.15.9

# Install dependencies
pnpm install

# Verify lockfile integrity
pnpm install --frozen-lockfile
```

### Build Process

The CI/CD pipeline will:
1. Use pnpm 9.15.9 for deterministic installs
2. Leverage cached pnpm store for faster builds
3. Generate Next.js standalone output
4. Create minimal runtime image with only necessary files

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact our support team

---

**Highway 420** - Where premium meets street. 🌿
