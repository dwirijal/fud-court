import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: 'var(--space-4)',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'bg-primary': 'hsl(var(--bg-primary))',
        'bg-secondary': 'hsl(var(--bg-secondary))',
        'bg-tertiary': 'hsl(var(--bg-tertiary))',
        'bg-quaternary': 'hsl(var(--bg-quaternary))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',
        'text-quaternary': 'hsl(var(--text-quaternary))',
        'accent-primary': 'hsl(var(--accent-primary))',
        'accent-secondary': 'hsl(var(--accent-secondary))',
        'accent-tertiary': 'hsl(var(--accent-tertiary))',
        'market-up': 'hsl(var(--market-up))',
        'market-down': 'hsl(var(--market-down))',
        'market-neutral': 'hsl(var(--market-neutral))',
        'status-success': 'hsl(var(--status-success))',
        'status-warning': 'hsl(var(--status-warning))',
        'status-error': 'hsl(var(--status-error))',
        'status-info': 'hsl(var(--status-info))',
        'chart-1': 'hsl(var(--chart-color-1))',
        'chart-2': 'hsl(var(--chart-color-2))',
        'chart-3': 'hsl(var(--chart-color-3))',
        'chart-4': 'hsl(var(--chart-color-4))',
        'chart-5': 'hsl(var(--chart-color-5))',
        'chart-6': 'hsl(var(--chart-color-6))',
        'chart-7': 'hsl(var(--chart-color-7))',
        'chart-8': 'hsl(var(--chart-color-8))',
        
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--text-primary))',
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
      spacing: {
        '1': 'var(--space-1)', '2': 'var(--space-2)', '3': 'var(--space-3)',
        '4': 'var(--space-4)', '5': 'var(--space-5)', '6': 'var(--space-6)',
        '7': 'var(--space-7)', '8': 'var(--space-8)', '9': 'var(--space-9)',
        '10': 'var(--space-10)',
      },
      borderRadius: {
        '1': 'var(--radius-1)', 
        '2': 'var(--radius-2)', 
        '3': 'var(--radius-3)',
        '4': 'var(--radius-4)', 
        '5': 'var(--radius-5)', 
        'full': 'var(--radius-full)',
        lg: 'var(--radius-2)', // Default large radius
        md: 'var(--radius-2)', // Default medium radius
        sm: 'var(--radius-1)', // Default small radius
      },
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: '1.4' }],
        sm: ['var(--text-sm)', { lineHeight: '1.5' }],
        base: ['var(--text-base)', { lineHeight: '1.6' }],
        lg: ['var(--text-lg)', { lineHeight: '1.6' }],
        xl: ['var(--text-xl)', { lineHeight: '1.3' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.3' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '1.2' }],
        '5xl': ['var(--text-5xl)', { lineHeight: '1.1' }],
        '6xl': ['var(--text-6xl)', { lineHeight: '1.1' }],
      },
      fontFamily: {
        primary: 'var(--font-primary)',
        sans: 'var(--font-primary)',
        mono: 'var(--font-mono)',
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out-circ': 'var(--ease-out-circ)',
        'out-quart': 'var(--ease-out-quart)',
        'in-out-quart': 'var(--ease-in-out-quart)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
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
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        skeleton: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        pricePulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeInUp: 'fadeInUp var(--duration-slow) var(--ease-out-quart)',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
        pricePulse: 'pricePulse var(--duration-normal) ease-in-out',
        marquee: 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
