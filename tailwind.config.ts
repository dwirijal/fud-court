
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
    spacing: {
        '0': '0',
        'px': '1px',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.5rem',
        '6': '2rem',
        '7': '3rem',
        '8': '4rem',
        '9': '5rem',
        '10': '6rem',
        '11': 'var(--space-11)',
        '12': 'var(--space-12)',
        '14': 'var(--space-14)',
        '16': 'var(--space-16)',
    },
    borderRadius: {
      '1': 'var(--radius-1)', // 4px
      '2': 'var(--radius-2)', // 8px
      '3': 'var(--radius-3)', // 12px
      '4': 'var(--radius-4)', // 16px
      'full': 'var(--radius-full)',
      'DEFAULT': 'var(--radius-2)',
      'sm': 'var(--radius-1)',
      'md': 'var(--radius-2)',
      'lg': 'var(--radius-3)',
    },
    extend: {
      fontFamily: {
        primary: ['var(--font-primary)', 'sans-serif'],
        sans: ['var(--font-primary)', 'sans-serif'],
        headline: ['var(--font-primary)', 'sans-serif'],
        mono: 'var(--font-mono)',
      },
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
      typography: (theme: (path: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text-secondary'),
            '--tw-prose-headings': theme('colors.text-primary'),
            '--tw-prose-lead': theme('colors.text-secondary'),
            '--tw-prose-links': theme('colors.accent-primary'),
            '--tw-prose-bold': theme('colors.text-primary'),
            '--tw-prose-counters': theme('colors.text-tertiary'),
            '--tw-prose-bullets': theme('colors.text-tertiary'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.text-primary'),
            '--tw-prose-quote-borders': theme('colors.accent-primary'),
            '--tw-prose-captions': theme('colors.text-tertiary'),
            '--tw-prose-code': theme('colors.text-primary'),
            '--tw-prose-pre-code': theme('colors.text-primary'),
            '--tw-prose-pre-bg': theme('colors.bg-tertiary'),
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
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
          '-webkit-backface-visibility': 'hidden',
        },
      });
    },
  ],
};

export default config;
