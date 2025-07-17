
'use client';

import React from 'react';

export default function DesignSystemPage() {
  return (
    <div className="container-full">
      <div className="section-spacing">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-6xl font-bold mb-4">Design System Showcase</h1>
          <p className="text-lg text-text-secondary">
            Comprehensive demonstration of the crypto finance app design system
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Typography</h2>
          
          <div className="card-primary p-5">
            <h3 className="text-3xl font-semibold mb-6">Headlines</h3>
            <div className="space-y-4">
              <h1 className="text-6xl font-bold">Headline 1 - Main Page Title</h1>
              <h2 className="text-5xl font-bold">Headline 2 - Section Title</h2>
              <h3 className="text-4xl font-semibold">Headline 3 - Subsection Title</h3>
              <h4 className="text-3xl font-semibold">Headline 4 - Card Title</h4>
              <h5 className="text-2xl font-semibold">Headline 5 - Component Title</h5>
              <h6 className="text-xl font-semibold">Headline 6 - Small Title</h6>
            </div>
          </div>

          <div className="card-primary mt-6 p-5">
            <h3 className="text-3xl font-semibold mb-6">Body Text & Numbers</h3>
            <div className="space-y-4">
              <p className="text-lg">Body Large - Important descriptive text with good readability</p>
              <p className="text-base">Body Regular - Standard body text for most content</p>
              <p className="text-sm">Body Small - Smaller descriptive text for less important information</p>
              
              <div className="pt-4 border-t border-bg-tertiary">
                <p className="text-sm font-medium mb-2">Caption Large - Larger metadata text</p>
                <p className="text-xs font-medium">Caption Regular - Small metadata and labels</p>
              </div>

              <div className="pt-4 border-t border-bg-tertiary">
                <div className="space-y-2">
                  <div className="font-mono text-2xl font-semibold">$42,350.25</div>
                  <div className="font-mono text-base font-medium">1,234.56 BTC</div>
                  <div className="font-mono text-sm font-medium">+2.5%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color System Section */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Color System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Background Colors */}
            <div className="card-primary p-5">
              <h4 className="text-xl font-semibold mb-4">Backgrounds</h4>
              <div className="space-y-3">
                <div className="bg-bg-primary border border-bg-tertiary p-3 rounded-2">
                  <span className="text-xs font-medium">Primary</span>
                </div>
                <div className="bg-bg-secondary p-3 rounded-2">
                  <span className="text-xs font-medium">Secondary</span>
                </div>
                <div className="bg-bg-tertiary p-3 rounded-2">
                  <span className="text-xs font-medium">Tertiary</span>
                </div>
                <div className="bg-bg-quaternary p-3 rounded-2">
                  <span className="text-xs font-medium">Quaternary</span>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="card-primary p-5">
              <h4 className="text-xl font-semibold mb-4">Accent Colors</h4>
              <div className="space-y-3">
                <div className="bg-accent-primary p-3 rounded-2">
                  <span className="text-xs font-medium text-white">Primary</span>
                </div>
                <div className="bg-accent-secondary p-3 rounded-2">
                  <span className="text-xs font-medium text-white">Secondary</span>
                </div>
                <div className="bg-accent-tertiary p-3 rounded-2">
                  <span className="text-xs font-medium text-gray-800">Tertiary</span>
                </div>
              </div>
            </div>

            {/* Market Colors */}
            <div className="card-primary p-5">
              <h4 className="text-xl font-semibold mb-4">Market Colors</h4>
              <div className="space-y-3">
                <div className="bg-market-up p-3 rounded-2">
                  <span className="text-xs font-medium text-white">Up +2.5%</span>
                </div>
                <div className="bg-market-down p-3 rounded-2">
                  <span className="text-xs font-medium text-white">Down -1.8%</span>
                </div>
                <div className="bg-market-neutral p-3 rounded-2">
                  <span className="text-xs font-medium text-white">Neutral 0.0%</span>
                </div>
              </div>
            </div>

            {/* Chart Colors */}
            <div className="card-primary p-5">
              <h4 className="text-xl font-semibold mb-4">Chart Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-chart-1 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">1</span>
                </div>
                <div className="bg-chart-2 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">2</span>
                </div>
                <div className="bg-chart-3 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">3</span>
                </div>
                <div className="bg-chart-4 p-2 rounded-1">
                  <span className="text-xs font-medium text-gray-800">4</span>
                </div>
                <div className="bg-chart-5 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">5</span>
                </div>
                <div className="bg-chart-6 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">6</span>
                </div>
                <div className="bg-chart-7 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">7</span>
                </div>
                <div className="bg-chart-8 p-2 rounded-1">
                  <span className="text-xs font-medium text-white">8</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Buttons</h2>
          
          <div className="card-primary p-5">
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-4">Button Variants</h4>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary focus-ring">
                    Primary Button
                  </button>
                  <button className="btn-secondary focus-ring">
                    Secondary Button
                  </button>
                  <button className="btn-ghost focus-ring">
                    Ghost Button
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Button States</h4>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary focus-ring" disabled>
                    Disabled Primary
                  </button>
                  <button className="btn-secondary focus-ring" disabled>
                    Disabled Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card Components */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-primary p-5">
              <h4 className="text-xl font-semibold mb-3">Primary Card</h4>
              <p className="text-base text-text-secondary mb-4">
                Standard card component for most content. Clean and minimal design.
              </p>
              <button className="btn-ghost">Learn More</button>
            </div>

            <div className="card-elevated p-5">
              <h4 className="text-xl font-semibold mb-3">Elevated Card</h4>
              <p className="text-base text-text-secondary mb-4">
                Elevated card with shadow for important content that needs emphasis.
              </p>
              <button className="btn-primary">Take Action</button>
            </div>

            <div className="card-news p-5">
              <h4 className="text-xl font-semibold mb-3">News Card</h4>
              <p className="text-base text-text-secondary mb-4">
                Specialized news card with hover effects and animations.
              </p>
              <div className="text-xs font-medium text-text-tertiary">
                2 hours ago
              </div>
            </div>
          </div>
        </section>

        {/* Price Display Components */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Price Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-primary p-5 text-center">
              <h4 className="text-xl font-semibold mb-4">Bitcoin</h4>
              <div className="price-display mb-2">
                $42,350.25
              </div>
              <div className="price-change positive">
                +2.5% (+$1,023.45)
              </div>
            </div>

            <div className="card-primary p-5 text-center">
              <h4 className="text-xl font-semibold mb-4">Ethereum</h4>
              <div className="price-display mb-2">
                $2,845.67
              </div>
              <div className="price-change negative">
                -1.8% (-$52.30)
              </div>
            </div>

            <div className="card-primary p-5 text-center">
              <h4 className="text-xl font-semibold mb-4">Cardano</h4>
              <div className="price-display mb-2">
                $0.4523
              </div>
              <div className="price-change neutral">
                0.0% ($0.00)
              </div>
            </div>
          </div>
        </section>

        {/* News Components */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">News Components</h2>
          
          <div className="space-y-4">
            <article className="news-item focus-ring" tabIndex={0}>
              <h3 className="news-item-title">
                Bitcoin Reaches New All-Time High Amid Institutional Adoption
              </h3>
              <p className="news-item-excerpt">
                The world&apos;s largest cryptocurrency has surged to unprecedented levels as major institutions
                continue to add Bitcoin to their balance sheets, signaling growing mainstream acceptance.
              </p>
              <div className="news-item-meta">
                <span>CoinDesk</span>
                <span>•</span>
                <span>2 hours ago</span>
                <span>•</span>
                <span>Finance</span>
              </div>
            </article>

            <article className="news-item focus-ring" tabIndex={0}>
              <h3 className="news-item-title">
                Ethereum 2.0 Staking Rewards Attract Record Investment
              </h3>
              <p className="news-item-excerpt">
                Ethereum&apos;s proof-of-stake consensus mechanism continues to draw significant investment
                as validators seek attractive yields in the current market environment.
              </p>
              <div className="news-item-meta">
                <span>The Block</span>
                <span>•</span>
                <span>4 hours ago</span>
                <span>•</span>
                <span>Technology</span>
              </div>
            </article>
          </div>
        </section>

        {/* Table Components */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Table Components</h2>
          
          <div className="table-container">
            <div className="table-header">
              Top Cryptocurrencies by Market Cap
            </div>
            
            <div className="table-row">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-tertiary">#1</span>
                <div>
                  <div className="text-xl font-semibold">Bitcoin</div>
                  <div className="text-xs font-medium text-text-secondary">BTC</div>
                </div>
              </div>
              <div className="text-right">
                <div className="table-cell-number">$42,350.25</div>
                <div className="table-cell-number table-cell-positive">+2.5%</div>
              </div>
            </div>

            <div className="table-row">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-tertiary">#2</span>
                <div>
                  <div className="text-xl font-semibold">Ethereum</div>
                  <div className="text-xs font-medium text-text-secondary">ETH</div>
                </div>
              </div>
              <div className="text-right">
                <div className="table-cell-number">$2,845.67</div>
                <div className="table-cell-number table-cell-negative">-1.8%</div>
              </div>
            </div>

            <div className="table-row">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-tertiary">#3</span>
                <div>
                  <div className="text-xl font-semibold">Cardano</div>
                  <div className="text-xs font-medium text-text-secondary">ADA</div>
                </div>
              </div>
              <div className="text-right">
                <div className="table-cell-number">$0.4523</div>
                <div className="table-cell-number table-cell-positive">+0.3%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Container */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Chart Components</h2>
          
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Bitcoin Price Chart</h3>
              <div className="chart-controls">
                <button className="btn-ghost">1D</button>
                <button className="btn-ghost">1W</button>
                <button className="btn-primary">1M</button>
                <button className="btn-ghost">3M</button>
                <button className="btn-ghost">1Y</button>
              </div>
            </div>
            
            {/* Placeholder for actual chart */}
            <div className="bg-bg-tertiary rounded-3 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-semibold mb-2">Chart Placeholder</div>
                <p className="text-xs font-medium text-text-secondary">
                  TradingView or Chart.js integration would go here
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Examples */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-primary p-5 text-center">
              <h4 className="text-xl font-semibold mb-4">Fade In Up</h4>
              <div className="animate-fadeInUp">
                <div className="bg-accent-primary p-4 rounded-3 text-white">
                  Animated Content
                </div>
              </div>
            </div>

            <div className="card-primary p-5 text-center">
              <h4 className="text-xl font-semibold mb-4">Skeleton Loading</h4>
              <div className="space-y-2">
                <div className="animate-skeleton bg-bg-tertiary h-4 rounded-2"></div>
                <div className="animate-skeleton bg-bg-tertiary h-4 rounded-2 w-3/4"></div>
                <div className="animate-skeleton bg-bg-tertiary h-4 rounded-2 w-1/2"></div>
              </div>
            </div>

            <div className="card-primary p-5 text-center">
              <h4 className="text-xl font-semibold mb-4">Price Pulse</h4>
              <div className="animate-pricePulse price-display text-market-up">
                $42,350.25
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Accessibility Features</h2>
          
          <div className="card-primary p-5">
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-4">Focus Management</h4>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-primary focus-ring">
                    Focusable Button
                  </button>
                  <a href="#" className="btn-secondary focus-ring">
                    Focusable Link
                  </a>
                  <input 
                    type="text" 
                    placeholder="Focusable input"
                    className="px-4 py-2 bg-bg-tertiary border border-bg-quaternary rounded-2 focus-ring"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Screen Reader Support</h4>
                <div className="space-y-2">
                  <p>
                    Price: $42,350.25 
                    <span className="sr-only">
                      Bitcoin current price is forty-two thousand three hundred fifty dollars and twenty-five cents
                    </span>
                  </p>
                  <p>
                    Change: <span className="text-market-up">+2.5%</span>
                    <span className="sr-only">
                      Price increased by two point five percent
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-4">Skip Navigation</h4>
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                <p className="text-xs font-medium text-text-secondary">
                  Tab to see the skip link (positioned off-screen until focused)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Layout */}
        <section className="mb-10">
          <h2 className="text-5xl font-bold mb-6">Responsive Layout</h2>
          
          <div className="card-primary p-5">
            <h4 className="text-xl font-semibold mb-4">Container & Spacing</h4>
            <p className="text-base text-text-secondary mb-4">
              This page uses the container-full and section-spacing classes for consistent
              responsive layout across all screen sizes.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="text-xs font-medium">Mobile: 1 col</div>
              </div>
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="text-xs font-medium">Tablet: 2 cols</div>
              </div>
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="text-xs font-medium">Desktop: 4 cols</div>
              </div>
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="text-xs font-medium">All responsive</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-10 border-t border-bg-tertiary">
          <p className="text-base text-text-secondary">
            This showcase demonstrates the complete crypto finance app design system
          </p>
          <p className="text-xs font-medium text-text-tertiary mt-2">
            Built with Tailwind CSS and CSS custom properties
          </p>
        </div>
      </div>
    </div>
  );
}
