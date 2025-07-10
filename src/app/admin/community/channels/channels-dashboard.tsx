
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Terminal,
    Hash,
    PlusCircle,
    Loader2,
    AlertTriangle,
    Edit,
    ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getGuildChannels } from "@/lib/discord";
import type { DiscordChannel } from "@/types";
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
import { createChannelAction, updateChannelAction } from '@/lib/actions/discord';
import { useToast } from "@/hooks/use-toast";
import { ChannelEditorSheet } from './channel-editor-sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

const StatusDot = ({ color }: { color: 'green' | 'red' | 'amber' }) => {
    const colorClasses = {
        green: 'bg-chart-2',
        red: 'bg-destructive',
        amber: 'bg-amber-500',
    };
    return <span className={cn('h-2.5 w-2.5 rounded-full', colorClasses[color])} />;
};

function CreateChannelDialog({ categories, open, onOpenChange, onActionComplete }: { categories: DiscordChannel[], open: boolean, onOpenChange: (open: boolean) => void, onActionComplete: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('type', type!);
            if (category) {
                formData.append('category', category);
            }
            
            await createChannelAction(formData);
            toast({
                title: "Success",
                description: `Channel "${name}" has been created.`,
            });
            onOpenChange(false); // Close dialog on success
            onActionComplete(); // Refresh data
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
    
    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setName('');
            setType(undefined);
            setCategory(undefined);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create New Channel</DialogTitle>
                        <DialogDescription>
                            Configure a new channel or category for your Discord server.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="general-chat" required disabled={isSubmitting} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select name="type" required disabled={isSubmitting} onValueChange={setType} value={type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an item type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Text Channel</SelectItem>
                                    <SelectItem value="2">Voice Channel</SelectItem>
                                    <SelectItem value="5">Announcement Channel</SelectItem>
                                    <SelectItem value="4">Category</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         {type !== '4' && ( // Don't show category selector if creating a category
                            <div className="space-y-2">
                                <Label htmlFor="category">Category (Optional)</Label>
                                <Select name="category" disabled={isSubmitting} onValueChange={setCategory} value={category}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting || !name || !type}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Creating...' : 'Create Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditCategoryDialog({ category, open, onOpenChange, onActionComplete }: { category: DiscordChannel | null, open: boolean, onOpenChange: (open: boolean) => void, onActionComplete: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);
    
    if (!category) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await updateChannelAction(category.id, { name });
            toast({
                title: "Success",
                description: `Category "${name}" has been updated.`,
            });
            onOpenChange(false);
            onActionComplete();
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : "Failed to update category.",
                variant: 'destructive'
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
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update the name for the <span className="font-semibold">{category.name}</span> category.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" disabled={isSubmitting}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting || name === category.name}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface ChannelsDashboardProps {
    initialChannels: DiscordChannel[];
    isDiscordConfigured: boolean;
    apiError: string | null;
}

export function ChannelsDashboard({ initialChannels, isDiscordConfigured, apiError: initialApiError }: ChannelsDashboardProps) {
    const [channels, setChannels] = useState<DiscordChannel[]>(initialChannels);
    const [apiError, setApiError] = useState<string | null>(initialApiError);
    const [isLoading, setIsLoading] = useState(false);
    const [channelsByCategory, setChannelsByCategory] = useState<Record<string, DiscordChannel[]>>({});
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<DiscordChannel | null>(null);
    const [editingChannel, setEditingChannel] = useState<DiscordChannel | null>(null);

    const groupChannels = (channelsToGroup: DiscordChannel[]) => {
        const categories = channelsToGroup.filter(c => c.type === 'Category');
        const categoryMap = categories.reduce((acc, cat) => {
            acc[cat.id] = { name: cat.name, position: cat.position, id: cat.id };
            return acc;
        }, {} as Record<string, { name: string; position: number; id: string; }>);

        const grouped = channelsToGroup
         .filter(c => c.type !== 'Category')
         .reduce((acc, channel) => {
            const categoryName = channel.parentId ? categoryMap[channel.parentId]?.name || 'Uncategorized' : 'Uncategorized';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(channel);
            return acc;
        }, {} as Record<string, DiscordChannel[]>);
        
        const categoryPositions: Record<string, { name: string; position: number, id: string | null }> = { 'Uncategorized': { name: 'Uncategorized', position: 9999, id: null } };
        categories.forEach(cat => {
            categoryPositions[cat.name] = { name: cat.name, position: cat.position, id: cat.id };
        });
        
        const sortedCategoryNames = Object.keys(grouped).sort((a,b) => {
            const posA = categoryPositions[a]?.position ?? 9999;
            const posB = categoryPositions[b]?.position ?? 9999;
            return posA - posB;
        });
        
        const sortedGrouped = sortedCategoryNames.reduce((acc, catName) => {
            acc[catName] = grouped[catName].sort((a, b) => a.position - b.position);
            return acc;
        }, {} as Record<string, DiscordChannel[]>);

        setChannelsByCategory(sortedGrouped);
    };

    useEffect(() => {
        groupChannels(channels);
    }, [channels]);
    
    const fetchChannels = async () => {
        if (!isDiscordConfigured) return;

        setIsLoading(true);
        try {
            const fetchedChannels = await getGuildChannels();
            setChannels(fetchedChannels);
            setApiError(null);
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "An unknown API error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
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
    const categories = channels.filter(c => c.type === 'Category').sort((a, b) => a.position - b.position);

    const getCategoryByName = (name: string) => categories.find(c => c.name === name);

    return (
        <>
            <header className="mb-12">
                <div className="flex items-center gap-4">
                    <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight">
                        Manage Channels
                    </h1>
                    <Badge variant={status.variant} className={cn("text-xs font-mono", status.className)}>
                        <StatusDot color={status.color} />
                        <span className="ml-1.5">{status.text}</span>
                    </Badge>
                </div>
                <p className="text-xl text-muted-foreground mt-2">
                    View, edit, and organize your Discord server channels.
                </p>
            </header>

            {isLoading ? (
                 <Card>
                    <CardHeader><CardTitle>Loading...</CardTitle></CardHeader>
                    <CardContent className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></CardContent>
                </Card>
            ) : !isDiscordConfigured ? (
                 <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="h-5 w-5" />Configuration Missing</CardTitle></CardHeader>
                    <CardContent><p className="text-muted-foreground">Your Discord Bot Token and/or Server ID are not configured. Please set `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID` in your `.env.local` file to enable this feature.</p></CardContent>
                </Card>
            ) : apiError ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />API Request Failed</CardTitle>
                        <CardDescription>Could not fetch data from the Discord API. Please check your Bot Token, Server ID, and that your bot has been invited to the server with the correct permissions.</CardDescription>
                    </CardHeader>
                    <CardContent><p className="text-sm text-destructive font-mono bg-destructive/10 p-4 rounded-md">{apiError}</p></CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="flex-grow">
                            <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" />Server Channels</CardTitle>
                            <CardDescription className="mt-1">Expand a category to see its channels. Click a channel to edit.</CardDescription>
                        </div>
                         {isDiscordConfigured && (
                            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Item
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                       <Accordion type="multiple" className="w-full space-y-2">
                            {Object.entries(channelsByCategory).map(([categoryName, categoryChannels]) => (
                                <AccordionItem key={categoryName} value={categoryName} className="border-none">
                                    <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                        <AccordionTrigger className="p-0 flex-1 hover:no-underline">
                                            <div className="flex items-center gap-2">
                                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                                {categoryName}
                                            </div>
                                        </AccordionTrigger>
                                        {categoryName !== 'Uncategorized' && (
                                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={(e) => { e.stopPropagation(); setEditingCategory(getCategoryByName(categoryName) || null); }}>
                                                <Edit className="h-3 w-3" />
                                                <span className="sr-only">Edit Category</span>
                                            </Button>
                                        )}
                                    </div>
                                    <AccordionContent className="p-0 pl-4">
                                        <div className="border-l py-2 space-y-1">
                                            {categoryChannels.map(channel => (
                                                <div key={channel.id} className="flex items-center justify-between p-2 pl-4 rounded-md hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                                        <div className="flex flex-col text-left">
                                                            <span className="font-medium">{channel.name}</span>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs h-5">{channel.type}</Badge>
                                                                {channel.nsfw && <Badge variant="destructive" className="text-xs h-5">NSFW</Badge>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={() => setEditingChannel(channel)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Button>
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

            <CreateChannelDialog categories={categories} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onActionComplete={fetchChannels} />
            <EditCategoryDialog category={editingCategory} open={!!editingCategory} onOpenChange={() => setEditingCategory(null)} onActionComplete={fetchChannels} />
            <ChannelEditorSheet 
                channel={editingChannel}
                open={!!editingChannel}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setEditingChannel(null);
                    }
                }}
                onActionComplete={() => {
                    fetchChannels();
                    // Keep sheet open for further edits, user can close it manually
                }}
            />
        </>
    );
}
