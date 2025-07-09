
'use server';

import type { DiscordMember, DiscordChannel } from '@/types';

const API_BASE_URL = 'https://discord.com/api/v10';

async function discordApiFetch(endpoint: string): Promise<any> {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        throw new Error('Discord Bot Token is not configured.');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bot ${token}`,
        },
        cache: 'no-store', // Data can change frequently, so don't cache
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: response.statusText }));
        // Provide a more specific error for common issues like missing permissions.
        if (response.status === 403) {
            throw new Error(`Discord API Forbidden (403): Check if the bot has the required permissions (e.g., 'View Channels', 'Manage Roles') in this server.`);
        }
        throw new Error(`Discord API request failed: ${errorBody.message || response.statusText}`);
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
