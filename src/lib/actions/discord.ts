
'use server';

import { revalidatePath } from 'next/cache';
import { createChannel, deleteChannel, editChannel, createThread } from '../discord';

const revalidate = () => revalidatePath('/admin/community/channels');

export async function updateChannelName(channelId: string, newName: string) {
    if (!newName || newName.trim().length === 0) {
        throw new Error('Channel name cannot be empty.');
    }

    try {
        await editChannel(channelId, { name: newName });
        revalidate();
    } catch (error) {
        console.error('Server action updateChannelName failed:', error);
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
        // Create a new FormData object to send to the Discord API.
        const discordApiFormData = new FormData();
        
        // This is the payload for the thread itself. It must always be present.
        const threadPayload: { name: string; type: number; message?: { content?: string } } = {
            name: threadName,
            type: 11, // 11 = Public Thread
        };

        // If there's content OR an image, we need to construct a message payload.
        if (messageContent || (imageFile && imageFile.size > 0)) {
            const message: { content?: string } = {};
            if (messageContent) {
                message.content = messageContent;
            }
             // Add the message object to the thread payload
            threadPayload.message = message;
        }
        
        // Append the final JSON payload to the form data.
        discordApiFormData.append('payload_json', JSON.stringify(threadPayload));

        // Attach the image file if it exists, using the correct field name `files[0]`.
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
