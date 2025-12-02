import React, { useEffect, useRef } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { EditorRenderer } from '@/components/EditorRenderer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProtectedPageWrapper } from '@/components/ProtectedPageWrapper';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { OnThisPage } from '@/components/OnThisPage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AtlassianLayout } from '@/components/layouts/AtlassianLayout';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import { CardGridLayout } from '@/components/layouts/CardGridLayout';
import { FullWidthLayout } from '@/components/layouts/FullWidthLayout';
import { ArticleLayout } from '@/components/layouts/ArticleLayout';
import { ComponentLayout } from '@/components/layouts/ComponentLayout';
import { IconGalleryLayout } from '@/components/layouts/IconGalleryLayout';
import { DocsLayout } from '@/components/DocsLayout';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

export function DocPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const slugPath = params['*']?.split('/').filter(Boolean) || ['home'];
  const contentRef = useRef<HTMLDivElement>(null);

  const page = storage.getPageBySlugPath(slugPath);

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = storage.getBreadcrumbs(page.id);

  useEffect(() => {
    // document.title is now managed by Helmet, but we keep this for fallback/sync
  }, [page.title]);

  const handleEdit = () => {
    navigate('/admindash', { state: { pageId: page.id } });
  };

  const SeoTags = () => (
    <Helmet>
      <title>{page.seo?.metaTitle || `${page.title} - Cockpit Design System`}</title>
      <meta name="description" content={page.seo?.metaDescription || page.summary || ''} />
      {page.seo?.ogImage && <meta property="og:image" content={page.seo.ogImage} />}
      <meta property="og:title" content={page.seo?.metaTitle || page.title} />
      <meta property="og:description" content={page.seo?.metaDescription || page.summary || ''} />
    </Helmet>
  );

  // Render specific layouts
  if (page.layout === 'atlassian') {
    return (
      <ProtectedPageWrapper page={page}>
        <SeoTags />
        <AtlassianLayout page={page} contentRef={contentRef} />
      </ProtectedPageWrapper>
    );
  }

  if (page.layout === 'landing') {
    return (
      <ProtectedPageWrapper page={page}>
        <SeoTags />
        <LandingLayout page={page} />
      </ProtectedPageWrapper>
    );
  }

  if (page.layout === 'cardGrid') {
    return (
      <ProtectedPageWrapper page={page}>
        <SeoTags />
        <CardGridLayout page={page} />
      </ProtectedPageWrapper>
    );
  }

  if (page.layout === 'fullWidth') {
    return (
      <ProtectedPageWrapper page={page}>
        <SeoTags />
        <FullWidthLayout page={page} />
      </ProtectedPageWrapper>
    );
  }

  if (page.layout === 'article') {
    return (
      <ProtectedPageWrapper page={page}>
        <SeoTags />
        <ArticleLayout page={page} />
      </ProtectedPageWrapper>
    );
  }

  if (page.layout === 'component') {
    return (
      <ProtectedPageWrapper page={page}>
        <SeoTags />
        <ComponentLayout page={page} />
      </ProtectedPageWrapper>
    );
  }

  // Default layout (Standard Docs)
  return (
    <ProtectedPageWrapper page={page}>
      <SeoTags />
      <DocsLayout>
        <div className="min-h-screen bg-background">
          <div className={cn(
            "mx-auto px-6 py-8",
            page.displayOptions?.contentWidth === 'full' ? "max-w-none" :
              page.displayOptions?.contentWidth === 'wide' ? "max-w-[1400px]" :
                "max-w-[1024px]"
          )}>
            {page.hero ? (
              <div
                className="relative py-16 px-6 text-center overflow-hidden mb-8 -mx-6 rounded-xl"
                style={{
                  backgroundColor: page.hero.backgroundColor || 'var(--primary)',
                  backgroundImage: page.hero.backgroundImage ? `url(${page.hero.backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: page.hero.textColor === 'dark' ? '#172B4D' : '#FFFFFF'
                }}
              >
                {page.hero.backgroundImage && (
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                )}
                <div className="relative z-10">
                  {(page.displayOptions?.showBreadcrumbs ?? true) && (
                    <div className="mb-6 flex justify-center opacity-80">
                      <Breadcrumbs pages={breadcrumbs} />
                    </div>
                  )}
                  <h1 className="text-4xl font-bold mb-4 tracking-tight">
                    {page.hero.title || page.title}
                  </h1>
                  <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto mb-6">
                    {page.hero.subtitle || page.summary}
                  </p>
                  {(page.hero.primaryCta || page.hero.secondaryCta) && (
                    <div className="flex flex-wrap justify-center gap-4">
                      {page.hero.primaryCta?.text && (
                        <Link
                          to={page.hero.primaryCta.link}
                          className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-background text-foreground font-medium hover:bg-background/90 transition-colors"
                        >
                          {page.hero.primaryCta.text}
                        </Link>
                      )}
                      {page.hero.secondaryCta?.text && (
                        <Link
                          to={page.hero.secondaryCta.link}
                          className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-current font-medium hover:bg-white/10 transition-colors"
                        >
                          {page.hero.secondaryCta.text}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {(page.displayOptions?.showBreadcrumbs ?? true) && (
                  <Breadcrumbs pages={breadcrumbs} />
                )}

                <div className="mb-6">
                  {(page.displayOptions?.showTitle ?? true) && (
                    <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
                  )}
                  {(page.displayOptions?.showSummary ?? true) && page.summary && (
                    <p className="text-lg text-muted-foreground">{page.summary}</p>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-6">
              {/* Main content area */}
              <div className="flex-1 min-w-0" ref={contentRef}>
                {page.viewMode === 'tabbed' && page.tabs ? (
                  <Tabs defaultValue={page.tabs[0]?.id} className="w-full">
                    <TabsList>
                      {page.tabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id}>
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {page.tabs.map((tab) => (
                      <TabsContent key={tab.id} value={tab.id} className="mt-6">
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                          <EditorRenderer blocks={tab.content.blocks} />
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <EditorRenderer blocks={page.content.blocks} />
                  </div>
                )}
              </div>

              {/* Right sidebar - On this page navigation */}
              {(page.displayOptions?.showOnThisPage ?? true) && (
                <OnThisPage contentRef={contentRef} />
              )}
            </div>
          </div>
        </div>
      </DocsLayout>
    </ProtectedPageWrapper>
  );
}