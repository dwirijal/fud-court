
'use server';

import { revalidatePath } from 'next/cache';
import { createChannel, deleteChannel, editChannel, createThread } from '../discord';
import TurndownService from 'turndown';

const revalidate = () => revalidatePath('/admin/community/channels');

export async function updateChannelAction(channelId: string, data: { name?: string; topic?: string; nsfw?: boolean; rate_limit_per_user?: number; }) {
    const updates: { [key: string]: any } = {};

    if (data.name !== undefined) updates.name = data.name;
    if (data.nsfw !== undefined) updates.nsfw = data.nsfw;
    if (data.rate_limit_per_user !== undefined) updates.rate_limit_per_user = data.rate_limit_per_user;
    
    // Convert topic from HTML to Markdown if it exists
    if (data.topic !== undefined) {
        const turndownService = new TurndownService();
        updates.topic = turndownService.turndown(data.topic);
    }


    if (Object.keys(updates).length === 0) {
        throw new Error('At least one property must be provided to update.');
    }
    if (updates.name && updates.name.trim().length === 0) {
        throw new Error('Channel name cannot be empty.');
    }

    try {
        await editChannel(channelId, updates);
        revalidate();
    } catch (error) {
        console.error('Server action updateChannelAction failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        // Re-throw the error to be caught by the client component
        throw new Error(message);
    }
}


export async function deleteChannelAction(channelId: string) {
    try {
        await deleteChannel(channelId);
        revalidate();
    } catch (error) {
        console.error('Server action deleteChannelAction failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(message);
    }
}

export async function createChannelAction(formData: FormData) {
    const name = formData.get('name') as string;
    const type = parseInt(formData.get('type') as string, 10);
    const category = formData.get('category') as string | null;

    if (!name || name.trim().length === 0) {
        throw new Error('Channel name is required.');
    }
     if (isNaN(type)) {
        throw new Error('Channel type is required.');
    }

    const payload: { name: string; type: number; parent_id?: string } = {
        name,
        type,
    };
    if (category) {
        payload.parent_id = category;
    }


    try {
        await createChannel(payload);
        revalidate();
    } catch (error) {
        console.error('Server action createChannelAction failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(message);
    }
}

export async function createThreadInChannel(formData: FormData) {
    const channelId = formData.get('channelId') as string;
    const threadName = formData.get('threadName') as string;
    const messageContent = formData.get('messageContent') as string;
    const imageFile = formData.get('image') as File | null;

    if (!threadName || threadName.trim().length === 0) {
        throw new Error('Thread name cannot be empty.');
    }
     if (!channelId) {
        throw new Error('Channel ID is missing.');
    }

    try {
        const discordApiFormData = new FormData();

        const threadPayload: { name: string; type: number; message?: { content?: string } } = {
            name: threadName,
            type: 11, // Public Thread
        };

        // Only add message object if there is content
        if (messageContent) {
           threadPayload.message = { content: messageContent };
        }
        
        discordApiFormData.append('payload_json', JSON.stringify(threadPayload));
        
        if (imageFile && imageFile.size > 0) {
             discordApiFormData.append('files[0]', imageFile, imageFile.name);
        }

        await createThread(channelId, discordApiFormData);
        revalidate();
    } catch (error) {
        console.error('Server action createThreadInChannel failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(message);
    }
}
