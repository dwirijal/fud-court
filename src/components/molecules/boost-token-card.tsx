
import type { BoostedToken } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, ShieldCheck, ShieldX, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export function BoostTokenCard({ boost }: { boost: BoostedToken }) {
  const auditOk = boost.audit.is_open_source && !boost.audit.is_honeypot;
  const time = new Date(boost.timestamp * 1000).toLocaleTimeString();

  return (
    <Card className="bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">
                {boost.token.symbol}
            </CardTitle>
            <a href={boost.pair.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                View on DexScreener <ExternalLink className="h-4 w-4" />
            </a>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground -mt-2 mb-4">{boost.token.name}</p>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Badge variant={auditOk ? "secondary" : "destructive"} className="flex items-center gap-1.5">
                        {auditOk ? <ShieldCheck className="h-4 w-4 text-chart-2" /> : <ShieldX className="h-4 w-4" />}
                        <span>{auditOk ? "Audit OK" : "Audit Failed"}</span>
                    </Badge>
                    <Badge variant="outline">
                        Source: {boost.source}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground tabular-nums">{time}</p>
            </div>
        </CardContent>
    </Card>
  );
}
