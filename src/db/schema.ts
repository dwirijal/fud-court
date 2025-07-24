/*
import { pgTable, text, timestamp, uniqueIndex, date, doublePrecision } from 'drizzle-orm/pg-core';

export const fredSeries = pgTable('fred_series', {
  id: text('id').primaryKey(), // FRED series ID, e.g., 'GDP'
  title: text('title').notNull(),
  units: text('units'),
  frequency: text('frequency'),
  seasonalAdjustment: text('seasonal_adjustment'),
  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
}, (fredSeries) => {
  return {
    idIndex: uniqueIndex('fred_series_id_idx').on(fredSeries.id),
  };
});

export const fredData = pgTable('fred_data', {
  seriesId: text('series_id').notNull().references(() => fredSeries.id),
  date: date('date').notNull(),
  value: doublePrecision('value').notNull(),
}, (fredData) => {
  return {
    seriesDateIndex: uniqueIndex('fred_data_series_date_idx').on(fredData.seriesId, fredData.date),
  };
});
*/