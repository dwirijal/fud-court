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
        'xs': 'var(--text-xs)',
        'sm': 'var(--text-sm)',
        'base': 'var(--text-base)',
        'lg': 'var(--text-lg)',
        'xl': 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
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
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        '1': 'var(--radius-1)',
        '2': 'var(--radius-2)',
        '3': 'var(--radius-3)',
        '4': 'var(--radius-4)',
        '5': 'var(--radius-5)',
        '6': 'var(--radius-6)',
        'full': 'var(--radius-full)',
        // Legacy support for ShadCN
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
        'fast': 'var(--duration-fast)',
        'normal': 'var(--duration-normal)',
        'slow': 'var(--duration-slow)',
        'slower': 'var(--duration-slower)',
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
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
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
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
        'fadeInUp': 'fadeInUp 0.5s var(--ease-out-quart)',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'pricePulse': 'pricePulse 0.6s ease-in-out',
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
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.container-full': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: 'var(--space-2)',
          paddingRight: 'var(--space-2)',
        },
        '.section-spacing': {
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-6)',
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
      };
      
      addUtilities(newUtilities, {
        respectPrefix: false,
        respectImportant: false,
      });
    },
  ],
} satisfies Config;
