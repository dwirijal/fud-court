
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

interface AnalyticsData {
    path: string;
    count: number;
}

interface DashboardContentProps {
    analytics: AnalyticsData[];
}

export function DashboardContent({ analytics }: DashboardContentProps) {
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
