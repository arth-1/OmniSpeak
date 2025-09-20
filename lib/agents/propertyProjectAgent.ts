import { BaseAgent, AgentContext, AgentResponse } from './baseAgent';

interface ProjectDetails {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  completedUnits: number;
  floorPlans: FloorPlan[];
  amenities: string[];
  expectedCompletion: Date;
  currentPhase: string;
  priceRange: {
    min: number;
    max: number;
  };
}

interface FloorPlan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  price: number;
  availableUnits: number;
  features: string[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestedProjects: string[];
  budget: number;
  preferences: any;
  status: 'prospect' | 'interested' | 'reserved' | 'purchased';
}

interface DemandLetter {
  id: string;
  projectId: string;
  subject: string;
  content: string;
  recipients: string[];
  scheduledSendDate: Date;
  status: 'draft' | 'scheduled' | 'sent';
  attachments?: string[];
}

export class PropertyProjectAgent extends BaseAgent {
  constructor() {
    super(
      'Property Project Management Agent',
      'Manages real estate projects, client communication, and automated demand letter campaigns',
      `You are an expert real estate project manager and marketing agent. Your role is to:
      1. Manage property development projects and track construction progress
      2. Maintain client databases and track interest levels
      3. Generate and send automated demand letters for project updates
      4. Coordinate client communications based on project milestones
      5. Analyze client preferences and match them with suitable units
      6. Track sales performance and generate project reports
      
      Always maintain professional communication and ensure timely updates to interested clients.`
    );

    this.setupProjectTools();
  }

