import { NextRequest, NextResponse } from 'next/server';
import { agentCoordinator } from '../../../../lib/agents/agentCoordinator';

export async function GET() {
  try {
    const tasks = agentCoordinator.getTaskHistory();
    return NextResponse.json({
      success: true,
      tasks: tasks.slice(0, 50) // Return last 50 tasks
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to get task history'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, trigger, agents, schedule } = body;

    if (!name || !trigger || !agents) {
      return NextResponse.json({
        success: false,
        error: 'Name, trigger, and agents are required'
      }, { status: 400 });
    }

    const result = await agentCoordinator.setupAutomatedWorkflow({
      name,
      trigger,
      agents,
      schedule
    });

    return NextResponse.json({
      success: true,
      workflow: result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to setup automated workflow'
    }, { status: 500 });
  }
}