#!/usr/bin/env node

/**
 * Inventory Cleanup Cron Job
 * 
 * This script cleans up expired inventory reservations and provides
 * inventory health monitoring. It should be run every 5 minutes via cron.
 * 
 * Cron configuration:
 * every 5 minutes (* / 5 * * * * /usr/bin/node /path/to/scripts/inventory-cleanup-cron.js)
 * 
 * Environment variables required:
 * - NEXT_PUBLIC_SITE_URL: Base URL of the application
 * - INTERNAL_API_KEY: API key for internal service calls
 */

const https = require('https');
const http = require('http');

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_KEY = process.env.INTERNAL_API_KEY;
const CLEANUP_ENDPOINT = `${SITE_URL}/api/inventory/cleanup`;

if (!API_KEY) {
  console.error('[Inventory Cleanup] INTERNAL_API_KEY environment variable is required');
  process.exit(1);
}

/**
 * Make HTTP request to cleanup endpoint
 */
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: result });
        } catch (error) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

/**
 * Cleanup expired inventory reservations
 */
async function cleanupExpiredReservations() {
  try {
    console.log(`[${new Date().toISOString()}] Starting inventory cleanup...`);
    
    const response = await makeRequest(CLEANUP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Highway420-InventoryCleanup/1.0'
      }
    });
    
    if (response.statusCode === 200) {
      const result = response.data;
      console.log(`[${new Date().toISOString()}] Cleanup completed successfully:`);
      console.log(`  - Cleaned reservations: ${result.cleanedReservations}`);
      console.log(`  - Statistics: ${JSON.stringify(result.statistics)}`);
      
      // Log warnings for high reservation counts
      if (result.statistics.active > 100) {
        console.warn(`[${new Date().toISOString()}] WARNING: High number of active reservations (${result.statistics.active})`);
      }
      
      return true;
    } else {
      console.error(`[${new Date().toISOString()}] Cleanup failed with status ${response.statusCode}:`, response.data);
      return false;
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Cleanup error:`, error.message);
    return false;
  }
}

/**
 * Get inventory health status
 */
async function getInventoryHealth() {
  try {
    const response = await makeRequest(CLEANUP_ENDPOINT, {
      method: 'GET',
      headers: {
        'User-Agent': 'Highway420-InventoryCleanup/1.0'
      }
    });
    
    if (response.statusCode === 200) {
      const health = response.data;
      
      // Log critical alerts
      if (health.inventory.statusCounts.out_of_stock > 0) {
        console.warn(`[${new Date().toISOString()}] ALERT: ${health.inventory.statusCounts.out_of_stock} products out of stock`);
      }
      
      if (health.inventory.statusCounts.low_stock > 0) {
        console.warn(`[${new Date().toISOString()}] WARNING: ${health.inventory.statusCounts.low_stock} products low on stock`);
      }
      
      if (health.reservations.expiringSoon > 0) {
        console.log(`[${new Date().toISOString()}] INFO: ${health.reservations.expiringSoon} reservations expiring soon`);
      }
      
      // Log low stock items
      if (health.inventory.lowStockAlerts && health.inventory.lowStockAlerts.length > 0) {
        console.log(`[${new Date().toISOString()}] Low stock items:`);
        health.inventory.lowStockAlerts.forEach(item => {
          console.log(`  - ${item.product_name} (${item.sku}): ${item.truly_available} available (${item.stock_status})`);
        });
      }
      
      return health;
    } else {
      console.error(`[${new Date().toISOString()}] Health check failed with status ${response.statusCode}:`, response.data);
      return null;
    }
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Health check error:`, error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  const startTime = Date.now();
  
  try {
    // Perform cleanup
    const cleanupSuccess = await cleanupExpiredReservations();
    
    // Get health status (every 5th run, i.e., every 25 minutes)
    const shouldCheckHealth = Math.floor(Date.now() / (5 * 60 * 1000)) % 5 === 0;
    if (shouldCheckHealth) {
      await getInventoryHealth();
    }
    
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Inventory cleanup completed in ${duration}ms`);
    
    process.exit(cleanupSuccess ? 0 : 1);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error:`, error);
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] Received SIGINT, exiting gracefully...`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] Received SIGTERM, exiting gracefully...`);
  process.exit(0);
});

// Run the cleanup
main();
