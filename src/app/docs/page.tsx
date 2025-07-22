'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocsPage() {
  const docSections = [
    {
      href: '/docs/roadmap',
      title: 'Roadmap',
      description: 'Track the development progress of Fud Court.',
    },
    {
      href: '/docs/design-system',
      title: 'Design System',
      description: 'Understand the UI/UX principles and components.',
    },
    {
      href: '/docs/api-specs/binance-api-spec',
      title: 'API Specifications',
      description: 'Explore the OpenAPI specifications for integrated APIs.',
    },
    {
      href: '/docs/gemini',
      title: 'Gemini CLI Log',
      description: 'Review the interaction log with the Gemini CLI.',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Documentation</h1>
      <p className="text-muted-foreground mb-6">Find all the documentation for Fud Court here.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docSections.map((section) => (
          <Link href={section.href} key={section.href}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
