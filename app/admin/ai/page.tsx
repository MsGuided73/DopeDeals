"use client";

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  Bot,
  Smile,
  MessageSquare,
  FileText,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Settings,
  Activity
} from 'lucide-react';

interface AIStats {
  total: number;
  classified: number;
  unclassified: number;
  nicotineProducts: number;
  requiresLabTest: number;
}

const AIConsolePage = () => {
  const [stats, setStats] = useState<AIStats>({
    total: 0,
    classified: 0,
    unclassified: 0,
    nicotineProducts: 0,
    requiresLabTest: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading AI stats:', error);
    } finally {
      setLoading(false);
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'queued': return 'bg-yellow-100 text-yellow-800';
        case 'error': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status}
      </span>
    );
  };

  const aiPerformanceData = [
    { name: 'Mon', accuracy: 92, speed: 1.1 },
    { name: 'Tue', accuracy: 94, speed: 1.0 },
    { name: 'Wed', accuracy: 91, speed: 1.3 },
    { name: 'Thu', accuracy: 96, speed: 0.9 },
    { name: 'Fri', accuracy: 95, speed: 1.1 },
    { name: 'Sat', accuracy: 97, speed: 0.8 },
    { name: 'Sun', accuracy: 93, speed: 1.2 }
  ];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Console</h1>
          <p className="text-gray-600 mt-1">Manage and monitor AI agents, classification jobs, and model performance</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium transition-colors">
            <Bot className="w-4 h-4" />
            Run Classification
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Configure Models
          </button>
        </div>
      </div>

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Products Classified</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{loading ? '...' : stats.classified}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>Total: {stats.total} products</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Nicotine Detected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{loading ? '...' : stats.nicotineProducts}</p>
              <div className="flex items-center mt-2 text-xs text-red-500 font-medium">
                <AlertCircle className="w-3 h-3 mr-1" />
                <span>Restricted status enforced</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">COA Requirements</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{loading ? '...' : stats.requiresLabTest}</p>
              <div className="flex items-center mt-2 text-xs text-orange-600">
                <FileText className="w-3 h-3 mr-1" />
                <span>Products requiring lab tests</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent AI Jobs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent AI Jobs</h3>
            <button className="text-sm text-purple-600 font-medium hover:underline">View History</button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-green-100 bg-green-50/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Product Classification</p>
                    <p className="text-sm text-gray-600">Batch: BATCH-001 | 50 products</p>
                  </div>
                </div>
                <StatusBadge status="Completed" />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min ago</span>
                <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> 1.2s avg latency</span>
              </div>
            </div>

            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl relative overflow-hidden">
               {/* Progress indicator */}
               <div className="absolute left-0 bottom-0 h-0.5 bg-blue-600 transition-all duration-1000" style={{ width: '64%' }}></div>
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Emoji Generation</p>
                    <p className="text-sm text-gray-600">New product descriptions | 25 items</p>
                  </div>
                </div>
                <StatusBadge status="Processing" />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Started 2 min ago</span>
                <span className="flex items-center gap-1">64% complete</span>
              </div>
            </div>

            <div className="p-4 border border-gray-100 bg-gray-50/50 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-gray-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">SEO Optimization</p>
                    <p className="text-sm text-gray-600">Meta descriptions | 100 products</p>
                  </div>
                </div>
                <StatusBadge status="Queued" />
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                <span>Scheduled for 11:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Concierge Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Concierge Analytics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-bold text-gray-900">4.8 / 5.0</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Response Time</span>
                <span className="text-sm font-bold text-gray-900">1.2s avg</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Resolution Rate</span>
                <span className="text-sm font-bold text-gray-900">87%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mt-2">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-purple-900">AI Insight</p>
                  <p className="text-sm text-purple-700">Concierge interactions are up 15% this week. Most queries are related to "Shipping Policies".</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Model Performance</h3>
            <p className="text-sm text-gray-500">System-wide accuracy and response metrics over the last 7 days</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-600">Accuracy %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-xs text-gray-600">Latency (s)</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={aiPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Accuracy %" 
              />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Response Time (s)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AIConsolePage;
