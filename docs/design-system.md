# Fud Court Design System

This document outlines the design principles, color palette, typography, and component philosophy for the Fud Court application. The goal is to maintain a consistent, professional, and data-centric user experience.

## Core Philosophy

- **Clarity First**: The UI must present complex data in a clear, digestible, and unambiguous manner.
- **Data-Driven**: Design choices should enhance data visualization and facilitate quick analysis.
- **Modern & Professional**: The aesthetic should be clean, modern, and trustworthy, avoiding overly "degen" or playful styles.
- **Responsive & Accessible**: The application must be usable across all major screen sizes and adhere to accessibility best practices.
- **Thematic**: Both light and dark modes are first-class citizens and must be fully supported.

## Color Palette

The color system is built using CSS variables defined in `src/app/globals.css`, following the ShadCN UI convention.

### Dark Mode (Default)

This is the primary theme, designed for focus and reduced eye strain during long sessions.

- **Background (`--background`)**: `#0f0e17` (A very dark, slightly desaturated blue)
- **Card/Muted Backgrounds (`--card`, `--muted`)**: `#1a1923` (Slightly lighter shades for depth)
- **Text (`--foreground`)**: `#fffffe` (Off-white for comfortable reading)
- **Primary Action (`--primary`)**: `#f25f4c` (A vibrant reddish-orange for key actions)
- **Secondary Action (`--secondary`)**: `#e53170` (A strong magenta for alternative actions)
- **Accent (`--accent`)**: `#ff8906` (A bright orange for highlights, warnings, and calls-to-action)

### Light Mode

A clean, professional theme for users who prefer a brighter interface.

- **Background (`--background`)**: `0 0% 100%` (White)
- **Card/Muted Backgrounds (`--card`, `--muted`)**: `210 40% 96.1%` (Light gray)
- **Text (`--foreground`)**: `222.2 84% 4.9%` (Almost black)
- **Primary Action (`--primary`)**: `222.2 47.4% 11.2%` (A deep, professional blue)

## Typography

- **Primary Font**: `Plus Jakarta Sans` is used for all text to ensure a modern, clean, and highly readable interface.
- **Hierarchy**: A clear typographic scale is used to establish visual hierarchy.
  - `text-5xl` to `text-6xl` for hero titles.
  - `text-2xl` to `text-4xl` for page and card titles.
  - `text-base` to `text-lg` for body copy.
  - `text-sm` to `text-xs` for metadata and captions.

## Components

The application relies heavily on **ShadCN UI** for its component library. This provides a foundation of accessible, unstyled components that we customize using Tailwind CSS.

- **Card (`@/components/ui/card.tsx`)**: The primary container for modular content. Cards are used to group related information, such as market stats, trading pairs, and analysis sections. They should have a subtle border and shadow to create depth.
- **Table (`@/components/ui/table.tsx`)**: Used for all tabular data. Rows should have a hover state to improve usability.
- **Button (`@/components/ui/button.tsx`)**: Used for all interactive actions. The default variant is reserved for primary actions on a page. `outline` and `ghost` variants are used for secondary actions.
- **Badge (`@/components/ui/badge.tsx`)**: Used for short, important pieces of information like market cap rank, risk levels, or token symbols.
- **Skeleton (`@/components/ui/skeleton.tsx`)**: A skeleton loader is used for all data-fetching states to provide a smooth loading experience and prevent layout shifts.

## Layout & Spacing

- **Container**: A centered container with a max-width of `1400px` is used for all pages.
- **Spacing**: Spacing is managed via Tailwind's utility classes, following a 4px grid system (e.g., `p-4` for 16px padding).
- **Grid**: A responsive grid system (`grid`, `grid-cols-*`) is used for layout, especially on dashboards, to ensure content reflows gracefully on different screen sizes.
