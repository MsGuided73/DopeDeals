import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Bot, FileText, AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassificationResult {
  category: string;
  substanceType: string;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiredCompliance: string[];
  reasoning: string;
}

interface COAValidationResult {
  isValid: boolean;
  cannabinoidProfile?: any;
  contaminants?: any;
  testDate?: string;
  labName?: string;
  batchNumber?: string;
  expirationDate?: string;
  errors: string[];
  warnings: string[];
}

export default function AIClassificationPage() {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [coaFile, setCoaFile] = useState<File | null>(null);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [testProductName, setTestProductName] = useState('');
  const [testProductDescription, setTestProductDescription] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products for selection
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  // Check AI service health
  const { data: healthStatus } = useQuery({
    queryKey: ['/api/ai/classification/health'],
    queryFn: async () => {
      const response = await fetch('/api/ai/classification/health');
      if (!response.ok) throw new Error('Health check failed');
      return response.json();
    },
    refetchInterval: 30000 // Check every 30 seconds
  });

  // Single product classification
  const classifyProductMutation = useMutation({
    mutationFn: async (data: { productId: string; includeImages?: boolean }) => {
      const response = await fetch('/api/ai/classification/classify/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Classification failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Product Classified",
        description: `Classified as ${data.classification.category} with ${Math.round(data.classification.confidence * 100)}% confidence`
      });
    }
  });

  // COA validation
  const validateCOAMutation = useMutation({
    mutationFn: async (data: { file: File; productName: string }) => {
      const formData = new FormData();
      formData.append('coa', data.file);
      formData.append('productName', data.productName);
      
      const response = await fetch('/api/ai/classification/validate/coa', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('COA validation failed');
      return response.json();
    },
    onSuccess: (data) => {
      const { validation } = data;
      toast({
        title: validation.isValid ? "COA Valid" : "COA Invalid",
        description: validation.isValid 
          ? `COA validated successfully by ${validation.labName || 'unknown lab'}`
          : `Validation failed: ${validation.errors.join(', ')}`,
        variant: validation.isValid ? "default" : "destructive"
      });
    }
  });

  // Process product import
  const processImportMutation = useMutation({
    mutationFn: async (data: { productId: string; coaFile?: File }) => {
      const formData = new FormData();
      formData.append('productId', data.productId);
      if (data.coaFile) {
        formData.append('coa', data.coaFile);
      }
      
      const response = await fetch('/api/ai/classification/process/import', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Import processing failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Import Processed",
        description: `Product classified and ${data.complianceAssigned ? 'compliance assigned' : 'no compliance needed'}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/stats'] });
    }
  });

  // Bulk classification
  const bulkClassifyMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/classification/classify/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 })
      });
      if (!response.ok) throw new Error('Bulk classification failed');
      return response.json();
    },
    onSuccess: (data) => {
      const { bulkClassification } = data;
      toast({
        title: "Bulk Classification Complete",
        description: `Processed ${bulkClassification.processed} products, classified ${bulkClassification.classified}, assigned compliance to ${bulkClassification.complianceAssigned}`
      });
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/stats'] });
    }
  });

  // Test classification
  const testClassifyMutation = useMutation({
    mutationFn: async (data: { productName: string; description: string }) => {
      // Create a temporary product for testing
      const testProduct = {
        productId: 'test-' + Date.now(),
        productName: data.productName,
        description: data.description
      };
      
      const response = await fetch('/api/ai/classification/classify/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testProduct)
      });
      if (!response.ok) throw new Error('Test classification failed');
      return response.json();
    }
  });

  const handleCOAUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoaFile(file);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Classification & COA Validation
          </h1>
          <p className="text-gray-600">
            Automated product compliance analysis using OpenAI GPT-4o
          </p>
          
          {/* Health Status */}
          {healthStatus && (
            <div className="mt-4">
              <Alert className={healthStatus.status === 'healthy' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {healthStatus.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={healthStatus.status === 'healthy' ? 'text-green-800' : 'text-red-800'}>
                    AI Service Status: {healthStatus.status} | OpenAI: {healthStatus.openaiConnected ? 'Connected' : 'Disconnected'}
                    {healthStatus.testClassification && ` | Test: ${healthStatus.testClassification}`}
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          )}
        </div>

        <Tabs defaultValue="classify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classify">Classify Products</TabsTrigger>
            <TabsTrigger value="coa">Validate COA</TabsTrigger>
            <TabsTrigger value="import">Process Import</TabsTrigger>
            <TabsTrigger value="test">Test AI</TabsTrigger>
          </TabsList>

          {/* Product Classification Tab */}
          <TabsContent value="classify">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Single Product Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="product-select">Select Product</Label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a product to classify" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.slice(0, 50).map((product: any) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={() => classifyProductMutation.mutate({ productId: selectedProductId, includeImages: true })}
                    disabled={!selectedProductId || classifyProductMutation.isPending}
                    className="w-full"
                  >
                    {classifyProductMutation.isPending ? 'Classifying...' : 'Classify Product'}
                  </Button>

                  {classifyProductMutation.data && (
                    <div className="mt-4 space-y-3">
                      <h4 className="font-semibold">Classification Result:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskBadgeVariant(classifyProductMutation.data.classification.riskLevel)}>
                            {classifyProductMutation.data.classification.category}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {Math.round(classifyProductMutation.data.classification.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          <strong>Substance:</strong> {classifyProductMutation.data.classification.substanceType}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Risk Level:</strong> {classifyProductMutation.data.classification.riskLevel}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Reasoning:</strong> {classifyProductMutation.data.classification.reasoning}
                        </p>
                        {classifyProductMutation.data.classification.requiredCompliance.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Required Compliance:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {classifyProductMutation.data.classification.requiredCompliance.map((req: string) => (
                                <Badge key={req} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Bulk Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Classify all products using AI analysis. This will analyze product names, descriptions, and assign appropriate compliance categories.
                  </p>
                  
                  <Button 
                    onClick={() => bulkClassifyMutation.mutate()}
                    disabled={bulkClassifyMutation.isPending}
                    className="w-full"
                    variant="outline"
                  >
                    {bulkClassifyMutation.isPending ? 'Processing...' : 'Classify All Products'}
                  </Button>

                  {bulkClassifyMutation.data && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold">Bulk Results:</h4>
                      <div className="text-sm space-y-1">
                        <p>Processed: {bulkClassifyMutation.data.bulkClassification.processed} products</p>
                        <p>Classified: {bulkClassifyMutation.data.bulkClassification.classified} high-risk products</p>
                        <p>Compliance Assigned: {bulkClassifyMutation.data.bulkClassification.complianceAssigned}</p>
                        <p>Errors: {bulkClassifyMutation.data.bulkClassification.errors}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* COA Validation Tab */}
          <TabsContent value="coa">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Certificate of Analysis Validation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="coa-product-name">Product Name</Label>
                  <Input 
                    id="coa-product-name"
                    placeholder="Enter product name for COA validation"
                    value={coaFile ? `${coaFile.name} validation` : ''}
                    readOnly={!!coaFile}
                  />
                </div>

                <div>
                  <Label htmlFor="coa-upload">Upload COA Document</Label>
                  <div className="mt-2">
                    <Input
                      id="coa-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={handleCOAUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports PDF, PNG, JPG, JPEG, WebP files (max 10MB)
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => coaFile && validateCOAMutation.mutate({ 
                    file: coaFile, 
                    productName: coaFile.name 
                  })}
                  disabled={!coaFile || validateCOAMutation.isPending}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {validateCOAMutation.isPending ? 'Validating...' : 'Validate COA'}
                </Button>

                {validateCOAMutation.data && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-semibold">COA Validation Result:</h4>
                    <Alert className={validateCOAMutation.data.validation.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                      <AlertDescription>
                        Status: {validateCOAMutation.data.validation.isValid ? 'Valid' : 'Invalid'}
                        {validateCOAMutation.data.validation.labName && (
                          <span> | Lab: {validateCOAMutation.data.validation.labName}</span>
                        )}
                        {validateCOAMutation.data.validation.batchNumber && (
                          <span> | Batch: {validateCOAMutation.data.validation.batchNumber}</span>
                        )}
                      </AlertDescription>
                    </Alert>
                    
                    {validateCOAMutation.data.validation.errors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-700">Errors:</p>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {validateCOAMutation.data.validation.errors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {validateCOAMutation.data.validation.warnings.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-yellow-700">Warnings:</p>
                        <ul className="text-sm text-yellow-600 list-disc list-inside">
                          {validateCOAMutation.data.validation.warnings.map((warning: string, index: number) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Import Processing Tab */}
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Process Product Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Complete import processing that classifies products and validates COA documents in one step.
                </p>

                <div>
                  <Label htmlFor="import-product-select">Select Product</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product to process" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.slice(0, 50).map((product: any) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="import-coa-upload">Upload COA (Optional)</Label>
                  <Input
                    id="import-coa-upload"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleCOAUpload}
                    className="cursor-pointer mt-2"
                  />
                </div>

                <Button 
                  onClick={() => processImportMutation.mutate({ 
                    productId: selectedProductId, 
                    coaFile: coaFile || undefined 
                  })}
                  disabled={!selectedProductId || processImportMutation.isPending}
                  className="w-full"
                >
                  {processImportMutation.isPending ? 'Processing...' : 'Process Import'}
                </Button>

                {processImportMutation.data && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-semibold">Import Processing Result:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Classification:</p>
                        <Badge variant={getRiskBadgeVariant(processImportMutation.data.classification.riskLevel)}>
                          {processImportMutation.data.classification.category}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Compliance:</p>
                        <Badge variant={processImportMutation.data.complianceAssigned ? 'default' : 'secondary'}>
                          {processImportMutation.data.complianceAssigned ? 'Assigned' : 'Not Required'}
                        </Badge>
                      </div>
                    </div>
                    
                    {processImportMutation.data.coaValidation && (
                      <div>
                        <p className="text-sm font-medium">COA Status:</p>
                        <Badge variant={processImportMutation.data.coaValidation.isValid ? 'default' : 'destructive'}>
                          {processImportMutation.data.coaValidation.isValid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test AI Tab */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Test AI Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the AI classification system with custom product data to see how it categorizes different products.
                </p>

                <div>
                  <Label htmlFor="test-product-name">Product Name</Label>
                  <Input 
                    id="test-product-name"
                    placeholder="e.g., THCA Diamond Pre-Roll, Kratom Powder, Glass Pipe"
                    value={testProductName}
                    onChange={(e) => setTestProductName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="test-product-description">Product Description</Label>
                  <Textarea 
                    id="test-product-description"
                    placeholder="Enter product description with details about ingredients, usage, effects, etc."
                    value={testProductDescription}
                    onChange={(e) => setTestProductDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={() => testClassifyMutation.mutate({ 
                    productName: testProductName, 
                    description: testProductDescription 
                  })}
                  disabled={!testProductName || testClassifyMutation.isPending}
                  className="w-full"
                >
                  {testClassifyMutation.isPending ? 'Testing...' : 'Test Classification'}
                </Button>

                {testClassifyMutation.data && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-semibold">Test Result:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskBadgeVariant(testClassifyMutation.data.classification.riskLevel)}>
                          {testClassifyMutation.data.classification.category}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {Math.round(testClassifyMutation.data.classification.confidence * 100)}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>Substance Type:</strong> {testClassifyMutation.data.classification.substanceType}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Risk Level:</strong> {testClassifyMutation.data.classification.riskLevel}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>AI Reasoning:</strong> {testClassifyMutation.data.classification.reasoning}
                      </p>
                      {testClassifyMutation.data.classification.requiredCompliance.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Required Compliance:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {testClassifyMutation.data.classification.requiredCompliance.map((req: string) => (
                              <Badge key={req} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}