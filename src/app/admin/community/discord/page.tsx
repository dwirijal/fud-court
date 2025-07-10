
import { redirect } from 'next/navigation';

// This page is deprecated and now redirects to the new, more specific
// /admin/community/channels page to better align with the new IA.
export default function DeprecatedDiscordPage() {
    redirect('/admin/community/channels');
}
