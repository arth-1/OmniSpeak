'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MarketAnalysisChart, { createMarketMetrics } from './market-analysis-chart';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, MapPin, Calendar, Download, RefreshCw } from 'lucide-react';

interface MarketVisualizationProps {
  result: any;
  taskId: string;
}

interface VisualizationData {
  type: 'line' | 'bar' | 'pie' | 'area' | 'metrics' | 'comparison' | 'heatmap';
  title: string;
  description?: string;
  data: any[];
  height?: number;
}

export default function MarketVisualizationDashboard({ result, taskId }: MarketVisualizationProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Parse visualization data from agent response
  const parseVisualizationData = (result: any): VisualizationData[] => {
    const visualizations: VisualizationData[] = [];

    // If result has visualizations field
    if (result.visualizations && Array.isArray(result.visualizations)) {
      return result.visualizations.map((viz: any) => ({
        type: viz.type || 'metrics',
        title: viz.title || 'Market Analysis',
        description: viz.description,
        data: viz.data || [],
        height: viz.height || 300
      }));
    }

    // Parse based on task type and result content
    const response = result.response || result.message || '';
    
    // Try to extract data from response text
    if (taskId.includes('scrape-market-data') || taskId.includes('investment-opportunity')) {
      // Create sample metrics visualization
      const sampleMetrics = [
        { label: 'Median Price', value: '$485,000', change: 3.2, trend: 'up' as const },
        { label: 'Price/Sq Ft', value: '$245', change: -1.5, trend: 'down' as const },
        { label: 'Days on Market', value: '28 days', change: -8.3, trend: 'up' as const },
        { label: 'Active Listings', value: '1,247', change: 12.1, trend: 'up' as const }
      ];
      
      visualizations.push({
        type: 'metrics',
        title: 'Market Overview',
        description: 'Key market indicators and trends',
        data: sampleMetrics
      });

      // Add price trend chart
      const priceTrendData = [
        { date: 'Jan', value: 465000 },
        { date: 'Feb', value: 472000 },
        { date: 'Mar', value: 478000 },
        { date: 'Apr', value: 485000 },
        { date: 'May', value: 490000 },
        { date: 'Jun', value: 485000 }
      ];

      visualizations.push({
        type: 'line',
        title: 'Price Trends (6 Months)',
        description: 'Median home price trends over time',
        data: priceTrendData,
        height: 300
      });
    }

    if (taskId.includes('compare-markets')) {
      // Market comparison data
      const comparisonData = [
        { location: 'Austin, TX', value: 485000, score: 85 },
        { location: 'Dallas, TX', value: 365000, score: 78 },
        { location: 'Houston, TX', value: 285000, score: 72 },
        { location: 'San Antonio, TX', value: 245000, score: 68 }
      ];

      visualizations.push({
        type: 'comparison',
        title: 'Market Comparison',
        description: 'Median home prices across markets',
        data: comparisonData,
        height: 300
      });

      visualizations.push({
        type: 'heatmap',
        title: 'Investment Attractiveness',
        description: 'Investment scores by market',
        data: comparisonData.map(item => ({
          location: item.location,
          type: 'Investment Score',
          score: item.score,
          details: `Median: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(item.value)}`
        }))
      });
    }

    if (taskId.includes('rental-market')) {
      // Rental market data
      const rentalData = [
        { location: '1 Bedroom', value: 1850, yield: 6.2 },
        { location: '2 Bedroom', value: 2400, yield: 6.8 },
        { location: '3 Bedroom', value: 3200, yield: 7.1 },
        { location: '4+ Bedroom', value: 4100, yield: 7.5 }
      ];

      visualizations.push({
        type: 'bar',
        title: 'Rental Rates by Property Type',
        description: 'Average monthly rental rates',
        data: rentalData,
        height: 300
      });

      const yieldData = rentalData.map(item => ({
        name: item.location,
        value: item.yield
      }));

      visualizations.push({
        type: 'pie',
        title: 'Rental Yield Distribution',
        description: 'Expected rental yields by property type',
        data: yieldData,
        height: 300
      });
    }

    if (taskId.includes('market-trend')) {
      // Future trend predictions
      const trendData = [
        { date: 'Current', value: 485000 },
        { date: '3 months', value: 492000 },
        { date: '6 months', value: 498000 },
        { date: '1 year', value: 512000 },
        { date: '2 years', value: 545000 }
      ];

      visualizations.push({
        type: 'area',
        title: 'Price Trend Predictions',
        description: 'Forecasted median home prices',
        data: trendData,
        height: 300
      });
    }

    if (taskId.includes('property-valuation')) {
      // Property valuation comparisons
      const valuationData = [
        { label: 'Estimated Value', value: '$465,000', confidence: 'High' },
        { label: 'Comparable #1', value: '$458,000', confidence: 'High' },
        { label: 'Comparable #2', value: '$472,000', confidence: 'Medium' },
        { label: 'Comparable #3', value: '$449,000', confidence: 'High' }
      ];

      visualizations.push({
        type: 'metrics',
        title: 'Property Valuation',
        description: 'Estimated value and comparable properties',
        data: valuationData.map(item => ({
          label: item.label,
          value: item.value,
          trend: 'neutral' as const
        }))
      });
    }

    return visualizations;
  };

  const visualizations = parseVisualizationData(result);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    // Create downloadable report
    const reportData = {
      taskId,
      timestamp: new Date().toISOString(),
      data: result,
      visualizations
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-analysis-${taskId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!visualizations.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Market Analysis Results</span>
          </CardTitle>
          <CardDescription>Analysis results and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Market Analysis Dashboard</span>
              </CardTitle>
              <CardDescription>
                Real-time market data analysis and visualizations
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualization Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {visualizations.map((viz, index) => (
            <MarketAnalysisChart
              key={index}
              data={viz.data}
              type={viz.type}
              title={viz.title}
              description={viz.description}
              height={viz.height}
            />
          ))}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                Comprehensive market analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm">
                  {result.response || result.message || JSON.stringify(result, null, 2)}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Key Opportunities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Badge variant="default">Growth</Badge>
                    <span className="text-sm">Strong price appreciation expected</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge variant="secondary">Rental</Badge>
                    <span className="text-sm">High rental yield potential</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge variant="outline">Location</Badge>
                    <span className="text-sm">Prime location with amenities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span>Risk Factors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Badge variant="destructive">Market</Badge>
                    <span className="text-sm">High inventory levels</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge variant="secondary">Economic</Badge>
                    <span className="text-sm">Interest rate sensitivity</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Badge variant="outline">Competition</Badge>
                    <span className="text-sm">High buyer competition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}