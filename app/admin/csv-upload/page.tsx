'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message: string;
  progress?: number;
}

export default function CsvUploadPage() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: 'idle',
    message: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadStatus({
          status: 'error',
          message: 'Please select a valid CSV file'
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadStatus({
          status: 'error',
          message: 'File size must be less than 10MB'
        });
        return;
      }

      setSelectedFile(file);
      setUploadStatus({
        status: 'idle',
        message: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus({
        status: 'error',
        message: 'Please select a CSV file first'
      });
      return;
    }

    setUploadStatus({
      status: 'uploading',
      message: 'Uploading CSV file...'
    });

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);

      // Get webhook URL from environment
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_CSV_WEBHOOK;

      if (!webhookUrl) {
        throw new Error('N8N webhook URL not configured. Please add N8N_CSV_WEBHOOK to your .env.local file.');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      setUploadStatus({
        status: 'success',
        message: `✅ Upload successful! Processed ${result.productsProcessed || 0} products.`
      });

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus({ status: 'idle', message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CSV Product Upload</h1>
        <p className="text-muted-foreground">
          Upload CSV files to import products via n8n workflow processing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            CSV File Upload
          </CardTitle>
          <CardDescription>
            Upload a CSV file to trigger the n8n workflow for product processing and database import.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileSelect}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button
                  variant="outline"
                  className="w-full h-24 border-dashed border-2 hover:border-primary/50 cursor-pointer"
                  asChild
                >
                  <span className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8" />
                    <span>
                      {selectedFile ? 'Click to select different file' : 'Click to select CSV file'}
                    </span>
                    {selectedFile && (
                      <span className="text-sm text-muted-foreground">
                        {selectedFile.name}
                      </span>
                    )}
                  </span>
                </Button>
              </label>
            </div>

            {/* Status Display */}
            {uploadStatus.message && (
              <Alert className={
                uploadStatus.status === 'success' ? 'border-green-200 bg-green-50' :
                uploadStatus.status === 'error' ? 'border-red-200 bg-red-50' :
                uploadStatus.status === 'uploading' ? 'border-blue-200 bg-blue-50' :
                'border-gray-200'
              }>
                {uploadStatus.status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {uploadStatus.status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                {uploadStatus.status === 'uploading' && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
                <AlertDescription className={
                  uploadStatus.status === 'success' ? 'text-green-800' :
                  uploadStatus.status === 'error' ? 'text-red-800' :
                  uploadStatus.status === 'uploading' ? 'text-blue-800' :
                  'text-gray-800'
                }>
                  {uploadStatus.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus.status === 'uploading'}
              className="flex-1"
            >
              {uploadStatus.status === 'uploading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV to n8n
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={resetUpload}
              disabled={uploadStatus.status === 'uploading'}
            >
              Reset
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">Instructions:</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>1. Select a CSV file containing your product data</p>
              <p>2. Click "Upload CSV to n8n" to trigger the workflow</p>
              <p>3. The n8n workflow will process the CSV and import to Supabase</p>
              <p>4. Check the status above for upload results</p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Environment Setup:</strong> Ensure <code>N8N_CSV_WEBHOOK</code> is configured in your .env.local file
                with the correct n8n webhook URL for CSV processing.
              </AlertDescription>
            </Alert>
          </div>

          {/* File Requirements */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="font-semibold">CSV File Requirements:</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Format:</strong> UTF-8 encoded CSV file</p>
              <p>• <strong>Size:</strong> Maximum 10MB</p>
              <p>• <strong>Columns:</strong> Should match your n8n workflow expectations</p>
              <p>• <strong>Headers:</strong> First row should contain column headers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
