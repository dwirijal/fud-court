
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Rss, ExternalLink } from "lucide-react";
import Parser from 'rss-parser';
import { format } from 'date-fns';

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

interface FeedItem {
    source: string;
    title: string;
    link: string;
    pubDate: string;
    isoDate: string;
}

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
            })).slice(0, 20); // Limit to 20 items per feed to keep the page snappy
        } catch (error) {
            console.warn(`Failed to fetch or parse RSS feed from ${source.name}:`, error);
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
                            <Link href="/admin/content">News & Content</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Live News Aggregator</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Live News Aggregator
                </h1>
                <p className="text-xl text-muted-foreground">
                    The latest articles from all configured RSS feeds, sorted by publication time.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rss className="h-5 w-5" />
                        Aggregated Feed
                    </CardTitle>
                    <CardDescription>
                       A combined list of recent articles from all your news sources.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] hidden sm:table-cell">Source</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="text-right w-[180px] hidden md:table-cell">Published</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feedItems.length > 0 ? (
                                feedItems.map((item, index) => (
                                    <TableRow key={`${item.link}-${index}`}>
                                        <TableCell className="font-semibold hidden sm:table-cell">{item.source}</TableCell>
                                        <TableCell>
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                                {item.title}
                                                <ExternalLink className="h-3 w-3 inline-block ml-1.5 opacity-60" />
                                            </a>
                                            <div className="text-xs text-muted-foreground md:hidden mt-1">
                                                {format(new Date(item.isoDate), "d MMM yyyy, HH:mm")}
                                            </div>
                                             <div className="text-xs text-muted-foreground sm:hidden mt-1">
                                                {item.source}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground hidden md:table-cell">
                                            {format(new Date(item.isoDate), "d MMM yyyy, HH:mm")}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                 <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">
                                        Could not fetch any articles from the configured feeds. Check server logs for details.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
