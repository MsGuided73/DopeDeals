'use client';

import { useState, useEffect } from 'react';
import { siteMonitor } from '../../../lib/site-monitor';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  description: string;
  resolved: boolean;
  auto_fix_attempted: boolean;
  auto_fix_successful: boolean;
}

export default function SiteMonitorDashboard() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState<any>(null);
  const [filter, setFilter] = useState({
    severity: 'all',
    category: 'all',
    event_type: 'all'
  });

  useEffect(() => {
    loadAuditLogs();
    loadHealthMetrics();
  }, [filter]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append('limit', '100');

      if (filter.severity !== 'all') {
        params.append('severity', filter.severity);
      }
      if (filter.category !== 'all') {
        params.append('category', filter.category);
      }
      if (filter.event_type !== 'all') {
        params.append('event_type', filter.event_type);
      }

      const response = await fetch(`/api/admin/audit-log?${params}`);

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      } else {
        console.error('Failed to load audit logs');
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHealthMetrics = async () => {
    try {
      const metrics = siteMonitor.getHealthMetrics();
      setHealthMetrics(metrics);
    } catch (error) {
      console.error('Error loading health metrics:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Health Metrics Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Health Overview</h2>

        {healthMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthMetrics.apiResponseTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${healthMetrics.errorRate > 50 ? 'text-red-600' : 'text-green-600'}`}>
                {healthMetrics.errorRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {healthMetrics.uptime.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {logs.filter(log => !log.resolved).length}
              </div>
              <div className="text-sm text-gray-600">Open Issues</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={filter.severity}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="api">API</option>
              <option value="performance">Performance</option>
              <option value="error">Error</option>
              <option value="security">Security</option>
              <option value="system">System</option>
              <option value="inventory">Inventory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
            <select
              value={filter.event_type}
              onChange={(e) => setFilter(prev => ({ ...prev, event_type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="fix">Fix</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600">{logs.length} entries</p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dope-orange mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No audit logs found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{log.title}</div>
                        <div className="text-sm text-gray-500">{log.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)} text-white`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {log.resolved && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Resolved
                          </span>
                        )}
                        {log.auto_fix_attempted && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            log.auto_fix_successful
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {log.auto_fix_successful ? 'Auto-fixed' : 'Fix Failed'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadHealthMetrics}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Health Metrics
          </button>
          <button
            onClick={() => siteMonitor.forceHealthCheck()}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Force Health Check
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
}