  private setupProjectTools() {
    // Project management tool
    this.addTool({
      name: 'get_project_status',
      description: 'Get current status and details of a real estate project',
      parameters: {
        projectId: 'string'
      },
      execute: async (params) => {
        // Mock project data - integrate with your project management system
        const mockProject: ProjectDetails = {
          id: params.projectId,
          name: 'Sunset Towers',
          location: 'Downtown Metropolitan',
          totalUnits: 120,
          completedUnits: 45,
          floorPlans: [
            {
              id: 'fp1',
              name: '1BR Deluxe',
              bedrooms: 1,
              bathrooms: 1,
              sqft: 650,
              price: 285000,
              availableUnits: 12,
              features: ['Balcony', 'City View', 'Modern Kitchen']
            },
            {
              id: 'fp2',
              name: '2BR Premium',
              bedrooms: 2,
              bathrooms: 2,
              sqft: 950,
              price: 425000,
              availableUnits: 8,
              features: ['Balcony', 'City View', 'Walk-in Closet', 'Premium Fixtures']
            }
          ],
          amenities: ['Gym', 'Pool', 'Concierge', 'Parking', 'Rooftop Garden'],
          expectedCompletion: new Date('2025-12-01'),
          currentPhase: 'Interior Finishing',
          priceRange: { min: 285000, max: 650000 }
        };

        return mockProject;
      }
    });

    // Client management tool
    this.addTool({
      name: 'get_interested_clients',
      description: 'Get list of clients interested in a specific project',
      parameters: {
        projectId: 'string',
        filters: 'object'
      },
      execute: async (params) => {
        // Mock client data - integrate with your CRM
        const mockClients: Client[] = [
          {
            id: 'client1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1-555-0123',
            interestedProjects: [params.projectId],
            budget: 400000,
            preferences: { bedrooms: 2, balcony: true },
            status: 'interested'
          },
          {
            id: 'client2',
            name: 'Sarah Johnson',
            email: 'sarah.j@email.com',
            phone: '+1-555-0124',
            interestedProjects: [params.projectId],
            budget: 300000,
            preferences: { bedrooms: 1, cityView: true },
            status: 'prospect'
          },
          {
            id: 'client3',
            name: 'Michael Chen',
            email: 'michael.chen@email.com',
            phone: '+1-555-0125',
            interestedProjects: [params.projectId],
            budget: 500000,
            preferences: { bedrooms: 2, parking: true },
            status: 'reserved'
          }
        ];

        // Apply filters if provided
        let filteredClients = mockClients;
        if (params.filters) {
          if (params.filters.budget) {
            filteredClients = filteredClients.filter(c => c.budget >= params.filters.budget.min && c.budget <= params.filters.budget.max);
          }
          if (params.filters.status) {
            filteredClients = filteredClients.filter(c => c.status === params.filters.status);
          }
        }

        return filteredClients;
      }
    });

    // Demand letter generation tool
    this.addTool({
      name: 'generate_demand_letter',
      description: 'Generate personalized demand letters for project updates',
      parameters: {
        projectId: 'string',
        updateType: 'string',
        customMessage: 'string'
      },
      execute: async (params) => {
        const project = await this.useTool('get_project_status', { projectId: params.projectId });
        const clients = await this.useTool('get_interested_clients', { projectId: params.projectId });

        const letterTemplates: Record<string, { subject: string; content: string }> = {
          construction_milestone: {
            subject: `🏗️ Exciting Progress Update: ${project.name} Construction Milestone Reached!`,
            content: this.generateConstructionUpdateContent(project, params.customMessage)
          },
          floor_completion: {
            subject: `🎉 New Floor Completed at ${project.name} - Limited Units Available!`,
            content: this.generateFloorCompletionContent(project, params.customMessage)
          },
          amenity_update: {
            subject: `✨ New Amenity Alert: ${project.name} Gets Even Better!`,
            content: this.generateAmenityUpdateContent(project, params.customMessage)
          },
          price_alert: {
            subject: `⏰ Price Update: ${project.name} - Act Now!`,
            content: this.generatePriceAlertContent(project, params.customMessage)
          },
          final_units: {
            subject: `🔥 Last Chance: Final Units at ${project.name}!`,
            content: this.generateFinalUnitsContent(project, params.customMessage)
          }
        };

        const template = letterTemplates[params.updateType] || letterTemplates.construction_milestone;
        
        const demandLetter: DemandLetter = {
          id: `DL-${Date.now()}`,
          projectId: params.projectId,
          subject: template.subject,
          content: template.content,
          recipients: (clients as Client[]).map((c: Client) => c.email),
          scheduledSendDate: new Date(),
          status: 'draft',
          attachments: []
        };

        return demandLetter;
      }
    });

    // Email sending tool
    this.addTool({
      name: 'send_demand_letters',
      description: 'Send demand letters to all interested clients',
      parameters: {
        demandLetter: 'object',
        scheduleTime: 'string'
      },
      execute: async (params) => {
        const letter: DemandLetter = params.demandLetter;
        
        // Mock email sending - integrate with your email service (SendGrid, AWS SES, etc.)
        const emailResults = [];
        
        for (const email of letter.recipients) {
          try {
            // Simulate email sending
            const emailResult = {
              email,
              status: 'sent',
              sentAt: new Date(),
              messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
            emailResults.push(emailResult);
            
            // In production, integrate with actual email service:
            // await sendEmail({
            //   to: email,
            //   subject: letter.subject,
            //   html: letter.content,
            //   attachments: letter.attachments
            // });
            
          } catch (error: any) {
            emailResults.push({
              email,
              status: 'failed',
              error: error?.message || 'Unknown error'
            });
          }
        }

        return {
          letterId: letter.id,
          totalSent: emailResults.filter(r => r.status === 'sent').length,
          totalFailed: emailResults.filter(r => r.status === 'failed').length,
          results: emailResults,
          sentAt: new Date()
        };
      }
    });

    // Client matching tool
    this.addTool({
      name: 'match_clients_to_units',
      description: 'Match interested clients to available units based on preferences',
      parameters: {
        projectId: 'string'
      },
      execute: async (params) => {
        const project = await this.useTool('get_project_status', { projectId: params.projectId });
        const clients = await this.useTool('get_interested_clients', { projectId: params.projectId });

        const matches = [];

        for (const client of clients) {
          for (const floorPlan of project.floorPlans) {
            let score = 0;
            const reasons = [];

            // Budget match
            if (floorPlan.price <= client.budget) {
              score += 40;
              reasons.push('Within budget');
            } else {
              continue; // Skip if over budget
            }

            // Bedroom preference
            if (client.preferences.bedrooms && floorPlan.bedrooms === client.preferences.bedrooms) {
              score += 30;
              reasons.push('Matches bedroom preference');
            }

            // Feature preferences
            if (client.preferences.balcony && floorPlan.features.includes('Balcony')) {
              score += 15;
              reasons.push('Has preferred balcony');
            }

            if (client.preferences.cityView && floorPlan.features.includes('City View')) {
              score += 15;
              reasons.push('Has city view');
            }

            // Availability
            if (floorPlan.availableUnits > 0) {
              score += 10;
              reasons.push('Units available');
            }

            if (score >= 50) { // Minimum match threshold
              matches.push({
                clientId: client.id,
                clientName: client.name,
                floorPlanId: floorPlan.id,
                floorPlanName: floorPlan.name,
                matchScore: score,
                reasons,
                recommendedAction: score >= 80 ? 'priority_contact' : 'follow_up'
              });
            }
          }
        }

        return matches.sort((a, b) => b.matchScore - a.matchScore);
      }
    });

    // Project analytics tool
    this.addTool({
      name: 'generate_project_analytics',
      description: 'Generate comprehensive project performance analytics',
      parameters: {
        projectId: 'string',
        timeframe: 'string'
      },
      execute: async (params) => {
        const project = await this.useTool('get_project_status', { projectId: params.projectId }) as ProjectDetails;
        const clients = await this.useTool('get_interested_clients', { projectId: params.projectId }) as Client[];

        const analytics = {
          projectOverview: {
            totalUnits: project.totalUnits,
            completedUnits: project.completedUnits,
            completionPercentage: (project.completedUnits / project.totalUnits) * 100,
            currentPhase: project.currentPhase
          },
          salesMetrics: {
            totalInquiries: clients.length,
            prospects: clients.filter((c: Client) => c.status === 'prospect').length,
            interested: clients.filter((c: Client) => c.status === 'interested').length,
            reserved: clients.filter((c: Client) => c.status === 'reserved').length,
            sold: clients.filter((c: Client) => c.status === 'purchased').length,
            conversionRate: (clients.filter((c: Client) => c.status === 'purchased').length / clients.length) * 100
          },
          inventoryStatus: project.floorPlans.map((fp: FloorPlan) => ({
            floorPlan: fp.name,
            totalUnits: fp.availableUnits + 5, // Mock total
            availableUnits: fp.availableUnits,
            soldUnits: 5, // Mock sold
            averagePrice: fp.price
          })),
          marketingInsights: {
            averageBudget: clients.reduce((sum: number, c: Client) => sum + c.budget, 0) / clients.length,
            mostRequestedBedrooms: this.getMostCommon(clients.map((c: Client) => c.preferences.bedrooms)),
            popularFeatures: ['Balcony', 'City View', 'Parking']
          }
        };

        return analytics;
      }
    });
  }

  async execute(input: string, context: AgentContext): Promise<AgentResponse> {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: `Handle project management request: ${input}` }
    ];

