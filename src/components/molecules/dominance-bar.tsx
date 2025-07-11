
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type LucideProps } from "lucide-react";

interface DominanceBarProps {
    title: string;
    percentage: number;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

export function DominanceBar({ title, percentage, icon: Icon }: DominanceBarProps) {
    return (
        <Card className="bg-card/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-mono">{percentage.toFixed(2)}%</div>
                <Progress value={percentage} className="mt-2 h-2" />
            </CardContent>
        </Card>
    );
}
