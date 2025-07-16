import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: 'var(--space-4)',
        sm: 'var(--space-5)',
        lg: 'var(--space-6)',
      },
    },
    spacing: {
      '0': '0px',
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
    },
    borderRadius: {
      sm: 'var(--radius-2)',
      md: 'var(--radius-3)',
      lg: 'var(--radius-4)',
      xl: 'var(--radius-5)',
      '2xl': 'var(--radius-6)',
      full: 'var(--radius-full)',
      DEFAULT: 'var(--radius-3)',
    },
    fontSize: {
      xs: ['var(--text-xs)', { lineHeight: '1.4' }],
      sm: ['var(--text-sm)', { lineHeight: '1.5' }],
      base: ['var(--text-base)', { lineHeight: '1.6' }],
      lg: ['var(--text-lg)', { lineHeight: '1.6' }],
      xl: ['var(--text-xl)', { lineHeight: '1.6' }],
      '2xl': ['var(--text-2xl)', { lineHeight: '1.4' }],
      '3xl': ['var(--text-3xl)', { lineHeight: '1.3' }],
      '4xl': ['var(--text-4xl)', { lineHeight: '1.2' }],
      '5xl': ['var(--text-5xl)', { lineHeight: '1.1' }],
      '6xl': ['var(--text-6xl)', { lineHeight: '1.1' }],
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-primary)', 'sans-serif'],
        headline: ['var(--font-primary)', 'sans-serif'],
        mono: 'var(--font-mono)',
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        primary: {
          DEFAULT: 'var(--accent-primary)',
          foreground: 'var(--text-primary)',
        },
        secondary: {
          DEFAULT: 'var(--bg-tertiary)',
          foreground: 'var(--text-primary)',
        },
        destructive: {
          DEFAULT: 'var(--status-error)',
          foreground: 'var(--text-primary)',
        },
        muted: {
          DEFAULT: 'var(--bg-tertiary)',
          foreground: 'var(--text-secondary)',
        },
        accent: {
          DEFAULT: 'var(--bg-quaternary)',
          foreground: 'var(--text-primary)',
        },
        popover: {
          DEFAULT: 'var(--bg-secondary)',
          foreground: 'var(--text-primary)',
        },
        card: {
          DEFAULT: 'var(--bg-secondary)',
          foreground: 'var(--text-primary)',
        },
        'market-up': 'var(--market-up)',
        'market-down': 'var(--market-down)',
        chart: {
          '1': 'var(--chart-color-1)',
          '2': 'var(--chart-color-2)',
          '3': 'var(--chart-color-3)',
          '4': 'var(--chart-color-4)',
          '5': 'var(--chart-color-5)',
        },
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
        'fadeInUp': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'skeleton': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        'pricePulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'marquee': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fadeInUp': 'fadeInUp 0.5s ease-out',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'pricePulse': 'pricePulse 0.6s ease-in-out',
        'marquee': 'marquee 60s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography'),
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
