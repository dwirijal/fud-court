
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

export default function ActivityLogsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Card>
                <CardHeader>
                    <CardTitle>Activity Logs</CardTitle>
                    <CardDescription>
                        This page is under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        A historical record of login attempts, user actions, and system events will be displayed here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