    const response = await this.callLLM(messages);
    
    const requestType = this.determineRequestType(input);
    let actions: any[] = [];
    let toolsUsed: string[] = [];

    try {
      switch (requestType) {
        case 'project_status':
          const projectData = await this.useTool('get_project_status', this.extractProjectParams(input));
          actions.push({ type: 'project_status', data: projectData });
          toolsUsed.push('get_project_status');
          break;

        case 'send_demand_letters':
          const demandLetter = await this.useTool('generate_demand_letter', this.extractDemandParams(input));
          const sendResults = await this.useTool('send_demand_letters', { demandLetter, scheduleTime: 'immediate' });
          actions.push({ type: 'demand_letter_generated', data: demandLetter });
          actions.push({ type: 'emails_sent', data: sendResults });
          toolsUsed.push('generate_demand_letter', 'send_demand_letters');
          break;

        case 'client_matching':
          const matches = await this.useTool('match_clients_to_units', this.extractProjectParams(input));
          actions.push({ type: 'client_matches', data: matches });
          toolsUsed.push('match_clients_to_units');
          break;

        case 'project_analytics':
          const analytics = await this.useTool('generate_project_analytics', this.extractAnalyticsParams(input));
          actions.push({ type: 'project_analytics', data: analytics });
          toolsUsed.push('generate_project_analytics');
          break;

        case 'client_list':
          const clients = await this.useTool('get_interested_clients', this.extractClientParams(input));
          actions.push({ type: 'client_list', data: clients });
          toolsUsed.push('get_interested_clients');
          break;
      }
    } catch (error) {
      console.error('Project management error:', error);
    }

