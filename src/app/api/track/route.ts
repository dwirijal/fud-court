
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

const bodySchema = z.object({
  path: z.string().min(1),
});

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json({ message: 'Firebase not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    await addDoc(collection(db, "pageViews"), {
      path: parsed.data.path,
      timestamp: serverTimestamp()
    });

    return NextResponse.json({ message: 'OK' }, { status: 200 });
  } catch (error) {
    console.error('Failed to log page view:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: `Failed to log page view: ${message}` }, { status: 500 });
  }
}
