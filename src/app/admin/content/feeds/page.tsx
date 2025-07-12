
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Rss } from "lucide-react";
import Parser from 'rss-parser';
import { FeedsTable } from "./feeds-table";
import type { FeedItem } from "./columns";

// Force dynamic rendering to fetch fresh data on each request
export const dynamic = 'force-dynamic';

const parser = new Parser();

const feedSources = [
    { name: "CoinTelegraph", url: "https://cointelegraph.com/rss" },
    { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
    { name: "WatcherGuru", url: "https://watcher.guru/news/author/watcherguru/feed" },
    { name: "The Block", url: "https://www.theblock.co/rss.xml" },
    { name: "Decrypt", url: "https://decrypt.co/feed" },
    { name: "CryptoSlate", url: "https://cryptoslate.com/feed/" },
    { name: "ForexLive (Central Banks)", url: "https://www.forexlive.com/feed/centralbank" },
    { name: "FXStreet", url: "https://www.fxstreet.com/rss/news" },
];

async function fetchAllFeeds(): Promise<FeedItem[]> {
    const promises = feedSources.map(async (source) => {
        try {
            // Setting a timeout for the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout
            
            const feed = await parser.parseURL(source.url);
            
            clearTimeout(timeoutId);

            return feed.items.map(item => ({
                source: source.name,
                title: item.title || 'No title provided',
                link: item.link || '#',
                pubDate: item.pubDate || new Date().toISOString(),
                isoDate: item.isoDate || new Date().toISOString(),
                content: item.content || item['content:encoded'] || item.summary,
            })).slice(0, 20); // Limit to 20 items per feed to keep the page snappy
        } catch (error) {
            console.warn(`Gagal mengambil atau mem-parsing feed RSS dari ${source.name}:`, error);
            return []; // Return empty array on error for this specific feed
        }
    });

    const results = await Promise.allSettled(promises);
    const allItems = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<FeedItem[]>).value);

    // Sort all items by date, newest first
    allItems.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());

    return allItems;
}


export default async function NewsFeedsPage() {
    const feedItems = await fetchAllFeeds();

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Admin</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                         <BreadcrumbLink asChild>
                            <Link href="/admin/content">Berita & Konten</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Agregator Berita Langsung</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Agregator Berita Langsung
                </h1>
                <p className="text-xl text-muted-foreground">
                    Artikel terbaru dari semua feed RSS yang dikonfigurasi, diurutkan berdasarkan waktu publikasi.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rss className="h-5 w-5" />
                        Feed Gabungan
                    </CardTitle>
                    <CardDescription>
                       Daftar gabungan artikel terbaru dari semua sumber berita Anda. Klik panah untuk melihat detail artikel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {feedItems.length > 0 ? (
                        <FeedsTable items={feedItems} />
                    ) : (
                        <div className="flex h-24 items-center justify-center text-center text-muted-foreground">
                            Tidak dapat mengambil artikel apa pun dari feed yang dikonfigurasi. Periksa log server untuk detailnya.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