    return {
      message: response,
      actions,
      toolsUsed,
      confidence: actions.length > 0 ? 0.9 : 0.6,
      needsHumanIntervention: false,
      nextSteps: this.generateNextSteps(requestType, actions)
    };
  }

  private generateConstructionUpdateContent(project: ProjectDetails, customMessage?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Great News About ${project.name}!</h2>
        
        <p>Dear Valued Client,</p>
        
        <p>We're excited to share some fantastic progress on <strong>${project.name}</strong>!</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669;">Construction Progress Update</h3>
          <ul>
            <li><strong>Current Phase:</strong> ${project.currentPhase}</li>
            <li><strong>Completion Progress:</strong> ${Math.round((project.completedUnits / project.totalUnits) * 100)}%</li>
            <li><strong>Units Completed:</strong> ${project.completedUnits} of ${project.totalUnits}</li>
            <li><strong>Expected Completion:</strong> ${project.expectedCompletion.toLocaleDateString()}</li>
          </ul>
        </div>
        
        ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
        
        <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #1d4ed8;">Available Floor Plans:</h4>
          ${project.floorPlans.map(fp => `
            <div style="margin: 10px 0;">
              <strong>${fp.name}</strong> - ${fp.bedrooms}BR/${fp.bathrooms}BA | ${fp.sqft} sqft | $${fp.price.toLocaleString()}
              <br><small style="color: #6b7280;">Only ${fp.availableUnits} units remaining!</small>
            </div>
          `).join('')}
        </div>
        
        <p>Don't miss this opportunity to secure your dream home at ${project.name}. Our sales team is standing by to answer any questions and help you reserve your preferred unit.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="tel:+1-555-HOMES" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Call Now: (555) HOMES
          </a>
        </div>
        
        <p>Best regards,<br>
        <strong>The ${project.name} Sales Team</strong></p>
      </div>
    `;
  }

  private generateFloorCompletionContent(project: ProjectDetails, customMessage?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🎉 Another Floor Completed at ${project.name}!</h2>
        
        <p>Dear Future Homeowner,</p>
        
        <p>We're thrilled to announce that another floor has been completed at <strong>${project.name}</strong>, bringing us one step closer to delivering your dream home!</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #dc2626;">⚡ Limited Time Opportunity</h3>
          <p>With the completion of this floor, we now have <strong>immediate move-in availability</strong> for select units!</p>
        </div>
        
        ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
        
        <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #059669;">What This Means for You:</h4>
          <ul style="color: #166534;">
            <li>Earlier move-in dates available</li>
            <li>Completed units available for viewing</li>
            <li>Pre-construction pricing still locked in</li>
            <li>Priority selection for remaining units</li>
          </ul>
        </div>
        
        <p style="font-size: 18px; color: #dc2626; font-weight: bold;">
          ⏰ Act fast - only ${project.floorPlans.reduce((sum, fp) => sum + fp.availableUnits, 0)} units remaining!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="mailto:sales@${project.name.toLowerCase().replace(/\s+/g, '')}.com" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
            Schedule Viewing
          </a>
          <a href="tel:+1-555-HOMES" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
            Call Sales Team
          </a>
        </div>
        
        <p>Don't let this opportunity slip away. Contact us today to secure your unit!</p>
        
        <p>Warm regards,<br>
        <strong>The ${project.name} Development Team</strong></p>
      </div>
    `;
  }

  private generateAmenityUpdateContent(project: ProjectDetails, customMessage?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">✨ ${project.name} Gets Even Better!</h2>
        
        <p>Dear Valued Client,</p>
        
        <p>We have some exciting news to share about the amazing amenities coming to <strong>${project.name}</strong>!</p>
        
        ${customMessage ? `<div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #7c3aed; font-style: italic;">${customMessage}</p>
        </div>` : ''}
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669;">Premium Amenities Include:</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            ${project.amenities.map(amenity => `
              <div style="display: flex; align-items: center;">
                <span style="color: #059669; margin-right: 8px;">✓</span>
                <span>${amenity}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <p>These world-class amenities are designed to enhance your lifestyle and provide unparalleled convenience and luxury.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Learn More About Amenities
          </a>
        </div>
        
        <p>Best regards,<br>
        <strong>The ${project.name} Team</strong></p>
      </div>
    `;
  }

  private generatePriceAlertContent(project: ProjectDetails, customMessage?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">⏰ Important Price Update for ${project.name}</h2>
        
        <p>Dear Valued Client,</p>
        
        <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c;">
          <h3 style="color: #ea580c;">Price Adjustment Notice</h3>
          <p>Due to increasing construction costs and high demand, we will be implementing a price adjustment effective next month.</p>
        </div>
        
        ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #0369a1;">Current Pricing (Limited Time):</h4>
          ${project.floorPlans.map(fp => `
            <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 4px;">
              <strong>${fp.name}</strong> - Starting at $${fp.price.toLocaleString()}
              <br><small style="color: #6b7280;">New pricing: $${(fp.price * 1.05).toLocaleString()} (5% increase)</small>
            </div>
          `).join('')}
        </div>
        
        <p style="font-size: 18px; color: #ea580c; font-weight: bold; text-align: center;">
          🔥 Lock in current pricing - Limited time offer expires soon!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #ea580c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Reserve Now at Current Pricing
          </a>
        </div>
        
        <p>Don't miss this opportunity to secure your unit at today's pricing!</p>
        
        <p>Sincerely,<br>
        <strong>The ${project.name} Sales Team</strong></p>
      </div>
    `;
  }

  private generateFinalUnitsContent(project: ProjectDetails, customMessage?: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🔥 FINAL UNITS: Last Chance at ${project.name}!</h2>
        
        <p>Dear Valued Client,</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #dc2626;">
          <h3 style="color: #dc2626; text-align: center;">⚠️ URGENT: FINAL UNITS AVAILABLE ⚠️</h3>
          <p style="text-align: center; font-size: 18px; color: #7f1d1d;">
            Only <strong>${project.floorPlans.reduce((sum, fp) => sum + fp.availableUnits, 0)} units</strong> remain in this sold-out community!
          </p>
        </div>
        
        ${customMessage ? `<p><em>${customMessage}</em></p>` : ''}
        
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #0369a1;">Last Remaining Units:</h4>
          ${project.floorPlans.filter(fp => fp.availableUnits > 0).map(fp => `
            <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #dc2626;">
              <strong style="color: #dc2626;">${fp.name}</strong> - ${fp.bedrooms}BR/${fp.bathrooms}BA
              <br>Price: $${fp.price.toLocaleString()} | Size: ${fp.sqft} sqft
              <br><strong style="color: #dc2626;">Only ${fp.availableUnits} unit(s) left!</strong>
            </div>
          `).join('')}
        </div>
        
        <div style="background: #059669; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3>🏠 Why Choose ${project.name}?</h3>
          <p>Premium location • Luxury amenities • Proven developer • Strong resale value</p>
        </div>
        
        <p style="font-size: 20px; color: #dc2626; font-weight: bold; text-align: center;">
          ⏰ These units will sell TODAY - Don't wait!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="tel:+1-555-HOMES" style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 18px;">
            CALL NOW: (555) HOMES
          </a>
        </div>
        
        <p style="text-align: center; color: #7f1d1d; font-weight: bold;">
          Call within the next 24 hours to secure your unit!
        </p>
        
        <p>Urgently yours,<br>
        <strong>The ${project.name} Sales Director</strong></p>
      </div>
    `;
  }

  private determineRequestType(input: string): string {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('demand letter') || lowerInput.includes('send email') || lowerInput.includes('notify clients')) return 'send_demand_letters';
    if (lowerInput.includes('match') || lowerInput.includes('recommend')) return 'client_matching';
    if (lowerInput.includes('analytics') || lowerInput.includes('report') || lowerInput.includes('performance')) return 'project_analytics';
    if (lowerInput.includes('clients') || lowerInput.includes('interested')) return 'client_list';
    return 'project_status';
  }

  private extractProjectParams(input: string) {
    // Simple extraction - in production, use more sophisticated NLP
    return {
      projectId: 'project_1' // Default project
    };
  }

  private extractDemandParams(input: string) {
    const lowerInput = input.toLowerCase();
    let updateType = 'construction_milestone';
    
    if (lowerInput.includes('floor completed')) updateType = 'floor_completion';
    if (lowerInput.includes('amenity')) updateType = 'amenity_update';
    if (lowerInput.includes('price')) updateType = 'price_alert';
    if (lowerInput.includes('final') || lowerInput.includes('last')) updateType = 'final_units';
    
    return {
      projectId: 'project_1',
      updateType,
      customMessage: this.extractCustomMessage(input)
    };
  }

  private extractClientParams(input: string) {
    return {
      projectId: 'project_1',
      filters: {}
    };
  }

  private extractAnalyticsParams(input: string) {
    return {
      projectId: 'project_1',
      timeframe: '30d'
    };
  }

  private extractCustomMessage(input: string): string {
    // Extract custom message if provided
    const messageMatch = input.match(/message[:\s]+"([^"]+)"/i);
    return messageMatch ? messageMatch[1] : '';
  }

  private getMostCommon(arr: any[]): any {
    const counts: Record<string, number> = {};
    arr.forEach(item => {
      if (item !== undefined) {
        const key = String(item);
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    
    let mostCommon = null;
    let maxCount = 0;
    for (const [item, count] of Object.entries(counts)) {
      if ((count as number) > maxCount) {
        maxCount = count as number;
        mostCommon = item;
      }
    }
    
    return mostCommon;
  }

  private generateNextSteps(requestType: string, actions: any[]): string[] {
    const steps = [];
    
    switch (requestType) {
      case 'send_demand_letters':
        steps.push('Review email delivery results');
        steps.push('Track client responses and engagement');
        steps.push('Follow up with non-responders in 3-5 days');
        steps.push('Schedule calls with interested clients');
        break;
      case 'client_matching':
        steps.push('Contact high-match clients immediately');
        steps.push('Schedule property viewings');
        steps.push('Prepare personalized proposals');
        break;
      case 'project_analytics':
        steps.push('Share analytics with development team');
        steps.push('Adjust marketing strategy based on insights');
        steps.push('Update pricing strategy if needed');
        break;
      default:
        steps.push('Review project status with team');
        steps.push('Plan next communication with clients');
    }
    
    return steps;
  }
}