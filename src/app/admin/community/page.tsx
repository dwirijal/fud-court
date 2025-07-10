
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertTriangle, Bot } from "lucide-react";
import { getGuildData } from "@/lib/discord";
import { CommunityDashboardContent } from "@/components/organisms/community-dashboard-content";

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
    const guildId = process.env.DISCORD_GUILD_ID;
    const isDiscordConfigured = !!process.env.DISCORD_BOT_TOKEN && !!guildId;
    let guildData = null;
    let apiError: string | null = null;

    if (isDiscordConfigured) {
        try {
            guildData = await getGuildData(guildId!);
        } catch (error) {
            apiError = error instanceof Error ? error.message : "An unknown API error occurred.";
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <Bot className="h-8 w-8" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                        Community Hub
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    An overview of your Discord community engagement and management tools.
                </p>
            </header>

            {!isDiscordConfigured ? (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Discord Not Configured</AlertTitle>
                    <AlertDescription>
                        Please set `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID` in your environment variables to enable the Community Hub.
                    </AlertDescription>
                </Alert>
            ) : apiError ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            API Request Failed
                        </CardTitle>
                        <CardDescription>Could not fetch data from the Discord API. Please check your Bot Token, Server ID, and that your bot has been invited to the server with the correct permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-destructive font-mono bg-destructive/10 p-4 rounded-md">{apiError}</p>
                    </CardContent>
                </Card>
            ) : guildData ? (
                <CommunityDashboardContent guildData={guildData} />
            ) : (
                 <Card>
                    <CardHeader>
                        <CardTitle>Loading Community Data...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Fetching the latest data from your Discord server.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
