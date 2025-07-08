
import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { unstable_noStore as noStore } from 'next/cache';


async function getPageAnalytics() {
    noStore(); // Opt out of caching for this data
    try {
        const data = await db
            .select({
                path: pageViews.path,
                count: count(pageViews.path),
            })
            .from(pageViews)
            .groupBy(pageViews.path)
            .orderBy(desc(count(pageViews.path)));
        return data;
    } catch (error) {
        console.error("Failed to fetch page analytics:", error);
        // In a real app, you might want more robust error handling
        return [];
    }
}


export async function DashboardContent() {
    const analytics = await getPageAnalytics();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>
                    A summary of the most visited pages on your site.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Page Path</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {analytics.length > 0 ? (
                            analytics.map((item) => (
                                <TableRow key={item.path}>
                                    <TableCell className="font-medium">{item.path}</TableCell>
                                    <TableCell className="text-right font-mono">{item.count}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24">
                                    No page view data yet. Refresh after navigating the site.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
