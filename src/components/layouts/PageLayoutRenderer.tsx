import React, { useRef } from 'react';
import { Page } from '@/types/page';
import { EditorRenderer } from '@/components/EditorRenderer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { OnThisPage } from '@/components/OnThisPage';
import { HeroSection } from './HeroSection';
import { CardGrid } from './CardGrid';
import { cn } from '@/lib/utils';

interface PageLayoutRendererProps {
  page: Page;
  breadcrumbs: Page[];
}

export function PageLayoutRenderer({ page, breadcrumbs }: PageLayoutRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const layout = page.layout || 'default';
  const config = page.layoutConfig || {};

  const maxWidthClass = {
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    full: 'max-w-full',
  }[config.maxWidth || 'default'];

  const showBreadcrumbs = config.showBreadcrumbs !== false && layout !== 'landing';
  const showTitle = config.showTitle !== false && layout !== 'landing';
  const showSummary = config.showSummary !== false && layout !== 'landing';
  const showOnThisPage = config.showOnThisPage !== false && layout === 'default';

  // Landing page layout
  if (layout === 'landing') {
    return (
      <div className="min-h-screen bg-background">
        {config.hero && (
          <HeroSection 
            config={config.hero} 
            title={page.title}
            subtitle={page.summary}
          />
        )}
        
        <div className="container mx-auto px-6 py-12">
          {config.cards && config.cards.length > 0 && (
            <div className="mb-12">
              <CardGrid cards={config.cards} columns={3} />
            </div>
          )}
          
          {page.content.blocks.length > 0 && (
            <div className={cn("mx-auto", maxWidthClass)}>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <EditorRenderer blocks={page.content.blocks} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Grid layout (category pages)
  if (layout === 'grid') {
    return (
      <div className="min-h-screen bg-background">
        <div className={cn("mx-auto px-6 py-8", maxWidthClass)}>
          {showBreadcrumbs && <Breadcrumbs pages={breadcrumbs} />}
          
          {showTitle && (
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
              {showSummary && page.summary && (
                <p className="text-lg text-muted-foreground">{page.summary}</p>
              )}
            </div>
          )}

          {config.cards && config.cards.length > 0 && (
            <div className="mb-12">
              <CardGrid cards={config.cards} columns={3} />
            </div>
          )}
          
          {page.content.blocks.length > 0 && (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <EditorRenderer blocks={page.content.blocks} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full-width layout
  if (layout === 'full-width') {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 py-8">
          {showBreadcrumbs && (
            <div className={cn("mx-auto mb-4", maxWidthClass)}>
              <Breadcrumbs pages={breadcrumbs} />
            </div>
          )}
          
          {showTitle && (
            <div className={cn("mx-auto mb-8", maxWidthClass)}>
              <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
              {showSummary && page.summary && (
                <p className="text-lg text-muted-foreground">{page.summary}</p>
              )}
            </div>
          )}
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <EditorRenderer blocks={page.content.blocks} />
          </div>
        </div>
      </div>
    );
  }

  // Article layout (narrow, centered)
  if (layout === 'article') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {showBreadcrumbs && <Breadcrumbs pages={breadcrumbs} />}
          
          {showTitle && (
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
              {showSummary && page.summary && (
                <p className="text-xl text-muted-foreground">{page.summary}</p>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          )}
          
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <EditorRenderer blocks={page.content.blocks} />
          </div>
        </div>
      </div>
    );
  }

  // Component layout (showcase style)
  if (layout === 'component') {
    return (
      <div className="min-h-screen bg-background">
        <div className={cn("mx-auto px-6 py-8", maxWidthClass)}>
          {showBreadcrumbs && <Breadcrumbs pages={breadcrumbs} />}
          
          <div className="flex gap-8">
            <div className="flex-1 min-w-0" ref={contentRef}>
              {showTitle && (
                <div className="mb-8 pb-8 border-b border-border">
                  <h1 className="text-4xl font-bold mb-3">{page.title}</h1>
                  {showSummary && page.summary && (
                    <p className="text-lg text-muted-foreground">{page.summary}</p>
                  )}
                  {page.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {page.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <EditorRenderer blocks={page.content.blocks} />
              </div>
            </div>
            
            <OnThisPage contentRef={contentRef} />
          </div>
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div className="min-h-screen bg-background">
      <div className={cn("mx-auto px-6 py-8", maxWidthClass)}>
        {showBreadcrumbs && <Breadcrumbs pages={breadcrumbs} />}
        
        <div className="flex gap-8">
          <div className="flex-1 min-w-0" ref={contentRef}>
            {showTitle && (
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
                {showSummary && page.summary && (
                  <p className="text-lg text-muted-foreground">{page.summary}</p>
                )}
              </div>
            )}
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <EditorRenderer blocks={page.content.blocks} />
            </div>
          </div>
          
          {showOnThisPage && <OnThisPage contentRef={contentRef} />}
        </div>
      </div>
    </div>
  );
}
