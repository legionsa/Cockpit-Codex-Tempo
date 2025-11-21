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
    document.title = `${page.title} - Cockpit Design System`;
  }, [page.title]);

  const handleEdit = () => {
    navigate('/admindash', { state: { pageId: page.id } });
  };

  return (
    <ProtectedPageWrapper page={page}>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <Breadcrumbs pages={breadcrumbs} />

          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{page.title}</h1>
            {page.summary && (
              <p className="text-lg text-muted-foreground">{page.summary}</p>
            )}
          </div>

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
            <OnThisPage contentRef={contentRef} />
          </div>
        </div>
      </div>
    </ProtectedPageWrapper>
  );
}