import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'test_connection') {
      return NextResponse.json({
        success: true,
        message: 'Firebase connection test',
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error('Firebase initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Firebase initialization failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
