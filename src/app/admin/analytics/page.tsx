
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { AreaChart } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Analytics & Performance
                </h1>
                <p className="text-xl text-muted-foreground">
                    An overview of your website's traffic.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AreaChart className="h-5 w-5" />
                        Under Construction
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This feature is temporarily disabled. When you're ready, we can reconnect this page to your database to track page views.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
