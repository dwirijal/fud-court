
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // The entire analytics feature is temporarily disabled.
  // This route will simply return OK without processing.
  return NextResponse.json({ message: 'Analytics disabled' }, { status: 200 });
}
