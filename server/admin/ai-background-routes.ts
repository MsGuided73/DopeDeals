/**
 * Admin-only routes for monitoring background AI classification
 */

import { Router } from 'express';
import { backgroundClassificationService } from '../services/backgroundClassifier.js';

const adminAIBackgroundRouter = Router();

// Admin middleware (simplified - in production use proper auth)
const requireAdmin = (req: any, res: any, next: any) => {
  // In production, check if user is admin
  // For now, just continue
  next();
};

// Get background classification statistics (admin only)
adminAIBackgroundRouter.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await backgroundClassificationService.getStats();
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get background classification stats'
    });
  }
});

// Start classification of all products (admin only)
adminAIBackgroundRouter.post('/classify-all', requireAdmin, async (req, res) => {
  try {
    await backgroundClassificationService.classifyAllProducts();
    res.json({
      success: true,
      message: 'Background classification started for all products',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start background classification'
    });
  }
});

// Update configuration (admin only)
adminAIBackgroundRouter.post('/config', requireAdmin, async (req, res) => {
  try {
    const { config } = req.body;
    backgroundClassificationService.updateConfig(config);
    res.json({
      success: true,
      message: 'Background classification configuration updated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update configuration'
    });
  }
});

export { adminAIBackgroundRouter };