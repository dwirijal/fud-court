'use client';

import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import type { Post } from "@/types";

interface NewsTableProps {
  posts: Post[];
}

export function NewsTable({ posts }: NewsTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Card className="bg-card/60 backdrop-blur-md overflow-hidden">
        <DataTable
          columns={columns}
          data={posts}
          renderRowSubComponent={(row) => (
            <div className="bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">{row.original.excerpt}</p>
            </div>
          )}
          getRowCanExpand={() => true}
        />
      </Card>
    </div>
  );
}
