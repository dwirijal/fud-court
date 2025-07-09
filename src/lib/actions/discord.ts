
'use server';

import { revalidatePath } from 'next/cache';
import { editChannel } from '../discord';

export async function updateChannelName(channelId: string, newName: string) {
    if (!process.env.DISCORD_GUILD_ID) {
        throw new Error('Discord Guild ID is not configured.');
    }
    if (!newName || newName.trim().length === 0) {
        throw new Error('Channel name cannot be empty.');
    }

    try {
        await editChannel(channelId, { name: newName });
        revalidatePath('/admin/community/discord');
    } catch (error) {
        console.error('Server action updateChannelName failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        // Re-throw the error to be caught by the client component
        throw new Error(message);
    }
}
