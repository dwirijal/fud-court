# Crypto Finance App Design System Documentation

## Overview

This document provides comprehensive guidelines for using the newly implemented design system for the crypto finance application. The design system follows Apple Human Interface Guidelines with modern crypto/finance specific adaptations, featuring a dark-first approach with pure black backgrounds and pastel red accents.

## 🎨 Color System

### Usage in Components

```jsx
// Background colors
<div className="bg-bg-primary">      {/* Pure black in dark mode */}
<div className="bg-bg-secondary">    {/* Secondary surfaces */}
<div className="bg-bg-tertiary">     {/* Elevated surfaces */}
<div className="bg-bg-quaternary">   {/* Interactive elements */}

// Text colors
<h1 className="text-text-primary">   {/* Primary text - white in dark */}
<p className="text-text-secondary">  {/* Secondary text - muted */}
<span className="text-text-tertiary">{/* Subtle/disabled text */}

// Accent colors
<button className="bg-accent-primary">{/* Main pastel red accent */}
<button className="bg-accent-secondary">{/* Lighter variant */}

// Market colors (for price indicators)
<span className="text-market-up">    {/* Green for gains */}
<span className="text-market-down">  {/* Red for losses */}
<span className="text-market-neutral">{/* Gray for no change */}
```

### CSS Variables

All colors are available as CSS variables:

```css
/* Use in custom CSS */
.my-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--bg-tertiary);
}
```

## 📐 Typography System

### Typography Classes

The design system includes semantic typography classes based on a **Major Second (1.125)** modular scale.

```jsx
// Headlines
<h1 className="headline-1">Main Page Title</h1>
<h2 className="headline-2">Section Title</h2>
<h3 className="headline-3">Subsection Title</h3>
<h4 className="headline-4">Card Title</h4>
<h5 className="headline-5">Component Title</h5>
<h6 className="headline-6">Small Title</h6>

// Body text
<p className="body-large">Important descriptive text</p>
<p className="body-regular">Standard body text</p>
<p className="body-small">Small descriptive text</p>

// Captions
<span className="caption-large">Large metadata</span>
<span className="caption-regular">Small metadata</span>

// Numbers (for prices and data)
<span className="number-large">$42,350.25</span>
<span className="number-regular">1.25%</span>
<span className="number-small">24h</span>
```

### Font Families

```jsx
// Primary font (Plus Jakarta Sans)
<p className="font-primary">Most text uses this</p>

// Monospace font (for numbers/code)
<span className="font-mono">$1,234.56</span>
```

## 📏 Spacing System

### Modular Spacing Scale

The system uses a 1.5 ratio (Perfect Fifth) for spacing:

```jsx
// Padding
<div className="p-1">   {/* 4px */}
<div className="p-2">   {/* 8px */}
<div className="p-3">   {/* 12px */}
<div className="p-4">   {/* 16px */}
<div className="p-5">   {/* 24px */}
<div className="p-6">   {/* 36px */}
<div className="p-7">   {/* 54px */}
<div className="p-8">   {/* 81px */}

// Margin
<div className="m-4">   {/* 16px */}
<div className="mb-5">  {/* 24px bottom margin */}

// Gap (for flexbox/grid)
<div className="flex gap-3">  {/* 12px gap */}
<div className="grid gap-4"> {/* 16px gap */}
```

## 🏗️ Component Patterns

### Card Components

Pre-built card classes for consistent styling:

```jsx
// Primary card (most common)
<div className="card-primary">
  <h3>Card Title</h3>
  <p>Card content...</p>
</div>

// Elevated card (with shadow)
<div className="card-elevated">
  <h3>Important Card</h3>
  <p>Elevated content...</p>
</div>

// News card (with hover effects)
<div className="card-news">
  <h4>News Headline</h4>
  <p>News excerpt...</p>
</div>
```

### Button Components

```jsx
// Primary action button
<button className="btn-primary">
  Buy Now
</button>

// Secondary action button
<button className="btn-secondary">
  View Details
</button>

// Ghost/subtle button
<button className="btn-ghost">
  Cancel
</button>
```

### Price Display Components

Specialized classes for financial data:

```jsx
// Large price display
<div className="price-display">
  $42,350.25
</div>

// Price change indicators
<div className="price-change positive">
  +2.5%
</div>

<div className="price-change negative">
  -1.8%
</div>

<div className="price-change neutral">
  0.0%
</div>
```

### News Components

```jsx
<article className="news-item">
  <h3 className="news-item-title">
    Bitcoin Reaches New All-Time High
  </h3>
  <p className="news-item-excerpt">
    The cryptocurrency market sees significant movement...
  </p>
  <div className="news-item-meta">
    <span>CoinDesk</span>
    <span>2 hours ago</span>
  </div>
</article>
```

### Table Components

```jsx
<div className="table-container">
  <div className="table-header">
    Cryptocurrency Prices
  </div>
  <div className="table-row">
    <span>Bitcoin</span>
    <span className="table-cell-number table-cell-positive">
      $42,350.25
    </span>
  </div>
</div>
```

### Chart Components

```jsx
<div className="chart-container">
  <div className="chart-header">
    <h3 className="chart-title">Bitcoin Price Chart</h3>
    <div className="chart-controls">
      <button className="btn-ghost">1D</button>
      <button className="btn-ghost">1W</button>
      <button className="btn-primary">1M</button>
    </div>
  </div>
  {/* Chart content */}
</div>
```

