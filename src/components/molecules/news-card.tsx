
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function NewsCard({ post }: { post: Post }) {
  const [publicationDate, setPublicationDate] = useState('');

  useEffect(() => {
    // Format the date only on the client side to avoid hydration mismatch
    // and show relative time for recent posts.
    const postDate = new Date(post.published_at);
    const now = new Date();
    const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      setPublicationDate(formatDistanceToNow(postDate, { addSuffix: true, locale: id }));
    } else {
      setPublicationDate(format(postDate, 'd MMMM yyyy', { locale: id }));
    }

  }, [post.published_at]);
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={cardVariants}
      className="h-full"
    >
      <Link href={`/news/${post.slug}`} className="group block h-full focus-ring rounded-3">
        <Card asChild className="card-news h-full flex flex-col">
          <article>
            <CardHeader className="p-0">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-3">
                <Image
                  src={post.feature_image || "https://placehold.co/600x400.png"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-slow group-hover:scale-105"
                  data-ai-hint="crypto abstract"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-4 space-y-2">
              {post.primary_tag && (
                <Badge variant="secondary">{post.primary_tag.name}</Badge>
              )}
              <CardTitle className="text-xl font-semibold leading-tight group-hover:text-accent-primary transition-colors">
                {post.title}
              </CardTitle>
              <p className="text-sm text-text-secondary line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <time dateTime={post.published_at} className="text-xs font-medium text-text-tertiary">
                {publicationDate || '...'}
              </time>
            </CardFooter>
          </article>
        </Card>
      </Link>
    </motion.div>
  );
}
