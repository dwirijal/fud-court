
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

export default async function AdminDashboardPage() {
    const isDbConfigured = !!process.env.DATABASE_URL;

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

            {isDbConfigured ? (
                <DashboardContent />
            ) : (
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
            )}
        </div>
    );
}
