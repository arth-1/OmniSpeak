import { BaseAgent, AgentContext, AgentResponse } from './baseAgent';
import { RealEstateDataScraper } from '../services/realEstateDataScraper';

interface MarketAnalysisParams {
  location: string;
  propertyType?: string;
  analysisType: 'investment' | 'market_trends' | 'rental_analysis' | 'comprehensive';
  budget?: number;
  bedrooms?: number;
}

interface VisualizationData {
  type: 'chart' | 'heatmap' | 'comparison' | 'timeline';
  data: any;
  config: any;
}

export class MarketAnalysisAgent extends BaseAgent {
  private dataScraper: RealEstateDataScraper;

  constructor() {
    super(
      'Market Analysis Agent',
      'Performs real-time market analysis using web scraping and data visualization',
      `You are an expert real estate market analyst with access to real-time market data. Your role is to:
      1. Scrape and analyze current market data from multiple sources
      2. Provide investment recommendations based on live market conditions
      3. Generate dynamic visualizations and charts
      4. Identify market trends and opportunities
      5. Compare properties and neighborhoods using real-time data
      6. Assess risk factors and market timing
      
      Always use the most current data and provide data-driven insights with confidence scores.`
    );

    this.dataScraper = new RealEstateDataScraper({
      rapidApiKey: process.env.RAPIDAPI_KEY,
      scrapingBeeKey: process.env.SCRAPINGBEE_KEY,
      brightDataKey: process.env.BRIGHTDATA_KEY
    });

    this.setupMarketAnalysisTools();
  }

