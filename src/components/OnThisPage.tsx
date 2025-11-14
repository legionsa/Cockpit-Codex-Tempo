import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface OnThisPageProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export function OnThisPage({ contentRef }: OnThisPageProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!contentRef.current) return;

    const extractHeadings = () => {
      const elements = contentRef.current?.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (!elements) return [];

      const headingsList: Heading[] = [];
      elements.forEach((element, index) => {
        const text = element.textContent || '';
        const level = parseInt(element.tagName.substring(1));
        // Create slug from text for better IDs
        const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const id = element.id || slug || `heading-${index}`;
        
        if (!element.id) {
          element.id = id;
        }

        headingsList.push({ id, text, level });
      });

      return headingsList;
    };

    const updateHeadings = () => {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        const extracted = extractHeadings();
        setHeadings(extracted);
      }, 100);
    };

    updateHeadings();

    const observer = new MutationObserver(updateHeadings);
    observer.observe(contentRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [contentRef]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      
      let currentActiveId = '';
      for (const element of headingElements) {
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150) {
          currentActiveId = element.id;
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="w-64 hidden xl:block">
      <div className="sticky top-8">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          On this page
        </h3>
        <nav className="space-y-1">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                'block w-full text-left text-sm py-1 px-2 rounded transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                activeId === heading.id
                  ? 'text-primary font-medium bg-accent'
                  : 'text-muted-foreground',
                heading.level === 3 && 'pl-4',
                heading.level === 4 && 'pl-6',
                heading.level === 5 && 'pl-8',
                heading.level === 6 && 'pl-10'
              )}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}