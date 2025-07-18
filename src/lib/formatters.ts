/**
 * Formats a numeric value as a currency string.
 * Supports compact notation for large numbers and precise formatting for small decimals.
 * Handles USD, IDR, EUR, and XAU (Gold).
 *
 * @param value The numeric value to format.
 * @param currency The currency code (e.g., 'usd', 'idr', 'eur', 'xau'). Defaults to 'usd'.
 * @param compact Whether to use compact notation (e.g., '$1.2M'). Defaults to false.
 * @returns A formatted currency string, or 'N/A' if the value is invalid.
 */
export const formatCurrency = (
  value: number | null | undefined,
  currency: string = 'usd',
  compact: boolean = false
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }

  const getLocaleForCurrency = (cur: string) => {
    switch (cur.toLowerCase()) {
      case 'idr':
        return 'id-ID';
      case 'eur':
        return 'de-DE';
      case 'usd':
      default:
        return 'en-US';
    }
  };

  if (currency.toLowerCase() === 'xau') {
    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation: compact ? 'compact' : undefined,
      compactDisplay: compact ? 'short' : undefined,
    };
    return `XAU ${new Intl.NumberFormat('en-US', options).format(value)}`;
  }

  const locale = getLocaleForCurrency(currency);
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  if (compact) {
    options.notation = 'compact';
  } else if (Math.abs(value) > 0 && Math.abs(value) < 1) {
    // For prices like $0.000123, show more precision
    options.maximumFractionDigits = 6;
  }

  return new Intl.NumberFormat(locale, options).format(value);
};
