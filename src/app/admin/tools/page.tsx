
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

export default function ToolsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Card>
                <CardHeader>
                    <CardTitle>Tools & Automation</CardTitle>
                    <CardDescription>
                        This page is under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Management of AI workflows, webhooks, publishing automation, and scheduled scripts will be available here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
