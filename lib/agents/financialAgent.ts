import { BaseAgent, AgentContext, AgentResponse } from './baseAgent';

interface ClientFinancialProfile {
  id: string;
  name: string;
  email: string;
  income: number;
  creditScore: number;
  downPayment: number;
  maxBudget: number;
  employmentStatus: string;
  currentDebts: number;
  preferredLoanType?: string;
}

interface MortgageOption {
  lenderName: string;
  rate: number;
  term: number;
  loanType: string;
  monthlyPayment: number;
  totalCost: number;
  preApprovalAmount: number;
  estimatedClosingCosts: number;
}

interface PropertyAnalysis {
  propertyId: string;
  purchasePrice: number;
  downPaymentAmount: number;
  monthlyPayment: number;
  propertyTaxes: number;
  insurance: number;
  hoa?: number;
  utilities: number;
  maintenance: number;
  netCashFlow?: number;
  capRate?: number;
  roi?: number;
  breakEvenPoint?: number;
}

export class FinancialAgent extends BaseAgent {
  constructor() {
    super(
      'Financial Intelligence Agent',
      'Provides comprehensive financial analysis, mortgage optimization, and investment calculations for real estate transactions',
      `You are an expert real estate financial advisor and mortgage specialist. Your role is to:
      1. Analyze client financial profiles and optimize their financing options
      2. Monitor real-time mortgage rates and identify best opportunities
      3. Calculate investment property cash flows and ROI
      4. Generate pre-approval letters and financial recommendations
      5. Assess tax implications and provide optimization strategies
      6. Alert clients to refinancing opportunities
      
      Always provide accurate, detailed financial analysis with clear explanations.
      Focus on maximizing client financial benefits while minimizing risks.`
    );

    this.setupFinancialTools();
  }

