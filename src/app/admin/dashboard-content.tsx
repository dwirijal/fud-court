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
import { Eye, FileText } from 'lucide-react';

interface AnalyticsData {
    path: string;
    count: number;
}

interface DashboardContentProps {
    analytics: AnalyticsData[];
    totalViews: number;
    uniquePages: number;
}

export function DashboardContent({ analytics, totalViews, uniquePages }: DashboardContentProps) {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all pages on the site.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Pages</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{uniquePages.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Number of unique paths tracked.</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Page Views Breakdown</CardTitle>
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
        </div>
    );
}