## 🎬 Animation System

### CSS Classes with Animations

```jsx
// Fade in from bottom
<div className="animate-fadeInUp">
  Content that fades in
</div>

// Loading skeleton
<div className="animate-skeleton">
  Loading placeholder
</div>

// Price change pulse
<span className="animate-pricePulse">
  $42,350.25
</span>
```

### Custom Animations

```css
/* Use timing functions */
.my-transition {
  transition: all var(--duration-normal) var(--ease-out-quart);
}

/* Custom animation with design system timing */
.my-hover:hover {
  transform: translateY(-2px);
  transition: transform var(--duration-fast) var(--ease-out-expo);
}
```

## 📱 Responsive Design

### Breakpoints

```jsx
// Responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>

<div className="text-base lg:text-lg">
  {/* Responsive text size */}
</div>
```

### Container and Layout

```jsx
// Full-width container with responsive padding
<div className="container-full">
  <div className="section-spacing">
    {/* Content with proper spacing */}
  </div>
</div>
```

## ♿ Accessibility Features

### Focus Management

```jsx
// Add focus rings to interactive elements
<button className="btn-primary focus-ring">
  Accessible Button
</button>

// Screen reader only text
<span className="sr-only">
  Screen reader description
</span>
```

### Skip Navigation

```jsx
// Add at the beginning of layout
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

## 📊 Chart Color Palette

For data visualization, use the predefined chart colors:

```jsx
// Tailwind classes
<div className="bg-chart-1">   {/* Pastel red */}
<div className="bg-chart-2">   {/* Teal */}
<div className="bg-chart-3">   {/* Blue */}
<div className="bg-chart-4">   {/* Yellow */}

// CSS variables
const chartColors = [
  'var(--chart-color-1)', // #ff6b6b
  'var(--chart-color-2)', // #4ecdc4
  'var(--chart-color-3)', // #45b7d1
  'var(--chart-color-4)', // #f9ca24
  'var(--chart-color-5)', // #f0932b
  'var(--chart-color-6)', // #eb4d4b
  'var(--chart-color-7)', // #6c5ce7
  'var(--chart-color-8)', // #a29bfe
];
```

## 🎯 Best Practices

### Do's

✅ **Use semantic classes**: Prefer `headline-3` over `text-3xl font-semibold`
✅ **Consistent spacing**: Use the modular scale (p-4, m-5, gap-3)
✅ **Market colors**: Use `market-up`, `market-down`, `market-neutral` for financial data
✅ **Focus accessibility**: Always add `focus-ring` to interactive elements
✅ **Monospace for numbers**: Use `font-mono` for prices and percentages

### Don'ts

❌ **Avoid arbitrary values**: Don't use `p-[13px]`, use scale values
❌ **Don't mix color systems**: Stick to design system colors
❌ **Avoid inline styles**: Use CSS classes and variables
❌ **Don't ignore accessibility**: Always consider screen readers and keyboard navigation

## 🔧 Implementation Examples

### Crypto Card Component

```jsx
function CryptoCard({ symbol, name, price, change, isPositive }) {
  return (
    <div className="card-primary hover:card-elevated transition-all duration-normal">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="headline-6">{name}</h4>
          <p className="caption-regular text-text-secondary">{symbol}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="price-display">
          ${price.toLocaleString()}
        </div>
        <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
    </div>
  );
}
```

### News Article Component

```jsx
function NewsArticle({ title, excerpt, source, publishedAt }) {
  return (
    <article className="news-item focus-ring" tabIndex="0">
      <h3 className="news-item-title">
        {title}
      </h3>
      <p className="news-item-excerpt">
        {excerpt}
      </p>
      <div className="news-item-meta">
        <span>{source}</span>
        <span>{publishedAt}</span>
      </div>
    </article>
  );
}
```

### Market Data Table

```jsx
function MarketTable({ data }) {
  return (
    <div className="table-container">
      <div className="table-header">
        Top Cryptocurrencies
      </div>
      {data.map((coin) => (
        <div key={coin.id} className="table-row">
          <div className="flex items-center gap-3">
            <span className="headline-6">{coin.name}</span>
            <span className="caption-regular text-text-secondary">
              {coin.symbol}
            </span>
          </div>
          <div className="text-right">
            <div className="table-cell-number">
              ${coin.price.toLocaleString()}
            </div>
            <div className={`table-cell-number ${
              coin.change >= 0 ? 'table-cell-positive' : 'table-cell-negative'
            }`}>
              {coin.change >= 0 ? '+' : ''}{coin.change}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 📦 Dependencies and Setup

The design system requires:

- **Plus Jakarta Sans** font (automatically imported)
- **Tailwind CSS** with custom configuration
- **tailwindcss-animate** plugin
- **@tailwindcss/typography** plugin

All setup is already complete in your project configuration.

## 🔄 Migration Guide

If updating existing components:

1. Replace hardcoded colors with design system variables
2. Update spacing to use modular scale
3. Replace custom typography with semantic classes
4. Add accessibility features (focus-ring, sr-only)
5. Use component-specific classes (card-primary, btn-primary, etc.)

---

This design system ensures consistency, accessibility, and maintainability across your crypto finance application while providing the modern, data-focused aesthetic needed for financial applications.
