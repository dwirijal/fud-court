
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, PlusCircle, Trash2 } from "lucide-react";
import type { DiscordChannel } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { updateChannelName } from '@/lib/actions/discord';

interface ChannelActionsProps {
    channel: DiscordChannel;
}

export function ChannelActions({ channel }: ChannelActionsProps) {
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newChannelName, setNewChannelName] = useState(channel.name);

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newChannelName === channel.name || newChannelName.trim() === '') {
            return;
        }
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
                    <DropdownMenuItem disabled>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Create Thread</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled className="text-destructive focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Channel</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

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
        </>
    );
}
