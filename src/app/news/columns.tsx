'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { Post } from '@/types'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import Link from 'next/link'

export const columns: ColumnDef<Post>[] = [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const post = row.original
            return (
                <Link href={`/news/${post.slug}`} className="hover:text-primary transition-colors font-medium">
                    {post.title}
                </Link>
            )
        },
    },
    {
        accessorKey: 'published_at',
        header: () => <div className="text-right">Published Date</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue('published_at'))
            const formatted = format(date, "HH:mm:ss dd MMMM", { locale: idLocale });
            return <div className="text-right text-muted-foreground">{formatted}</div>
        },
    },
]
