
'use client';

import { DataTable } from "@/components/ui/data-table";
import type { AdminPost } from "@/lib/ghost-admin";
import { getColumns } from "./columns";

interface PostQueueTableProps {
    posts: AdminPost[];
    ghostUrl: string;
}

export function PostQueueTable({ posts, ghostUrl }: PostQueueTableProps) {
    const columns = getColumns(ghostUrl);
    return <DataTable columns={columns} data={posts} />;
}
