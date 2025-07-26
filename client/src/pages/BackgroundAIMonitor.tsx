/**
 * Admin-only page for monitoring background AI classification
 * This page is not accessible to regular users
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Play, Pause, Activity, TrendingUp, AlertTriangle } from "lucide-react";

interface BackgroundStats {
  queueLength: number;
  processing: boolean;
  totalProducts: number;
  activeProducts: number;
  hiddenProducts: number;
}

export default function BackgroundAIMonitor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch background AI statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['/api/admin/ai-background/stats'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const stats: BackgroundStats | null = (statsData as any)?.stats || null;

  // Start background classification for all products
  const classifyAllMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/ai-background/classify-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to start classification');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Background Classification Started",
        description: "All products have been queued for AI classification",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/ai-background/stats'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start background classification",
        variant: "destructive",
      });
    }
  });

  // Update configuration
  const updateConfigMutation = useMutation({
    mutationFn: async (config: any) => {
      const response = await fetch('/api/admin/ai-background/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });
      if (!response.ok) throw new Error('Failed to update config');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuration Updated",
        description: "Background AI settings have been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Background AI Monitor</h1>
          <p className="text-gray-600">Loading system statistics...</p>
        </div>
      </div>
    );
  }

  const hiddenPercentage = stats ? (stats.hiddenProducts / stats.totalProducts) * 100 : 0;
  const activePercentage = stats ? (stats.activeProducts / stats.totalProducts) * 100 : 0;

  return (
    <div className="container mx-auto p-6">
      {/* Admin Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-red-500" />
          <h1 className="text-3xl font-bold">Background AI Monitor</h1>
          <Badge variant="destructive">Admin Only</Badge>
        </div>
        <p className="text-gray-600">
          Monitor and control the automatic AI classification system that runs behind the scenes
        </p>
      </div>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Queue Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
              <Activity className={`w-4 h-4 ${stats.processing ? 'text-green-500' : 'text-gray-400'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.queueLength}</div>
              <p className="text-xs text-muted-foreground">
                {stats.processing ? 'Processing...' : 'Idle'}
              </p>
            </CardContent>
          </Card>

          {/* Total Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                In catalog
              </p>
            </CardContent>
          </Card>

          {/* Active Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                {activePercentage.toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          {/* Hidden Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hidden Products</CardTitle>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hiddenProducts}</div>
              <p className="text-xs text-muted-foreground">
                {hiddenPercentage.toFixed(1)}% restricted
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Unable to load statistics</p>
        </div>
      )}

      {/* Product Distribution */}
      {stats && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>
              Overview of product visibility based on AI classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Active Products (Visible to Users)</span>
                <span>{stats.activeProducts} ({activePercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={activePercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hidden Products (Restricted Access)</span>
                <span>{stats.hiddenProducts} ({hiddenPercentage.toFixed(1)}%)</span>
              </div>
              <Progress value={hiddenPercentage} className="h-2 [&>div]:bg-orange-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Background AI Controls</CardTitle>
          <CardDescription>
            Administrative controls for the background AI classification system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => classifyAllMutation.mutate()}
              disabled={classifyAllMutation.isPending || stats?.processing}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {classifyAllMutation.isPending ? 'Starting...' : 'Classify All Products'}
            </Button>

            <Button 
              variant="outline"
              onClick={() => updateConfigMutation.mutate({
                autoHideNicotineProducts: true,
                autoHideTobaccoProducts: true,
                delayBetweenClassifications: 2000
              })}
              disabled={updateConfigMutation.isPending}
            >
              Reset to Default Config
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-amber-800 mb-2">How Background AI Works:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• <strong>Rule-based filtering:</strong> Fast keyword detection for obvious cases (nicotine, tobacco, etc.)</li>
              <li>• <strong>AI classification:</strong> Complex analysis for ambiguous products using OpenAI</li>
              <li>• <strong>Automatic compliance:</strong> Hides restricted products from regular users</li>
              <li>• <strong>Zoho integration:</strong> Processes new imports automatically in background</li>
              <li>• <strong>Invisible operation:</strong> Users never see this process happening</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}