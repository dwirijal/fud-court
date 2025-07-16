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
      padding: "2rem",
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
      fontSize: {
        'xs': 'var(--text-xs)',     // 10.24px
        'sm': 'var(--text-sm)',     // 12.8px
        'base': 'var(--text-base)', // 16px
        'lg': 'var(--text-lg)',     // 20px
        'xl': 'var(--text-xl)',     // 25px
        '2xl': 'var(--text-2xl)',   // 31.25px
        '3xl': 'var(--text-3xl)',   // 39px
        '4xl': 'var(--text-4xl)',   // 48.8px
        '5xl': 'var(--text-5xl)',   // 61px
        '6xl': 'var(--text-6xl)',   // 76.3px
      },
      fontWeight: {
        light: 'var(--font-light)',       // 300
        normal: 'var(--font-regular)',    // 400
        medium: 'var(--font-medium)',     // 500
        semibold: 'var(--font-semibold)', // 600
        bold: 'var(--font-bold)',         // 700
        extrabold: 'var(--font-extrabold)', // 800
      },
      spacing: {
        '1': 'var(--space-1)',   // 4px
        '2': 'var(--space-2)',   // 8px
        '3': 'var(--space-3)',   // 12px
        '4': 'var(--space-4)',   // 16px
        '5': 'var(--space-5)',   // 24px
        '6': 'var(--space-6)',   // 36px
        '7': 'var(--space-7)',   // 54px
        '8': 'var(--space-8)',   // 81px
        '9': 'var(--space-9)',   // 121px
        '10': 'var(--space-10)', // 182px
      },
      colors: {
        // Background colors
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-quaternary': 'var(--bg-quaternary)',
        
        // Text colors
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-quaternary': 'var(--text-quaternary)',
        
        // Accent colors
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'accent-tertiary': 'var(--accent-tertiary)',
        
        // Secondary colors
        'secondary-primary': 'var(--secondary-primary)',
        'secondary-secondary': 'var(--secondary-secondary)',
        'secondary-tertiary': 'var(--secondary-tertiary)',
        
        // Tertiary colors
        'tertiary-primary': 'var(--tertiary-primary)',
        'tertiary-secondary': 'var(--tertiary-secondary)',
        'tertiary-tertiary': 'var(--tertiary-tertiary)',
        
        // Market colors
        'market-up': 'var(--market-up)',
        'market-down': 'var(--market-down)',
        'market-neutral': 'var(--market-neutral)',
        
        // Status colors
        'status-success': 'var(--status-success)',
        'status-warning': 'var(--status-warning)',
        'status-error': 'var(--status-error)',
        'status-info': 'var(--status-info)',
        
        // Chart colors
        'chart-1': 'var(--chart-color-1)',
        'chart-2': 'var(--chart-color-2)',
        'chart-3': 'var(--chart-color-3)',
        'chart-4': 'var(--chart-color-4)',
        'chart-5': 'var(--chart-color-5)',
        'chart-6': 'var(--chart-color-6)',
        'chart-7': 'var(--chart-color-7)',
        'chart-8': 'var(--chart-color-8)',
        
        // Legacy Tailwind support
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
      },
      borderRadius: {
        '1': 'var(--radius-1)',     // 2px
        '2': 'var(--radius-2)',     // 4px
        '3': 'var(--radius-3)',     // 8px
        '4': 'var(--radius-4)',     // 12px
        '5': 'var(--radius-5)',     // 16px
        '6': 'var(--radius-6)',     // 24px
        'full': 'var(--radius-full)', // 9999px
        // Legacy support
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'out-circ': 'var(--ease-out-circ)',
        'out-quart': 'var(--ease-out-quart)',
        'in-out-quart': 'var(--ease-in-out-quart)',
      },
      transitionDuration: {
        'fast': 'var(--duration-fast)',       // 0.15s
        'normal': 'var(--duration-normal)',   // 0.3s
        'slow': 'var(--duration-slow)',       // 0.5s
        'slower': 'var(--duration-slower)',   // 0.75s
      },
      screens: {
        'sm': '640px',   // --breakpoint-sm
        'md': '768px',   // --breakpoint-md
        'lg': '1024px',  // --breakpoint-lg
        'xl': '1280px',  // --breakpoint-xl
        '2xl': '1536px', // --breakpoint-2xl
      },
      keyframes: {
        // New design system animations
        'fadeInUp': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
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
        // Legacy animations
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-gradient': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'marquee': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        // New design system animations
        'fadeInUp': 'fadeInUp 0.5s var(--ease-out-quart)',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'pricePulse': 'pricePulse 0.6s ease-in-out',
        // Legacy animations
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-gradient': 'pulse-gradient 5s ease-in-out infinite',
        'marquee': 'marquee 180s linear infinite',
      },
      boxShadow: {
        'elevated': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'news-hover': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), 
    require('@tailwindcss/typography'),
    // Custom plugin for design system utilities
    function({ addUtilities, theme }: { addUtilities: any; theme: any }) {
      const newUtilities = {
        // Spacing utilities using design system tokens
        '.m-1': { margin: 'var(--space-1)' },
        '.m-2': { margin: 'var(--space-2)' },
        '.m-3': { margin: 'var(--space-3)' },
        '.m-4': { margin: 'var(--space-4)' },
        '.m-5': { margin: 'var(--space-5)' },
        '.m-6': { margin: 'var(--space-6)' },
        '.m-7': { margin: 'var(--space-7)' },
        '.m-8': { margin: 'var(--space-8)' },
        '.m-9': { margin: 'var(--space-9)' },
        '.m-10': { margin: 'var(--space-10)' },
        
        '.p-1': { padding: 'var(--space-1)' },
        '.p-2': { padding: 'var(--space-2)' },
        '.p-3': { padding: 'var(--space-3)' },
        '.p-4': { padding: 'var(--space-4)' },
        '.p-5': { padding: 'var(--space-5)' },
        '.p-6': { padding: 'var(--space-6)' },
        '.p-7': { padding: 'var(--space-7)' },
        '.p-8': { padding: 'var(--space-8)' },
        '.p-9': { padding: 'var(--space-9)' },
        '.p-10': { padding: 'var(--space-10)' },
        
        // Gap utilities
        '.gap-1': { gap: 'var(--space-1)' },
        '.gap-2': { gap: 'var(--space-2)' },
        '.gap-3': { gap: 'var(--space-3)' },
        '.gap-4': { gap: 'var(--space-4)' },
        '.gap-5': { gap: 'var(--space-5)' },
        '.gap-6': { gap: 'var(--space-6)' },
        '.gap-7': { gap: 'var(--space-7)' },
        '.gap-8': { gap: 'var(--space-8)' },
        '.gap-9': { gap: 'var(--space-9)' },
        '.gap-10': { gap: 'var(--space-10)' },
        
        // Layout utilities
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
        
        // Focus utilities
        '.focus-ring:focus': {
          outline: '2px solid var(--accent-primary)',
          outlineOffset: '2px',
        },
        
        // Screen reader utilities
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
      };
      
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
