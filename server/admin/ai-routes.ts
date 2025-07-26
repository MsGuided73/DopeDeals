import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { classifyProduct, bulkClassifyProducts } from '../services/aiClassifier.js';
import { ingestCOA } from '../services/coaParser.js';
import { storage } from '../storage.js';

export const adminAIRouter = Router();

// Configure multer for COA file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed.'));
    }
  }
});

// Manual re-classification of a single product
adminAIRouter.post('/classify/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Verify product exists
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await classifyProduct(productId);
    
    res.json({
      success: true,
      message: `Product "${product.name}" reclassified successfully`,
      result
    });
  } catch (error) {
    console.error('[Admin AI] Classification error:', error);
    res.status(500).json({ 
      error: 'Classification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// COA upload and parsing
adminAIRouter.post('/coa-upload', upload.single('coa'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'COA file is required' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Verify product exists
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Generate a URL for the COA (in production, this would be uploaded to cloud storage)
    const coaUrl = `/coa/${productId}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
    
    const result = await ingestCOA(productId, req.file.buffer, coaUrl);
    
    res.json({
      success: true,
      message: `COA processed for product "${product.name}"`,
      result
    });
  } catch (error) {
    console.error('[Admin AI] COA upload error:', error);
    res.status(500).json({ 
      error: 'COA processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Bulk reclassification
const bulkClassifySchema = z.object({
  productIds: z.array(z.string()).optional(),
  limit: z.number().min(1).max(1000).optional().default(100)
});

adminAIRouter.post('/bulk-classify', async (req, res) => {
  try {
    const { productIds, limit } = bulkClassifySchema.parse(req.body);
    
    const result = await bulkClassifyProducts(productIds, limit);
    
    res.json({
      success: true,
      message: 'Bulk classification completed',
      result
    });
  } catch (error) {
    console.error('[Admin AI] Bulk classification error:', error);
    res.status(500).json({ 
      error: 'Bulk classification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get AI classification status for products
adminAIRouter.get('/status', async (req, res) => {
  try {
    const { page = 1, limit = 50, filter = 'all' } = req.query;
    
    const products = await storage.getProducts();
    
    // Filter products based on AI classification status
    let filteredProducts = products;
    if (filter === 'classified') {
      filteredProducts = products.filter(p => p.aiClassified);
    } else if (filter === 'unclassified') {
      filteredProducts = products.filter(p => !p.aiClassified);
    } else if (filter === 'needs_review') {
      filteredProducts = products.filter(p => p.nicotineProduct || p.requiresLabTest);
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Get compliance info for each product
    const productsWithCompliance = await Promise.all(
      paginatedProducts.map(async (product) => {
        const productCompliances = await storage.getProductComplianceByProductId(product.id);
        const labCertificates = await storage.getLabCertificatesByProductId(product.id);
        
        return {
          ...product,
          complianceRulesCount: productCompliances.length,
          labCertificatesCount: labCertificates.length,
          hasValidCOA: labCertificates.some(cert => cert.isValid)
        };
      })
    );

    res.json({
      products: productsWithCompliance,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / Number(limit))
      },
      stats: {
        total: products.length,
        classified: products.filter(p => p.aiClassified).length,
        unclassified: products.filter(p => !p.aiClassified).length,
        nicotineProducts: products.filter(p => p.nicotineProduct).length,
        requiresLabTest: products.filter(p => p.requiresLabTest).length
      }
    });
  } catch (error) {
    console.error('[Admin AI] Status fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch AI status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get classification history for a product
adminAIRouter.get('/history/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productCompliances = await storage.getProductComplianceByProductId(productId);
    const labCertificates = await storage.getLabCertificatesByProductId(productId);
    const auditLogs = await storage.getComplianceAuditLogs({ page: 1, limit: 100 });
    const productAuditLogs = auditLogs.filter(log => log.productId === productId);

    // Get compliance rules details
    const complianceRules = await Promise.all(
      productCompliances.map(pc => storage.getComplianceRuleById(pc.complianceId))
    );

    res.json({
      product: {
        id: product.id,
        name: product.name,
        aiClassified: product.aiClassified,
        nicotineProduct: product.nicotineProduct,
        requiresLabTest: product.requiresLabTest,
        visibleOnMainSite: product.visibleOnMainSite,
        hiddenReason: product.hiddenReason
      },
      complianceRules: complianceRules.filter(Boolean),
      labCertificates,
      auditHistory: productAuditLogs
    });
  } catch (error) {
    console.error('[Admin AI] History fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch classification history',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});