import { redirect } from 'next/navigation';

export default function DeprecatedDashboardPage() {
    // This page is deprecated. Redirect to the new admin root.
    redirect('/admin');
}
