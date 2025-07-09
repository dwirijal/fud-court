
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeedItem {
    source: string;
    title: string;
    link: string;
    pubDate: string;
    isoDate: string;
    content?: string;
}

export const columns: ColumnDef<FeedItem>[] = [
    {
      id: 'expander',
      header: () => null,
      cell: ({ row }) => {
        const canExpand = !!row.original.content;
        return (
          <Button
            onClick={() => row.toggleExpanded()}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!canExpand}
            aria-label="Toggle details"
          >
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                row.getIsExpanded() && 'rotate-90'
              )}
            />
          </Button>
        )
      },
      size: 48,
    },
    {
        accessorKey: 'source',
        header: 'Source',
        cell: ({ row }) => <div className="font-semibold w-full max-w-[120px] truncate" title={row.getValue('source')}>{row.getValue('source')}</div>,
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const item = row.original;
            return (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" title={item.title}>
                    {item.title}
                    <ExternalLink className="h-3 w-3 inline-block ml-1.5 opacity-60" />
                </a>
            )
        },
    },
    {
        accessorKey: 'isoDate',
        header: () => <div className="text-right">Published</div>,
        cell: ({ row }) => {
            const dateString = row.getValue('isoDate') as string;
            const formattedDate = format(new Date(dateString), "d MMM yyyy, HH:mm");
            return <div className="text-right font-mono text-xs text-muted-foreground w-full max-w-[150px]">{formattedDate}</div>;
        },
    },
];
