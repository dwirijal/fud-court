
import { getAllPosts } from "@/lib/ghost-admin";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { PostQueueTable } from "./queue-table";

export const dynamic = 'force-dynamic';

export default async function PostQueuePage() {
    const isGhostAdminConfigured = !!process.env.GHOST_API_URL && !!process.env.GHOST_ADMIN_API_KEY;
    const posts = isGhostAdminConfigured ? await getAllPosts() : [];
    
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
                        <BreadcrumbPage>Post & Thread Queue</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Post & Thread Queue
                </h1>
                <p className="text-xl text-muted-foreground">
                    View, manage, and prioritize all scheduled, drafted, and published content.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>All Content</CardTitle>
                    <CardDescription>
                        A complete list of all content across all statuses from your Ghost CMS.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isGhostAdminConfigured ? (
                         <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Configuration Missing</AlertTitle>
                            <AlertDescription>
                                Ghost Admin API keys are not configured. Please set `GHOST_API_URL` and `GHOST_ADMIN_API_KEY` in your environment variables to see the post queue.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <PostQueueTable posts={posts} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
