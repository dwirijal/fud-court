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
import { DashboardContent } from "./dashboard-content";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import { unstable_noStore as noStore } from 'next/cache';

async function getPageAnalytics() {
    noStore();
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


export default async function AdminDashboardPage() {
    const isDbConfigured = !!process.env.DATABASE_URL;
    let analytics = [];
    let dbError: string | null = null;

    if (isDbConfigured) {
        try {
            analytics = await getPageAnalytics();
        } catch (error) {
            console.error("Failed to fetch page analytics:", error);
            dbError = error instanceof Error ? error.message : "An unknown database error occurred.";
        }
    }

    const totalViews = analytics.reduce((sum, item) => sum + item.count, 0);
    const uniquePages = analytics.length;

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Breadcrumb className="mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                    An overview of your website's statistics.
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
                            Please ensure the `DATABASE_URL` is correctly set in your `.env.local` file and restart the server.
                        </p>
                    </CardContent>
                </Card>
            ) : dbError ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Database Connection Failed</CardTitle>
                        <CardDescription>
                           Could not connect to the database. This is often caused by an incorrect hostname or credentials in your `DATABASE_URL`.
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
