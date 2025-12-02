import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Page } from '@/types/page';

import * as LucideIcons from 'lucide-react';

interface BreadcrumbsProps {
  pages: Page[];
}

export function Breadcrumbs({ pages }: BreadcrumbsProps) {
  if (pages.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {pages.map((page, index) => {
          const PageIcon = page.icon && (LucideIcons as any)[page.icon] ? (LucideIcons as any)[page.icon] : null;

          return (
            <li key={page.id} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {index === pages.length - 1 ? (
                <span className="font-medium text-foreground flex items-center gap-2">
                  {PageIcon && <PageIcon className="h-4 w-4" />}
                  {page.title}
                </span>
              ) : (
                <Link
                  to={`/${pages.slice(0, index + 1).map(p => p.slug).join('/')}`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  {PageIcon && <PageIcon className="h-4 w-4" />}
                  {page.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
