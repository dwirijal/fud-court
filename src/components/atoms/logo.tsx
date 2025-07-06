import { Gavel } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <Gavel className="h-5 w-5" />
      </div>
      <span className="text-lg font-bold font-headline hidden md:inline-block group-data-[state=expanded]:inline-block">
        Fud Court
      </span>
    </div>
  );
}
