
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
import { Terminal, AlertTriangle, Hash, Loader2 } from "lucide-react";
import { getGuildChannels } from "@/lib/discord";
import { ChannelsDashboard } from "./channels-dashboard";

export const dynamic = 'force-dynamic';

export default async function ManageChannelsPage() {
    const isDiscordConfigured = !!process.env.DISCORD_BOT_TOKEN && !!process.env.DISCORD_GUILD_ID;
    let channels = [];
    let apiError: string | null = null;

    if (isDiscordConfigured) {
        try {
            channels = await getGuildChannels();
        } catch (error) {
            apiError = error instanceof Error ? error.message : "An unknown API error occurred.";
        }
    }

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
                        <BreadcrumbPage>Manage Channels</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            
            <ChannelsDashboard
                initialChannels={channels}
                isDiscordConfigured={isDiscordConfigured}
                apiError={apiError}
            />
        </div>
    );
}
