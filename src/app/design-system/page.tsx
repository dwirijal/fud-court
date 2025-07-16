'use client';

import React from 'react';

export default function DesignSystemPage() {
  return (
    <div className="container-full">
      <div className="section-spacing">
        {/* Header */}
        <div className="mb-10">
          <h1 className="headline-1 mb-4">Design System Showcase</h1>
          <p className="body-large text-text-secondary">
            Comprehensive demonstration of the crypto finance app design system
          </p>
        </div>

        {/* Typography Section */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Typography</h2>
          
          <div className="card-primary">
            <h3 className="headline-4 mb-6">Headlines</h3>
            <div className="space-y-4">
              <h1 className="headline-1">Headline 1 - Main Page Title</h1>
              <h2 className="headline-2">Headline 2 - Section Title</h2>
              <h3 className="headline-3">Headline 3 - Subsection Title</h3>
              <h4 className="headline-4">Headline 4 - Card Title</h4>
              <h5 className="headline-5">Headline 5 - Component Title</h5>
              <h6 className="headline-6">Headline 6 - Small Title</h6>
            </div>
          </div>

          <div className="card-primary mt-6">
            <h3 className="headline-4 mb-6">Body Text & Numbers</h3>
            <div className="space-y-4">
              <p className="body-large">Body Large - Important descriptive text with good readability</p>
              <p className="body-regular">Body Regular - Standard body text for most content</p>
              <p className="body-small">Body Small - Smaller descriptive text for less important information</p>
              
              <div className="pt-4 border-t border-bg-tertiary">
                <p className="caption-large mb-2">Caption Large - Larger metadata text</p>
                <p className="caption-regular">Caption Regular - Small metadata and labels</p>
              </div>

              <div className="pt-4 border-t border-bg-tertiary">
                <div className="space-y-2">
                  <div className="number-large">$42,350.25</div>
                  <div className="number-regular">1,234.56 BTC</div>
                  <div className="number-small">+2.5%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color System Section */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Color System</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Background Colors */}
            <div className="card-primary">
              <h4 className="headline-6 mb-4">Backgrounds</h4>
              <div className="space-y-3">
                <div className="bg-bg-primary border border-bg-tertiary p-3 rounded-2">
                  <span className="caption-regular">Primary</span>
                </div>
                <div className="bg-bg-secondary p-3 rounded-2">
                  <span className="caption-regular">Secondary</span>
                </div>
                <div className="bg-bg-tertiary p-3 rounded-2">
                  <span className="caption-regular">Tertiary</span>
                </div>
                <div className="bg-bg-quaternary p-3 rounded-2">
                  <span className="caption-regular">Quaternary</span>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div className="card-primary">
              <h4 className="headline-6 mb-4">Accent Colors</h4>
              <div className="space-y-3">
                <div className="bg-accent-primary p-3 rounded-2">
                  <span className="caption-regular text-white">Primary</span>
                </div>
                <div className="bg-accent-secondary p-3 rounded-2">
                  <span className="caption-regular text-white">Secondary</span>
                </div>
                <div className="bg-accent-tertiary p-3 rounded-2">
                  <span className="caption-regular text-gray-800">Tertiary</span>
                </div>
              </div>
            </div>

            {/* Market Colors */}
            <div className="card-primary">
              <h4 className="headline-6 mb-4">Market Colors</h4>
              <div className="space-y-3">
                <div className="bg-market-up p-3 rounded-2">
                  <span className="caption-regular text-white">Up +2.5%</span>
                </div>
                <div className="bg-market-down p-3 rounded-2">
                  <span className="caption-regular text-white">Down -1.8%</span>
                </div>
                <div className="bg-market-neutral p-3 rounded-2">
                  <span className="caption-regular text-white">Neutral 0.0%</span>
                </div>
              </div>
            </div>

            {/* Chart Colors */}
            <div className="card-primary">
              <h4 className="headline-6 mb-4">Chart Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-chart-1 p-2 rounded-1">
                  <span className="caption-regular text-white">1</span>
                </div>
                <div className="bg-chart-2 p-2 rounded-1">
                  <span className="caption-regular text-white">2</span>
                </div>
                <div className="bg-chart-3 p-2 rounded-1">
                  <span className="caption-regular text-white">3</span>
                </div>
                <div className="bg-chart-4 p-2 rounded-1">
                  <span className="caption-regular text-gray-800">4</span>
                </div>
                <div className="bg-chart-5 p-2 rounded-1">
                  <span className="caption-regular text-white">5</span>
                </div>
                <div className="bg-chart-6 p-2 rounded-1">
                  <span className="caption-regular text-white">6</span>
                </div>
                <div className="bg-chart-7 p-2 rounded-1">
                  <span className="caption-regular text-white">7</span>
                </div>
                <div className="bg-chart-8 p-2 rounded-1">
                  <span className="caption-regular text-white">8</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Button Components */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Buttons</h2>
          
          <div className="card-primary">
            <div className="space-y-6">
              <div>
                <h4 className="headline-6 mb-4">Button Variants</h4>
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
                <h4 className="headline-6 mb-4">Button States</h4>
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
          <h2 className="headline-2 mb-6">Cards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-primary">
              <h4 className="headline-6 mb-3">Primary Card</h4>
              <p className="body-regular text-text-secondary mb-4">
                Standard card component for most content. Clean and minimal design.
              </p>
              <button className="btn-ghost">Learn More</button>
            </div>

            <div className="card-elevated">
              <h4 className="headline-6 mb-3">Elevated Card</h4>
              <p className="body-regular text-text-secondary mb-4">
                Elevated card with shadow for important content that needs emphasis.
              </p>
              <button className="btn-primary">Take Action</button>
            </div>

            <div className="card-news">
              <h4 className="headline-6 mb-3">News Card</h4>
              <p className="body-regular text-text-secondary mb-4">
                Specialized news card with hover effects and animations.
              </p>
              <div className="caption-regular text-text-tertiary">
                2 hours ago
              </div>
            </div>
          </div>
        </section>

        {/* Price Display Components */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Price Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-primary text-center">
              <h4 className="headline-6 mb-4">Bitcoin</h4>
              <div className="price-display mb-2">
                $42,350.25
              </div>
              <div className="price-change positive">
                +2.5% (+$1,023.45)
              </div>
            </div>

            <div className="card-primary text-center">
              <h4 className="headline-6 mb-4">Ethereum</h4>
              <div className="price-display mb-2">
                $2,845.67
              </div>
              <div className="price-change negative">
                -1.8% (-$52.30)
              </div>
            </div>

            <div className="card-primary text-center">
              <h4 className="headline-6 mb-4">Cardano</h4>
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
          <h2 className="headline-2 mb-6">News Components</h2>
          
          <div className="space-y-4">
            <article className="news-item focus-ring" tabIndex={0}>
              <h3 className="news-item-title">
                Bitcoin Reaches New All-Time High Amid Institutional Adoption
              </h3>
              <p className="news-item-excerpt">
                The world's largest cryptocurrency has surged to unprecedented levels as major institutions
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
                Ethereum's proof-of-stake consensus mechanism continues to draw significant investment
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
          <h2 className="headline-2 mb-6">Table Components</h2>
          
          <div className="table-container">
            <div className="table-header">
              Top Cryptocurrencies by Market Cap
            </div>
            
            <div className="table-row">
              <div className="flex items-center gap-3">
                <span className="caption-regular text-text-tertiary">#1</span>
                <div>
                  <div className="headline-6">Bitcoin</div>
                  <div className="caption-regular text-text-secondary">BTC</div>
                </div>
              </div>
              <div className="text-right">
                <div className="table-cell-number">$42,350.25</div>
                <div className="table-cell-number table-cell-positive">+2.5%</div>
              </div>
            </div>

            <div className="table-row">
              <div className="flex items-center gap-3">
                <span className="caption-regular text-text-tertiary">#2</span>
                <div>
                  <div className="headline-6">Ethereum</div>
                  <div className="caption-regular text-text-secondary">ETH</div>
                </div>
              </div>
              <div className="text-right">
                <div className="table-cell-number">$2,845.67</div>
                <div className="table-cell-number table-cell-negative">-1.8%</div>
              </div>
            </div>

            <div className="table-row">
              <div className="flex items-center gap-3">
                <span className="caption-regular text-text-tertiary">#3</span>
                <div>
                  <div className="headline-6">Cardano</div>
                  <div className="caption-regular text-text-secondary">ADA</div>
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
          <h2 className="headline-2 mb-6">Chart Components</h2>
          
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
                <div className="headline-6 mb-2">Chart Placeholder</div>
                <p className="caption-regular text-text-secondary">
                  TradingView or Chart.js integration would go here
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Examples */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-primary text-center">
              <h4 className="headline-6 mb-4">Fade In Up</h4>
              <div className="animate-fadeInUp">
                <div className="bg-accent-primary p-4 rounded-3 text-white">
                  Animated Content
                </div>
              </div>
            </div>

            <div className="card-primary text-center">
              <h4 className="headline-6 mb-4">Skeleton Loading</h4>
              <div className="space-y-2">
                <div className="animate-skeleton bg-bg-tertiary h-4 rounded-2"></div>
                <div className="animate-skeleton bg-bg-tertiary h-4 rounded-2 w-3/4"></div>
                <div className="animate-skeleton bg-bg-tertiary h-4 rounded-2 w-1/2"></div>
              </div>
            </div>

            <div className="card-primary text-center">
              <h4 className="headline-6 mb-4">Price Pulse</h4>
              <div className="animate-pricePulse price-display text-market-up">
                $42,350.25
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Accessibility Features</h2>
          
          <div className="card-primary">
            <div className="space-y-6">
              <div>
                <h4 className="headline-6 mb-4">Focus Management</h4>
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
                    className="px-4 py-2 bg-bg-tertiary border border-bg-quaternary rounded-3 focus-ring"
                  />
                </div>
              </div>

              <div>
                <h4 className="headline-6 mb-4">Screen Reader Support</h4>
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
                <h4 className="headline-6 mb-4">Skip Navigation</h4>
                <a href="#main-content" className="skip-link">
                  Skip to main content
                </a>
                <p className="caption-regular text-text-secondary">
                  Tab to see the skip link (positioned off-screen until focused)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Layout */}
        <section className="mb-10">
          <h2 className="headline-2 mb-6">Responsive Layout</h2>
          
          <div className="card-primary">
            <h4 className="headline-6 mb-4">Container & Spacing</h4>
            <p className="body-regular text-text-secondary mb-4">
              This page uses the container-full and section-spacing classes for consistent
              responsive layout across all screen sizes.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="caption-regular">Mobile: 1 col</div>
              </div>
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="caption-regular">Tablet: 2 cols</div>
              </div>
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="caption-regular">Desktop: 4 cols</div>
              </div>
              <div className="bg-bg-tertiary p-4 rounded-3 text-center">
                <div className="caption-regular">All responsive</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-10 border-t border-bg-tertiary">
          <p className="body-regular text-text-secondary">
            This showcase demonstrates the complete crypto finance app design system
          </p>
          <p className="caption-regular text-text-tertiary mt-2">
            Built with Tailwind CSS and CSS custom properties
          </p>
        </div>
      </div>
    </div>
  );
}
