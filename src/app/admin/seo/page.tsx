
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

export default function SeoToolsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-semibold font-headline tracking-tight mb-2">
                    SEO & Linking Tools
                </h1>
                <p className="text-xl text-muted-foreground">
                    Optimize your content for search engines and manage internal links.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Under Construction</CardTitle>
                    <CardDescription>
                        This feature is currently being developed.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Future capabilities will include:
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                        <li>Sitemap generation and submission.</li>
                        <li>Keyword analysis and tracking.</li>
                        <li>Internal linking suggestions.</li>
                        <li>Broken link checker.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
