import { redirect } from 'next/navigation';
import { AppShell } from '@/components/organisms/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function GhostAdminPage() {
  const ghostUrl = process.env.GHOST_API_URL;

  if (ghostUrl) {
    // The standard path for the Ghost admin dashboard is /ghost/
    // We remove any trailing slash from the URL to prevent double slashes.
    redirect(`${ghostUrl.replace(/\/$/, '')}/ghost/`);
  }

  // If the URL isn't configured, show a helpful message instead of a broken redirect.
  return (
    <AppShell>
        <div className="container mx-auto px-4 py-12 md:py-24 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Ghost Admin Not Configured</CardTitle>
                    <CardDescription>
                        The link to your Ghost Dashboard could not be generated.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Please ensure the `GHOST_API_URL` is correctly set in your `.env.local` file to enable this feature.
                    </p>
                </CardContent>
            </Card>
        </div>
    </AppShell>
  );
}
