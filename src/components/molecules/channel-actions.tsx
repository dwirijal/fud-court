
'use client';

import { useState } from 'react';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, PlusCircle, Trash2, MessageSquarePlus } from "lucide-react";
import type { DiscordChannel } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { updateChannelName, deleteChannelAction, createThreadInChannel } from '@/lib/actions/discord';

interface ChannelActionsProps {
    channel: DiscordChannel;
}

export function ChannelActions({ channel }: ChannelActionsProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for Edit Dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState(channel.name);

    // State for Thread Dialog
    const [isThreadDialogOpen, setIsThreadDialogOpen] = useState(false);
    const [threadName, setThreadName] = useState('');

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

     const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (threadName.trim() === '') return;

        setIsSubmitting(true);
        try {
            await createThreadInChannel(channel.id, threadName);
            toast({
                title: 'Success',
                description: `Thread "${threadName}" created in #${channel.name}.`,
            });
            setIsThreadDialogOpen(false);
            setThreadName('');
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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Channel</span>
                            </div>
                        </AlertDialogTrigger>
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
                            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
                                {isSubmitting ? 'Deleting...' : 'Continue'}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Create Thread Dialog */}
            <Dialog open={isThreadDialogOpen} onOpenChange={setIsThreadDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Thread in #{channel.name}</DialogTitle>
                        <DialogDescription>
                            Enter a name for your new thread.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateThread}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="thread-name" className="text-right">
                                    Thread Name
                                </Label>
                                <Input
                                    id="thread-name"
                                    value={threadName}
                                    onChange={(e) => setThreadName(e.target.value)}
                                    className="col-span-3"
                                    disabled={isSubmitting}
                                    placeholder="e.g., Weekly AMA discussion"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" disabled={isSubmitting}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting || threadName.trim() === ''}>
                                {isSubmitting ? 'Creating...' : 'Create Thread'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
