# Fud Court

### Clarity in Chaos

![Fud Court Screenshot](https://firebasestorage.googleapis.com/v0/b/project-sx-test-and-demo.appspot.com/o/images%2F66955d5499a071f02b55f13c%2Fimage.png?alt=media&token=c45b7337-f261-460d-8381-8b776c728e75)

---

**Fud Court** is a sophisticated, data-driven dashboard designed to bring clarity to the chaotic world of cryptocurrency. It provides powerful tools for market analysis, news aggregation, and insights, all within a single, beautifully designed interface.

Built with Next.js and leveraging a modern tech stack, Fud Court serves as an all-in-one command center for crypto enthusiasts and traders.

## Core Features

- **📊 Macro Sentiment Score**: A proprietary 5-component model that calculates an overall market health score based on Market Cap, Volume, Fear & Greed Index, ATH distance, and Market Breadth. (See [formula.md](formula.md) for details)
- **📊 Global Economic Dashboard**: An advanced dashboard featuring key economic indicators from FRED (Federal Reserve Economic Data). Includes interactive charts with technical analysis overlays like Moving Averages, RSI, and MACD to provide deep market context.
- **📈 Live Crypto Markets**: Real-time cryptocurrency data, including prices, market caps, and historical sparklines, powered by the CoinGecko API, with robust currency conversion and infinite scroll for seamless browsing.  **(Data now fetched from Supabase)**
- **💰 DeFi TVL Metrics**: Track Total Value Locked (TVL) for various DeFi protocols, providing insights into the decentralized finance ecosystem.
- **📝 Headless CMS Integration**: View content from a Ghost CMS backend.
- **⚡ Dynamic & Modern UI**: Built with Next.js App Router, Radix, and styled with Tailwind CSS & ShadCN UI for a responsive, performant, and aesthetically pleasing user experience.
- **Aesthetic Themes**: Includes beautifully crafted light and dark mode themes.
- **MVP Features:**
    - Homepage with carousel of top 50 cryptocurrencies and market summary.
    - Dedicated markets page with sortable and filterable cryptocurrency table and currency switching.
    - Individual cryptocurrency pages with detailed information.


## Known Issues

- None at the moment. The application is stable and optimized for deployment.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **CMS**: [Ghost](https://ghost.org/) (Headless)
- **Database/Backend**: [Supabase](https://supabase.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/fud-court.git
    cd fud-court
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of your project and add the following variables.

    ```bash
    # .env

    # Ghost CMS
    GHOST_API_URL=https://your-ghost-instance.com
    GHOST_CONTENT_API_KEY=your_content_api_key
    # Note: For magic link functionality, GHOST_CONTENT_API_KEY should be an Admin API Key.

    # CoinMarketCap (Used as a fallback for CoinGecko)
    COINMARKETCAP_API_KEY=your_coinmarketcap_api_key

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Discord (Optional, for future features)
    # DISCORD_BOT_TOKEN=your_discord_bot_token
    # DISCORD_GUILD_ID=your_discord_server_id
    ```

    **Important for Vercel Deployment:**
    You must also set these variables in your Vercel project settings for the deployed application to work.
    1. Go to your project on Vercel.
    2. Click the **Settings** tab.
    3. Go to **Environment Variables**.
    4. Add each key-value pair from your `.env` file.
    5. **Redeploy** your project from the Vercel dashboard for the changes to take effect.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

---
This project was bootstrapped with Firebase Studio.
