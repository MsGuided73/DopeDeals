"use client";

import { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Lock,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Settings,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

interface ComplianceStats {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerifications: number;
  rejectedVerifications: number;
  ageComplianceRate: number;
  locationComplianceRate: number;
  activeRestrictions: number;
}

interface AgeVerification {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  verification_method: 'id_upload' | 'credit_card' | 'third_party' | 'manual';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  id_number?: string;
  date_of_birth: string;
  age: number;
  location: string;
  ip_address: string;
}

interface ComplianceRule {
  id: string;
  name: string;
  type: 'age' | 'location' | 'product' | 'purchase_limit';
  description: string;
  is_active: boolean;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function AdminCompliancePage() {
  const [stats, setStats] = useState<ComplianceStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    pendingVerifications: 0,
    rejectedVerifications: 0,
    ageComplianceRate: 0,
    locationComplianceRate: 0,
    activeRestrictions: 0
  });
  const [verifications, setVerifications] = useState<AgeVerification[]>([]);
  const [rules, setRules] = useState<ComplianceRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'verifications' | 'rules' | 'audit'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState<AgeVerification | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load stats
      const statsRes = await fetch('/api/admin/compliance/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      } else {
        // Mock stats
        setStats({
          totalUsers: 1250,
          verifiedUsers: 1100,
          pendingVerifications: 45,
          rejectedVerifications: 23,
          ageComplianceRate: 94.2,
          locationComplianceRate: 98.1,
          activeRestrictions: 12
        });
      }

      // Load verifications
      const verificationsRes = await fetch('/api/admin/compliance/verifications');
      if (verificationsRes.ok) {
        const verificationsData = await verificationsRes.json();
        setVerifications(verificationsData.verifications || []);
      } else {
        // Mock verifications
        setVerifications([
          {
            id: '1',
            user_id: 'user-1',
            user_email: 'john.doe@email.com',
            user_name: 'John Doe',
            verification_method: 'id_upload',
            status: 'pending',
            submitted_at: '2024-11-08T10:30:00Z',
            date_of_birth: '1995-03-15',
            age: 29,
            location: 'California, USA',
            ip_address: '192.168.1.100'
          },
          {
            id: '2',
            user_id: 'user-2',
            user_email: 'jane.smith@email.com',
            user_name: 'Jane Smith',
            verification_method: 'credit_card',
            status: 'approved',
            submitted_at: '2024-11-07T14:20:00Z',
            reviewed_at: '2024-11-07T15:30:00Z',
            reviewed_by: 'Admin User',
            date_of_birth: '1988-07-22',
            age: 36,
            location: 'California, USA',
            ip_address: '192.168.1.101'
          }
        ]);
      }

      // Load rules
      const rulesRes = await fetch('/api/admin/compliance/rules');
      if (rulesRes.ok) {
        const rulesData = await rulesRes.json();
        setRules(rulesData.rules || []);
      } else {
        // Mock rules
        setRules([
          {
            id: '1',
            name: 'Minimum Age Requirement',
            type: 'age',
            description: 'Users must be 21 years or older',
            is_active: true,
            parameters: { minimum_age: 21 },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            name: 'California Only',
            type: 'location',
            description: 'Only allow users from California',
            is_active: true,
            parameters: { allowed_states: ['CA'] },
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ]);
      }

      // Load audit logs
      const auditRes = await fetch('/api/admin/compliance/audit');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateVerificationStatus(
    verificationId: string,
    status: AgeVerification['status'],
    rejectionReason?: string
  ) {
    try {
      const response = await fetch(`/api/admin/compliance/verifications/${verificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejection_reason: rejectionReason })
      });

      if (response.ok) {
        await loadData();
        setShowVerificationModal(false);
        setSelectedVerification(null);
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
    }
  }

  const filteredVerifications = verifications.filter(verification => {
    const matchesSearch = searchQuery === '' ||
      verification.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      verification.user_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600 mt-1">Monitor age verification, location compliance, and regulatory requirements</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="bg-dope-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Compliance Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Age Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ageComplianceRate}%</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <p className="text-sm text-green-600">Within limits</p>
              </div>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Location Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.locationComplianceRate}%</p>
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 text-blue-600 mr-1" />
                <p className="text-sm text-blue-600">CA residents</p>
              </div>
            </div>
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                <p className="text-sm text-yellow-600">Requires review</p>
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Restrictions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRestrictions}</p>
              <div className="flex items-center mt-1">
                <Lock className="w-4 h-4 text-red-600 mr-1" />
                <p className="text-sm text-red-600">Enforced</p>
              </div>
            </div>
            <Lock className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'verifications'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Age Verifications ({verifications.length})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'rules'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Compliance Rules ({rules.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'audit'
                  ? 'border-dope-orange text-dope-orange'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Audit Log
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Compliance Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">System Compliant</h3>
                      <p className="text-green-700">All compliance checks are passing</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">Review Required</h3>
                      <p className="text-yellow-700">{stats.pendingVerifications} verifications pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Verification</h3>
                  <p className="text-gray-600 mb-4">Process multiple age verifications</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                    Start Process
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Report</h3>
                  <p className="text-gray-600 mb-4">Create compliance reports</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">
                    Generate
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Rules</h3>
                  <p className="text-gray-600 mb-4">Modify compliance rules</p>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verifications Tab */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Verifications Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVerifications.map((verification) => (
                      <tr key={verification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{verification.user_name}</div>
                            <div className="text-sm text-gray-500">{verification.user_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {verification.age} years
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {verification.verification_method.replace('_', ' ').toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verification.status)}`}>
                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(verification.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedVerification(verification);
                                setShowVerificationModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Review Verification"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              {rules.map((rule) => (
                <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${rule.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                        <p className="text-sm text-gray-500">{rule.type.toUpperCase()} • {rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        Edit Rule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audit Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{log.user_id}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                            {log.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Review Modal */}
      {showVerificationModal && selectedVerification && (
        <VerificationReviewModal
          verification={selectedVerification}
          onClose={() => {
            setShowVerificationModal(false);
            setSelectedVerification(null);
          }}
          onUpdate={updateVerificationStatus}
        />
      )}
    </div>
  );
}

// Verification Review Modal Component
function VerificationReviewModal({
  verification,
  onClose,
  onUpdate
}: {
  verification: AgeVerification;
  onClose: () => void;
  onUpdate: (id: string, status: AgeVerification['status'], reason?: string) => void;
}) {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onUpdate(verification.id, 'approved');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onUpdate(verification.id, 'rejected', rejectionReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold text-gray-900">Review Age Verification</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{verification.user_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{verification.user_email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="text-sm text-gray-900">{new Date(verification.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <p className="text-sm text-gray-900">{verification.age} years</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm text-gray-900">{verification.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <p className="text-sm text-gray-900">{verification.ip_address}</p>
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Method</label>
                <p className="text-sm text-gray-900">{verification.verification_method.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Submitted</label>
                <p className="text-sm text-gray-900">{new Date(verification.submitted_at).toLocaleString()}</p>
              </div>
              {verification.reviewed_at && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reviewed</label>
                    <p className="text-sm text-gray-900">{new Date(verification.reviewed_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
                    <p className="text-sm text-gray-900">{verification.reviewed_by}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Rejection Reason (if rejecting) */}
          {verification.status === 'pending' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                placeholder="Provide a reason for rejection..."
              />
            </div>
          )}

          {/* Actions */}
          {verification.status === 'pending' && (
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
              >
                Reject Verification
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Approve Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
