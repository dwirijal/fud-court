import { updateCryptoExchangeRates } from '@/lib/coingecko';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await updateCryptoExchangeRates();
    return NextResponse.json({ message: 'Exchange rates updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return NextResponse.json({ message: 'Error updating exchange rates' }, { status: 500 });
  }
}
