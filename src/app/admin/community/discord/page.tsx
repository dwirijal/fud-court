
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
import { 
    Terminal, 
    Users, 
    Hash, 
    Settings, 
    MessageSquare,
    Shield,
    Bot,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getGuildMembers, getGuildChannels } from "@/lib/discord";
import type { DiscordMember, DiscordChannel } from "@/types";
import { format } from "date-fns";
import { ChannelActions } from "@/components/molecules/channel-actions";
import { cn } from "@/lib/utils";

const automationFeatures = [
    { title: "Welcome Messages", description: "Automatically greet new members.", icon: MessageSquare },
    { title: "Role Automation", description: "Assign roles based on reactions or commands.", icon: Shield },
    { title: "Custom Commands", description: "Set up custom bot commands for your server.", icon: Bot },
    { title: "Logging & Moderation", description: "Configure logging channels for server events.", icon: Settings },
];

const StatusDot = ({ color }: { color: 'green' | 'red' | 'amber' }) => {
    const colorClasses = {
        green: 'bg-chart-2',
        red: 'bg-destructive',
        amber: 'bg-amber-500',
    };
    return <span className={cn('h-2.5 w-2.5 rounded-full', colorClasses[color])} />;
};


export default async function DiscordIntegrationPage() {
    const guildId = process.env.DISCORD_GUILD_ID;
    const isDiscordConfigured = !!process.env.DISCORD_BOT_TOKEN && !!guildId;
    
    let members: DiscordMember[] = [];
    let channels: DiscordChannel[] = [];
    let apiError: string | null = null;
    let channelsByCategory: Record<string, DiscordChannel[]> = {};

    if (isDiscordConfigured) {
        try {
            // Fetch both in parallel to speed things up
            [members, channels] = await Promise.all([
                getGuildMembers(guildId!),
                getGuildChannels(guildId!)
            ]);

            channelsByCategory = channels.reduce((acc, channel) => {
                const category = channel.category || 'Uncategorized';
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(channel);
                return acc;
            }, {} as Record<string, DiscordChannel[]>);

        } catch (error) {
            apiError = error instanceof Error ? error.message : "An unknown API error occurred.";
        }
    }

    const getStatus = () => {
        if (!isDiscordConfigured) {
            return {
                text: 'Not Configured',
                color: 'amber',
                variant: 'secondary',
                className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            } as const;
        }
        if (apiError) {
            return {
                text: 'API Error',
                color: 'red',
                variant: 'destructive',
            } as const;
        }
        return {
            text: 'Connected',
            color: 'green',
            variant: 'default',
            className: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
        } as const;
    };

    const status = getStatus();


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
                <div className="flex items-center gap-4">
                     <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                        Discord Integration
                    </h1>
                     <Badge variant={status.variant} className={cn("text-xs font-mono", status.className)}>
                        <StatusDot color={status.color} />
                        <span className="ml-1.5">{status.text}</span>
                    </Badge>
                </div>

                <p className="text-xl text-muted-foreground mt-2">
                    Manage your Discord server connection and automations.
                </p>
            </header>

            {!isDiscordConfigured ? (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            Configuration Missing
                        </CardTitle>
                        <CardDescription>
                            Your Discord Bot Token and/or Server ID are not configured. Please set `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID` in your environment variables to enable this feature.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="space-y-12">
                     {apiError ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <StatusDot color="red" />
                                    API Request Failed
                                </CardTitle>
                                <CardDescription>Could not fetch data from the Discord API. Please check your Bot Token, Server ID, and that your bot has been invited to the server with the correct permissions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-destructive font-mono bg-destructive/10 p-4 rounded-md">{apiError}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Server Members Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Recent Server Members
                                    </CardTitle>
                                    <CardDescription>A list of the most recent members in your server.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Roles</TableHead>
                                                <TableHead className="text-right">Joined At</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {members.map(member => (
                                                <TableRow key={member.id}>
                                                    <TableCell className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={member.avatarUrl} alt={`${member.name}'s avatar`} data-ai-hint="user avatar" />
                                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{member.name}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {member.roles.length > 0 ? member.roles.map(role => (
                                                                <Badge key={role} variant="secondary">{role}</Badge>
                                                            )) : <span className="text-xs text-muted-foreground">No roles</span>}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs">{format(new Date(member.joinedAt), 'd MMM yyyy')}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Server Channels Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Hash className="h-5 w-5" />
                                        Server Channels
                                    </CardTitle>
                                    <CardDescription>
                                        Channels in your server, grouped by category. Click to expand.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="multiple" className="w-full">
                                        {Object.entries(channelsByCategory).map(([category, categoryChannels]) => (
                                            <AccordionItem key={category} value={category}>
                                                <AccordionTrigger className="hover:no-underline px-2 rounded-md hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{category}</span>
                                                        <Badge variant="secondary">{categoryChannels.length}</Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-1 pt-2">
                                                        {categoryChannels.map(channel => (
                                                            <div key={channel.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 ml-4">
                                                                <div className="flex items-center gap-3">
                                                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium">{channel.name}</span>
                                                                    <Badge variant="outline">{channel.type}</Badge>
                                                                </div>
                                                                <ChannelActions channel={channel} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </>
                    )}
                    
                    {/* Automation & Settings Section */}
                     <div>
                        <h2 className="text-2xl font-semibold font-headline mb-4">
                            Automation & Settings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {automationFeatures.map((feature) => (
                                <Card key={feature.title} className="hover:border-primary/50 hover:shadow-lg transition-all">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg font-headline">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