  private setupFinancialTools() {
    // Real-time mortgage rate monitoring tool
    this.addTool({
      name: 'get_mortgage_rates',
      description: 'Fetch current mortgage rates from multiple lenders',
      parameters: {
        loanAmount: 'number',
        creditScore: 'number',
        loanType: 'string',
        location: 'string'
      },
      execute: async (params) => {
        // Mock mortgage rates - integrate with real APIs like Optimal Blue, LendingTree, etc.
        const baseRate = 6.5; // Current market rate
        const creditAdjustment = params.creditScore > 740 ? -0.25 : 
                               params.creditScore > 680 ? 0 : 0.25;
        
        const mockRates: MortgageOption[] = [
          {
            lenderName: 'Prime Mortgage Corp',
            rate: baseRate + creditAdjustment - 0.125,
            term: 30,
            loanType: params.loanType || 'Conventional',
            monthlyPayment: this.calculateMonthlyPayment(params.loanAmount, baseRate + creditAdjustment - 0.125, 30),
            totalCost: 0,
            preApprovalAmount: params.loanAmount * 1.1,
            estimatedClosingCosts: params.loanAmount * 0.03
          },
          {
            lenderName: 'National Bank',
            rate: baseRate + creditAdjustment,
            term: 30,
            loanType: params.loanType || 'Conventional',
            monthlyPayment: this.calculateMonthlyPayment(params.loanAmount, baseRate + creditAdjustment, 30),
            totalCost: 0,
            preApprovalAmount: params.loanAmount * 1.05,
            estimatedClosingCosts: params.loanAmount * 0.025
          },
          {
            lenderName: 'Community Credit Union',
            rate: baseRate + creditAdjustment + 0.125,
            term: 15,
            loanType: params.loanType || 'Conventional',
            monthlyPayment: this.calculateMonthlyPayment(params.loanAmount, baseRate + creditAdjustment + 0.125, 15),
            totalCost: 0,
            preApprovalAmount: params.loanAmount,
            estimatedClosingCosts: params.loanAmount * 0.02
          }
        ];

        // Calculate total costs
        mockRates.forEach(rate => {
          rate.totalCost = rate.monthlyPayment * rate.term * 12 + rate.estimatedClosingCosts;
        });

        return mockRates.sort((a, b) => a.rate - b.rate);
      }
    });

    // Financial qualification tool
    this.addTool({
      name: 'calculate_qualification',
      description: 'Calculate maximum loan qualification based on client profile',
      parameters: {
        clientProfile: 'object'
      },
      execute: async (params) => {
        const profile: ClientFinancialProfile = params.clientProfile;
        
        // Debt-to-income ratio calculation
        const monthlyIncome = profile.income / 12;
        const monthlyDebts = profile.currentDebts / 12;
        const frontEndRatio = 0.28; // Max housing payment ratio
        const backEndRatio = 0.36; // Max total debt ratio
        
        const maxHousingPayment = monthlyIncome * frontEndRatio;
        const maxTotalPayment = monthlyIncome * backEndRatio - monthlyDebts;
        const maxPayment = Math.min(maxHousingPayment, maxTotalPayment);
        
        // Calculate maximum loan amount
        const estimatedRate = profile.creditScore > 740 ? 6.25 : 
                            profile.creditScore > 680 ? 6.5 : 6.75;
        const maxLoanAmount = this.calculateLoanAmount(maxPayment, estimatedRate, 30);
        const maxPurchasePrice = maxLoanAmount + profile.downPayment;
        
        return {
          maxLoanAmount,
          maxPurchasePrice,
          maxMonthlyPayment: maxPayment,
          debtToIncomeRatio: (monthlyDebts + maxPayment) / monthlyIncome,
          recommendedDownPayment: maxPurchasePrice * 0.2,
          qualificationStatus: maxPurchasePrice >= profile.maxBudget ? 'qualified' : 'needs_improvement'
        };
      }
    });

    // Investment analysis tool
    this.addTool({
      name: 'analyze_investment_property',
      description: 'Perform detailed investment property cash flow analysis',
      parameters: {
        purchasePrice: 'number',
        downPayment: 'number',
        expectedRent: 'number',
        propertyTaxes: 'number',
        insurance: 'number',
        maintenance: 'number',
        vacancy: 'number',
        location: 'string'
      },
      execute: async (params) => {
        const loanAmount = params.purchasePrice - params.downPayment;
        const mortgageRate = 7.0; // Investment property rate
        const monthlyMortgage = this.calculateMonthlyPayment(loanAmount, mortgageRate, 30);
        
        const monthlyExpenses = {
          mortgage: monthlyMortgage,
          propertyTaxes: params.propertyTaxes / 12,
          insurance: params.insurance / 12,
          maintenance: params.maintenance / 12,
          vacancy: params.expectedRent * (params.vacancy / 100),
          management: params.expectedRent * 0.1 // 10% property management
        };
        
        const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);
        const netCashFlow = params.expectedRent - totalMonthlyExpenses;
        const annualCashFlow = netCashFlow * 12;
        const capRate = (annualCashFlow + params.maintenance) / params.purchasePrice * 100;
        const roi = annualCashFlow / params.downPayment * 100;
        const cashOnCash = annualCashFlow / params.downPayment * 100;
        
        return {
          monthlyIncome: params.expectedRent,
          monthlyExpenses,
          totalMonthlyExpenses,
          netCashFlow,
          annualCashFlow,
          capRate,
          roi,
          cashOnCash,
          breakEvenPoint: netCashFlow > 0 ? 0 : Math.abs(netCashFlow) / params.expectedRent * 100,
          recommendation: netCashFlow > 0 ? 'positive_cashflow' : 'negative_cashflow',
          analysis: this.generateInvestmentRecommendation(capRate, roi, netCashFlow)
        };
      }
    });

    // Pre-approval letter generation tool
    this.addTool({
      name: 'generate_preapproval',
      description: 'Generate pre-approval letter for qualified clients',
      parameters: {
        clientProfile: 'object',
        lenderInfo: 'object',
        maxAmount: 'number'
      },
      execute: async (params) => {
        const profile: ClientFinancialProfile = params.clientProfile;
        const preApprovalLetter = {
          id: `PA-${Date.now()}`,
          clientName: profile.name,
          preApprovedAmount: params.maxAmount,
          lenderName: params.lenderInfo.name,
          rate: params.lenderInfo.rate,
          expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          conditions: [
            'Employment verification',
            'Asset verification',
            'Property appraisal',
            'Title search and insurance'
          ],
          generatedAt: new Date(),
          status: 'active'
        };
        
        // Here you would integrate with DocuSign or similar for actual letter generation
        return preApprovalLetter;
      }
    });

