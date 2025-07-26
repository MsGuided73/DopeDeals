import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { aiClassificationService } from './classification-service.js';
import { storage } from '../storage.js';

// Extend Express Request interface
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const aiClassificationRouter = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed.'));
    }
  }
});

// Classify a single product
const classifyProductSchema = z.object({
  productId: z.string(),
  includeImages: z.boolean().optional().default(false)
});

aiClassificationRouter.post('/classify/product', async (req, res) => {
  try {
    const { productId, includeImages } = classifyProductSchema.parse(req.body);
    
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await aiClassificationService.classifyProduct({
      productId: product.id,
      productName: product.name,
      description: product.description || '',
      images: includeImages && product.imageUrl ? [product.imageUrl] : []
    });

    res.json({
      productId,
      classification: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI Classification API] Error:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
});

// Validate COA document
aiClassificationRouter.post('/validate/coa', upload.single('coa'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'COA document is required' });
    }

    const productName = req.body.productName || 'Unknown Product';
    
    const validation = await aiClassificationService.validateCOA(
      req.file.buffer,
      productName
    );

    res.json({
      productName,
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[COA Validation API] Error:', error);
    res.status(500).json({ error: 'COA validation failed' });
  }
});

// Process product import with optional COA
aiClassificationRouter.post('/process/import', upload.single('coa'), async (req: MulterRequest, res: Response) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await aiClassificationService.processProductImport(
      product,
      req.file?.buffer
    );

    res.json({
      productId,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Import Processing API] Error:', error);
    res.status(500).json({ error: 'Import processing failed' });
  }
});

// Bulk classify products
const bulkClassifySchema = z.object({
  productIds: z.array(z.string()).optional(),
  limit: z.number().min(1).max(1000).optional().default(100)
});

aiClassificationRouter.post('/classify/bulk', async (req, res) => {
  try {
    const { productIds, limit } = bulkClassifySchema.parse(req.body);
    
    // If no specific products, get recent products
    let targetProductIds = productIds;
    if (!targetProductIds) {
      const products = await storage.getProducts();
      targetProductIds = products.slice(0, limit).map(p => p.id);
    }

    const result = await aiClassificationService.bulkClassifyProducts(targetProductIds);

    res.json({
      bulkClassification: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Bulk Classification API] Error:', error);
    res.status(500).json({ error: 'Bulk classification failed' });
  }
});

// Get classification history for a product
aiClassificationRouter.get('/history/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get current compliance assignments
    const productCompliances = await storage.getProductComplianceByProductId(productId);
    const complianceRules = await Promise.all(
      productCompliances.map(pc => storage.getComplianceRuleById(pc.complianceId))
    );

    // Get audit logs related to this product
    const auditLogs = await storage.getComplianceAuditLogs({ 
      page: 1, 
      limit: 50 
    });
    const productAuditLogs = auditLogs.filter(log => log.productId === productId);

    res.json({
      productId,
      productName: product.name,
      currentCompliance: complianceRules.filter(Boolean),
      auditHistory: productAuditLogs,
      lastClassified: product.createdAt
    });
  } catch (error) {
    console.error('[Classification History API] Error:', error);
    res.status(500).json({ error: 'Failed to fetch classification history' });
  }
});

// Re-classify products with updated rules
aiClassificationRouter.post('/reclassify/all', async (req, res) => {
  try {
    const result = await aiClassificationService.bulkClassifyProducts();
    
    res.json({
      message: 'Bulk reclassification completed',
      results: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Reclassification API] Error:', error);
    res.status(500).json({ error: 'Reclassification failed' });
  }
});

// Health check for AI service
aiClassificationRouter.get('/health', async (req, res) => {
  try {
    // Test OpenAI connection with a simple request
    const testResult = await aiClassificationService.classifyProduct({
      productId: 'test',
      productName: 'Test Glass Pipe',
      description: 'A simple glass smoking pipe for tobacco use'
    });

    res.json({
      status: 'healthy',
      openaiConnected: true,
      testClassification: testResult.category,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[AI Health Check] Error:', error);
    res.status(503).json({
      status: 'unhealthy',
      openaiConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});