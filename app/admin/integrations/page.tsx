"use client";

import { useState, useEffect } from 'react';
import {
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Link as LinkIcon,
  Shield,
  Zap,
  CreditCard,
  Truck,
  Database,
  ArrowRight,
  Plus,
  Activity
} from 'lucide-react';

const AdminIntegrationsPage = () => {
  const [syncing, setSyncing] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealthData();
  }, []);

  async function loadHealthData() {
    setLoading(true);
    try {
      const [zohoRes, shipRes, kajaRes] = await Promise.all([
        fetch('/api/zoho/health'),
        fetch('/api/shipstation/health'),
        fetch('/api/kajapay/health')
      ]);

      setHealthData({
        zoho: zohoRes.ok ? await zohoRes.json() : { status: 'error' },
        shipstation: shipRes.ok ? await shipRes.json() : { status: 'error' },
        kajapay: kajaRes.ok ? await kajaRes.json() : { status: 'error' }
      });
    } catch (error) {
      console.error('Error loading integration health:', error);
    } finally {
      setLoading(false);
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case 'ok': 
        case 'healthy': return 'bg-green-100 text-green-800';
        case 'warning': 
        case 'uninitialized': return 'bg-yellow-100 text-yellow-800';
        case 'error': 
        case 'disabled': return 'bg-red-100 text-red-800';
        case 'disconnected': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const displayStatus = status === 'ok' ? 'Healthy' : status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {displayStatus}
      </span>
    );
  };

  const integrations = [
    {
      id: 'zoho',
      name: 'Zoho CRM',
      description: 'Customer management and lead tracking',
      icon: <Database className="w-6 h-6 text-blue-600" />,
      status: healthData.zoho?.status || 'Unknown',
      lastSync: healthData.zoho?.expires_at ? `Expires ${new Date(healthData.zoho.expires_at).toLocaleDateString()}` : 'No sync data',
      records: healthData.zoho?.sampleItem ? `Connected: ${healthData.zoho.sampleItem.name}` : 'No records found',
      color: 'blue'
    },
    {
      id: 'kajapay',
      name: 'KajaPay',
      description: 'Cannabis-friendly payment processing',
      icon: <CreditCard className="w-6 h-6 text-green-600" />,
      status: healthData.kajapay?.status || 'Unknown',
      lastSync: 'Live connection',
      records: healthData.kajapay?.message || 'Check configuration',
      color: 'green'
    },
    {
      id: 'shipstation',
      name: 'ShipStation',
      description: 'Shipping and order fulfillment',
      icon: <Truck className="w-6 h-6 text-orange-600" />,
      status: healthData.shipstation?.status || 'Unknown',
      lastSync: 'Awaiting sync',
      records: healthData.shipstation?.message || 'Check configuration',
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect and manage third-party services and automation tools</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={loadHealthData}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
          <button className="bg-dope-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all">
            <Plus className="w-5 h-5" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 bg-${integration.color}-50 rounded-xl flex items-center justify-center`}>
                {integration.icon}
              </div>
              <StatusBadge status={integration.status} />
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-1">{integration.name}</h3>
            <p className="text-sm text-gray-500 mb-6 min-h-[40px]">{integration.description}</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Status Detail</span>
                <span className="font-medium text-gray-700 truncate ml-4">{integration.records}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Info</span>
                <span className="font-medium text-gray-700">{integration.lastSync}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                Configure
              </button>
              <button className="bg-dope-orange/10 text-dope-orange py-2 rounded-lg text-sm font-medium hover:bg-dope-orange/20 transition-colors">
                Sync Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Integration Logs placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent System Events</h3>
          <div className="flex gap-2">
            <select className="text-sm border-gray-200 rounded-lg focus:ring-dope-orange focus:border-dope-orange">
              <option>All Events</option>
              <option>Integrations</option>
              <option>Database</option>
              <option>Security</option>
            </select>
          </div>
        </div>
        
        <div className="p-12 text-center">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Live system logs will appear here once connected to the modern audit trail.</p>
        </div>
      </div>
    </div>
  );
};

// Re-importing missing Icon
const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default AdminIntegrationsPage;
