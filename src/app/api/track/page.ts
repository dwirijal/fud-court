
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews } from '@/lib/db/schema';
import { z } from 'zod';

const bodySchema = z.object({
  path: z.string().min(1),
});

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    await db.insert(pageViews).values({ path: parsed.data.path });

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Failed to log page view:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: `Failed to log page view: ${message}` }, { status: 500 });
  }
}
