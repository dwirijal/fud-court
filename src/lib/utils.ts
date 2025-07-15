import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function rgbToHex(rgb: string): string {
  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbMatch) {
    return rgb; // Return original if not in rgb(r, g, b) format
  }

  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const r = parseInt(rgbMatch[1]);
  const g = parseInt(rgbMatch[2]);
  const b = parseInt(rgbMatch[3]);

  return "#" + toHex(r) + toHex(g) + toHex(b);
}