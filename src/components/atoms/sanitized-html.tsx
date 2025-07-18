
'use client';

import React, { useState, useEffect, memo } from 'react';

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

function SanitizedHtmlComponent({ html, className }: SanitizedHtmlProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string | null>(null);

  useEffect(() => {
    // Reset content when html prop changes to show loading state
    setSanitizedContent(null);

    // Dynamically import DOMPurify only on the client side
    import('dompurify').then(module => {
      const DOMPurify = module.default;
      setSanitizedContent(DOMPurify.sanitize(html));
    }).catch(error => {
      console.error("Fatal: Failed to load and run DOMPurify. HTML will not be rendered for security reasons.", error);
      // Explicitly set to an empty string on failure to prevent rendering raw HTML
      setSanitizedContent(''); 
    });
  }, [html]);

  // While sanitizing, sanitizedContent will be null. You can render a loader here if desired.
  if (sanitizedContent === null) {
    return <div className={className}>Memuat konten...</div>;
  }

  // If sanitization fails or result is empty, render an empty div
  if (!sanitizedContent) {
    return <div className={className} />;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

// Memoize the component to prevent re-renders if props haven't changed.
export const SanitizedHtml = memo(SanitizedHtmlComponent);
