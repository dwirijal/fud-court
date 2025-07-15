'use client';

import { useSearchParams } from 'next/navigation';
import { CurrencySwitcher } from './currency-switcher';

export function CurrencySwitcherClient() {
  const searchParams = useSearchParams();
  const currency = searchParams?.get('currency')?.toLowerCase() || 'usd';

  return <CurrencySwitcher defaultValue={currency || 'usd'} />;
}