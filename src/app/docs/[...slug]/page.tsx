import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DocPageProps {
  params: { slug: string[] };
}

async function getDocContent(slug: string[]) {
  const filePath = path.join(process.cwd(), 'docs', ...slug) + '.md';
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`Failed to read doc file: ${filePath}`, error);
    notFound();
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const content = await getDocContent(params.slug);
  return (
    <div className="container mx-auto px-4 py-8 prose dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Generate static paths for all markdown files in the docs directory
export async function generateStaticParams() {
  const docsDir = path.join(process.cwd(), 'docs');
  
  // Check if docs directory exists
  try {
    await fs.access(docsDir);
  } catch (error) {
    // If docs directory doesn't exist, return empty params
    return [];
  }

  const files = await fs.readdir(docsDir, { recursive: true });
  const markdownFiles = files
    .filter(file => typeof file === 'string' && file.endsWith('.md'))
    .map(file => ({
      slug: (file as string).replace(/\.md$/, '').split(path.sep),
    }));
    
  return markdownFiles;
}
