
# Fud Court

### Clarity in Chaos

![Fud Court Screenshot](https://firebasestorage.googleapis.com/v0/b/project-sx-test-and-demo.appspot.com/o/images%2F66955d5499a071f02b55f13c%2Fimage.png?alt=media&token=c45b7337-f261-460d-8381-8b776c728e75)

---

**Fud Court** is a sophisticated, data-driven dashboard designed to bring clarity to the chaotic world of cryptocurrency. It provides powerful tools for market analysis, news aggregation, AI-powered insights, and community management, all within a single, beautifully designed interface.

Built with Next.js and leveraging a modern tech stack, Fud Court serves as an all-in-one command center for crypto enthusiasts, traders, and community managers.

## Core Features

- **📊 Macro Sentiment Score**: A proprietary 5-component model that calculates an overall market health score based on Market Cap, Volume, Fear & Greed Index, ATH distance, and Market Breadth.
- **🤖 AI-Powered Trending Topics**: Utilizes Genkit and Google's Gemini models to analyze real-time news feeds and identify emerging market narratives and sentiment.
- **📈 Live Crypto Markets**: Real-time cryptocurrency data, including prices, market caps, and historical sparklines, powered by the CoinGecko API.
- **📝 Headless CMS Integration**: Seamlessly create, edit, and manage content with a full-featured post editor connected to a Ghost CMS backend.
- **💬 Discord Community Hub**: A dedicated admin section to view server stats, manage channels (create, edit, delete), and create threads directly from the dashboard.
- **⚡ Dynamic & Modern UI**: Built with Next.js App Router, Radix, and styled with Tailwind CSS & ShadCN UI for a responsive, performant, and aesthetically pleasing user experience.
- **🔍 Page Analytics**: Track page views across the application with data stored in Firebase Firestore.
- **Aesthetic Themes**: Includes beautifully crafted light and dark mode themes.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit) (with Gemini)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **CMS**: [Ghost](https://ghost.org/) (Headless)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- A Firebase project

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
    GHOST_ADMIN_API_KEY=your_admin_api_key

    # Discord (for Community Hub)
    DISCORD_BOT_TOKEN=your_discord_bot_token
    DISCORD_GUILD_ID=your_discord_server_id
    
    # Firebase (for Page Analytics)
    # Get these from your Firebase project settings > General tab > Your apps > Web app
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
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

5.  **Run the Genkit development server (for AI flows):**
    In a separate terminal, run:
    ```bash
    npm run genkit:watch
    ```
    This will start the Genkit development UI, allowing you to inspect and test your AI flows.

---
This project was bootstrapped with Firebase Studio.
