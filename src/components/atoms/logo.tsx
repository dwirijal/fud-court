import { Gavel } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-primary text-primary-foreground p-2 rounded-full", className)}>
        <Gavel className="h-5 w-5" />
    </div>
  );
}