  private setupMarketAnalysisTools() {
    // Real-time market data scraping tool
    this.addTool({
      name: 'scrape_market_data',
      description: 'Scrape real-time market data from multiple sources (Zillow, Realtor.com, etc.)',
      parameters: {
        location: 'string',
        propertyType: 'string',
        sources: 'array'
      },
      execute: async (params) => {
        try {
          const analysis = await this.dataScraper.performComprehensiveAnalysis(
            params.location,
            params.propertyType || 'residential'
          );

          return {
            success: analysis.success,
            data: analysis,
            confidence: analysis.confidence,
            timestamp: new Date(),
            sources: analysis.dataSources,
            rawData: analysis.results
          };
        } catch (error: any) {
          throw new Error(`Market data scraping failed: ${error.message}`);
        }
      }
    });

    // Investment opportunity analysis tool
    this.addTool({
      name: 'analyze_investment_opportunity',
      description: 'Analyze investment potential using real-time market data and visualizations',
      parameters: {
        location: 'string',
        budget: 'number',
        investmentType: 'string'
      },
      execute: async (params) => {
        // Get comprehensive market data
        const marketData = await this.useTool('scrape_market_data', {
          location: params.location,
          propertyType: 'residential'
        });

        if (!marketData.success) {
          throw new Error('Failed to gather market data for analysis');
        }

        // Analyze investment metrics
        const analysis = this.calculateInvestmentMetrics(marketData.data, params.budget);
        
        // Generate visualizations
        const visualizations = this.generateInvestmentVisualizations(marketData.data, analysis);

        return {
          location: params.location,
          budget: params.budget,
          marketData: marketData.data,
          analysis,
          visualizations,
          recommendations: this.generateInvestmentRecommendations(analysis),
          riskAssessment: marketData.data.analysis.riskAssessment,
          confidence: marketData.confidence * 0.9 // Slight reduction for derived analysis
        };
      }
    });

    // Comparative market analysis tool
    this.addTool({
      name: 'compare_markets',
      description: 'Compare multiple markets/locations for investment decisions',
      parameters: {
        locations: 'array',
        criteria: 'array'
      },
      execute: async (params) => {
        const comparisons = [];
        
        for (const location of params.locations) {
          try {
            const marketData = await this.useTool('scrape_market_data', {
              location,
              propertyType: 'residential'
            });
            
            if (marketData.success) {
              comparisons.push({
                location,
                data: marketData.data,
                score: this.calculateMarketScore(marketData.data, params.criteria)
              });
            }
          } catch (error) {
            console.error(`Failed to analyze ${location}:`, error);
          }
        }

        // Sort by score
        comparisons.sort((a, b) => b.score - a.score);

        return {
          comparisons,
          winner: comparisons[0]?.location,
          visualizations: this.generateComparisonVisualizations(comparisons),
          summary: this.generateComparisonSummary(comparisons)
        };
      }
    });

    // Rental market analysis tool
    this.addTool({
      name: 'analyze_rental_market',
      description: 'Analyze rental market conditions and rental property investment potential',
      parameters: {
        location: 'string',
        bedrooms: 'number',
        propertyPrice: 'number'
      },
      execute: async (params) => {
        const rentalData = await this.dataScraper.scrapeRentalData(params.location, params.bedrooms);
        const marketData = await this.dataScraper.scrapeZillowData(params.location);

        if (!rentalData.success || !marketData.success) {
          throw new Error('Failed to gather rental market data');
        }

        const analysis = this.calculateRentalMetrics(
          params.propertyPrice,
          rentalData.data?.averageRent || 2500,
          rentalData.data || {}
        );

        return {
          location: params.location,
          bedrooms: params.bedrooms,
          propertyPrice: params.propertyPrice,
          rentalData: rentalData.data,
          analysis,
          visualizations: this.generateRentalVisualizations(rentalData.data, analysis),
          recommendations: this.generateRentalRecommendations(analysis)
        };
      }
    });

    // Market trend prediction tool
    this.addTool({
      name: 'predict_market_trends',
      description: 'Predict future market trends using current data and economic indicators',
      parameters: {
        location: 'string',
        timeframe: 'string'
      },
      execute: async (params) => {
        const marketData = await this.useTool('scrape_market_data', {
          location: params.location,
          propertyType: 'residential'
        });

        const economicData = await this.dataScraper.scrapeEconomicData(params.location);

        if (!marketData.success || !economicData.success) {
          throw new Error('Failed to gather data for trend prediction');
        }

        const predictions = this.generateMarketPredictions(
          marketData.data,
          economicData.data,
          params.timeframe
        );

        return {
          location: params.location,
          timeframe: params.timeframe,
          predictions,
          confidence: this.calculatePredictionConfidence(marketData.data, economicData.data),
          visualizations: this.generateTrendVisualizations(predictions),
          actionableInsights: this.generateActionableInsights(predictions)
        };
      }
    });

    // Property valuation tool
    this.addTool({
      name: 'estimate_property_value',
      description: 'Estimate property value using comparative market analysis and real-time data',
      parameters: {
        address: 'string',
        bedrooms: 'number',
        bathrooms: 'number',
        sqft: 'number'
      },
      execute: async (params) => {
        // Extract location from address
        const location = params.address.split(',').slice(-2).join(',').trim();
        
        const marketData = await this.useTool('scrape_market_data', {
          location,
          propertyType: 'residential'
        });

        if (!marketData.success) {
          throw new Error('Failed to gather comparable property data');
        }

        const valuation = this.calculatePropertyValuation(params, marketData.data);

        return {
          address: params.address,
          estimatedValue: valuation.value,
          valueRange: valuation.range,
          confidence: valuation.confidence,
          comparables: valuation.comparables,
          pricePerSqft: valuation.pricePerSqft,
          marketPosition: valuation.marketPosition,
          visualizations: this.generateValuationVisualizations(valuation)
        };
      }
    });
  }

