
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import {
    Users,
    Mail,
    BarChart3,
    Bot
} from "lucide-react";

const communityFeatures = [
    {
        title: "User Management",
        description: "View and manage all registered members of your user base.",
        icon: Users,
        href: "/admin/users",
    },
    {
        title: "Discord Integration",
        description: "Connect and manage your Discord server, roles, and automations.",
        icon: Bot,
        href: "/admin/community/discord",
    },
    {
        title: "Email & Offer Tools",
        description: "Manage newsletters and member offers directly in your Ghost Admin Dashboard.",
        icon: Mail,
        href: "/admin/ghost",
        external: true,
    },
    {
        title: "Engagement Analytics",
        description: "Track member growth, email open rates, and other key community metrics.",
        icon: BarChart3,
        href: "#",
    },
];


export default function CommunityPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Community Hub
                </h1>
                <p className="text-xl text-muted-foreground">
                    Tools to manage, engage, and grow your audience.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {communityFeatures.map((feature) => (
                    <Link
                        href={feature.href}
                        key={feature.title}
                        className="group block h-full"
                        aria-disabled={feature.href === '#'}
                        onClick={(e) => { if (feature.href === '#') e.preventDefault(); }}
                        {...(feature.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                        <Card className="flex flex-col hover:border-primary/50 hover:shadow-lg transition-all h-full group-aria-disabled:pointer-events-none group-aria-disabled:opacity-60">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-lg font-headline">{feature.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
