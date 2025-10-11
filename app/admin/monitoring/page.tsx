import { Metadata } from 'next';
import SiteMonitorDashboard from '../_components/SiteMonitorDashboard';

export const metadata: Metadata = {
  title: 'Site Monitor | Dope Deals Admin',
  description: 'AI-powered site monitoring dashboard with real-time health metrics and error tracking.',
};

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Monitor</h1>
          <p className="text-gray-600 mt-1">
            AI-powered monitoring with real-time health metrics and automated error recovery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Monitoring Active</span>
          </div>
        </div>
      </div>

      <SiteMonitorDashboard />
    </div>
  );
}
