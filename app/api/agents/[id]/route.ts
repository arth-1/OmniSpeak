import { NextRequest, NextResponse } from 'next/server';
import { agentCoordinator } from '../../../../lib/agents/agentCoordinator';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params;
    const agent = agentCoordinator.getAgent(id);
    
    if (!agent) {
      return NextResponse.json({
        success: false,
        error: 'Agent not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to get agent details'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const { action } = body;

    if (!action || !['activate', 'deactivate'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid action. Use "activate" or "deactivate"'
      }, { status: 400 });
    }

    const success = action === 'activate' 
      ? agentCoordinator.activateAgent(id)
      : agentCoordinator.deactivateAgent(id);

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Agent not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Agent ${action}d successfully`
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to update agent'
    }, { status: 500 });
  }
}