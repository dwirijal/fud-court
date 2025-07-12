
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

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
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Database Not Configured</AlertTitle>
                    <AlertDescription>
                        Page analytics cannot be displayed. Please ensure `DATABASE_URL` is correctly set in your environment variables (both locally in `.env.local` and in your Vercel project settings) and redeploy.
                    </AlertDescription>
                </Alert>
            ) : dbError ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Database Connection Failed</CardTitle>
                        <CardDescription>
                           Could not connect to the database. This often means the `DATABASE_URL` is missing or incorrect in your Vercel project settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-semibold mb-2">Troubleshooting Steps:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Go to your Vercel project dashboard.</li>
                            <li>Navigate to **Settings** &rarr; **Environment Variables**.</li>
                            <li>Ensure there is a variable named `DATABASE_URL` with the correct pooled connection string from Neon.</li>
                            <li>Redeploy your project after adding/updating the variable.</li>
                        </ul>
                         <p className="mt-4 text-sm text-destructive font-mono bg-destructive/10 p-4 rounded-md">
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
