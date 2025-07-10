
'use server';

import type { DiscordChannel, DiscordGuildData } from '@/types';

const API_BASE_URL = 'https://discord.com/api/v10';

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
    body?: Record<string, any> | FormData;
    noCache?: boolean;
}

async function discordApiFetch(endpoint: string, options: FetchOptions = {}): Promise<any> {
    const { method = 'GET', body, noCache = false } = options;
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        throw new Error('Discord Bot Token is not configured.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
        'Authorization': `Bot ${token}`,
    };
    
    const fetchOptions: RequestInit = {
        method,
        headers,
        // Caching strategy: no-cache for mutations, 60s for GET
        cache: (method !== 'GET' || noCache) ? 'no-store' : undefined,
        next: (method === 'GET' && !noCache) ? { revalidate: 60 } : undefined,
    };

    if (body) {
        if (body instanceof FormData) {
            // Let the runtime set the Content-Type header for FormData
            fetchOptions.body = body;
        } else {
            headers['Content-Type'] = 'application/json';
            fetchOptions.body = JSON.stringify(body);
        }
    }
    
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText, ...response }));
        if (response.status === 403) {
            throw new Error(`Discord API Forbidden (403): Check if the bot has the required permissions (e.g., 'Manage Channels', 'Create Public Threads') in this server.`);
        }
        const apiErrorMessage = errorBody.message || JSON.stringify(errorBody);
        throw new Error(`Discord API request failed: ${apiErrorMessage}`);
    }
    
    if (response.status === 204) {
        return null;
    }

    return response.json();
}


/**
 * Fetches channels from a Discord guild.
 * @returns A promise that resolves to an array of DiscordChannel objects.
 */
export async function getGuildChannels(): Promise<DiscordChannel[]> {
    const guildId = process.env.DISCORD_GUILD_ID;
    if (!guildId) throw new Error('Discord Guild ID is not configured.');

     try {
        const channels: any[] = await discordApiFetch(`/guilds/${guildId}/channels`, { noCache: true });
        
        return channels
            .filter(channel => [0, 2, 5, 4].includes(channel.type)) // Text, Voice, Announcement, Category channels
            .map((channel: any) => {
                let type: DiscordChannel['type'] = 'Text';
                if (channel.type === 2) type = 'Voice';
                if (channel.type === 5) type = 'Announcement';
                if (channel.type === 4) type = 'Category';

                return {
                    id: channel.id,
                    name: channel.name,
                    type,
                    topic: channel.topic,
                    parentId: channel.parent_id,
                    position: channel.position,
                    nsfw: channel.nsfw || false,
                    rate_limit_per_user: channel.rate_limit_per_user || 0,
                };
            });
    } catch (error) {
        console.error('Failed to fetch guild channels from Discord:', error);
        throw error;
    }
}

/**
 * Edits a Discord channel.
 * @param channelId The ID of the channel to edit.
 * @param data The data to update, e.g., { name: 'new-name', topic: 'new-topic' }.
 * @returns A promise that resolves when the channel is edited.
 */
export async function editChannel(channelId: string, data: { name?: string; topic?: string, nsfw?: boolean, rate_limit_per_user?: number }): Promise<void> {
    try {
        await discordApiFetch(`/channels/${channelId}`, {
            method: 'PATCH',
            body: data,
        });
    } catch (error) {
        console.error(`Failed to edit channel ${channelId}:`, error);
        throw error;
    }
}

/**
 * Deletes a Discord channel.
 * @param channelId The ID of the channel to delete.
 * @returns A promise that resolves when the channel is deleted.
 */
export async function deleteChannel(channelId: string): Promise<void> {
    try {
        await discordApiFetch(`/channels/${channelId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error(`Failed to delete channel ${channelId}:`, error);
        throw error;
    }
}

/**
 * Creates a new channel in a Discord guild.
 * @param data The channel creation data.
 * @returns A promise that resolves with the created channel data.
 */
export async function createChannel(data: { name: string; type: number; parent_id?: string }): Promise<DiscordChannel> {
    const guildId = process.env.DISCORD_GUILD_ID;
    if (!guildId) throw new Error('Discord Guild ID is not configured.');
    
    try {
        return await discordApiFetch(`/guilds/${guildId}/channels`, {
            method: 'POST',
            body: data,
        });
    } catch (error) {
        console.error(`Failed to create channel in guild ${guildId}:`, error);
        throw error;
    }
}

/**
 * Creates a new thread in a channel.
 * @param channelId The ID of the parent channel.
 * @param data The thread creation data, as FormData.
 * @returns A promise that resolves with the created thread data.
 */
export async function createThread(channelId: string, data: FormData): Promise<any> {
     try {
        return await discordApiFetch(`/channels/${channelId}/threads`, {
            method: 'POST',
            body: data,
        });
    } catch (error) {
        console.error(`Failed to create thread in channel ${channelId}:`, error);
        throw error;
    }
}


/**
 * Fetches comprehensive data about a Discord guild.
 * @returns A promise that resolves to an object with guild details.
 */
export async function getGuildData(): Promise<DiscordGuildData> {
    const guildId = process.env.DISCORD_GUILD_ID;
    if (!guildId) throw new Error('Discord Guild ID is not configured.');

    try {
        const [guild, channels] = await Promise.all([
            discordApiFetch(`/guilds/${guildId}?with_counts=true`),
            getGuildChannels()
        ]);

        return {
            name: guild.name,
            iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
            totalMembers: guild.approximate_member_count,
            onlineMembers: guild.approximate_presence_count,
            totalChannels: channels.filter(c => c.type !== 'Category').length,
        };
    } catch (error) {
        console.error('Failed to fetch comprehensive guild data from Discord:', error);
        throw error;
    }
}
