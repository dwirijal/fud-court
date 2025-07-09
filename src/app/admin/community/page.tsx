
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
    Ticket,
    BarChart3
} from "lucide-react";

const communityFeatures = [
    {
        title: "Member Directory",
        description: "View, search, and manage all registered members from your Ghost publication.",
        icon: Users,
        href: "#",
    },
    {
        title: "Email Newsletters",
        description: "Create and send one-off email newsletters directly to your audience segments.",
        icon: Mail,
        href: "#",
    },
    {
        title: "Offer Management",
        description: "Create special offers and unique discount codes for your paid membership tiers.",
        icon: Ticket,
        href: "#",
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
