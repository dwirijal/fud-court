
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

export default function MarketsPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <Card>
                <CardHeader>
                    <CardTitle>Markets & Signals</CardTitle>
                    <CardDescription>
                        This page is under construction.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Tools for live market watching, token screening, alerts, and on-chain data analysis will be implemented here.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
