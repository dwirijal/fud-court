
"use client"

import * as React from "react"
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
    onValueChange: (value: string) => void;
}

export function CurrencySwitcher({ defaultValue, className, onValueChange }: CurrencySwitcherProps) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
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
