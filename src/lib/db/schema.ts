import { pgTable, serial, text, timestamp, integer, real } from 'drizzle-orm/pg-core';

export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  path: text('path').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
});


export const marketSnapshots = pgTable('market_snapshots', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    macroScore: integer('macro_score').notNull(),
    marketCapScore: integer('market_cap_score').notNull(),
    volumeScore: integer('volume_score').notNull(),
    fearGreedScore: integer('fear_greed_score').notNull(),
    athScore: integer('ath_score').notNull(),
    marketBreadthScore: integer('market_breadth_score').notNull(),
});
