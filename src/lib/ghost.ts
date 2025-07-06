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
  },
  {
    id: "2",
    slug: "ethereum-dencun-upgrade",
    title: "Ethereum's Dencun Upgrade: A New Era for Layer 2 Solutions",
    excerpt: "The recent Dencun upgrade on the Ethereum network introduced 'proto-danksharding,' a feature designed to significantly lower transaction fees for Layer 2 rollups...",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-19T14:30:00.000Z",
    primary_tag: { id: "t2", name: "Ethereum" },
  },
  {
    id: "3",
    slug: "the-rise-of-solana",
    title: "The Rise of Solana: Can It Compete with Ethereum?",
    excerpt: "Solana has emerged as a major player in the blockchain space, boasting high throughput and low transaction costs. We explore its ecosystem, recent developments, and potential...",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-18T09:00:00.000Z",
    primary_tag: { id: "t3", name: "Altcoins" },
  },
   {
    id: "4",
    slug: "defi-security-best-practices",
    title: "DeFi Security: Best Practices to Protect Your Crypto Assets",
    excerpt: "While decentralized finance offers incredible opportunities, it also comes with risks. Learn how to secure your assets, vet projects, and avoid common scams in the DeFi space.",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-17T11:00:00.000Z",
    primary_tag: { id: "t4", name: "DeFi" },
  },
  {
    id: "5",
    slug: "stablecoins-explained",
    title: "A Beginner's Guide to Stablecoins and Their Role in Crypto",
    excerpt: "What are stablecoins, and why are they so important for the crypto ecosystem? This guide breaks down the different types of stablecoins, their use cases, and the regulatory landscape.",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-16T16:45:00.000Z",
    primary_tag: { id: "t5", name: "Education" },
  },
   {
    id: "6",
    slug: "navigating-the-bear-market",
    title: "Strategies for Navigating a Crypto Bear Market",
    excerpt: "Bear markets can be challenging, but they also present opportunities. Discover strategies for managing your portfolio, finding value, and staying sane during a market downturn.",
    feature_image: "https://placehold.co/600x400.png",
    published_at: "2024-05-15T08:20:00.000Z",
    primary_tag: { id: "t6", name: "Trading" },
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
      resolve(posts.find((p) => p.slug === slug));
    }, 300);
  });
}
