
'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, MessageSquarePlus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import type { DiscordChannel } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { updateChannelName, deleteChannelAction, createThreadInChannel } from '@/lib/actions/discord';
import { Textarea } from '../ui/textarea';

interface ChannelActionsProps {
    channel: DiscordChannel;
    onActionComplete: () => void;
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
                             <Label htmlFor="image-upload" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer">
                                <ImageIcon className="h-4 w-4" />
                                <span>{imageFile ? "Change image" : "Upload an image (optional)"}</span>
                            </Label>
                            <Input id="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg, image/gif" disabled={isSubmitting} />
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


export function ChannelActions({ channel, onActionComplete }: ChannelActionsProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for Edit Dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState(channel.name);

    // State for Thread Dialog
    const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);

    // State for Delete Alert
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newChannelName === channel.name || newChannelName.trim() === '') return;
        
        setIsSubmitting(true);
        try {
            await updateChannelName(channel.id, newChannelName);
            toast({
                title: 'Success',
                description: `Channel renamed to "${newChannelName}".`,
            });
            setIsEditDialogOpen(false);
            onActionComplete();
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : "Failed to rename channel.",
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
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
            setIsSubmitting(false);
        }
    }

    const canHaveThreads = channel.type === 'Text' || channel.type === 'Announcement';


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Channel actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Channel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsThreadDialogOpen(true)} disabled={!canHaveThreads}>
                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                        <span>Create Thread</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setIsDeleteDialogOpen(true)} className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Channel</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Channel Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Channel</DialogTitle>
                        <DialogDescription>
                            Make changes to your channel here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value)}
                                    className="col-span-3"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" disabled={isSubmitting}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting || newChannelName.trim() === '' || newChannelName === channel.name}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Thread Dialog */}
            <CreateThreadDialog 
                channel={channel} 
                open={isThreadDialogOpen} 
                onOpenChange={setIsThreadDialogOpen} 
                onActionComplete={onActionComplete} 
            />

            {/* Delete Channel Alert Dialog */}
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
                    <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-destructive hover:bg-destructive/90">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
