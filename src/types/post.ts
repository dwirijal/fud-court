
export type Post = {
  id?: string;
  title: string;
  slug?: string;
  html: string;
  excerpt?: string;
  featureImage?: string;
  status: 'draft' | 'published' | 'scheduled';
  
  // Required for Ghost's optimistic locking
  updated_at?: string; 

  // Optional fields from Ghost API
  feature_image_alt?: string;
  feature_image_caption?: string;
  published_at?: string; // For scheduling
  visibility?: 'public' | 'members' | 'paid';
  tags?: string[];
  authors?: string[]; // Assuming array of author emails/slugs
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  email_subject?: string;
  send_email_when_published?: boolean;
  codeinjection_head?: string;
  codeinjection_foot?: string;
};
