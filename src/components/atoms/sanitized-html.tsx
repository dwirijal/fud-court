'use client';

import React, { useState, useEffect } from 'react';

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

export function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    // Dynamically import DOMPurify only on the client side
    import('dompurify').then(module => {
      setSanitizedContent(module.default.sanitize(html));
    }).catch(error => {
      console.error("Failed to load DOMPurify:", error);
      setSanitizedContent(html); // Fallback to unsanitized if DOMPurify fails
    });
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
