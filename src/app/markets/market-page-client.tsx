
'use client'

import { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { CurrencySwitcher } from '@/components/molecules/currency-switcher';

interface MarketPageClientProps {
    initialCurrency: string;
    initialSearch: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function MarketPageClient({ initialCurrency, initialSearch }: MarketPageClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const createQueryString = useCallback((params: Record<string, string | null>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        for (const [name, value] of Object.entries(params)) {
             if (value) {
                current.set(name, value);
            } else {
                current.delete(name);
            }
        }
        return current.toString();
    }, [searchParams]);

    useEffect(() => {
        const query = createQueryString({ search: debouncedSearchQuery || null });
        router.push(`${pathname}?${query}`);
    }, [debouncedSearchQuery, pathname, router, createQueryString]);

    const handleCurrencyChange = (value: string) => {
        const query = createQueryString({ currency: value });
        router.push(`${pathname}?${query}`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Cari koin..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full sm:w-auto"
            />
            <CurrencySwitcher 
                defaultValue={initialCurrency}
                onValueChange={handleCurrencyChange}
                className="w-full sm:w-auto"
            />
        </div>
    );
}
