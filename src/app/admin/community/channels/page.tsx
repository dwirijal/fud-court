
'use client';

import { useState, useEffect } from 'react';
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
    Hash, 
    PlusCircle,
    Loader2
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getGuildChannels } from "@/lib/discord";
import type { DiscordChannel } from "@/types";
import { ChannelActions } from "@/components/molecules/channel-actions";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createChannelAction } from '@/lib/actions/discord';
import { useToast } from "@/hooks/use-toast";


const StatusDot = ({ color }: { color: 'green' | 'red' | 'amber' }) => {
    const colorClasses = {
        green: 'bg-chart-2',
        red: 'bg-destructive',
        amber: 'bg-amber-500',
    };
    return <span className={cn('h-2.5 w-2.5 rounded-full', colorClasses[color])} />;
};


function CreateChannelDialog({ categories, open, onOpenChange, onFormSubmit }: { categories: DiscordChannel[], open: boolean, onOpenChange: (open: boolean) => void, onFormSubmit: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(event.currentTarget);
            await createChannelAction(formData);
            toast({
                title: "Success",
                description: `Channel "${formData.get('name')}" has been created.`,
            });
            onOpenChange(false);
            onFormSubmit();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create channel.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Channel</DialogTitle>
                        <DialogDescription>
                            Configure the details for your new Discord channel.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" name="name" className="col-span-3" placeholder="general-chat" required disabled={isSubmitting} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Type</Label>
                            <Select name="type" required disabled={isSubmitting}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a channel type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Text Channel</SelectItem>
                                    <SelectItem value="2">Voice Channel</SelectItem>
                                    <SelectItem value="5">Announcement Channel</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                             <Select name="category" disabled={isSubmitting}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="(Optional) Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Creating...' : 'Create Channel'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// This page now needs to be wrapped in a Server Component to fetch data server-side
// and check environment variables before rendering the client component.
export default function ManageChannelsPageWrapper() {
    const isDiscordConfigured = !!process.env.DISCORD_BOT_TOKEN && !!process.env.DISCORD_GUILD_ID;
    return <ManageChannelsPage isDiscordConfigured={isDiscordConfigured} />;
}


function ManageChannelsPage({ isDiscordConfigured }: { isDiscordConfigured: boolean }) {
    const [channels, setChannels] = useState<DiscordChannel[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [channelsByCategory, setChannelsByCategory] = useState<Record<string, DiscordChannel[]>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const fetchChannels = async () => {
        if (isDiscordConfigured) {
            try {
                setIsLoading(true);
                const fetchedChannels = await getGuildChannels();

                setChannels(fetchedChannels);

                const grouped = fetchedChannels
                 .filter(c => c.type !== 'Category')
                 .reduce((acc, channel) => {
                    const category = channel.category || 'Uncategorized';
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(channel);
                    return acc;
                }, {} as Record<string, DiscordChannel[]>);

                setChannelsByCategory(grouped);

            } catch (error) {
                setApiError(error instanceof Error ? error.message : "An unknown API error occurred.");
            } finally {
                setIsLoading(false);
            }
        } else {
             setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, [isDiscordConfigured]);

    const getStatus = () => {
        if (!isDiscordConfigured) {
            return { text: 'Not Configured', color: 'amber', variant: 'secondary', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' } as const;
        }
        if (apiError) {
            return { text: 'API Error', color: 'red', variant: 'destructive' } as const;
        }
        return { text: 'Connected', color: 'green', variant: 'default', className: 'bg-chart-2/10 text-chart-2 border-chart-2/20' } as const;
    };

    const status = getStatus();
    const categories = channels.filter(c => c.type === 'Category');


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
            
            <header className="flex justify-between items-center mb-12">
                 <div>
                    <div className="flex items-center gap-4">
                         <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                            Manage Discord Channels
                        </h1>
                         <Badge variant={status.variant} className={cn("text-xs font-mono", status.className)}>
                            <StatusDot color={status.color} />
                            <span className="ml-1.5">{status.text}</span>
                        </Badge>
                    </div>

                    <p className="text-xl text-muted-foreground mt-2">
                        View, edit, and organize your Discord server channels.
                    </p>
                 </div>
                 {isDiscordConfigured && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Channel
                    </Button>
                 )}
            </header>

            {isLoading ? (
                 <Card>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-48">
                       <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </CardContent>
                </Card>
            ) : !isDiscordConfigured ? (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="h-5 w-5" />
                            Configuration Missing
                        </CardTitle>
                        <CardDescription>
                            Your Discord Bot Token and/or Server ID are not configured. Please set `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID` in your `.env.local` file to enable this feature.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : apiError ? (
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
                                                    <ChannelActions channel={channel} onActionComplete={fetchChannels} />
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            <CreateChannelDialog categories={categories} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onFormSubmit={fetchChannels} />
        </div>
    );
}
