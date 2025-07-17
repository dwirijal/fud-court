
"use client"

import * as React from "react"
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const currencies = [
  { value: "usd", label: "USD ($)" },
  { value: "idr", label: "IDR (Rp)" },
  { value: "eur", label: "EUR (€)" },
  { value: "xau", label: "XAU (Emas)" },
]

interface CurrencySwitcherProps {
    defaultValue: string;
    className?: string;
}

export function CurrencySwitcher({ defaultValue, className }: CurrencySwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('currency', value);
    const search = current.toString();
    const query = search ? `?${search}` : "";
    // Use router.replace to avoid adding to history stack for a simple filter change
    router.replace(`${pathname}${query}`);
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={defaultValue}>
      <SelectTrigger className={cn("w-[140px]", className)} aria-label="Pilih Mata Uang">
        <SelectValue placeholder="Pilih Mata Uang" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
