# Fud Court Design System

This document outlines the design principles, color palette, typography, and component philosophy for the Fud Court application. The goal is to maintain a consistent, professional, and data-centric user experience.

## Core Philosophy

- **Clarity First**: The UI must present complex data in a clear, digestible, and unambiguous manner.
- **Data-Driven**: Design choices should enhance data visualization and facilitate quick analysis.
- **Modern & Professional**: The aesthetic should be clean, modern, and trustworthy, avoiding overly "degen" or playful styles.
- **Responsive & Accessible**: The application must be usable across all major screen sizes and adhere to accessibility best practices.
- **Thematic**: Both light and dark modes are first-class citizens and must be fully supported.

## Design Tokens

Design tokens are the core variables that define the visual style of the application. In this project, they are implemented as CSS variables in `src/app/globals.css`. This allows for easy theming and consistent styling.

**Example: Color Token**

A color like `--primary` is defined for both light and dark modes:

```css
/* In :root (light mode) */
--primary: 222.2 47.4% 11.2%;

/* In .dark (dark mode) */
--primary: 6 90% 63%; /* #f25f4c */
```

This token is then used in components via Tailwind's utility classes, which are configured in `tailwind.config.ts`:

```javascript
// tailwind.config.ts
...
colors: {
    primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
    },
},
...
```

This allows us to simply use `bg-primary` in our components, and it will adapt to the current theme automatically.

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

### Text Style Examples

- **Hero Title**: Used for major page headings.
  - `className="text-5xl md:text-8xl font-bold"`
- **Page Title**: Used for standard page titles.
  - `className="text-3xl font-bold"`
- **Card Title**: Used for titles within components like `<Card>`.
  - `className="text-xl font-semibold"`
- **Body Copy**: Standard text for paragraphs.
  - `className="text-base text-muted-foreground"`
- **Caption**: Small text for metadata or less important information.
  - `className="text-xs text-muted-foreground"`

## Component Philosophy & Atomic Design

While not strictly following the Atomic Design methodology, the philosophy is similar. We build small, reusable components (atoms) that are composed into larger, more complex components.

### Component Example: Atom (`<Badge />`)

An "atom" is the smallest possible component, like a button or a badge. It has its own properties and styles but doesn't have business logic.

**`@/components/ui/badge.tsx`**:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ...",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground ...",
        secondary: "...",
        destructive: "...",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

This atomic `Badge` component can then be used anywhere in the application to display a small piece of information, ensuring consistency.

### Component Library

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
