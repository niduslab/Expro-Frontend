import { useState, useEffect } from 'react';

/**
 * Hook: Page Content Management
 * Manages page-specific content and metadata
 * 
 * @param initialContent - Initial content state
 * @returns Content state and setter
 * 
 * @example
 * const { content, setContent } = usePageContent({ title: 'Home' });
 */
export const usePageContent = <T extends Record<string, any>>(initialContent: T) => {
  const [content, setContent] = useState<T>(initialContent);

  useEffect(() => {
    // Update document title if title is provided
    if ('title' in content && typeof content.title === 'string') {
      document.title = `${content.title} | Expro`;
    }
  }, [content]);

  return { content, setContent };
};
