
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
import { Activity, Bot, Newspaper, Users } from "lucide-react";

export default async function AdminDashboardPage() {
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
                    A central hub for managing your CryptoPulse application.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Market Snapshot
                        </CardTitle>
                        <CardDescription>Under Construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            A real-time overview of key market indicators like BTC, ETH, and more will be displayed here.
                        </p>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                           AI Signal Summary
                        </CardTitle>
                        <CardDescription>Under Construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            AI-generated summaries of market signals, support/resistance levels, and macro events.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Active Community
                        </CardTitle>
                        <CardDescription>Under Construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Metrics on trending community threads and most active users.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Newspaper className="h-5 w-5" />
                            Content Queue
                        </CardTitle>
                        <CardDescription>Under Construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            A view of scheduled and queued posts or news articles.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
