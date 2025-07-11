
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // Disallow crawling of admin pages
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
