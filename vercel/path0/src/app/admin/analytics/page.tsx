
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { DashboardContent } from "../dashboard-content";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { unstable_noStore as noStore } from 'next/cache';

interface AnalyticsData {
    path: string;
    count: number;
}

async function getPageAnalytics(): Promise<AnalyticsData[]> {
    noStore();
    if (!db) {
        throw new Error("Firebase is not configured.");
    }
    const pageViewsRef = collection(db, "pageViews");
    const q = query(pageViewsRef);
    const querySnapshot = await getDocs(q);

    const counts: { [path: string]: number } = {};
    querySnapshot.forEach((doc) => {
        const path = doc.data().path;
        counts[path] = (counts[path] || 0) + 1;
    });

    const data = Object.entries(counts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count);

    return data;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    useEffect(() => {
        if (!isFirebaseConfigured) {
            setError("Firebase not configured. Please check your environment variables.");
            setIsLoading(false);
            return;
        }

        getPageAnalytics()
            .then(data => {
                setAnalytics(data);
            })
            .catch(err => {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [isFirebaseConfigured]);

    const totalViews = analytics.reduce((sum, item) => sum + item.count, 0);
    const uniquePages = analytics.length;

    const renderContent = () => {
        if (isLoading) {
            return (
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (error) {
             return (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                        <p className="mt-2 text-xs">Please ensure your Firebase project credentials are correctly set in your environment variables and that the Firestore database has been created in your project.</p>
                    </AlertDescription>
                </Alert>
            );
        }

        return <DashboardContent analytics={analytics} totalViews={totalViews} uniquePages={uniquePages} />;
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Analytics & Performance
                </h1>
                <p className="text-xl text-muted-foreground">
                    An overview of your website's traffic, powered by Firebase.
                </p>
            </header>

            {renderContent()}
        </div>
    );
}
