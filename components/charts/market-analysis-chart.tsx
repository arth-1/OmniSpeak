'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Home, MapPin, Calendar, Users, Building2 } from 'lucide-react';

interface MarketDataPoint {
  date: string;
  value: number;
  type?: string;
  location?: string;
}

interface MarketMetric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface MarketAnalysisChartProps {
  data: any;
  type: 'line' | 'bar' | 'pie' | 'area' | 'metrics' | 'comparison' | 'heatmap';
  title: string;
  description?: string;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function MarketAnalysisChart({ data, type, title, description, height = 300 }: MarketAnalysisChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Price']} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Average Price']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Price']} />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'metrics':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((metric: MarketMetric, index: number) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {metric.icon}
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  {metric.trend && getTrendIcon(metric.trend)}
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  {metric.change && (
                    <div className={`text-sm ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        );

      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis type="category" dataKey="location" width={100} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Median Price']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'heatmap':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item: any, index: number) => {
              const intensity = Math.min(Math.max((item.score || 0) / 100, 0), 1);
              const bgColor = `rgba(59, 130, 246, ${intensity})`;
              return (
                <Card key={index} className="p-4" style={{ backgroundColor: bgColor }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{item.location}</h4>
                      <p className="text-sm text-gray-200">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{item.score}%</div>
                      <Badge variant={item.score > 70 ? 'default' : item.score > 40 ? 'secondary' : 'destructive'}>
                        {item.score > 70 ? 'High' : item.score > 40 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                  {item.details && (
                    <div className="mt-2 text-sm text-gray-200">
                      {item.details}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{title}</span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

// Helper function to create sample market metrics
export const createMarketMetrics = (marketData: any) => {
  return [
    {
      label: 'Median Price',
      value: formatCurrency(marketData.medianPrice || 0),
      change: marketData.priceChange || 0,
      trend: marketData.priceChange > 0 ? 'up' : marketData.priceChange < 0 ? 'down' : 'neutral',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      label: 'Price per Sq Ft',
      value: formatCurrency(marketData.pricePerSqFt || 0),
      change: marketData.pricePerSqFtChange || 0,
      trend: marketData.pricePerSqFtChange > 0 ? 'up' : marketData.pricePerSqFtChange < 0 ? 'down' : 'neutral',
      icon: <Home className="h-4 w-4" />
    },
    {
      label: 'Days on Market',
      value: `${marketData.daysOnMarket || 0} days`,
      change: marketData.daysOnMarketChange || 0,
      trend: marketData.daysOnMarketChange < 0 ? 'up' : marketData.daysOnMarketChange > 0 ? 'down' : 'neutral',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      label: 'Active Listings',
      value: marketData.activeListings || 0,
      change: marketData.activeListingsChange || 0,
      trend: marketData.activeListingsChange > 0 ? 'up' : marketData.activeListingsChange < 0 ? 'down' : 'neutral',
      icon: <Building2 className="h-4 w-4" />
    }
  ];
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}