"use client"

import * as React from "react"
<<<<<<< HEAD
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
=======
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
>>>>>>> 0a4e7b910a97992556e7397d3b7dce1417bc2d19

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
