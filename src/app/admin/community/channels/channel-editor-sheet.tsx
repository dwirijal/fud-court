
'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
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
import { Loader2, Trash2, MessageSquarePlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { updateChannelAction, deleteChannelAction, createThreadInChannel } from '@/lib/actions/discord';
import type { DiscordChannel } from '@/types';

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

interface ChannelEditorSheetProps {
    channel: DiscordChannel | null;
    onOpenChange: (isOpen: boolean) => void;
    onActionComplete: () => void;
}

export function ChannelEditorSheet({ channel, onOpenChange, onActionComplete }: ChannelEditorSheetProps) {
    const { setOpen: setSidebarOpen } = useSidebar();
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [nsfw, setNsfw] = useState(false);
    const [slowmode, setSlowmode] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);
    
    const { toast } = useToast();

    const isOpen = !!channel;

    useEffect(() => {
        if (channel) {
            setName(channel.name);
            setTopic(channel.topic || '');
            setNsfw(channel.nsfw);
            setSlowmode(channel.rate_limit_per_user || 0);
            setSidebarOpen(false); // Collapse sidebar when sheet opens
        } else {
            // Optional: restore sidebar when sheet closes
            // setSidebarOpen(true); 
        }
    }, [channel, setSidebarOpen]);
    
    if (!channel) return null;

    const hasChanges = name !== channel.name || topic !== (channel.topic || '') || nsfw !== channel.nsfw || slowmode !== (channel.rate_limit_per_user || 0);

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
            onOpenChange(false); // Close the sheet after deletion
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
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-xl w-full flex flex-col">
                <SheetHeader>
                    <SheetTitle>Edit Channel</SheetTitle>
                    <SheetDescription>
                        Editing <span className="font-semibold text-primary">#{channel.name}</span>. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor={`name-${channel.id}`}>Channel Name</Label>
                        <Input id={`name-${channel.id}`} value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`topic-${channel.id}`}>Channel Description (Topic)</Label>
                        <Textarea id={`topic-${channel.id}`} value={topic} onChange={(e) => setTopic(e.target.value)} disabled={isSubmitting} placeholder="Let people know what this channel is for." />
                    </div>
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
                    <div className="flex items-center space-x-2">
                        <Switch id={`nsfw-${channel.id}`} checked={nsfw} onCheckedChange={setNsfw} disabled={isSubmitting} />
                        <Label htmlFor={`nsfw-${channel.id}`}>Age-Restricted (NSFW)</Label>
                    </div>
                </div>
                <SheetFooter className="mt-auto pt-4 border-t">
                    <div className="flex justify-between w-full">
                        <div className="flex gap-2">
                            <Button onClick={() => setIsThreadDialogOpen(true)} variant="outline" size="sm" disabled={!canHaveThreads || isSubmitting}>
                                <MessageSquarePlus className="mr-2 h-4 w-4" /> Create Thread
                            </Button>
                            <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" size="sm" disabled={isSubmitting || isDeleting}>
                                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Delete
                            </Button>
                        </div>
                         <Button onClick={handleSave} size="sm" disabled={!hasChanges || isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>

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
        </Sheet>
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
