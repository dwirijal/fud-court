
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
      fontFamily: {
        sans: ['var(--font-primary)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.3' }],      // 12px Caption
        'sm': ['0.875rem', { lineHeight: '1.4' }],   // 14px Body
        'base': ['1rem', { lineHeight: '1.5' }],     // 16px Body Large
        'lg': ['1.125rem', { lineHeight: '1.5' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.4' }],    // 20px H3
        '2xl': ['1.5rem', { lineHeight: '1.3' }],    // 24px H2
        '3xl': ['2rem', { lineHeight: '1.2' }],      // 32px H1
      },
      colors: {
        'bg-primary': 'hsl(var(--bg-primary))',
        'bg-secondary': 'hsl(var(--bg-secondary))',
        'bg-tertiary': 'hsl(var(--bg-tertiary))',
        'bg-quaternary': 'hsl(var(--bg-quaternary))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-tertiary': 'hsl(var(--text-tertiary))',
        
        'market-up': 'hsl(var(--market-up))',
        'market-down': 'hsl(var(--market-down))',
        'market-neutral': 'hsl(var(--market-neutral))',
        
        'status-success': 'hsl(var(--status-success))',
        'status-warning': 'hsl(var(--accent-tertiary))',
        'status-error': 'hsl(var(--status-error))',
        'status-info': 'hsl(var(--status-info))',
        'premium': 'hsl(var(--premium))',

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
        lg: 'var(--radius-4)',
        md: 'var(--radius-2)',
        sm: 'var(--radius-1)',
      },
      transitionTimingFunction: {
        'ease': 'var(--ease)',
        'ease-in': 'var(--ease-in)',
        'ease-out': 'var(--ease-out)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        medium: 'var(--duration-medium)',
        slow: 'var(--duration-slow)',
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
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        skeleton: {
          '0%': { backgroundColor: 'hsl(var(--bg-tertiary))' },
          '50%': { backgroundColor: 'hsl(var(--bg-quaternary))' },
          '100%': { backgroundColor: 'hsl(var(--bg-tertiary))' },
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
        fadeInUp: 'fadeInUp var(--duration-slow) var(--ease-out)',
        skeleton: 'skeleton 1.5s ease-in-out infinite',
        pricePulse: 'pricePulse var(--duration-medium) ease-in-out',
        marquee: 'marquee 60s linear infinite',
      },
      typography: (theme: (path: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text-secondary'),
            '--tw-prose-headings': theme('colors.text-primary'),
            '--tw-prose-lead': theme('colors.text-secondary'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.text-primary'),
            '--tw-prose-counters': theme('colors.text-tertiary'),
            '--tw-prose-bullets': theme('colors.text-tertiary'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.text-primary'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-captions': theme('colors.text-tertiary'),
            '--tw-prose-code': theme('colors.primary.DEFAULT'),
            '--tw-prose-pre-code': theme('colors.text-primary'),
            '--tw-prose-pre-bg': theme('colors.bg-secondary'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'), 
    require('@tailwindcss/typography'),
  ],
};

export default config;
