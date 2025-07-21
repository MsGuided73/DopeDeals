import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertUserBehaviorSchema } from "@shared/schema";
import { registerZohoRoutes, initializeZohoServices, startScheduledSync } from "./zoho/routes.js";
import kajaPayRoutes, { initializeKajaPayRoutes } from "./kajapay/routes.js";
import emojiRoutes, { initializeEmojiRoutes } from "./ai/emoji-routes.js";
import { initializeConciergeRoutes } from "./concierge/routes.js";
import { createShipstationRoutes } from "./shipstation/routes";
import { ShipstationService, ShipstationServiceConfig } from "./shipstation/service";
import { fixRLS } from "./routes/admin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const filters = {
        categoryId: req.query.categoryId as string,
        brandId: req.query.brandId as string,
        material: req.query.material as string,
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
        featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
        vipExclusive: req.query.vipExclusive === 'true' ? true : req.query.vipExclusive === 'false' ? false : undefined,
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Brands routes
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brands" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const cartItems = await storage.getUserCartItems(req.params.userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const success = await storage.removeFromCart(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json({ message: "Cart item removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Memberships routes
  app.get("/api/memberships", async (req, res) => {
    try {
      const memberships = await storage.getMemberships();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch memberships" });
    }
  });

  // Recommendation routes
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { type = 'personalized', limit = 8 } = req.query;
      
      const validTypes = ['trending', 'personalized', 'similar', 'category_based'];
      if (!validTypes.includes(type as string)) {
        return res.status(400).json({ message: "Invalid recommendation type" });
      }
      
      const recommendations = await storage.getRecommendations(
        userId,
        type as 'trending' | 'personalized' | 'similar' | 'category_based',
        parseInt(limit as string) || 8
      );
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/user-behavior", async (req, res) => {
    try {
      const validatedData = insertUserBehaviorSchema.parse(req.body);
      const behavior = await storage.trackUserBehavior(validatedData);
      res.json(behavior);
    } catch (error) {
      res.status(400).json({ message: "Invalid behavior data" });
    }
  });

  app.get("/api/user-behavior/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 50 } = req.query;
      
      const behaviors = await storage.getUserBehavior(userId, parseInt(limit as string) || 50);
      res.json(behaviors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user behavior" });
    }
  });

  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.put("/api/user-preferences/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const preferences = await storage.updateUserPreferences(userId, req.body);
      res.json(preferences);
    } catch (error) {
      res.status(400).json({ message: "Invalid preferences data" });
    }
  });

  app.get("/api/product-similarity/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const { limit = 10 } = req.query;
      
      const similarities = await storage.getProductSimilarity(productId, parseInt(limit as string) || 10);
      res.json(similarities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product similarities" });
    }
  });

  // SEO routes
  app.get("/robots.txt", (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(`User-agent: *
Allow: /

# Age verification compliance
Disallow: /age-restricted/
Disallow: /checkout/
Disallow: /account/

# SEO optimization
Sitemap: https://vipsmoke.com/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Special rules for specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block known bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /`);
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const products = await storage.getProducts({});
      const categories = await storage.getCategories();
      const baseUrl = 'https://vipsmoke.com';
      const currentDate = new Date().toISOString().split('T')[0];
      
      const urls = [
        // Static pages
        { url: `${baseUrl}/`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/products`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/categories`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/vip-membership`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/privacy-policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms-of-service`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 }
      ];

      // Add category pages
      categories.forEach(category => {
        urls.push({
          url: `${baseUrl}/category/${category.id}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: 0.7
        });
      });

      // Add product pages
      products.forEach(product => {
        urls.push({
          url: `${baseUrl}/product/${product.id}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: 0.8
        });
      });

      // Generate XML sitemap
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
      const xmlNamespace = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      const xmlUrls = urls.map(url => {
        return `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
      }).join('\n');

      const xmlFooter = '\n</urlset>';

      res.set('Content-Type', 'application/xml');
      res.send(xmlHeader + xmlNamespace + xmlUrls + xmlFooter);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sitemap" });
    }
  });

  // Initialize and register Zoho integration routes
  try {
    const zohoInitResult = initializeZohoServices();
    if (zohoInitResult.success) {
      registerZohoRoutes(app);
      console.log('[Server] Zoho integration initialized successfully');
      
      // Start scheduled sync if enabled
      startScheduledSync();
    } else {
      console.warn('[Server] Zoho integration disabled:', zohoInitResult.error);
    }
  } catch (error) {
    console.error('[Server] Failed to initialize Zoho integration:', error);
  }

  // Initialize and register KajaPay payment routes
  try {
    const kajaPayRoutes = initializeKajaPayRoutes(storage);
    app.use('/api/kajapay', kajaPayRoutes);
    console.log('[Server] KajaPay payment integration initialized successfully');
  } catch (error) {
    console.error('[Server] Failed to initialize KajaPay integration:', error);
  }

  // Initialize and register AI Emoji recommendation routes
  try {
    const emojiAIRoutes = initializeEmojiRoutes(storage);
    app.use('/api/emoji', emojiAIRoutes);
    console.log('[Server] AI Emoji recommendation system initialized successfully');
  } catch (error) {
    console.error('[Server] Failed to initialize AI Emoji system:', error);
  }

  // Initialize and register VIP Concierge AI routes
  try {
    const conciergeRoutes = initializeConciergeRoutes(storage);
    app.use('/api/concierge', conciergeRoutes);
    console.log('[Server] VIP Concierge AI system initialized successfully');
  } catch (error) {
    console.error('[Server] Failed to initialize VIP Concierge system:', error);
  }

  // Initialize and register ShipStation integration routes
  try {
    let shipstationService: ShipstationService | null = null;
    
    // Check if ShipStation credentials are available
    const shipstationApiKey = process.env.SHIPSTATION_API_KEY;
    const shipstationApiSecret = process.env.SHIPSTATION_API_SECRET;
    
    if (shipstationApiKey && shipstationApiSecret) {
      const shipstationConfig: ShipstationServiceConfig = {
        apiKey: shipstationApiKey,
        apiSecret: shipstationApiSecret,
        webhookUrl: process.env.SHIPSTATION_WEBHOOK_URL,
        defaultWarehouseId: process.env.SHIPSTATION_DEFAULT_WAREHOUSE_ID,
        autoSyncInterval: process.env.SHIPSTATION_SYNC_INTERVAL ? parseInt(process.env.SHIPSTATION_SYNC_INTERVAL) : 3600000, // Default 1 hour
        enableWebhooks: process.env.SHIPSTATION_ENABLE_WEBHOOKS === 'true'
      };
      
      shipstationService = new ShipstationService(shipstationConfig, storage);
      
      // Validate configuration
      const validation = await shipstationService.validateConfiguration();
      if (validation.valid) {
        console.log('[Server] ShipStation integration initialized successfully');
      } else {
        console.warn('[Server] ShipStation configuration validation failed:', validation.error);
        shipstationService = null;
      }
    } else {
      console.log('[Server] ShipStation integration disabled: API credentials not provided');
    }
    
    // Register routes regardless (they will handle missing service gracefully)
    const shipstationRoutes = createShipstationRoutes(shipstationService);
    app.use('/api/shipstation', shipstationRoutes);
    
  } catch (error) {
    console.error('[Server] Failed to initialize ShipStation integration:', error);
    
    // Still register routes with null service for error handling
    const shipstationRoutes = createShipstationRoutes(null);
    app.use('/api/shipstation', shipstationRoutes);
  }

  // Admin routes for database management
  app.post('/api/admin/fix-rls', fixRLS);

  const httpServer = createServer(app);
  return httpServer;
}
