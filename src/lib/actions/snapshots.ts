
'use server';

import { db } from '@/lib/db';
import { marketSnapshots } from '@/lib/db/schema';
import type { MarketAnalysisOutput } from '@/types';
import { desc, eq } from 'drizzle-orm';
import { startOfToday } from 'date-fns';

/**
 * Saves a market analysis snapshot to the database.
 * @param analysis The market analysis data to save.
 */
export async function saveMarketSnapshot(analysis: MarketAnalysisOutput) {
  if (!db) {
    console.warn('Database not configured. Skipping snapshot save.');
    return;
  }

  try {
    await db.insert(marketSnapshots).values({
      macroScore: analysis.macroScore,
      marketCapScore: analysis.components.marketCapScore,
      volumeScore: analysis.components.volumeScore,
      fearGreedScore: analysis.components.fearGreedScore,
      athScore: analysis.components.athScore,
      marketBreadthScore: analysis.components.marketBreadthScore,
    });
    console.log('Market snapshot saved successfully.');
  } catch (error) {
    console.error('Failed to save market snapshot:', error);
    // We don't throw here because failing to save a snapshot
    // shouldn't break the user-facing application.
  }
}

/**
 * Checks if a snapshot has already been saved for the current day.
 * @returns A promise that resolves to true if a snapshot exists, false otherwise.
 */
export async function hasTodaySnapshot(): Promise<boolean> {
    if (!db) {
        return false;
    }
    
    try {
        const today = startOfToday();
        const result = await db.query.marketSnapshots.findFirst({
            where: (snapshots, { gte }) => gte(snapshots.createdAt, today),
            columns: { id: true }
        });

        return !!result;
    } catch (error) {
        console.error('Failed to check for today\'s snapshot:', error);
        // Assume no snapshot on error to allow attempting a save.
        return false;
    }
}
