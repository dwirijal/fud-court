
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
  			'2xl': '1400px'
  		}
  	},
  	spacing: {
  		'0': '0',
  		'px': '1px',
  		'0.5': '0.25rem', /* 4px */
  		'1': '0.5rem', /* 8px */
  		'2': '1rem', /* 16px */
  		'3': '1.5rem', /* 24px */
  		'4': '2rem', /* 32px */
  		'5': '2.5rem', /* 40px */
  		'6': '3rem', /* 48px */
  		'7': '3.5rem', /* 56px */
  		'8': '4rem', /* 64px */
  		'9': '4.5rem', /* 72px */
  		'10': '5rem', /* 80px */
  		'11': '5.5rem', /* 88px */
  		'12': '6rem', /* 96px */
  		'14': '7rem', /* 112px */
  		'16': '8rem' /* 128px */
  	},
  	borderRadius: {
  		lg: 'var(--radius)',
  		md: 'calc(var(--radius) - 2px)',
  		sm: 'calc(var(--radius) - 4px)',
  	},
  	extend: {
  		fontFamily: {
  			primary: [
  				'var(--font-primary)',
  				'sans-serif'
  			],
  			sans: [
  				'var(--font-primary)',
  				'sans-serif'
  			],
  			headline: [
  				'var(--font-primary)',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.88rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			sm: [
  				'0.94rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			lg: [
  				'1.07rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			xl: [
  				'1.14rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			'2xl': [
  				'1.22rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
  			'3xl': [
  				'1.30rem',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			'4xl': [
  				'1.38rem',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			'5xl': [
  				'1.48rem',
  				{
  					lineHeight: '1.1'
  				}
  			],
  			'6xl': [
  				'1.57rem',
  				{
  					lineHeight: '1.0'
  				}
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
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
  			'chart-1': 'hsl(var(--chart-1))',
  			'chart-2': 'hsl(var(--chart-2))',
  			'chart-3': 'hsl(var(--chart-3))',
  			'chart-4': 'hsl(var(--chart-4))',
  			'chart-5': 'hsl(var(--chart-5))',
  			'chart-6': 'hsl(var(--chart-6))',
  			'chart-7': 'hsl(var(--chart-7))',
  			'chart-8': 'hsl(var(--chart-8))'
  		},
  		transitionTimingFunction: {
  			'out-expo': 'var(--ease-out-expo)',
  			'out-circ': 'var(--ease-out-circ)',
  			'out-quart': 'var(--ease-out-quart)',
  			'in-out-quart': 'var(--ease-in-out-quart)'
  		},
  		transitionDuration: {
  			fast: 'var(--duration-fast)',
  			normal: 'var(--duration-normal)',
  			slow: 'var(--duration-slow)',
  			slower: 'var(--duration-slower)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			fadeInUp: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			skeleton: {
  				'0%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.4'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			pricePulse: {
  				'0%': {
  					transform: 'scale(1)'
  				},
  				'50%': {
  					transform: 'scale(1.05)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(-50%)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			fadeInUp: 'fadeInUp var(--duration-slow) var(--ease-out-quart)',
  			skeleton: 'skeleton 1.5s ease-in-out infinite',
  			pricePulse: 'pricePulse var(--duration-normal) ease-in-out',
  			marquee: 'marquee 60s linear infinite'
  		}
  	}
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
