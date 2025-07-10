
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
    Terminal, 
    Hash, 
    PlusCircle,
    Loader2,
    AlertTriangle,
    MessageSquarePlus,
    Trash2
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
import { Switch } from "@/components/ui/switch";
import { createChannelAction, updateChannelAction, deleteChannelAction, createThreadInChannel } from '@/lib/actions/discord';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


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

const slowmodeOptions = [
    { value: 0, label: 'Off' },
    { value: 5, label: '5 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 900, label: '15 minutes' },
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 hour' },
    { value: 7200, label: '2 hours' },
    { value: 21600, label: '6 hours' },
];

function ChannelEditor({ channel, onActionComplete }: { channel: DiscordChannel, onActionComplete: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);
    
    const [name, setName] = useState(channel.name);
    const [topic, setTopic] = useState(channel.topic || '');
    const [nsfw, setNsfw] = useState(channel.nsfw);
    const [slowmode, setSlowmode] = useState(channel.rate_limit_per_user);

    const hasChanges = name !== channel.name || topic !== (channel.topic || '') || nsfw !== channel.nsfw || slowmode !== channel.rate_limit_per_user;

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            await updateChannelAction(channel.id, {
                name: name !== channel.name ? name : undefined,
                topic: topic !== (channel.topic || '') ? topic : undefined,
                nsfw: nsfw !== channel.nsfw ? nsfw : undefined,
                rate_limit_per_user: slowmode !== channel.rate_limit_per_user ? slowmode : undefined,
            });
            toast({
                title: "Success",
                description: `Channel #${channel.name} has been updated.`,
            });
            onActionComplete();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update channel.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteChannelAction(channel.id);
            toast({
                title: 'Success',
                description: `Channel "${channel.name}" has been deleted.`,
            });
            setIsDeleteDialogOpen(false);
            onActionComplete();
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : "Failed to delete channel.",
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const canHaveThreads = channel.type === 'Text' || channel.type === 'Announcement';
    
    return (
        <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`name-${channel.id}`}>Channel Name</Label>
                    <Input id={`name-${channel.id}`} value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`topic-${channel.id}`}>Channel Description (Topic)</Label>
                    <Textarea id={`topic-${channel.id}`} value={topic} onChange={(e) => setTopic(e.target.value)} disabled={isSubmitting} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor={`slowmode-${channel.id}`}>Slowmode</Label>
                    <Select
                        value={slowmode?.toString()}
                        onValueChange={(v) => setSlowmode(parseInt(v, 10))}
                        disabled={isSubmitting || channel.type === 'Voice'}
                    >
                        <SelectTrigger id={`slowmode-${channel.id}`}>
                            <SelectValue placeholder="Select slowmode" />
                        </SelectTrigger>
                        <SelectContent>
                            {slowmodeOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                    <Switch id={`nsfw-${channel.id}`} checked={nsfw} onCheckedChange={setNsfw} disabled={isSubmitting} />
                    <Label htmlFor={`nsfw-${channel.id}`}>Age-Restricted (NSFW)</Label>
                </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
                 <div className="flex gap-2">
                    <Button onClick={() => setIsThreadDialogOpen(true)} variant="outline" size="sm" disabled={!canHaveThreads || isSubmitting}>
                        <MessageSquarePlus className="mr-2 h-4 w-4" /> Create Thread
                    </Button>
                     <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" size="sm" disabled={isSubmitting}>
                         {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                         Delete
                    </Button>
                </div>
                 <Button onClick={handleSave} size="sm" disabled={!hasChanges || isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
            <CreateThreadDialog 
                channel={channel} 
                open={isThreadDialogOpen} 
                onOpenChange={setIsThreadDialogOpen} 
                onActionComplete={onActionComplete} 
            />
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        <span className="font-bold"> #{channel.name} </span>
                        channel and all of its messages.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function CreateThreadDialog({ channel, open, onOpenChange, onActionComplete }: { channel: DiscordChannel, open: boolean, onOpenChange: (open: boolean) => void, onActionComplete: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [threadName, setThreadName] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (threadName.trim() === '') {
            toast({ title: "Error", description: "Thread name is required.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('channelId', channel.id);
            formData.append('threadName', threadName);
            formData.append('messageContent', messageContent);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            await createThreadInChannel(formData);
            
            toast({
                title: 'Success',
                description: `Thread "${threadName}" created successfully in #${channel.name}.`,
            });
            onActionComplete();
            onOpenChange(false);
            // Reset form
            setThreadName('');
            setMessageContent('');
            setImageFile(null);

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : "Failed to create thread.",
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Thread in #{channel.name}</DialogTitle>
                    <DialogDescription>
                        Start a new discussion. The first message will be sent with the thread.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="thread-name">Thread Name</Label>
                            <Input
                                id="thread-name"
                                value={threadName}
                                onChange={(e) => setThreadName(e.target.value)}
                                placeholder="e.g., Weekly AMA discussion"
                                disabled={isSubmitting}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="message-content">Message (Optional)</Label>
                            <Textarea
                                id="message-content"
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                placeholder="Your first message in the thread..."
                                disabled={isSubmitting}
                                rows={5}
                            />
                        </div>
                         <div>
                            <Label htmlFor="image-upload" className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer">
                                Upload an image (optional)
                            </Label>
                            <Input id="image-upload" type="file" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" disabled={isSubmitting} />
                            {imageFile && <p className="text-xs text-muted-foreground mt-2">Selected: {imageFile.name}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting || !threadName}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? 'Creating...' : 'Create Thread'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
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

    const groupChannels = (channelsToGroup: DiscordChannel[]) => {
        const grouped = channelsToGroup
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
    const categories = channels.filter(c => c.type === 'Category');

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
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Your Discord Bot Token and/or Server ID are not configured. Please set `DISCORD_BOT_TOKEN` and `DISCORD_GUILD_ID` in your `.env.local` file to enable this feature.</p>
                    </CardContent>
                </Card>
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
            ) : (
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="flex-grow">
                            <CardTitle className="flex items-center gap-2">
                                <Hash className="h-5 w-5" />
                                Server Channels
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Channels in your server, grouped by category. Click to expand and edit.
                            </CardDescription>
                        </div>
                         {isDiscordConfigured && (
                            <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Channel
                            </Button>
                        )}
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
                                            <Accordion type="multiple" className="w-full">
                                                {categoryChannels.map(channel => (
                                                    <AccordionItem value={channel.id} key={channel.id} className="border-b-0">
                                                        <AccordionTrigger className="flex items-center justify-between rounded-md p-2 hover:bg-muted/50 ml-4 hover:no-underline">
                                                                <div className="flex items-center gap-2">
                                                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium">{channel.name}</span>
                                                                    <Badge variant="outline">{channel.type}</Badge>
                                                                    {channel.nsfw && <Badge variant="destructive">NSFW</Badge>}
                                                                </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 ml-8 bg-background rounded-b-md border">
                                                           <ChannelEditor channel={channel} onActionComplete={fetchChannels} />
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            <CreateChannelDialog categories={categories} open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onFormSubmit={fetchChannels} />
        </>
    );
}
