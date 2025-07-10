
'use server';

import { revalidatePath } from 'next/cache';
import { createChannel, deleteChannel, editChannel, createThread } from '../discord';
import TurndownService from 'turndown';

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
    const htmlContent = formData.get('messageContent') as string;
    const imageFile = formData.get('image') as File;

    if (!threadName || threadName.trim().length === 0) {
        throw new Error('Thread name cannot be empty.');
    }
     if (!channelId) {
        throw new Error('Channel ID is missing.');
    }

    // Initialize Turndown to convert HTML to Markdown
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(htmlContent);

    try {
        const threadData = {
            name: threadName,
            message: {
                content: markdownContent,
            }
        };

        const threadCreationFormData = new FormData();
        threadCreationFormData.append('payload_json', JSON.stringify(threadData));

        if (imageFile && imageFile.size > 0) {
             threadCreationFormData.append(`files[0]`, imageFile, imageFile.name);
        }

        await createThread(channelId, threadCreationFormData);
        revalidate();
    } catch (error) {
        console.error('Server action createThreadInChannel failed:', error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new Error(message);
    }
}