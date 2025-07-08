
'use client';

import type { BoostedToken } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function BoostTokenCard({ boost }: { boost: BoostedToken }) {
  const auditOk = boost.audit.is_open_source && !boost.audit.is_honeypot;
  const [time, setTime] = useState('');

  useEffect(() => {
    // This ensures the time is formatted only on the client, after hydration,
    // avoiding a mismatch with the server-rendered HTML.
    setTime(new Date(boost.timestamp * 1000).toLocaleTimeString());
  }, [boost.timestamp]);

  return (
    <Card className="bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">
                {boost.token.symbol}
            </CardTitle>
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
