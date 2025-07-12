
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { DashboardContent } from "../dashboard-content";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import { unstable_noStore as noStore } from 'next/cache';

async function getPageAnalytics() {
    noStore();
    // Check if db is configured before using it
    if (!db) {
        throw new Error("Database is not configured.");
    }
    const data = await db
        .select({
            path: pageViews.path,
            count: count(pageViews.path),
        })
        .from(pageViews)
        .groupBy(pageViews.path)
        .orderBy(desc(count(pageViews.path)));
    return data;
}


export default async function AnalyticsPage() {
    // Check if db is available from the lib
    const isDbConfigured = !!db;
    let analytics = [];
    let dbError: string | null = null;

    if (isDbConfigured) {
        try {
            analytics = await getPageAnalytics();
        } catch (error) {
            // We are intentionally not logging the error to the console here.
            // In a dev environment, this prevents the Next.js error overlay from appearing
            // for configuration issues (like a wrong DB hostname), which can be confusing.
            // The UI will render a friendly error message instead.
            dbError = error instanceof Error ? error.message : "An unknown database error occurred.";
        }
    }

    const totalViews = analytics.reduce((sum, item) => sum + item.count, 0);
    const uniquePages = analytics.length;

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Analytics & Performance
                </h1>
                <p className="text-xl text-muted-foreground">
                    An overview of your website's traffic and engagement statistics.
                </p>
            </header>

            {!isDbConfigured ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Database Not Configured</CardTitle>
                        <CardDescription>
                            Page analytics cannot be displayed because the database is not connected.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Please ensure `ANALYTIC_URL` is correctly set in your environment variables and restart the server.
                        </p>
                    </CardContent>
                </Card>
            ) : dbError ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Database Connection Failed</CardTitle>
                        <CardDescription>
                           Could not connect to the database. This is often caused by an incorrect hostname or credentials.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-destructive font-mono bg-destructive/10 p-4 rounded-md">
                            {dbError}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <DashboardContent analytics={analytics} totalViews={totalViews} uniquePages={uniquePages} />
            )}
        </div>
    );
}
