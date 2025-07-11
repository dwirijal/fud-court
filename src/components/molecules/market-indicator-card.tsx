
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideProps } from "lucide-react";

interface MarketIndicatorCardProps {
    title: string;
    value: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export function MarketIndicatorCard({ title, value, icon: Icon }: MarketIndicatorCardProps) {
    return (
        <Card className="bg-card/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-lg sm:text-2xl font-bold font-mono">{value}</div>
            </CardContent>
        </Card>
    );
}
