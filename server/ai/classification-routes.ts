import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { classifyProduct, bulkClassifyProducts } from '../services/aiClassifier.js';
import { ingestCOA } from '../services/coaParser.js';
import { storage } from '../storage.js';
import { openai } from '../services/openaiClient.js';

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

    const result = await classifyProduct(productId);

    res.json({
      productId,
      classification: {
        category: result.categories[0] || 'Other',
        substanceType: result.categories.join(', '),
        confidence: 0.95, // High confidence for successful classification
        riskLevel: result.nicotineProduct ? 'high' : (result.requiresLabTest ? 'medium' : 'low'),
        requiredCompliance: result.categories,
        reasoning: `Classified as ${result.categories.join(', ')} based on product analysis`
      },
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
    
    // Create a temporary product ID for COA validation
    const tempProductId = `temp-${Date.now()}`;
    const coaUrl = `/temp/coa-${Date.now()}.${req.file.originalname.split('.').pop()}`;
    
    const validation = await ingestCOA(tempProductId, req.file.buffer, coaUrl);

    res.json({
      productName,
      validation: {
        isValid: validation.extractedData.isValid,
        labName: validation.extractedData.labName,
        batchNumber: validation.extractedData.batchNumber,
        potency: validation.extractedData.potency,
        testedAt: validation.extractedData.testedAt,
        errors: validation.extractedData.validationErrors || [],
        warnings: []
      },
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

    // Process classification first
    const classificationResult = await classifyProduct(productId);
    
    // Process COA if provided
    let coaValidation = null;
    if (req.file) {
      const coaUrl = `/coa/${productId}-${Date.now()}.${req.file.originalname.split('.').pop()}`;
      coaValidation = await ingestCOA(productId, req.file.buffer, coaUrl);
    }

    res.json({
      productId,
      classification: {
        category: classificationResult.categories[0] || 'Other',
        substanceType: classificationResult.categories.join(', '),
        confidence: 0.95,
        riskLevel: classificationResult.nicotineProduct ? 'high' : (classificationResult.requiresLabTest ? 'medium' : 'low'),
        requiredCompliance: classificationResult.categories,
        reasoning: `Classified as ${classificationResult.categories.join(', ')} based on product analysis`
      },
      complianceAssigned: classificationResult.complianceRulesAssigned > 0,
      coaValidation: coaValidation ? {
        isValid: coaValidation.extractedData.isValid,
        labName: coaValidation.extractedData.labName,
        batchNumber: coaValidation.extractedData.batchNumber
      } : null,
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

    const result = await bulkClassifyProducts(targetProductIds, limit);

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
    const result = await bulkClassifyProducts();
    
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
    const testResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Test connection" }],
      max_tokens: 10
    });

    res.json({
      status: 'healthy',
      openaiConnected: !!testResponse.choices[0]?.message?.content,
      testClassification: 'Connection successful',
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