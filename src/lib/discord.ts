
'use server';

import type { DiscordMember, DiscordChannel } from '@/types';

const API_BASE_URL = 'https://discord.com/api/v10';

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
    body?: Record<string, any>;
}

async function discordApiFetch(endpoint: string, options: FetchOptions = {}): Promise<any> {
    const { method = 'GET', body } = options;
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        throw new Error('Discord Bot Token is not configured.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    
    const fetchOptions: RequestInit = {
        method,
        headers: {
            'Authorization': `Bot ${token}`,
        },
        // Use a short revalidation time for guild data to keep it fresh
        next: { revalidate: 60 }, 
    };

    if (body) {
        // Only add Content-Type header if there is a body
        (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
        fetchOptions.body = JSON.stringify(body);
        // Don't cache mutating requests
        delete (fetchOptions as any).next;
    }
    
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        // Provide a more specific error for common issues like missing permissions.
        if (response.status === 403) {
            throw new Error(`Discord API Forbidden (403): Check if the bot has the required permissions (e.g., 'Manage Channels') in this server.`);
        }
        throw new Error(`Discord API request failed: ${errorBody.message || response.statusText}`);
    }
    
    // Handle responses with no content, like a successful PATCH or DELETE
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

/**
 * Fetches members and their roles from a Discord guild.
 * @param guildId The ID of the Discord server.
 * @param limit The number of members to fetch. Defaults to 25.
 * @returns A promise that resolves to an array of DiscordMember objects.
 */
export async function getGuildMembers(guildId: string, limit: number = 25): Promise<DiscordMember[]> {
    try {
        const [members, rolesData] = await Promise.all([
            discordApiFetch(`/guilds/${guildId}/members?limit=${limit}`),
            discordApiFetch(`/guilds/${guildId}/roles`)
        ]);

        const rolesMap = rolesData.reduce((acc: any, role: any) => {
            acc[role.id] = role.name;
            return acc;
        }, {} as Record<string, string>);

        return members.map((member: any) => ({
            id: member.user.id,
            name: member.nick || member.user.global_name || member.user.username,
            avatarUrl: member.user.avatar
                ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.user.discriminator) % 5}.png`,
            roles: member.roles
                .map((roleId: string) => rolesMap[roleId])
                .filter((roleName: string | undefined) => roleName && roleName !== '@everyone'),
            joinedAt: member.joined_at,
        }));
    } catch (error) {
        console.error('Failed to fetch guild members from Discord:', error);
        throw error; // Re-throw to be caught by the page component
    }
}


/**
 * Fetches channels from a Discord guild.
 * @param guildId The ID of the Discord server.
 * @returns A promise that resolves to an array of DiscordChannel objects.
 */
export async function getGuildChannels(guildId: string): Promise<DiscordChannel[]> {
     try {
        const channels: any[] = await discordApiFetch(`/guilds/${guildId}/channels`);
        
        const channelCategories = channels.reduce((acc, channel) => {
            if (channel.type === 4) { // GUILD_CATEGORY
                acc[channel.id] = channel.name;
            }
            return acc;
        }, {} as Record<string, string>);

        return channels
            .filter(channel => [0, 2, 5].includes(channel.type)) // Text, Voice, Announcement channels
            .sort((a, b) => (a.position || 0) - (b.position || 0)) // Sort by position
            .map((channel: any) => {
                let type: DiscordChannel['type'] = 'Text';
                if (channel.type === 2) type = 'Voice';
                if (channel.type === 5) type = 'Announcement';

                return {
                    id: channel.id,
                    name: channel.name,
                    type,
                    category: channel.parent_id ? channelCategories[channel.parent_id] || 'Uncategorized' : 'Uncategorized',
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
 * @param data The data to update, e.g., { name: 'new-name' }.
 * @returns A promise that resolves when the channel is edited.
 */
export async function editChannel(channelId: string, data: { name: string }): Promise<void> {
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
 * Fetches comprehensive data about a Discord guild.
 * @param guildId The ID of the Discord server.
 * @returns A promise that resolves to an object with guild details.
 */
export async function getGuildData(guildId: string) {
    try {
        const [guild, channels] = await Promise.all([
            discordApiFetch(`/guilds/${guildId}?with_counts=true`),
            getGuildChannels(guildId)
        ]);

        return {
            name: guild.name,
            iconUrl: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
            totalMembers: guild.approximate_member_count,
            onlineMembers: guild.approximate_presence_count,
            totalChannels: channels.length,
        };
    } catch (error) {
        console.error('Failed to fetch comprehensive guild data from Discord:', error);
        throw error;
    }
}
