
'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns, type FeedItem } from './columns';

interface FeedsTableProps {
    items: FeedItem[];
}

export function FeedsTable({ items }: FeedsTableProps) {
    return (
        <DataTable
            columns={columns}
            data={items}
            getRowCanExpand={(row) => !!row.original.content}
            renderRowSubComponent={(row) => {
                const item = row.original;
                return (
                    <div className="bg-muted/50 p-6">
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.content || 'No content available.' }}
                        />
                    </div>
                )
            }}
        />
    )
}
