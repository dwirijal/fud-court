
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

export default function UsersPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        This page is under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Functionality to manage users, roles, and permissions will be implemented here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
