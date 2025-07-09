
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

export default function LibraryPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Card>
                <CardHeader>
                    <CardTitle>Content Library</CardTitle>
                    <CardDescription>
                        This page is under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        A central repository for image assets, AI prompts, templates, and archived content will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
