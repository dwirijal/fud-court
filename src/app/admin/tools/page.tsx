
'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Flame,
    Rss,
    Webhook,
    CalendarClock
} from "lucide-react";

const tools = [
    {
        title: "AI Trending Topics",
        description: "View the AI-powered analysis of news feeds to identify market narratives.",
        icon: Flame,
        href: "/admin/content/trending",
        status: "active"
    },
    {
        title: "Live News Aggregator",
        description: "Monitor the latest articles from all configured RSS feeds in real-time.",
        icon: Rss,
        href: "/admin/content/feeds",
        status: "active"
    },
    {
        title: "Webhook Management",
        description: "Configure webhooks to integrate with external services and trigger workflows.",
        icon: Webhook,
        href: "#",
        status: "planned"
    },
    {
        title: "Scheduled Publishing",
        description: "Automate the publishing of content to your Ghost blog and social media channels.",
        icon: CalendarClock,
        href: "#",
        status: "planned"
    }
];

export default function ToolsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    Tools & Automation
                </h1>
                <p className="text-xl text-muted-foreground">
                    Manage AI workflows, integrations, and content automation.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <Link
                        href={tool.href}
                        key={tool.title}
                        className="group block h-full"
                        aria-disabled={tool.href === '#'}
                        onClick={(e) => { if (tool.href === '#') e.preventDefault(); }}
                    >
                        <Card className="flex flex-col hover:border-primary/50 hover:shadow-lg transition-all h-full group-aria-disabled:pointer-events-none group-aria-disabled:opacity-60">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                                        <tool.icon className="h-6 w-6" />
                                    </div>
                                    <Badge variant={tool.status === 'active' ? 'default' : 'secondary'}>
                                        {tool.status === 'active' ? 'Active' : 'Planned'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-headline pt-4">{tool.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{tool.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
