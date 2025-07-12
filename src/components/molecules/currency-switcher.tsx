
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
  { value: "usd", label: "USD" },
  { value: "idr", label: "IDR" },
  { value: "eur", label: "EUR" },
  { value: "xau", label: "XAU (Emas)" },
]

interface CurrencySwitcherProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export function CurrencySwitcher({ value, onValueChange, className }: CurrencySwitcherProps) {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className={cn("w-[120px]", className)}>
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
