
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
    BotMessageSquare,
    CalendarDays,
    Flame,
    Image as ImageIcon,
    Languages,
    Link as LinkIcon,
    ListTodo,
    Rss,
} from "lucide-react";

const contentFeatures = [
    {
        title: "Post & Thread Queue",
        description: "View, manage, and prioritize scheduled and drafted content.",
        icon: ListTodo,
        href: "/admin/content/queue",
    },
    {
        title: "Content Generator",
        description: "Use AI or manual tools to create new articles and threads.",
        icon: BotMessageSquare,
        href: "#",
    },
    {
        title: "News Sources & Feeds",
        description: "View the configured RSS feeds that power the content pipeline.",
        icon: Rss,
        href: "/admin/content/feeds",
    },
    {
        title: "Trending Topics Monitor",
        description: "Use AI to analyze news feeds and identify key market narratives.",
        icon: Flame,
        href: "/admin/content/trending",
    },
    {
        title: "Translation Tools",
        description: "Translate content between languages, such as EN to ID.",
        icon: Languages,
        href: "#",
    },
    {
        title: "SEO & Linking Tools",
        description: "Optimize content for search engines and manage internal links.",
        icon: LinkIcon,
        href: "/admin/seo",
    },
    {
        title: "Image Generator",
        description: "Create unique images for your content using AI models.",
        icon: ImageIcon,
        href: "#",
    },
    {
        title: "Content Schedule Calendar",
        description: "Visualize your content pipeline on a weekly or monthly calendar.",
        icon: CalendarDays,
        href: "#",
    },
];


export default function ContentPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    News & Content Management
                </h1>
                <p className="text-xl text-muted-foreground">
                    A powerful suite of tools for your entire content workflow.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {contentFeatures.map((feature) => (
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
