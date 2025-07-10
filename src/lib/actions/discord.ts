
'use server';

import { revalidatePath } from 'next/cache';
import { createChannel, deleteChannel, editChannel, createThread } from '../discord';

const revalidate = () => revalidatePath('/admin/community/channels');

export async function updateChannelAction(channelId: string, data: { name?: string; topic?: string; nsfw?: boolean; rate_limit_per_user?: number; }) {
    if (!data.name && !data.topic && data.nsfw === undefined && data.rate_limit_per_user === undefined) {
        throw new Error('At least one property must be provided to update.');
    }
    if (data.name && data.name.trim().length === 0) {
        throw new Error('Channel name cannot be empty.');
    }

    try {
        await editChannel(channelId, data);
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
    const category = formData.get('category') as string;

    if (!name || name.trim().length === 0) {
        throw new Error('Channel name is required.');
    }
     if (isNaN(type)) {
        throw new Error('Channel type is required.');
    }

    try {
        await createChannel({
            name,
            type,
            parent_id: category || undefined,
        });
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

        const threadPayload: { name: string; type: number; message?: { content: string } } = {
            name: threadName,
            type: 11, // Public Thread
        };

        // If there's content OR an image, we need a message object.
        if (messageContent || (imageFile && imageFile.size > 0)) {
            threadPayload.message = {
                content: messageContent,
            };
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
