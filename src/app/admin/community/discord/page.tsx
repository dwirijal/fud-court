
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";

export default function DiscordIntegrationPage() {
    const isDiscordConfigured = !!process.env.DISCORD_BOT_TOKEN;

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
                            <Link href="/admin/community">Community Hub</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Discord Integration</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Discord Integration
                </h1>
                <p className="text-xl text-muted-foreground">
                    Manage your Discord server connection and automations.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Connection Status</CardTitle>
                    <CardDescription>
                        Check if your application is successfully connected to the Discord API.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!isDiscordConfigured ? (
                         <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Configuration Missing</AlertTitle>
                            <AlertDescription>
                                Discord Bot Token is not configured. Please set `DISCORD_BOT_TOKEN` in your environment variables to enable this feature. You can get a token from the Discord Developer Portal.
                            </AlertDescription>
                        </Alert>
                    ) : (
                         <Alert>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertTitle>Successfully Connected</AlertTitle>
                            <AlertDescription>
                                Your Discord Bot Token is configured correctly. You can now build features that interact with the Discord API.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
