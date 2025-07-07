import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/types";

export function NewsCard({ post }: { post: Post }) {
  const showImage = post.primary_tag?.name?.toLowerCase() !== 'news';

  return (
    <Link href={`/news/${post.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {showImage && (
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={post.feature_image || "https://placehold.co/600x400.png"}
                alt={post.title}
                fill
                className="object-cover rounded-t-lg"
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
      </Card>
    </Link>
  );
}
