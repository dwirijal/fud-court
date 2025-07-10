
'use server';

import { redirect } from 'next/navigation';

// This page is deprecated and now redirects to the new, more specific
// /admin/community/channels page to better align with the new IA.
// This change was made to support a more modular approach to community management.
export default function DeprecatedDiscordPage() {
    redirect('/admin/community/channels');
}
