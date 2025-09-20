import { NextRequest, NextResponse } from 'next/server';
import { agentCoordinator } from '../../../lib/agents/agentCoordinator';

export async function GET() {
  try {
    const agents = agentCoordinator.getAgentStatus();
    return NextResponse.json({
      success: true,
      agents
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to get agent status'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, context, strategy = 'smart-routing' } = body;

    if (!task || !context) {
      return NextResponse.json({
        success: false,
        error: 'Task and context are required'
      }, { status: 400 });
    }

    const result = await agentCoordinator.executeTask(task, context, strategy);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to execute agent task'
    }, { status: 500 });
  }
}