
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
import { Flame, AlertTriangle } from "lucide-react";
import Parser from 'rss-parser';
import { getTrendingTopics, type TrendingTopicsOutput } from "@/ai/flows/trending-topics-flow";
import { Badge } from "@/components/ui/badge";

// This is a temporary type, the one from feeds/columns is not exported.
interface FeedItem {
    source: string;
    title: string;
    link: string;
    pubDate: string;
    isoDate: string;
    content?: string;
}

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

const parser = new Parser();

async function fetchAllFeeds(): Promise<FeedItem[]> {
    const promises = feedSources.map(async (source) => {
        try {
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
                content: item.contentSnippet || item.summary,
            })).slice(0, 15); // Limit to 15 items per feed
        } catch (error) {
            console.warn(`Gagal mengambil atau mem-parsing feed RSS dari ${source.name}:`, error);
            return []; // Return empty array on error
        }
    });

    const results = await Promise.allSettled(promises);
    const allItems = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<FeedItem[]>).value);

    allItems.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
    
    // Limit to the most recent 50 articles to keep the AI prompt concise
    return allItems.slice(0, 50);
}

const getSentimentVariant = (sentiment: TrendingTopicsOutput['topics'][0]['sentiment']): 'default' | 'destructive' | 'secondary' => {
    switch (sentiment) {
        case 'Positive':
            return 'default';
        case 'Negative':
            return 'destructive';
        case 'Neutral':
            return 'secondary';
        default:
            return 'secondary';
    }
}


export default async function TrendingTopicsPage() {
    const articles = await fetchAllFeeds();
    let trendingTopics: TrendingTopicsOutput | null = null;
    let error: string | null = null;

    if (articles.length > 0) {
        try {
            trendingTopics = await getTrendingTopics({ 
                articles: articles.map(a => ({ title: a.title, content: a.content }))
            });
        } catch (e) {
            console.error("Error fetching trending topics from AI:", e);
            error = e instanceof Error ? e.message : "Terjadi kesalahan yang tidak diketahui saat menganalisis topik.";
        }
    } else {
        error = "Tidak dapat mengambil artikel berita apa pun untuk dianalisis sebagai topik tren.";
    }

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
                        <BreadcrumbPage>Monitor Topik Tren</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Monitor Topik Tren
                </h1>
                <p className="text-xl text-muted-foreground">
                    Analisis berita terbaru yang didukung AI untuk mengidentifikasi narasi pasar utama.
                </p>
            </header>

            {error ? (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Analisis Gagal
                        </CardTitle>
                        <CardDescription>
                          Tidak dapat menghasilkan topik tren saat ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                </Card>
            ) : !trendingTopics || trendingTopics.topics.length === 0 ? (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Flame className="h-5 w-5" />
                           Menganalisis Topik...
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Harap tunggu sebentar. Jika pesan ini terus muncul, mungkin tidak ada tren signifikan dalam kumpulan berita terbaru.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {trendingTopics.topics.map((topic, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl font-headline pr-4">{topic.topic}</CardTitle>
                                    <Badge variant={getSentimentVariant(topic.sentiment)}>
                                        {topic.sentiment}
                                    </Badge>
                                </div>
                                <CardDescription>Relevansi: {topic.relevanceScore}/10</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{topic.summary}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
