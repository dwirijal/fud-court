
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
<<<<<<< HEAD
      padding: "var(--space-4)",
      screens: {
        "2xl": "1400px",
=======
      padding: {
        DEFAULT: 'var(--space-4)',
        sm: 'var(--space-5)',
        lg: 'var(--space-6)',
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
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
      '1': 'var(--radius-1)',
      '2': 'var(--radius-2)',
      '3': 'var(--radius-3)',
      '4': 'var(--radius-4)',
      '5': 'var(--radius-5)',
      '6': 'var(--radius-6)',
      DEFAULT: 'var(--radius-3)',
      sm: 'var(--radius-2)',
      lg: 'var(--radius-4)',
      xl: 'var(--radius-5)',
      '2xl': 'var(--radius-6)',
      full: 'var(--radius-full)',
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
        primary: ['var(--font-primary)', 'sans-serif'],
        sans: ['var(--font-primary)', 'sans-serif'],
        headline: ['var(--font-primary)', 'sans-serif'],
        mono: 'var(--font-mono)',
        body: ['var(--font-primary)', 'sans-serif'],
        code: ['var(--font-mono)', 'monospace'],
      },
<<<<<<< HEAD
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
=======
      fontWeight: {
        light: 'var(--font-light)',
        regular: 'var(--font-regular)',
        normal: 'var(--font-regular)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
        extrabold: 'var(--font-extrabold)',
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-quaternary': 'var(--bg-quaternary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-quaternary': 'var(--text-quaternary)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-tertiary': 'var(--accent-tertiary)',
        'secondary-primary': 'var(--secondary-primary)',
        'secondary-secondary': 'var(--secondary-secondary)',
        'secondary-tertiary': 'var(--secondary-tertiary)',
        'tertiary-primary': 'var(--tertiary-primary)',
        'tertiary-secondary': 'var(--tertiary-secondary)',
        'tertiary-tertiary': 'var(--tertiary-tertiary)',
        'market-up': 'var(--market-up)',
        'market-down': 'var(--market-down)',
        'market-neutral': 'var(--market-neutral)',
        'status-success': 'var(--status-success)',
        'status-warning': 'var(--status-warning)',
        'status-error': 'var(--status-error)',
        'status-info': 'var(--status-info)',
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
        chart: {
          '1': 'var(--chart-color-1)',
          '2': 'var(--chart-color-2)',
          '3': 'var(--chart-color-3)',
          '4': 'var(--chart-color-4)',
          '5': 'var(--chart-color-5)',
          '6': 'var(--chart-color-6)',
          '7': 'var(--chart-color-7)',
          '8': 'var(--chart-color-8)',
        },
      },
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
      transitionTimingFunction: {
        'out-quart': 'var(--ease-out-quart)',
      },
      transitionDuration: {
<<<<<<< HEAD
        'normal': 'var(--duration-normal)',
        'fast': 'var(--duration-fast)',
=======
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
        'slower': 'var(--duration-slower)',
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
<<<<<<< HEAD
=======
        'fadeInUp': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
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
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
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
<<<<<<< HEAD
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 60s linear infinite',
=======
        'fadeInUp': 'fadeInUp 0.5s var(--ease-out-quart)',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'pricePulse': 'pricePulse 0.6s ease-in-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 60s linear infinite',
      },
      boxShadow: {
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'news-hover': '0 8px 32px rgba(0, 0, 0, 0.2)',
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), 
    require('@tailwindcss/typography'),
<<<<<<< HEAD
=======
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.perspective-1000': { perspective: '1000px' },
        '.preserve-3d': { transformStyle: 'preserve-3d' },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
          '-webkit-backface-visibility': 'hidden',
        },
        '.container-full': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'var(--space-4)',
          paddingRight: 'var(--space-4)',
        },
        '.section-spacing': {
          paddingTop: 'var(--space-8)',
          paddingBottom: 'var(--space-8)',
        },
        '.focus-ring:focus': {
          outline: '2px solid var(--accent-primary)',
          outlineOffset: '2px',
        },
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          border: '0',
        },
      });
    },
>>>>>>> b058873b045abf5277ae8797dcaa268e60af95fe
  ],
};

export default config;
