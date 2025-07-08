
'use client';

import { DataTable } from "@/components/ui/data-table";
import type { AdminPost } from "@/lib/ghost-admin";
import { getColumns } from "./columns";

interface PostQueueTableProps {
    posts: AdminPost[];
}

export function PostQueueTable({ posts }: PostQueueTableProps) {
    const columns = getColumns();
    return <DataTable columns={columns} data={posts} />;
}