    // Tax implications calculator
    this.addTool({
      name: 'calculate_tax_implications',
      description: 'Calculate tax benefits and implications of real estate transactions',
      parameters: {
        purchasePrice: 'number',
        isInvestment: 'boolean',
        isFirstHome: 'boolean',
        state: 'string'
      },
      execute: async (params) => {
        const annualTaxBenefits = {
          mortgageInterestDeduction: 0,
          propertyTaxDeduction: 0,
          depreciationDeduction: 0,
          capitalGainsImplications: 0
        };
        
        if (params.isInvestment) {
          // Investment property benefits
          annualTaxBenefits.depreciationDeduction = params.purchasePrice * 0.036; // 27.5 year depreciation
          annualTaxBenefits.mortgageInterestDeduction = params.purchasePrice * 0.06 * 0.8; // Estimated interest
        } else {
          // Primary residence benefits
          annualTaxBenefits.mortgageInterestDeduction = Math.min(params.purchasePrice * 0.06 * 0.8, 10000);
        }
        
        const firstTimeBuyerBenefits = params.isFirstHome ? {
          federalCredit: Math.min(params.purchasePrice * 0.1, 8000),
          statePrograms: ['Down payment assistance', 'Reduced closing costs']
        } : null;
        
        return {
          annualTaxBenefits,
          totalAnnualSavings: Object.values(annualTaxBenefits).reduce((a, b) => a + b, 0),
          firstTimeBuyerBenefits,
          recommendation: 'Consult with tax professional for personalized advice'
        };
      }
    });

