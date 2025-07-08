
export type Post = {
  id?: string;
  title: string;
  slug?: string;
  html: string;
  excerpt?: string;
  featureImage?: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  tags?: string[];
  authors?: string[];
  // Required for Ghost's optimistic locking
  updated_at?: string; 
};
