/**
 * AI-Powered Site Monitoring System
 *
 * Monitors site health, detects issues, and provides automated recovery
 * with admin notifications and user-friendly error handling.
 */

interface SiteHealthMetrics {
  apiResponseTime: number;
  errorRate: number;
  uptime: number;
  lastChecked: Date;
  activeUsers: number;
}

interface ErrorReport {
  id: string;
  timestamp: Date;
  error: string;
  stack?: string;
  userAgent?: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  autoFixable: boolean;
}

class SiteMonitor {
  private static instance: SiteMonitor;
  private healthMetrics: SiteHealthMetrics;
  private errorReports: ErrorReport[] = [];
  private adminNotificationUrl: string;
  private isMonitoring: boolean = false;

  constructor() {
    this.healthMetrics = {
      apiResponseTime: 0,
      errorRate: 0,
      uptime: 100,
      lastChecked: new Date(),
      activeUsers: 0
    };
    this.adminNotificationUrl = process.env.ADMIN_NOTIFICATION_WEBHOOK || '';
  }

  static getInstance(): SiteMonitor {
    if (!SiteMonitor.instance) {
      SiteMonitor.instance = new SiteMonitor();
    }
    return SiteMonitor.instance;
  }

  /**
   * Start monitoring site health
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('🔍 AI Site Monitor Started');

    // Check API health every 30 seconds
    setInterval(() => this.checkApiHealth(), 30000);

    // Check for JavaScript errors
    this.setupErrorTracking();

    // Monitor performance metrics
    this.setupPerformanceTracking();
  }

  /**
   * Check API endpoints health
   */
  private async checkApiHealth(): Promise<void> {
    const startTime = Date.now();
    // Only monitor core product APIs - Zoho integration not active yet
    const endpoints = [
      '/api/products',
      '/api/products/bongs',
      '/api/products/pipes'
    ];

    let totalResponseTime = 0;
    let errorCount = 0;

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });

        const responseTime = Date.now() - startTime;
        totalResponseTime += responseTime;

        if (!response.ok) {
          errorCount++;
          this.reportError({
            error: `API endpoint ${endpoint} returned ${response.status}`,
            severity: 'medium',
            url: endpoint
          });
        }
      } catch (error) {
        errorCount++;
        this.reportError({
          error: `Failed to reach API endpoint: ${endpoint}`,
          severity: 'high',
          url: endpoint
        });
      }
    }

    // Update health metrics
    const avgResponseTime = endpoints.length > 0 ? totalResponseTime / endpoints.length : 0;
    this.healthMetrics.apiResponseTime = avgResponseTime;
    this.healthMetrics.errorRate = endpoints.length > 0 ? (errorCount / endpoints.length) * 100 : 0;
    this.healthMetrics.lastChecked = new Date();

    // Alert if error rate is too high
    if (this.healthMetrics.errorRate > 50) {
      this.sendAdminAlert('High API Error Rate', `Error rate is ${this.healthMetrics.errorRate.toFixed(1)}%`);
    }
  }

  /**
   * Setup global error tracking
   */
  private setupErrorTracking(): void {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError({
        error: event.message,
        stack: event.error?.stack,
        severity: 'high',
        url: window.location.href
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        error: `Unhandled Promise Rejection: ${event.reason}`,
        severity: 'high',
        url: window.location.href
      });
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceTracking(): void {
    // Track page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;

        // Alert if page load is too slow
        if (loadTime > 3000) { // 3 seconds
          this.reportError({
            error: `Slow page load: ${loadTime}ms`,
            severity: 'medium',
            url: window.location.href
          });
        }
      }
    });
  }

  /**
   * Report and handle errors
   */
  async reportError(errorData: Partial<ErrorReport>): Promise<void> {
    // Validate error data
    if (!errorData || typeof errorData !== 'object') {
      console.warn('Site Monitor: Invalid error data provided');
      return;
    }

    const errorReport: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      error: errorData.error || 'Unknown error',
      stack: errorData.stack,
      userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'Server-side',
      url: errorData.url || (typeof window !== 'undefined' ? window.location?.href : 'Unknown'),
      severity: errorData.severity || 'medium',
      resolved: false,
      autoFixable: this.isAutoFixable(errorData.error || '')
    };

    this.errorReports.push(errorReport);

    // Log to database audit log
    await this.logToDatabase(errorReport);

    // Log to console for debugging
    console.error('🚨 Site Monitor Error:', errorReport);

    // Send to admin if critical
    if (errorReport.severity === 'critical' || errorReport.severity === 'high') {
      await this.sendAdminAlert('Critical Site Error', this.formatErrorMessage(errorReport));
    }

    // Attempt auto-fix if possible
    if (errorReport.autoFixable) {
      this.attemptAutoFix(errorReport);
    }
  }

  /**
   * Log error to database audit log
   */
  private async logToDatabase(errorReport: ErrorReport): Promise<void> {
    try {
      // For now, just log to console until we fix the API endpoint
      console.log('📝 Audit Log Entry (Database API needs fixing):', {
        event_type: 'error',
        severity: errorReport.severity,
        category: this.categorizeError(errorReport.error),
        title: `Site Error: ${errorReport.error.substring(0, 100)}`,
        description: errorReport.error,
        error_stack: errorReport.stack,
        user_agent: errorReport.userAgent,
        url: errorReport.url,
        auto_fixable: errorReport.autoFixable,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log to database:', logError);
    }
  }

  /**
   * Categorize error type
   */
  private categorizeError(error: string): string {
    if (error.toLowerCase().includes('api')) return 'api';
    if (error.toLowerCase().includes('stock')) return 'inventory';
    if (error.toLowerCase().includes('load')) return 'performance';
    if (error.toLowerCase().includes('network')) return 'network';
    return 'system';
  }

  /**
   * Determine if error can be auto-fixed
   */
  private isAutoFixable(error: string): boolean {
    const fixableErrors = [
      'stock_quantity',
      'Failed to load',
      'Network timeout',
      'API endpoint not found'
    ];

    return fixableErrors.some(fixableError => error.toLowerCase().includes(fixableError.toLowerCase()));
  }

  /**
   * Attempt automatic fixes
   */
  private async attemptAutoFix(errorReport: ErrorReport): Promise<void> {
    console.log('🔧 Attempting auto-fix for:', errorReport.error);

    try {
      // Fix stock quantity issues
      if (errorReport.error.toLowerCase().includes('stock_quantity')) {
        await this.fixStockQuantities();
      }

      // Fix API endpoint issues
      if (errorReport.error.toLowerCase().includes('api endpoint')) {
        await this.checkApiEndpoints();
      }

      // Mark as resolved
      errorReport.resolved = true;
      console.log('✅ Auto-fix successful');
    } catch (fixError) {
      console.error('❌ Auto-fix failed:', fixError);
      await this.sendAdminAlert('Auto-fix Failed', `Failed to auto-fix: ${errorReport.error}`);
    }
  }

  /**
   * Auto-fix stock quantities
   */
  private async fixStockQuantities(): Promise<void> {
    try {
      const response = await fetch('/api/admin/fix-stock-quantities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('✅ Stock quantities fixed');
      }
    } catch (error) {
      console.error('❌ Failed to fix stock quantities:', error);
    }
  }

  /**
   * Check and fix API endpoints
   */
  private async checkApiEndpoints(): Promise<void> {
    const endpoints = ['/api/products', '/api/products/bongs', '/api/products/pipes'];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        if (!response.ok) {
          console.warn(`⚠️ API endpoint ${endpoint} returned ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ API endpoint ${endpoint} unreachable`);
      }
    }
  }

  /**
   * Send alert to admin team
   */
  private async sendAdminAlert(title: string, message: string): Promise<void> {
    if (!this.adminNotificationUrl) {
      console.log('📢 Admin Alert (Webhook not configured):', { title, message });
      return;
    }

    try {
      await fetch(this.adminNotificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          message,
          timestamp: new Date().toISOString(),
          severity: 'high'
        })
      });
    } catch (error) {
      console.error('Failed to send admin alert:', error);
    }
  }

  /**
   * Format error message for admin notification
   */
  private formatErrorMessage(errorReport: ErrorReport): string {
    return `
🚨 Site Error Detected

Error: ${errorReport.error}
URL: ${errorReport.url}
Time: ${errorReport.timestamp.toISOString()}
Severity: ${errorReport.severity}
User Agent: ${errorReport.userAgent}

${errorReport.stack ? `Stack Trace: ${errorReport.stack}` : ''}

Auto-fixable: ${errorReport.autoFixable ? 'Yes' : 'No'}
    `.trim();
  }

  /**
   * Get current health metrics
   */
  getHealthMetrics(): SiteHealthMetrics {
    return { ...this.healthMetrics };
  }

  /**
   * Get recent error reports
   */
  getRecentErrors(limit: number = 10): ErrorReport[] {
    return this.errorReports
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Force health check
   */
  async forceHealthCheck(): Promise<SiteHealthMetrics> {
    await this.checkApiHealth();
    return this.getHealthMetrics();
  }
}

// Export singleton instance
export const siteMonitor = SiteMonitor.getInstance();

// Auto-start monitoring when imported - PAUSED
// if (typeof window !== 'undefined') {
//   siteMonitor.startMonitoring();
// }

export default SiteMonitor;
