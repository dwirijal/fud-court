
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
import { 
    Terminal, 
    CheckCircle, 
    Users, 
    Hash, 
    Settings, 
    MessageSquare,
    Shield,
    Bot
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data - In a real implementation, this would come from the Discord API
const mockMembers = [
    { id: '1', name: 'CryptoChad', roles: ['Admin', 'Trader'], joinedAt: '2023-01-15' },
    { id: '2', name: 'DiamondHands', roles: ['Member'], joinedAt: '2023-02-20' },
    { id: '3', name: 'MoonLambo', roles: ['Member', 'OG'], joinedAt: '2022-11-10' },
];

const mockChannels = [
    { id: '1', name: 'general-chat', type: 'Text', category: 'COMMUNITY' },
    { id: '2', name: 'alpha-calls', type: 'Text', category: 'TRADING' },
    { id: '3', name: 'memes', type: 'Text', category: 'COMMUNITY' },
    { id: '4', name: 'Trading Floor', type: 'Voice', category: 'TRADING' },
];

const automationFeatures = [
    { title: "Welcome Messages", description: "Automatically greet new members.", icon: MessageSquare },
    { title: "Role Automation", description: "Assign roles based on reactions or commands.", icon: Shield },
    { title: "Custom Commands", description: "Set up custom bot commands for your server.", icon: Bot },
    { title: "Logging & Moderation", description: "Configure logging channels for server events.", icon: Settings },
];

export default function DiscordIntegrationPage() {
    // This check determines whether to show the configuration message or the dashboard.
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

            <Card className="mb-8">
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
                            <CheckCircle className="h-4 w-4 text-chart-2" />
                            <AlertTitle>Successfully Connected</AlertTitle>
                            <AlertDescription>
                                Your Discord Bot Token is configured correctly. You can now build features that interact with the Discord API.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {isDiscordConfigured && (
                <div className="space-y-12">
                    {/* Server Members Section */}
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Server Members
                            </CardTitle>
                            <CardDescription>A list of the most recent members in your server. (Mock Data)</CardDescription>
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
                                    {mockMembers.map(member => (
                                        <TableRow key={member.id}>
                                            <TableCell className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                     <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="user avatar"/>
                                                     <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{member.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {member.roles.map(role => (
                                                        <Badge key={role} variant="secondary">{role}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-xs">{member.joinedAt}</TableCell>
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
                            <CardDescription>A list of channels in your server. (Mock Data)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Channel Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Category</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockChannels.map(channel => (
                                        <TableRow key={channel.id}>
                                            <TableCell className="font-medium">#{channel.name}</TableCell>
                                            <TableCell>{channel.type}</TableCell>
                                            <TableCell><Badge variant="outline">{channel.category}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    
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
