# Fud Court Roadmap

This document outlines the development roadmap for Fud Court, a dashboard for adjudicating crypto claims.

## v0.1.0: Foundation & Core Setup (Current)

The initial version focuses on setting up the technical foundation of the project.

- [x] **Project Scaffolding**: Initialize Next.js 14+ with TypeScript.
- [x] **Styling Engine**: Set up Tailwind CSS with a custom theme configuration.
- [x] **UI Component Library**: Integrate `shadcn/ui` with all base components.
- [x] **Architectural Design**: Implement an Atomic Design folder structure (`atoms`, `molecules`, `organisms`) compatible with the Next.js App Router.
- [x] **Scalability Prep**: Create dedicated folders for `types` and `lib`.
- [x] **CMS Mocking**: Create a mock API for Ghost CMS integration to simulate fetching news content.
- [x] **Initial UI/UX**: Build the main application shell, including a header, collapsible sidebar, and a dashboard layout.
- [x] **Versioning**: Establish semantic versioning (`v0.1.0`).
- [x] **Roadmap Creation**: This document.

## v0.2.0: CMS Integration & Content Display

- [ ] **Feature**: Connect to a live Ghost CMS instance (Headless).
- [ ] **Feature**: Create dynamic routes for individual news articles (`/news/[slug]`).
- [ ] **Feature**: Implement a dedicated news feed page with pagination.
- [ ] **Enhancement**: Add search functionality for news articles.
- [ ] **Task**: Write unit and integration tests for CMS fetching logic.

## v0.3.0: Real-time Crypto Data

- [ ] **Feature**: Integrate a third-party API (e.g., CoinGecko, CryptoCompare) for live cryptocurrency data.
- [ ] **Feature**: Replace mock crypto data on the dashboard with real-time data.
- [ ] **Feature**: Create dynamic pages for individual cryptocurrencies (`/token/[id]`).
- [ ] **Feature**: Implement detailed charts and historical data views on token pages.
- [ ] **Enhancement**: Add a "Favorites" or "Watchlist" feature for users.

## v0.4.0: User Accounts & Personalization

- [ ] **Feature**: Implement user authentication (e.g., NextAuth.js).
- [ ] **Feature**: Create user profiles and settings pages.
- [ ] **Feature**: Allow users to save their watchlist to their account.
- [ ] **Feature**: Personalized news feeds based on user interests or watchlist.

## Future Milestones (Placeholder)

- **Milestone**: Portfolio Tracking
- **Milestone**: Advanced Charting Tools
- **Milestone**: Mobile App (React Native)
- **Milestone**: API for third-party developers
