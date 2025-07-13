
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
import { format } from 'date-fns';

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
    setPublicationDate(format(new Date(post.published_at), 'd MMMM yyyy, HH:mm'));
  }, [post.published_at]);
  
  const showImage = post.primary_tag?.name?.toLowerCase() !== 'news';

  return (
    <motion.div
      className="h-full"
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.03 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3 }}
      variants={cardVariants}
    >
      <Link href={`/news/${post.slug}`} className="group block h-full">
        <Card className="h-full flex flex-col bg-card/60 backdrop-blur-md transition-shadow duration-300 hover:shadow-xl">
          {showImage && (
            <CardHeader className="p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={post.feature_image || "https://placehold.co/600x400"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="crypto abstract"
                />
              </div>
            </CardHeader>
          )}
          <CardContent className="flex-grow p-6 space-y-3">
            {post.primary_tag && (
              <Badge variant="secondary">{post.primary_tag.name}</Badge>
            )}
            <CardTitle className="text-xl font-headline leading-snug group-hover:text-primary transition-colors">
              {post.title}
            </CardTitle>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {post.excerpt}
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <time dateTime={post.published_at} className="text-xs text-muted-foreground">
              {publicationDate || '...'}
            </time>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