  async execute(input: string, context: AgentContext): Promise<AgentResponse> {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: `Perform market analysis: ${input}` }
    ];

    const response = await this.callLLM(messages);
    
    const analysisType = this.determineAnalysisType(input);
    const params = this.extractAnalysisParams(input);
    
    let actions: any[] = [];
    let toolsUsed: string[] = [];
    let visualizations: VisualizationData[] = [];

    try {
      switch (analysisType) {
        case 'investment_analysis':
          const investmentAnalysis = await this.useTool('analyze_investment_opportunity', params);
          actions.push({ type: 'investment_analysis', data: investmentAnalysis });
          visualizations = investmentAnalysis.visualizations || [];
          toolsUsed.push('analyze_investment_opportunity');
          break;

        case 'market_comparison':
          const comparison = await this.useTool('compare_markets', params);
          actions.push({ type: 'market_comparison', data: comparison });
          visualizations = comparison.visualizations || [];
          toolsUsed.push('compare_markets');
          break;

        case 'rental_analysis':
          const rentalAnalysis = await this.useTool('analyze_rental_market', params);
          actions.push({ type: 'rental_analysis', data: rentalAnalysis });
          visualizations = rentalAnalysis.visualizations || [];
          toolsUsed.push('analyze_rental_market');
          break;

        case 'trend_prediction':
          const trendAnalysis = await this.useTool('predict_market_trends', params);
          actions.push({ type: 'trend_prediction', data: trendAnalysis });
          visualizations = trendAnalysis.visualizations || [];
          toolsUsed.push('predict_market_trends');
          break;

        case 'property_valuation':
          const valuation = await this.useTool('estimate_property_value', params);
          actions.push({ type: 'property_valuation', data: valuation });
          visualizations = valuation.visualizations || [];
          toolsUsed.push('estimate_property_value');
          break;

        default:
          // General market data scraping
          const marketData = await this.useTool('scrape_market_data', {
            location: params.location || 'New York, NY',
            propertyType: params.propertyType || 'residential'
          });
          actions.push({ type: 'market_data', data: marketData });
          toolsUsed.push('scrape_market_data');
      }
    } catch (error) {
      console.error('Market analysis error:', error);
    }

    return {
      message: response,
      actions,
      toolsUsed,
      visualizations,
      confidence: actions.length > 0 ? 0.85 : 0.6,
      needsHumanIntervention: false,
      nextSteps: this.generateNextSteps(analysisType, actions)
    };
  }

  // Helper methods for calculations and analysis

  private calculateInvestmentMetrics(marketData: any, budget: number) {
    const avgPrice = marketData.results?.find((r: any) => r.source === 'Zillow')?.data?.marketStats?.medianPrice || budget;
    const avgRent = marketData.results?.find((r: any) => r.source === 'Rentometer')?.data?.averageRent || 2500;
    
    const monthlyRent = avgRent;
    const annualRent = monthlyRent * 12;
    const capRate = (annualRent / avgPrice) * 100;
    const cashFlow = monthlyRent - (avgPrice * 0.01); // Rough monthly payment estimate
    const roi = (cashFlow * 12 / (budget * 0.25)) * 100; // Assuming 25% down payment

    return {
      capRate: Number(capRate.toFixed(2)),
      monthlyRent,
      annualRent,
      monthlyCashFlow: Number(cashFlow.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      paybackPeriod: budget > 0 ? Number((budget / (cashFlow * 12)).toFixed(1)) : 0,
      investmentGrade: this.getInvestmentGrade(capRate, roi, cashFlow)
    };
  }

  private calculateRentalMetrics(propertyPrice: number, averageRent: number, rentalData: any) {
    const monthlyRent = averageRent;
    const annualRent = monthlyRent * 12;
    const grossYield = (annualRent / propertyPrice) * 100;
    const estimatedExpenses = monthlyRent * 0.3; // 30% rule for expenses
    const netMonthlyIncome = monthlyRent - estimatedExpenses;
    const netYield = ((netMonthlyIncome * 12) / propertyPrice) * 100;

    return {
      monthlyRent,
      annualRent,
      grossYield: Number(grossYield.toFixed(2)),
      netYield: Number(netYield.toFixed(2)),
      netMonthlyIncome: Number(netMonthlyIncome.toFixed(2)),
      vacancyRate: rentalData.vacancyRate || 5,
      rentGrowth: rentalData.rentTrend === 'increasing' ? 3 : 1,
      marketRating: this.getRentalMarketRating(grossYield, rentalData.vacancyRate)
    };
  }

  private calculatePropertyValuation(params: any, marketData: any) {
    const comparables = marketData.results?.find((r: any) => r.source === 'Zillow')?.data?.listings || [];
    const avgPricePerSqft = marketData.results?.find((r: any) => r.source === 'Zillow')?.data?.marketStats?.pricePerSqft || 250;
    
    const estimatedValue = params.sqft * avgPricePerSqft;
    const range = {
      low: estimatedValue * 0.9,
      high: estimatedValue * 1.1
    };

    return {
      value: estimatedValue,
      range,
      pricePerSqft: avgPricePerSqft,
      confidence: 0.8,
      comparables: comparables.slice(0, 5),
      marketPosition: estimatedValue > (marketData.results?.find((r: any) => r.source === 'Zillow')?.data?.marketStats?.medianPrice || 0) ? 'above_market' : 'below_market'
    };
  }

  private generateMarketPredictions(marketData: any, economicData: any, timeframe: string) {
    const jobGrowth = economicData.data?.jobGrowth || 2;
    const populationGrowth = economicData.data?.populationGrowth || 1;
    const currentTrend = marketData.results?.find((r: any) => r.source === 'Realtor.com')?.data?.marketTrend || 'stable';
    
    const multiplier = timeframe === '1_year' ? 1 : timeframe === '3_years' ? 3 : 5;
    const baseGrowth = (jobGrowth + populationGrowth) / 2;
    const trendMultiplier = currentTrend === 'up' ? 1.2 : currentTrend === 'down' ? 0.8 : 1;
    
    const predictedGrowth = baseGrowth * trendMultiplier * multiplier;
    const currentPrice = marketData.results?.find((r: any) => r.source === 'Zillow')?.data?.marketStats?.medianPrice || 500000;
    const predictedPrice = currentPrice * (1 + predictedGrowth / 100);

    return {
      timeframe,
      currentPrice,
      predictedPrice: Number(predictedPrice.toFixed(0)),
      expectedGrowth: Number(predictedGrowth.toFixed(1)),
      factors: {
        jobGrowth,
        populationGrowth,
        marketTrend: currentTrend
      },
      scenarios: {
        optimistic: predictedPrice * 1.2,
        realistic: predictedPrice,
        pessimistic: predictedPrice * 0.8
      }
    };
  }

  // Visualization generation methods
  private generateInvestmentVisualizations(marketData: any, analysis: any): VisualizationData[] {
    return [
      {
        type: 'chart',
        data: {
          labels: ['Cap Rate', 'ROI', 'Cash Flow'],
          datasets: [{
            label: 'Investment Metrics',
            data: [analysis.capRate, analysis.roi, analysis.monthlyCashFlow],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b']
          }]
        },
        config: { type: 'bar', title: 'Investment Analysis Overview' }
      },
      {
        type: 'comparison',
        data: {
          current: analysis,
          market_average: { capRate: 6, roi: 8, monthlyCashFlow: 500 }
        },
        config: { title: 'Performance vs Market Average' }
      }
    ];
  }

  private generateRentalVisualizations(rentalData: any, analysis: any): VisualizationData[] {
    return [
      {
        type: 'chart',
        data: {
          labels: ['Gross Yield', 'Net Yield', 'Vacancy Rate'],
          datasets: [{
            data: [analysis.grossYield, analysis.netYield, rentalData.vacancyRate],
            backgroundColor: ['#3b82f6', '#10b981', '#ef4444']
          }]
        },
        config: { type: 'doughnut', title: 'Rental Market Metrics' }
      }
    ];
  }

  private generateComparisonVisualizations(comparisons: any[]): VisualizationData[] {
    return [
      {
        type: 'chart',
        data: {
          labels: comparisons.map(c => c.location),
          datasets: [{
            label: 'Market Score',
            data: comparisons.map(c => c.score),
            backgroundColor: '#3b82f6'
          }]
        },
        config: { type: 'bar', title: 'Market Comparison Scores' }
      }
    ];
  }

  private generateTrendVisualizations(predictions: any): VisualizationData[] {
    return [
      {
        type: 'timeline',
        data: {
          current: predictions.currentPrice,
          predicted: predictions.predictedPrice,
          scenarios: predictions.scenarios
        },
        config: { title: `Price Prediction - ${predictions.timeframe}` }
      }
    ];
  }

  private generateValuationVisualizations(valuation: any): VisualizationData[] {
    return [
      {
        type: 'comparison',
        data: {
          estimated: valuation.value,
          range: valuation.range,
          comparables: valuation.comparables
        },
        config: { title: 'Property Valuation Analysis' }
      }
    ];
  }

  // Helper methods
  private getInvestmentGrade(capRate: number, roi: number, cashFlow: number): string {
    if (capRate > 8 && roi > 12 && cashFlow > 300) return 'A+';
    if (capRate > 6 && roi > 8 && cashFlow > 200) return 'A';
    if (capRate > 4 && roi > 5 && cashFlow > 100) return 'B';
    if (capRate > 2 && roi > 2 && cashFlow > 0) return 'C';
    return 'D';
  }

  private getRentalMarketRating(grossYield: number, vacancyRate: number): string {
    if (grossYield > 8 && vacancyRate < 3) return 'Excellent';
    if (grossYield > 6 && vacancyRate < 5) return 'Good';
    if (grossYield > 4 && vacancyRate < 8) return 'Fair';
    return 'Poor';
  }

  private calculateMarketScore(marketData: any, criteria: string[]): number {
    let score = 50;
    
    // Add scoring logic based on criteria
    const analysis = marketData.analysis;
    if (analysis.investmentScore > 70) score += 20;
    if (analysis.riskAssessment.level === 'Low') score += 15;
    if (analysis.marketCondition === 'Buyer\'s Market') score += 10;
    
    return Math.min(100, score);
  }

  private calculatePredictionConfidence(marketData: any, economicData: any): number {
    let confidence = 0.6; // Base confidence
    
    if (marketData.confidence > 0.8) confidence += 0.1;
    if (economicData.success) confidence += 0.1;
    if (marketData.dataSources >= 3) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }

  // Analysis type determination and parameter extraction
  private determineAnalysisType(input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('investment') || lowerInput.includes('roi') || lowerInput.includes('cash flow')) {
      return 'investment_analysis';
    }
    if (lowerInput.includes('compare') || lowerInput.includes('comparison')) {
      return 'market_comparison';
    }
    if (lowerInput.includes('rental') || lowerInput.includes('rent')) {
      return 'rental_analysis';
    }
    if (lowerInput.includes('trend') || lowerInput.includes('predict') || lowerInput.includes('future')) {
      return 'trend_prediction';
    }
    if (lowerInput.includes('value') || lowerInput.includes('appraisal') || lowerInput.includes('estimate')) {
      return 'property_valuation';
    }
    
    return 'general_analysis';
  }

  private extractAnalysisParams(input: string): any {
    // Simple parameter extraction - in production, use more sophisticated NLP
    const params: any = {};
    
    // Extract location
    const locationMatch = input.match(/in\s+([^,]+(?:,\s*[^,]+)*)/i);
    if (locationMatch) {
      params.location = locationMatch[1].trim();
    } else {
      params.location = 'New York, NY'; // Default
    }
    
    // Extract budget
    const budgetMatch = input.match(/\$?([\d,]+)k?\s*(?:budget|price|cost)/i);
    if (budgetMatch) {
      let amount = parseInt(budgetMatch[1].replace(/,/g, ''));
      if (input.includes('k') || amount < 1000) amount *= 1000;
      params.budget = amount;
    }
    
    // Extract bedrooms
    const bedroomMatch = input.match(/(\d+)\s*(?:br|bed|bedroom)/i);
    if (bedroomMatch) {
      params.bedrooms = parseInt(bedroomMatch[1]);
    }
    
    // Extract multiple locations for comparison
    const locationsMatch = input.match(/compare\s+([^.]+)/i);
    if (locationsMatch) {
      params.locations = locationsMatch[1].split(/\s+(?:and|vs|versus)\s+/i).map(loc => loc.trim());
    }
    
    return params;
  }

  private generateInvestmentRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.capRate > 8) {
      recommendations.push('Excellent cap rate - strong investment potential');
    } else if (analysis.capRate < 4) {
      recommendations.push('Low cap rate - consider negotiating price or look for better opportunities');
    }
    
    if (analysis.roi > 10) {
      recommendations.push('High ROI expected - proceed with investment');
    } else if (analysis.roi < 5) {
      recommendations.push('Low ROI - consider increasing down payment or finding better deals');
    }
    
    if (analysis.monthlyCashFlow > 200) {
      recommendations.push('Positive cash flow - good for monthly income');
    } else if (analysis.monthlyCashFlow < 0) {
      recommendations.push('Negative cash flow - budget for monthly contributions');
    }
    
    return recommendations;
  }

  private generateRentalRecommendations(analysis: any): string[] {
    const recommendations = [];
    
    if (analysis.grossYield > 8) {
      recommendations.push('High rental yield - excellent rental investment');
    }
    
    if (analysis.vacancyRate < 3) {
      recommendations.push('Low vacancy rate - strong rental demand');
    }
    
    if (analysis.marketRating === 'Excellent') {
      recommendations.push('Top-tier rental market - consider long-term investment');
    }
    
    return recommendations;
  }

  private generateComparisonSummary(comparisons: any[]): string {
    if (comparisons.length === 0) return 'No valid comparisons available';
    
    const winner = comparisons[0];
    const runnerUp = comparisons[1];
    
    let summary = `${winner.location} ranks highest with a score of ${winner.score}/100. `;
    
    if (runnerUp) {
      summary += `${runnerUp.location} is a close second with ${runnerUp.score}/100. `;
    }
    
    summary += 'Consider market conditions, timing, and personal preferences in your final decision.';
    
    return summary;
  }

  private generateActionableInsights(predictions: any): string[] {
    const insights = [];
    
    if (predictions.expectedGrowth > 5) {
      insights.push('Strong growth expected - consider buying soon to maximize appreciation');
    } else if (predictions.expectedGrowth < 0) {
      insights.push('Market decline predicted - consider waiting or negotiating aggressively');
    }
    
    if (predictions.factors.jobGrowth > 3) {
      insights.push('Strong job growth supports property demand and price appreciation');
    }
    
    return insights;
  }

  private generateNextSteps(analysisType: string, actions: any[]): string[] {
    const steps = [];
    
    switch (analysisType) {
      case 'investment_analysis':
        steps.push('Schedule property viewings for top candidates');
        steps.push('Arrange financing pre-approval');
        steps.push('Conduct detailed due diligence');
        break;
      case 'rental_analysis':
        steps.push('Research local property management companies');
        steps.push('Calculate exact operating expenses');
        steps.push('Verify rental comps with recent transactions');
        break;
      case 'trend_prediction':
        steps.push('Monitor market indicators monthly');
        steps.push('Set up price alerts for target properties');
        steps.push('Review predictions quarterly');
        break;
      default:
        steps.push('Review analysis with investment advisor');
        steps.push('Gather additional market data if needed');
    }
    
    return steps;
  }
}