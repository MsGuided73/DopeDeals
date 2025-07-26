import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';
import { Shield, AlertTriangle, CheckCircle, XCircle, Users, BarChart3 } from 'lucide-react';

interface ComplianceRule {
  id: string;
  category: string;
  substanceType: string;
  restrictedStates: string[];
  ageRequirement: number;
  labTestingRequired: boolean;
  batchTrackingRequired: boolean;
  warningLabels: string[];
  shippingRestrictions: any;
  createdAt: string;
}

interface ComplianceViolation {
  productId: string;
  violation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
}

interface ComplianceStats {
  totalViolations: number;
  criticalViolations: number;
  resolvedViolations: number;
}

export default function CompliancePage() {
  const [selectedCategory, setSelectedCategory] = useState('THCA');
  const [newRuleData, setNewRuleData] = useState({
    category: '',
    substanceType: '',
    restrictedStates: '',
    ageRequirement: 21,
    labTestingRequired: true,
    batchTrackingRequired: true,
    warningLabels: ''
  });

  const queryClient = useQueryClient();

  // Fetch compliance rules
  const { data: rules = [], isLoading: rulesLoading } = useQuery({
    queryKey: ['/api/compliance/rules'],
    queryFn: async () => {
      const response = await fetch('/api/compliance/rules');
      if (!response.ok) throw new Error('Failed to fetch rules');
      return response.json();
    }
  });

  // Fetch compliance statistics
  const { data: stats } = useQuery<ComplianceStats>({
    queryKey: ['/api/compliance/stats'],
    queryFn: async () => {
      const response = await fetch('/api/compliance/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  // Initialize default rules mutation
  const initializeRulesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/compliance/initialize', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to initialize rules');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/rules'] });
    }
  });

  // Audit all products mutation
  const auditAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/compliance/audit/all', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to run audit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/stats'] });
    }
  });

  // Create new rule mutation
  const createRuleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/compliance/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create rule');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/rules'] });
      setNewRuleData({
        category: '',
        substanceType: '',
        restrictedStates: '',
        ageRequirement: 21,
        labTestingRequired: true,
        batchTrackingRequired: true,
        warningLabels: ''
      });
    }
  });

  const handleCreateRule = () => {
    const ruleData = {
      ...newRuleData,
      restrictedStates: newRuleData.restrictedStates.split(',').map(s => s.trim().toUpperCase()),
      warningLabels: newRuleData.warningLabels.split('\n').filter(l => l.trim()),
      shippingRestrictions: {
        requiresAdultSignature: true,
        noInternationalShipping: true
      }
    };
    createRuleMutation.mutate(ruleData);
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={colors[severity as keyof typeof colors] || colors.medium}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const categoryRules = Array.isArray(rules) ? rules.filter((rule: ComplianceRule) => rule.category === selectedCategory) : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VIP Smoke Compliance Engine</h1>
          <p className="text-gray-600">
            Manage compliance rules and monitor regulatory adherence for high-risk products
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalViolations || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.criticalViolations || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.resolvedViolations || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
            <TabsTrigger value="audit">Product Audit</TabsTrigger>
            <TabsTrigger value="create">Create Rule</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Rules Management
                </CardTitle>
                <CardDescription>
                  View and manage compliance rules for different product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-4">
                    <Button
                      onClick={() => initializeRulesMutation.mutate()}
                      disabled={initializeRulesMutation.isPending}
                    >
                      Initialize Default Rules
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <div className="flex gap-2 mb-4">
                    {['THCA', 'Kratom', '7-Hydroxy', 'Nicotine'].map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Rules Display */}
                  <div className="space-y-4">
                    {rulesLoading ? (
                      <div className="text-center py-8">Loading compliance rules...</div>
                    ) : categoryRules.length > 0 ? (
                      categoryRules.map((rule: ComplianceRule) => (
                        <Card key={rule.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">{rule.category}</h3>
                              <Badge variant="outline">{rule.substanceType}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <Label className="text-sm font-medium">Age Requirement</Label>
                                <p className="text-sm text-gray-600">{rule.ageRequirement}+ years</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Lab Testing Required</Label>
                                <p className="text-sm text-gray-600">
                                  {rule.labTestingRequired ? 'Yes' : 'No'}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Batch Tracking</Label>
                                <p className="text-sm text-gray-600">
                                  {rule.batchTrackingRequired ? 'Required' : 'Not Required'}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Restricted States</Label>
                                <p className="text-sm text-gray-600">
                                  {rule.restrictedStates.length > 0 
                                    ? rule.restrictedStates.join(', ') 
                                    : 'None'
                                  }
                                </p>
                              </div>
                            </div>

                            {rule.warningLabels.length > 0 && (
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Required Warnings</Label>
                                <div className="space-y-1">
                                  {rule.warningLabels.map((warning, index) => (
                                    <Alert key={index} className="py-2">
                                      <AlertDescription className="text-sm">
                                        {warning}
                                      </AlertDescription>
                                    </Alert>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No rules found for {selectedCategory}. Click "Initialize Default Rules" to create them.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Product Compliance Audit
                </CardTitle>
                <CardDescription>
                  Run comprehensive compliance audits on all products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => auditAllMutation.mutate()}
                    disabled={auditAllMutation.isPending}
                    className="w-full"
                  >
                    {auditAllMutation.isPending ? 'Running Audit...' : 'Run Full Compliance Audit'}
                  </Button>

                  {auditAllMutation.data && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Audit completed: {auditAllMutation.data.totalProducts} products checked, 
                        {auditAllMutation.data.violationsFound} violations found, 
                        {auditAllMutation.data.criticalViolations} critical issues detected.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Compliance Rule</CardTitle>
                <CardDescription>
                  Define custom compliance requirements for product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newRuleData.category}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Delta-8, Hemp, Vapes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="substanceType">Substance Type</Label>
                      <Input
                        id="substanceType"
                        value={newRuleData.substanceType}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, substanceType: e.target.value }))}
                        placeholder="e.g., Cannabis Derivative"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ageRequirement">Age Requirement</Label>
                      <Input
                        id="ageRequirement"
                        type="number"
                        value={newRuleData.ageRequirement}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, ageRequirement: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="restrictedStates">Restricted States (comma-separated)</Label>
                      <Input
                        id="restrictedStates"
                        value={newRuleData.restrictedStates}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, restrictedStates: e.target.value }))}
                        placeholder="CA, NY, TX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="warningLabels">Warning Labels (one per line)</Label>
                    <Textarea
                      id="warningLabels"
                      value={newRuleData.warningLabels}
                      onChange={(e) => setNewRuleData(prev => ({ ...prev, warningLabels: e.target.value }))}
                      placeholder="This product has not been evaluated by the FDA&#10;Keep out of reach of children"
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateRule}
                    disabled={createRuleMutation.isPending}
                    className="w-full"
                  >
                    {createRuleMutation.isPending ? 'Creating...' : 'Create Compliance Rule'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}