# Fud Court Roadmap

This document outlines the development roadmap for Fud Court, a dashboard for adjudicating crypto claims.

## v0.1.0: Foundation & Core Setup (Completed)

- [x] **Project Scaffolding**: Initialize Next.js 14+ with TypeScript.
- [x] **Styling Engine**: Set up Tailwind CSS with a custom theme configuration.
- [x] **UI Component Library**: Integrate `shadcn/ui` with all base components.
- [x] **Architectural Design**: Implement an Atomic Design folder structure (`atoms`, `molecules`, `organisms`) compatible with the Next.js App Router.
    - **Updated**: Refactored to a more flexible component structure (`ui`, `shared`) focusing on reusability rather than strict Atomic Design layers.
- [x] **Scalability Prep**: Create dedicated folders for `types` and `lib`.
- [x] **CMS Mocking**: Create a mock API for Ghost CMS integration to simulate fetching news content.
    - **Updated**: Ghost CMS integration is currently commented out and will be revisited if needed.
- [x] **Initial UI/UX**: Build the main application shell, including a header, collapsible sidebar, and a dashboard layout.
    - **Updated**: Implemented minimalist header and footer. Sidebar is not currently implemented.
- [x] **Versioning**: Establish semantic versioning (`v0.1.0`).
- [x] **Roadmap Creation**: This document.

## v0.2.0: CMS Integration & Content Display (Pending)

- [ ] **Feature**: Connect to a live Ghost CMS instance (Headless).
- [ ] **Feature**: Create dynamic routes for individual news articles (`/news/[slug]`).
- [ ] **Feature**: Implement a dedicated news feed page with pagination.
- [ ] **Enhancement**: Add search functionality for news articles.
- [ ] **Task**: Write unit and integration tests for CMS fetching logic.

## v0.3.0: Real-time Crypto Data (In Progress)

- [x] **Feature**: Integrate a third-party API (e.g., CoinGecko, CryptoCompare) for live cryptocurrency data.
    - **Updated**: Integrated CoinGecko, Binance, DefiLlama, DexScreener, and Alternative.me (Fear & Greed Index) APIs. Data is fetched directly from these APIs, not Supabase.
- [x] **Feature**: Replace mock crypto data on the dashboard with real-time data.
    - **Updated**: Data is now fetched directly from integrated APIs.
- [x] **Feature**: Create dynamic pages for individual cryptocurrencies (`/coins/[id]`).
- [x] **Feature**: Implement detailed charts and historical data views on token pages.
    - **Updated**: Basic data display implemented; charting functionality is pending.
- [ ] **Enhancement**: Implement robust currency conversion for market data.
    - **Updated**: Basic USD conversion is present; robust multi-currency conversion is pending.
- [x] **Enhancement**: Implement infinite scroll for market data tables.
    - **Updated**: Implemented infinite scroll on `/coins` page.
- [x] **Enhancement**: Add a "Favorites" or "Watchlist" feature for users.
    - **Updated**: Implemented `/coins/watchlist` page.

## v0.4.0: User Accounts & Personalization (Pending)

- [ ] **Feature**: Implement user authentication (e.g., NextAuth.js).
- [ ] **Feature**: Create user profiles and settings pages.
- [ ] **Feature**: Allow users to save their watchlist to their account.
- [ ] **Feature**: Personalized news feeds based on user interests or watchlist.

## v0.5.0: Degen Zone & Advanced Features (In Progress)

- [x] **Feature**: Implement a "Degen" page to show real-time trending tokens.
    - **Updated**: Implemented `/degen/pairs`, `/degen/tokens/[address]`, `/degen/search`, `/degen/trending`, and `/degen/new-listings` pages.

## Future Milestones & Suggested Improvements

- **Milestone**: Portfolio Tracking
- **Milestone**: Advanced Charting Tools
- **Milestone**: Mobile App (React Native)
- **Milestone**: API for third-party developers
- **Refactor**: Improve the implementation of Next.js Server and Client Components to prevent rendering issues.
    - **Updated**: Significant refactoring has been done to address these issues.
- [ ] **Testing**: Increase test coverage for all new features.
- [ ] **New Task**: Implement `/defi/yield/[pool]` page for individual yield pool analytics.
- [ ] **New Task**: Implement `/defi/stablecoins` and `/defi/stablecoins/[asset]` pages for stablecoin analytics.
- [ ] **New Task**: Implement `/defi/dexs` and `/defi/dexs/[protocol]` pages for DEX volume analytics.
- [ ] **New Task**: Implement `/defi/options` page for options DEX overview.
- [ ] **New Task**: Implement global search functionality in the navbar.