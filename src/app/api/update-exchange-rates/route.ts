import { NextResponse } from 'next/server';
import { CoinGeckoAPI } from '@/lib/api-clients/crypto';

export async function GET() {
  try {
    const coinGeckoClient = new CoinGeckoAPI();
    const exchangeRates = await coinGeckoClient.getSimplePrice({
      ids: 'bitcoin,ethereum',
      vs_currencies: 'usd,eur',
      include_24hr_change: true,
    });
    console.log('Fetched exchange rates:', exchangeRates);
    return NextResponse.json({ message: 'Exchange rates fetched successfully', data: exchangeRates }, { status: 200 });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json({ message: 'Error fetching exchange rates' }, { status: 500 });
  }
}
