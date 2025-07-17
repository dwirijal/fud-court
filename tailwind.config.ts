import type {Config} from 'tailwindcss';

export default {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "var(--space-4)",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        // Legacy support
        body: ['var(--font-primary)', 'sans-serif'],
        headline: ['var(--font-primary)', 'sans-serif'],
        code: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        'px': 'var(--space-px)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
        '9': 'var(--space-9)',
        '10': 'var(--space-10)',
        '11': 'var(--space-11)',
        '12': 'var(--space-12)',
        '14': 'var(--space-14)',
        '16': 'var(--space-16)',
      },
      colors: {
        // Background colors
        'bg-primary': 'hsl(var(--bg-primary))',
        'bg-secondary': 'hsl(var(--bg-secondary))',
        'bg-tertiary': 'hsl(var(--bg-tertiary))',
        'bg-glass': 'hsl(var(--bg-glass))',

        // Text colors
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',
        
        // Accent colors
        'accent-primary': 'hsl(var(--accent-primary))',

        // Market colors
        'market-up': 'hsl(var(--market-up))',
        'market-down': 'hsl(var(--market-down))',
        'market-neutral': 'hsl(var(--market-neutral))',
        
        // Chart colors
        'chart-1': 'hsl(var(--chart-1))',
        'chart-2': 'hsl(var(--chart-2))',
        'chart-3': 'hsl(var(--chart-3))',
        'chart-4': 'hsl(var(--chart-4))',
        'chart-5': 'hsl(var(--chart-5))',
        'chart-6': 'hsl(var(--chart-6))',
        'chart-7': 'hsl(var(--chart-7))',
        'chart-8': 'hsl(var(--chart-8))',
        
        // Legacy Tailwind support for ShadCN
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        '1': 'var(--radius-1)',
        '2': 'var(--radius-2)',
        '3': 'var(--radius-3)',
        '4': 'var(--radius-4)',
        'full': 'var(--radius-full)',
        // Legacy support for ShadCN
        lg: 'var(--radius-3)',
        md: 'var(--radius-2)',
        sm: 'var(--radius-1)',
      },
      transitionTimingFunction: {
        'out-quart': 'var(--ease-out-quart)',
      },
      transitionDuration: {
        'normal': 'var(--duration-normal)',
        'fast': 'var(--duration-fast)',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'marquee': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), 
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
