
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { DiscordChannel } from "@/types";
import { ChannelEditor } from './channel-editor';
import { useSidebar } from "@/hooks/use-sidebar";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChannelEditorSheetProps {
    channel: DiscordChannel | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onActionComplete: () => void;
}

export function ChannelEditorSheet({ channel, open, onOpenChange, onActionComplete }: ChannelEditorSheetProps) {
    const { setOpen: setSidebarOpen } = useSidebar();

    useEffect(() => {
        if (open && window.innerWidth > 768) {
            setSidebarOpen(false);
        }
    }, [open, setSidebarOpen]);

    if (!channel) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="text-2xl font-headline">Edit Channel</SheetTitle>
                    <SheetDescription>
                        Manage settings for <span className="font-semibold text-primary">#{channel.name}</span>
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow">
                    <ChannelEditor 
                        channel={channel} 
                        onActionComplete={onActionComplete} 
                        onClose={() => onOpenChange(false)}
                    />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
