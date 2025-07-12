
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  path: z.string().min(1),
});

export async function POST(request: Request) {
  // The entire analytics feature is temporarily disabled.
  // This route will simply return OK without processing.
  return NextResponse.json({ message: 'Analytics disabled' }, { status: 200 });
}