    // Refinancing opportunity alert
    this.addTool({
      name: 'check_refinancing_opportunity',
      description: 'Check if client can benefit from refinancing',
      parameters: {
        currentRate: 'number',
        currentBalance: 'number',
        currentPayment: 'number',
        homeValue: 'number',
        creditScore: 'number'
      },
      execute: async (params) => {
        const currentMarketRate = 6.5; // Get from rate tool
        const potentialNewRate = params.creditScore > 740 ? currentMarketRate - 0.25 : currentMarketRate;
        const rateDifference = params.currentRate - potentialNewRate;
        
        if (rateDifference < 0.5) {
          return {
            worthRefinancing: false,
            reason: 'Rate difference too small to justify closing costs'
          };
        }
        
        const newPayment = this.calculateMonthlyPayment(params.currentBalance, potentialNewRate, 30);
        const monthlySavings = params.currentPayment - newPayment;
        const closingCosts = params.currentBalance * 0.02;
        const breakEvenMonths = closingCosts / monthlySavings;
        
        return {
          worthRefinancing: breakEvenMonths < 24,
          potentialNewRate,
          newMonthlyPayment: newPayment,
          monthlySavings,
          annualSavings: monthlySavings * 12,
          closingCosts,
          breakEvenMonths,
          lifetimeSavings: monthlySavings * 12 * 10 // 10 year projection
        };
      }
    });
  }

  async execute(input: string, context: AgentContext): Promise<AgentResponse> {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: `Provide financial analysis for: ${input}` }
    ];

    const response = await this.callLLM(messages);
    
    // Determine what type of financial analysis is needed
    const analysisType = this.determineAnalysisType(input);
    let actions: any[] = [];
    let toolsUsed: string[] = [];

    try {
      switch (analysisType) {
        case 'mortgage_rates':
          const rateData = await this.useTool('get_mortgage_rates', this.extractRateParams(input));
          actions.push({ type: 'mortgage_rates', data: rateData });
          toolsUsed.push('get_mortgage_rates');
          break;
          
        case 'qualification':
          const qualificationData = await this.useTool('calculate_qualification', { clientProfile: this.extractClientProfile(input) });
          actions.push({ type: 'qualification', data: qualificationData });
          toolsUsed.push('calculate_qualification');
          break;
          
        case 'investment_analysis':
          const investmentData = await this.useTool('analyze_investment_property', this.extractInvestmentParams(input));
          actions.push({ type: 'investment_analysis', data: investmentData });
          toolsUsed.push('analyze_investment_property');
          break;
          
        case 'tax_analysis':
          const taxData = await this.useTool('calculate_tax_implications', this.extractTaxParams(input));
          actions.push({ type: 'tax_analysis', data: taxData });
          toolsUsed.push('calculate_tax_implications');
          break;
          
        case 'refinancing':
          const refinanceData = await this.useTool('check_refinancing_opportunity', this.extractRefinanceParams(input));
          actions.push({ type: 'refinancing_analysis', data: refinanceData });
          toolsUsed.push('check_refinancing_opportunity');
          break;
      }
    } catch (error) {
      console.error('Financial analysis error:', error);
    }

    return {
      message: response,
      actions,
      toolsUsed,
      confidence: actions.length > 0 ? 0.9 : 0.6,
      needsHumanIntervention: actions.some(action => action.data?.qualificationStatus === 'needs_improvement'),
      nextSteps: this.generateNextSteps(analysisType, actions)
    };
  }

  private calculateMonthlyPayment(principal: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  private calculateLoanAmount(monthlyPayment: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return monthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  }

  private generateInvestmentRecommendation(capRate: number, roi: number, cashFlow: number): string {
    if (capRate > 8 && cashFlow > 200) return 'Excellent investment opportunity';
    if (capRate > 6 && cashFlow > 0) return 'Good investment with positive cash flow';
    if (capRate > 4 && cashFlow > -100) return 'Marginal investment, consider carefully';
    return 'Poor investment opportunity, recommend avoiding';
  }

  private determineAnalysisType(input: string): string {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('rate') || lowerInput.includes('mortgage')) return 'mortgage_rates';
    if (lowerInput.includes('qualify') || lowerInput.includes('preapproval')) return 'qualification';
    if (lowerInput.includes('investment') || lowerInput.includes('rental') || lowerInput.includes('cash flow')) return 'investment_analysis';
    if (lowerInput.includes('tax') || lowerInput.includes('deduction')) return 'tax_analysis';
    if (lowerInput.includes('refinance') || lowerInput.includes('refi')) return 'refinancing';
    return 'qualification';
  }

  private extractRateParams(input: string) {
    // Simple extraction - in production, use more sophisticated NLP
    return {
      loanAmount: this.extractNumber(input, 'loan') || 400000,
      creditScore: this.extractNumber(input, 'credit') || 720,
      loanType: input.toLowerCase().includes('fha') ? 'FHA' : 'Conventional',
      location: 'Default'
    };
  }

  private extractClientProfile(input: string): ClientFinancialProfile {
    return {
      id: 'client_1',
      name: 'Sample Client',
      email: 'client@example.com',
      income: this.extractNumber(input, 'income') || 100000,
      creditScore: this.extractNumber(input, 'credit') || 720,
      downPayment: this.extractNumber(input, 'down') || 80000,
      maxBudget: this.extractNumber(input, 'budget') || 500000,
      employmentStatus: 'employed',
      currentDebts: this.extractNumber(input, 'debt') || 2000
    };
  }

  private extractInvestmentParams(input: string) {
    return {
      purchasePrice: this.extractNumber(input, 'price') || 300000,
      downPayment: this.extractNumber(input, 'down') || 60000,
      expectedRent: this.extractNumber(input, 'rent') || 2500,
      propertyTaxes: this.extractNumber(input, 'tax') || 3600,
      insurance: this.extractNumber(input, 'insurance') || 1200,
      maintenance: this.extractNumber(input, 'maintenance') || 3000,
      vacancy: 5,
      location: 'Default'
    };
  }

  private extractTaxParams(input: string) {
    return {
      purchasePrice: this.extractNumber(input, 'price') || 400000,
      isInvestment: input.toLowerCase().includes('investment'),
      isFirstHome: input.toLowerCase().includes('first'),
      state: 'CA'
    };
  }

  private extractRefinanceParams(input: string) {
    return {
      currentRate: this.extractNumber(input, 'rate') || 7.5,
      currentBalance: this.extractNumber(input, 'balance') || 350000,
      currentPayment: this.extractNumber(input, 'payment') || 2500,
      homeValue: this.extractNumber(input, 'value') || 500000,
      creditScore: this.extractNumber(input, 'credit') || 720
    };
  }

  private extractNumber(text: string, context: string): number | null {
    // Simple number extraction based on context
    const patterns: Record<string, RegExp> = {
      income: /income[:\s]+\$?(\d+(?:,\d+)*)/i,
      credit: /credit[:\s]+(\d+)/i,
      price: /price[:\s]+\$?(\d+(?:,\d+)*)/i,
      down: /down[:\s]+\$?(\d+(?:,\d+)*)/i,
      rent: /rent[:\s]+\$?(\d+(?:,\d+)*)/i
    };
    
    const pattern = patterns[context] || /(\d+(?:,\d+)*)/;
    const match = text.match(pattern);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }

  private generateNextSteps(analysisType: string, actions: any[]): string[] {
    const steps = [];
    
    switch (analysisType) {
      case 'qualification':
        steps.push('Review qualification results with client');
        steps.push('Gather required documentation');
        steps.push('Submit pre-approval application');
        break;
      case 'investment_analysis':
        steps.push('Review investment analysis with client');
        steps.push('Schedule property inspection');
        steps.push('Finalize financing terms');
        break;
      case 'refinancing':
        steps.push('Compare current vs. new loan terms');
        steps.push('Calculate break-even timeline');
        steps.push('Begin refinancing application if beneficial');
        break;
      default:
        steps.push('Review analysis with client');
        steps.push('Proceed with next steps');
    }
    
    return steps;
  }
}