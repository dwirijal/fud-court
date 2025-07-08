
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { AdminPost } from '@/lib/ghost-admin';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const getStatusVariant = (status: AdminPost['status']): 'default' | 'secondary' | 'outline' => {
    switch (status) {
        case 'published':
            return 'default';
        case 'scheduled':
            return 'secondary';
        case 'draft':
            return 'outline';
        default:
            return 'outline';
    }
};

export const getColumns = (): ColumnDef<AdminPost>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const post = row.original;
            const editUrl = `/admin/posts/${post.id}/edit`;

            return (
                <Link href={editUrl} className="group inline-flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                    <span>{post.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
            )
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as AdminPost['status'];
            return (
                <Badge variant={getStatusVariant(status)} className="capitalize">
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'updated_at',
        header: () => <div className="text-right">Last Updated</div>,
        cell: ({ row }) => {
            const dateString = row.getValue('updated_at') as string;
            const formattedDate = format(new Date(dateString), "d MMM yyyy, HH:mm");
            return <div className="text-right tabular-nums text-muted-foreground">{formattedDate}</div>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const post = row.original;
            const editUrl = `/admin/posts/${post.id}/edit`;

            return (
                 <div className="text-right">
                    <Button asChild variant="outline" size="sm">
                        <Link href={editUrl}>
                            Edit
                        </Link>
                    </Button>
                </div>
            )
        }
    }
];
