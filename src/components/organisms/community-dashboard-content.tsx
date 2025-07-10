
'use client';

import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Signal,
    Hash,
    MessageSquare,
    ArrowUpRight
} from "lucide-react";
import type { DiscordGuildData } from "@/types";

interface CommunityDashboardContentProps {
    guildData: DiscordGuildData;
}

const quickActionFeatures = [
    {
        title: "Manage Channels",
        description: "View and edit all server channels.",
        icon: Hash,
        href: "/admin/community/channels",
    },
    {
        title: "Send Announcement",
        description: "Broadcast a message to a channel.",
        icon: MessageSquare,
        href: "/admin/community/broadcast",
    },
    {
        title: "Manage Members",
        description: "View and manage all members.",
        icon: Users,
        href: "/admin/community/members",
    },
];

export function CommunityDashboardContent({ guildData }: CommunityDashboardContentProps) {
    return (
        <div className="space-y-12">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{guildData.totalMembers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total members in the server.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online Members</CardTitle>
                        <Signal className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{guildData.onlineMembers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Members currently online.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
                        <Hash className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{guildData.totalChannels.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Text, voice, and announcement channels.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trending Topic</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">Token Listings</div>
                        <p className="text-xs text-muted-foreground">Analysis feature coming soon.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Section */}
            <div>
                <h2 className="text-2xl font-semibold font-headline mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActionFeatures.map((feature) => (
                        <Card key={feature.title} className="flex flex-col">
                            <CardHeader className="flex-grow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-lg font-headline">{feature.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">{feature.description}</CardDescription>
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href={feature.href}>
                                        Go to Page
                                        <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}