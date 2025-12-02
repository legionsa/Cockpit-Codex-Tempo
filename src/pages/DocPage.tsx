import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordPrompt } from '@/components/PasswordPrompt';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageLayoutRenderer } from '@/components/layouts/PageLayoutRenderer';

export function DocPage() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const slugPath = params['*']?.split('/').filter(Boolean) || ['home'];
  const [isUnlocked, setIsUnlocked] = useState(false);

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
  const isPasswordProtected = page.password && page.password.length > 0;
  const canView = isAuthenticated || !isPasswordProtected || isUnlocked;

  useEffect(() => {
    document.title = `${page.title} - Cockpit Design System`;
  }, [page.title]);

  if (!canView) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Breadcrumbs pages={breadcrumbs} />
          <div className="mt-12 text-center">
            <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
            <p className="text-muted-foreground">This page is password protected.</p>
          </div>
        </div>
        <PasswordPrompt
          open={!canView}
          onCorrectPassword={() => setIsUnlocked(true)}
          expectedPassword={page.password || ''}
        />
      </>
    );
  }

  return <PageLayoutRenderer page={page} breadcrumbs={breadcrumbs} />;
}