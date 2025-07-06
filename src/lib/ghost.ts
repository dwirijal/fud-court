import type { Post } from "@/types";

const posts: Post[] = [
  {
    id: "1",
    slug: "understanding-the-halving",
    title: "Understanding the Bitcoin Halving and Its Impact on the Market",
    excerpt: "The Bitcoin halving is a pivotal event that occurs approximately every four years, reducing the reward for mining new blocks by half. This article dives into the mechanics...",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-20T10:00:00.000Z",
    primary_tag: { id: "t1", name: "Bitcoin" },
    html: `
      <p>The Bitcoin halving is a pre-programmed event in the Bitcoin protocol that occurs roughly every four years, or after every 210,000 blocks are mined. It reduces the reward that miners receive for validating transactions and adding new blocks to the blockchain by 50%.</p>
      <h2>Why Does it Matter?</h2>
      <p>This reduction in the supply of new bitcoins entering the market can have significant effects on its price. Historically, Bitcoin halvings have been followed by substantial bull runs. The core idea is simple supply and demand: if demand remains constant or increases while the supply of new coins is cut, the price should, in theory, go up.</p>
      <p>However, past performance is not indicative of future results, and the market has become much more complex since the last halving.</p>
      <figure>
        <img src="https://placehold.co/800x400.png" alt="Bitcoin Chart" data-ai-hint="bitcoin chart" />
        <figcaption>A generic chart representing Bitcoin's price volatility.</figcaption>
      </figure>
      <h2>What to Expect This Time</h2>
      <p>Market analysts are divided. Some predict another major price surge, while others believe the event is already "priced in" by the market, meaning its effects won't be as dramatic. Factors like institutional adoption, macroeconomic conditions, and regulatory developments will also play a crucial role.</p>
    `
  },
  {
    id: "2",
    slug: "ethereum-dencun-upgrade",
    title: "Ethereum's Dencun Upgrade: A New Era for Layer 2 Solutions",
    excerpt: "The recent Dencun upgrade on the Ethereum network introduced 'proto-danksharding,' a feature designed to significantly lower transaction fees for Layer 2 rollups...",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-19T14:30:00.000Z",
    primary_tag: { id: "t2", name: "Ethereum" },
    html: `
      <p>The Dencun upgrade for Ethereum represents a major step forward in scalability. By introducing 'proto-danksharding' (EIP-4844), it creates a new, cheaper way for Layer 2 rollups to store data on the main chain.</p>
      <h2>What are 'Blobs'?</h2>
      <p>Instead of using permanent, expensive CALLDATA, rollups can now post data in temporary 'blobs.' This data is available long enough for Layer 2 nodes to sync but eventually gets pruned, keeping the main chain lean and reducing storage costs. The result is a dramatic reduction in transaction fees for end-users on networks like Arbitrum, Optimism, and Base.</p>
      <blockquote>This is arguably the most significant upgrade for Ethereum's scalability since the inception of rollups.</blockquote>
      <h2>Impact on the Ecosystem</h2>
      <p>Lower fees make a wide range of applications more viable, from on-chain gaming to social media and micro-transactions. This is expected to spur a new wave of innovation and adoption across the Ethereum ecosystem.</p>
    `
  },
  {
    id: "3",
    slug: "the-rise-of-solana",
    title: "The Rise of Solana: Can It Compete with Ethereum?",
    excerpt: "Solana has emerged as a major player in the blockchain space, boasting high throughput and low transaction costs. We explore its ecosystem, recent developments, and potential...",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-18T09:00:00.000Z",
    primary_tag: { id: "t3", name: "Altcoins" },
    html: `
      <p>Solana has positioned itself as a high-performance alternative to Ethereum, often dubbed an "Ethereum killer." Its unique Proof-of-History (PoH) consensus mechanism allows for parallel transaction processing, leading to incredibly fast and cheap transactions.</p>
      <h2>The Trade-offs</h2>
      <p>This performance comes with trade-offs, primarily concerning decentralization and network stability. Solana has experienced several outages, raising concerns about its reliability. The validator hardware requirements are also significantly higher than Ethereum's, potentially leading to a more centralized set of validators.</p>
      <ul>
        <li><strong>Pros:</strong> High speed, low cost, growing DeFi and NFT ecosystem.</li>
        <li><strong>Cons:</strong> Network stability issues, concerns over decentralization.</li>
      </ul>
      <h2>A Multi-Chain Future</h2>
      <p>Rather than a zero-sum game, the future is likely multi-chain. Solana and Ethereum may end up co-existing, serving different use cases and user bases. Solana's speed makes it ideal for applications like high-frequency trading and on-chain order books, while Ethereum's robust security and decentralization may remain the preferred choice for high-value asset settlement.</p>
    `
  },
   {
    id: "4",
    slug: "defi-security-best-practices",
    title: "DeFi Security: Best Practices to Protect Your Crypto Assets",
    excerpt: "While decentralized finance offers incredible opportunities, it also comes with risks. Learn how to secure your assets, vet projects, and avoid common scams in the DeFi space.",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-17T11:00:00.000Z",
    primary_tag: { id: "t4", name: "DeFi" },
    html: "<p>Navigating the world of Decentralized Finance (DeFi) requires vigilance. The saying 'Not your keys, not your crypto' is paramount. Using a hardware wallet to store your assets is the first and most crucial step.</p><h2>Vetting Projects</h2><p>Before investing in a new DeFi protocol, do your own research (DYOR). Look for code audits from reputable security firms, check the team's background, and analyze the project's tokenomics. A strong community and transparent communication are also positive signs.</p>"
  },
  {
    id: "5",
    slug: "stablecoins-explained",
    title: "A Beginner's Guide to Stablecoins and Their Role in Crypto",
    excerpt: "What are stablecoins, and why are they so important for the crypto ecosystem? This guide breaks down the different types of stablecoins, their use cases, and the regulatory landscape.",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-16T16:45:00.000Z",
    primary_tag: { id: "t5", name: "Education" },
    html: "<p>Stablecoins are cryptocurrencies designed to minimize price volatility. They are typically pegged to a stable asset, like the U.S. dollar.</p><h2>Types of Stablecoins</h2><ul><li><strong>Fiat-Collateralized:</strong> Backed 1:1 by fiat currency held in a reserve (e.g., USDC, USDT).</li><li><strong>Crypto-Collateralized:</strong> Backed by other cryptocurrencies (e.g., DAI).</li><li><strong>Algorithmic:</strong> Use algorithms to manage supply and maintain their peg, without direct collateral.</li></ul>"
  },
   {
    id: "6",
    slug: "navigating-the-bear-market",
    title: "Strategies for Navigating a Crypto Bear Market",
    excerpt: "Bear markets can be challenging, but they also present opportunities. Discover strategies for managing your portfolio, finding value, and staying sane during a market downturn.",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-15T08:20:00.000Z",
    primary_tag: { id: "t6", name: "Trading" },
    html: "<p>A bear market is a period of sustained price decline. While stressful, it's also a time when disciplined investors can build strong positions.</p><h2>Key Strategies</h2><p><strong>Dollar-Cost Averaging (DCA):</strong> Instead of investing a lump sum, DCA involves investing smaller, fixed amounts over time. This averages out your purchase price and reduces the risk of buying at a peak.</p><p><strong>Focus on Fundamentals:</strong> Use the downturn to research projects with strong technology, active development, and clear use cases. The hype fades in a bear market, revealing the projects with true substance.</p>"
  },
];

export async function getPosts(): Promise<Post[]> {
  // In the future, this will be an API call to Ghost CMS
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(posts);
    }, 500); // Simulate network delay
  });
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
   return new Promise((resolve) => {
    setTimeout(() => {
      const post = posts.find((p) => p.slug === slug);
      // In a real scenario, you might fetch the full post content here, including HTML
      resolve(post);
    }, 300);
  });
}
