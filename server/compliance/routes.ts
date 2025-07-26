import { Router } from 'express';
import { z } from 'zod';
import { complianceService } from './service.js';
import { storage } from '../storage.js';
import { insertComplianceRuleSchema, insertProductComplianceSchema } from '../../shared/schema.js';

export const complianceRouter = Router();

// Initialize default compliance rules
complianceRouter.post('/initialize', async (req, res) => {
  try {
    await complianceService.initializeDefaultRules();
    res.json({ success: true, message: 'Default compliance rules initialized' });
  } catch (error) {
    console.error('[Compliance API] Failed to initialize rules:', error);
    res.status(500).json({ error: 'Failed to initialize compliance rules' });
  }
});

// Get all compliance rules
complianceRouter.get('/rules', async (req, res) => {
  try {
    const rules = await storage.getAllComplianceRules();
    res.json(rules);
  } catch (error) {
    console.error('[Compliance API] Failed to fetch rules:', error);
    res.status(500).json({ error: 'Failed to fetch compliance rules' });
  }
});

// Get compliance rules by category
complianceRouter.get('/rules/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const rules = await storage.getComplianceRulesByCategory(category);
    res.json(rules);
  } catch (error) {
    console.error('[Compliance API] Failed to fetch rules by category:', error);
    res.status(500).json({ error: 'Failed to fetch compliance rules' });
  }
});

// Create new compliance rule
complianceRouter.post('/rules', async (req, res) => {
  try {
    const validatedData = insertComplianceRuleSchema.parse(req.body);
    const rule = await storage.createComplianceRule(validatedData);
    res.status(201).json(rule);
  } catch (error) {
    console.error('[Compliance API] Failed to create rule:', error);
    res.status(400).json({ error: 'Invalid compliance rule data' });
  }
});

// Check state compliance for a product
complianceRouter.get('/products/:productId/state/:state', async (req, res) => {
  try {
    const { productId, state } = req.params;
    const compliance = await complianceService.checkStateCompliance(productId, state.toUpperCase());
    res.json(compliance);
  } catch (error) {
    console.error('[Compliance API] Failed to check state compliance:', error);
    res.status(500).json({ error: 'Failed to check state compliance' });
  }
});

// Get product compliance summary
complianceRouter.get('/products/:productId/summary', async (req, res) => {
  try {
    const { productId } = req.params;
    const summary = await complianceService.getProductComplianceSummary(productId);
    res.json(summary);
  } catch (error) {
    console.error('[Compliance API] Failed to get compliance summary:', error);
    res.status(500).json({ error: 'Failed to get compliance summary' });
  }
});

// Audit specific product
complianceRouter.post('/products/:productId/audit', async (req, res) => {
  try {
    const { productId } = req.params;
    const violations = await complianceService.auditProduct(productId);
    
    if (violations.length > 0) {
      await complianceService.logViolations(violations, 'manual-audit');
    }
    
    res.json({ 
      productId, 
      violations,
      compliant: violations.length === 0 
    });
  } catch (error) {
    console.error('[Compliance API] Failed to audit product:', error);
    res.status(500).json({ error: 'Failed to audit product' });
  }
});

// Assign compliance category to product
const assignComplianceSchema = z.object({
  category: z.string(),
  substanceType: z.string().optional()
});

complianceRouter.post('/products/:productId/assign', async (req, res) => {
  try {
    const { productId } = req.params;
    const { category } = assignComplianceSchema.parse(req.body);
    
    await complianceService.assignComplianceToProduct(productId, category);
    res.json({ success: true, message: `Assigned ${category} compliance to product` });
  } catch (error) {
    console.error('[Compliance API] Failed to assign compliance:', error);
    res.status(400).json({ error: 'Failed to assign compliance' });
  }
});

// Bulk audit all products
complianceRouter.post('/audit/all', async (req, res) => {
  try {
    const results = await complianceService.auditAllProducts();
    res.json(results);
  } catch (error) {
    console.error('[Compliance API] Failed to audit all products:', error);
    res.status(500).json({ error: 'Failed to audit all products' });
  }
});

// Get audit logs
complianceRouter.get('/audit/logs', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const severity = req.query.severity as string;
    
    const logs = await storage.getComplianceAuditLogs({ page, limit, severity });
    res.json(logs);
  } catch (error) {
    console.error('[Compliance API] Failed to fetch audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Mark violation as resolved
complianceRouter.patch('/audit/logs/:logId/resolve', async (req, res) => {
  try {
    const { logId } = req.params;
    const { resolvedBy, notes } = req.body;
    
    await storage.resolveComplianceViolation(logId, resolvedBy, notes);
    res.json({ success: true, message: 'Violation marked as resolved' });
  } catch (error) {
    console.error('[Compliance API] Failed to resolve violation:', error);
    res.status(500).json({ error: 'Failed to resolve violation' });
  }
});

// Get compliance statistics
complianceRouter.get('/stats', async (req, res) => {
  try {
    const stats = await storage.getComplianceStats();
    res.json(stats);
  } catch (error) {
    console.error('[Compliance API] Failed to get compliance stats:', error);
    res.status(500).json({ error: 'Failed to get compliance statistics' });
  }
});