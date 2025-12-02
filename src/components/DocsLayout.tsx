import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useSettings } from '@/lib/settingsContext';
import { NavTree } from '@/components/NavTree';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const { settings } = useSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pageTree = storage.buildPageTree();

  // Debug logging
  React.useEffect(() => {
    console.log('[DocsLayout] Settings loaded:', settings);
    console.log('[DocsLayout] Brand icon SVG length:', settings.brandIconSvg?.length || 0);
    console.log('[DocsLayout] Brand icon SVG:', settings.brandIconSvg);
  }, [settings]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <SiteHeader />

      <div className="container flex-1">
        <div className="flex gap-6 md:gap-10">
          {/* Sidebar */}
          <aside
            className={cn(
              "hidden md:block shrink-0 transition-all duration-300 ease-in-out relative group",
              isSidebarOpen ? "w-64" : "w-0"
            )}
          >
            <div className={cn("sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-6", !isSidebarOpen && "invisible")}>
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSidebarOpen(false)}
                  title="Close menu"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
              <NavTree nodes={pageTree} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 py-6 min-w-0">
            {!isSidebarOpen && (
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsSidebarOpen(true)}
                  title="Open menu"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
