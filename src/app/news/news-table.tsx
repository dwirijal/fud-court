'use client';

import { Card } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import type { Post } from "@/types";
import { useEffect, useRef, useState, useCallback } from "react";

interface NewsTableProps {
  posts: Post[];
}

const PAGE_SIZE = 20;

export function NewsTable({ posts: initialPosts }: NewsTableProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length === PAGE_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news?page=${page + 1}`);
      if (!res.ok) throw new Error('Gagal fetch data');
      const data: Post[] = await res.json();
      setPosts(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
      setHasMore(data.length === PAGE_SIZE);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading) {
        loadMore();
      }
    }, { threshold: 1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore, loading, hasMore, loaderRef]);

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
        <div ref={loaderRef} className="flex justify-center py-4">
          {loading && <span className="text-muted-foreground">Memuat...</span>}
          {!hasMore && <span className="text-muted-foreground">Semua berita sudah dimuat.</span>}
        </div>
      </Card>
    </div>
  );
}
