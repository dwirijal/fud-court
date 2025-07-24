/*
import { NextRequest, NextResponse } from 'next/server';
import { FredClient } from '../../../../lib/api-clients/economics/fred';
import { db } from '../../../../src/db';
import { fredSeries, fredData } from '../../../../src/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { seriesId, startDate, endDate } = await req.json();

    if (!seriesId) {
      return NextResponse.json({ error: 'seriesId is required' }, { status: 400 });
    }

    const fredApiKey = process.env.FRED_API_KEY;
    if (!fredApiKey) {
      return NextResponse.json({ error: 'FRED_API_KEY is not set' }, { status: 500 });
    }

    const fredClient = new FredClient({ apiKey: fredApiKey });

    // Fetch series metadata
    const seriesResponse = await fredClient.getSeries(seriesId);
    const series = seriesResponse.series[0];

    if (!series) {
      return NextResponse.json({ error: `Series with ID ${seriesId} not found` }, { status: 404 });
    }

    // Upsert series metadata
    await db.insert(fredSeries)
      .values({
        id: series.id,
        title: series.title,
        units: series.units,
        frequency: series.frequency,
        seasonalAdjustment: series.seasonal_adjustment,
        lastUpdated: new Date(series.last_updated),
      })
      .onConflictDoUpdate({
        target: fredSeries.id,
        set: {
          title: series.title,
          units: series.units,
          frequency: series.frequency,
          seasonalAdjustment: series.seasonal_adjustment,
          lastUpdated: new Date(series.last_updated),
        },
      });

    // Fetch series observations
    const observationsResponse = await fredClient.getSeriesObservations(seriesId, {
      observation_start: startDate,
      observation_end: endDate,
    });

    const observations = observationsResponse.observations;

    if (observations.length === 0) {
      return NextResponse.json({ message: `No observations found for series ${seriesId}` });
    }

    // Insert observations, handling duplicates
    const dataToInsert = observations.map(obs => ({
      seriesId: series.id,
      date: new Date(obs.date),
      value: parseFloat(obs.value),
    })).filter(data => !isNaN(data.value)); // Filter out observations with non-numeric values

    if (dataToInsert.length > 0) {
      await db.insert(fredData)
        .values(dataToInsert)
        .onConflictDoNothing({
          target: [fredData.seriesId, fredData.date],
        });
    }

    return NextResponse.json({ message: `Successfully ingested data for series ${seriesId}`, count: dataToInsert.length });
  } catch (error) {
    console.error('Error ingesting FRED data:', error);
    return NextResponse.json({ error: 'Failed to ingest FRED data' }, { status: 500 });
  }
}
*/