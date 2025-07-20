import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  Database, 
  Settings, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  Upload,
  Webhook,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';

interface ZohoHealthStatus {
  status: 'healthy' | 'unhealthy';
  zoho: {
    status: 'healthy' | 'unhealthy';
    message: string;
  };
  sync: {
    status: 'healthy' | 'unhealthy';
    lastSync?: string;
    errors: string[];
  };
}

interface SyncResult {
  success: number;
  failed: number;
  errors: string[];
}

interface ZohoConfig {
  enabled: boolean;
  syncInterval: number;
  batchSize: number;
  autoSync: {
    products: boolean;
    categories: boolean;
    orders: boolean;
    customers: boolean;
    inventory: boolean;
  };
  conflictResolution: {
    strategy: string;
  };
}

export function ZohoIntegration() {
  const [health, setHealth] = useState<ZohoHealthStatus | null>(null);
  const [config, setConfig] = useState<ZohoConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ [key: string]: number }>({});
  const [lastSyncResults, setLastSyncResults] = useState<{ [key: string]: SyncResult }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadHealthStatus();
    loadConfig();
  }, []);

  const loadHealthStatus = async () => {
    try {
      const response = await fetch('/api/zoho/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Failed to load health status:', error);
    }
  };

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/zoho/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/zoho/test-connection', { method: 'POST' });
      const data = await response.json();
      
      toast({
        title: data.success ? 'Connection Successful' : 'Connection Failed',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      });
      
      if (data.success) {
        loadHealthStatus();
      }
    } catch (error) {
      toast({
        title: 'Connection Test Failed',
        description: 'Unable to test connection to Zoho Inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const performSync = async (syncType: string, options: any = {}) => {
    setLoading(true);
    setSyncProgress(prev => ({ ...prev, [syncType]: 0 }));

    try {
      const response = await fetch(`/api/zoho/sync/${syncType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLastSyncResults(prev => ({ ...prev, [syncType]: data.result }));
        setSyncProgress(prev => ({ ...prev, [syncType]: 100 }));
        
        toast({
          title: 'Sync Completed',
          description: data.message,
        });
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      loadHealthStatus();
    }
  };

  const performFullSync = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/zoho/sync/full', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setLastSyncResults(data.result);
        toast({
          title: 'Full Sync Completed',
          description: 'All data has been synchronized with Zoho Inventory',
        });
      } else {
        throw new Error(data.error || 'Full sync failed');
      }
    } catch (error) {
      toast({
        title: 'Full Sync Failed',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      loadHealthStatus();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>;
      case 'unhealthy':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Unhealthy</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  const getSyncResultBadge = (result: SyncResult) => {
    if (result.failed === 0) {
      return <Badge variant="default" className="bg-green-500">Success ({result.success})</Badge>;
    } else if (result.success > 0) {
      return <Badge variant="secondary">Partial ({result.success}/{result.success + result.failed})</Badge>;
    } else {
      return <Badge variant="destructive">Failed ({result.failed})</Badge>;
    }
  };

  if (!health || !config) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Loading Zoho integration status...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zoho Inventory Integration</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage synchronization between VIP Smoke and Zoho Inventory
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(health.status)}
          <Button onClick={loadHealthStatus} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {health.status === 'unhealthy' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Zoho integration is not healthy. Please check your configuration and API credentials.
            {health.sync.errors.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {health.sync.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status & Health</TabsTrigger>
          <TabsTrigger value="sync">Synchronization</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Zoho API</span>
                  {getStatusBadge(health.zoho.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span>Sync Manager</span>
                  {getStatusBadge(health.sync.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {health.zoho.message}
                </p>
                <Button onClick={testConnection} disabled={loading} className="w-full">
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                  Test Connection
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Last Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                {health.sync.lastSync ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      {new Date(health.sync.lastSync).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round((Date.now() - new Date(health.sync.lastSync).getTime()) / (1000 * 60))} minutes ago
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No sync performed yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Products
                </CardTitle>
                <CardDescription>Sync product catalog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lastSyncResults.products && getSyncResultBadge(lastSyncResults.products)}
                {syncProgress.products !== undefined && (
                  <Progress value={syncProgress.products} className="w-full" />
                )}
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => performSync('products', { fullSync: false })}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Incremental
                  </Button>
                  <Button 
                    onClick={() => performSync('products', { fullSync: true })}
                    disabled={loading}
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Full Sync
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
                <CardDescription>Sync product categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lastSyncResults.categories && getSyncResultBadge(lastSyncResults.categories)}
                <Button 
                  onClick={() => performSync('categories')}
                  disabled={loading}
                  size="sm"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Sync Categories
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Orders
                </CardTitle>
                <CardDescription>Sync order data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lastSyncResults.orders && getSyncResultBadge(lastSyncResults.orders)}
                <Button 
                  onClick={() => performSync('orders')}
                  disabled={loading}
                  size="sm"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Sync Orders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Inventory
                </CardTitle>
                <CardDescription>Update stock levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lastSyncResults.inventory && getSyncResultBadge(lastSyncResults.inventory)}
                <Button 
                  onClick={() => performSync('inventory')}
                  disabled={loading}
                  size="sm"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Inventory
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Webhook className="w-5 h-5 mr-2" />
                  Full Synchronization
                </CardTitle>
                <CardDescription>Perform complete data sync</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={performFullSync}
                  disabled={loading}
                  className="w-full"
                  variant="default"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                  Start Full Sync
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Integration Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {config.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Sync Interval</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {config.syncInterval} minutes
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Batch Size</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {config.batchSize} records
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Conflict Strategy</label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {config.conflictResolution.strategy.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Auto Sync Settings</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(config.autoSync).map(([key, enabled]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Badge variant={enabled ? "default" : "secondary"}>
                        {enabled ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}