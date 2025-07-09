
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
import { Button } from "@/components/ui/button";
import { Rss, ExternalLink } from "lucide-react";

// Data extracted from the user's provided JSON
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

export default function NewsFeedsPage() {
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
                        <BreadcrumbPage>News Feeds</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    News Sources & Feeds
                </h1>
                <p className="text-xl text-muted-foreground">
                    A list of configured RSS feeds for content aggregation.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Rss className="h-5 w-5" />
                        Configured RSS Feeds
                    </CardTitle>
                    <CardDescription>
                       These are the sources currently configured in the content pipeline. This page is read-only.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Source Name</TableHead>
                                <TableHead>Feed URL</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feedSources.map((source) => (
                                <TableRow key={source.name}>
                                    <TableCell className="font-semibold">{source.name}</TableCell>
                                    <TableCell className="font-mono text-muted-foreground">{source.url}</TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                View Feed
                                            </a>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
