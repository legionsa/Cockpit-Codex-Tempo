import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { useSettings } from '@/lib/settingsContext';
import { NavTree } from '@/components/NavTree';
import { Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const { settings } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTree = storage.buildPageTree();

  // Debug logging
  React.useEffect(() => {
    console.log('[DocsLayout] Settings loaded:', settings);
    console.log('[DocsLayout] Brand icon SVG length:', settings.brandIconSvg?.length || 0);
    console.log('[DocsLayout] Brand icon SVG:', settings.brandIconSvg);
  }, [settings]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6">
                <Link to="/home" className="flex items-center gap-3 font-bold text-xl" onClick={() => setSidebarOpen(false)}>
                  {settings.brandIconSvg && (
                    <div
                      className="w-6 h-6 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                      style={{ width: '24px', height: '24px' }}
                      dangerouslySetInnerHTML={{ __html: settings.brandIconSvg }}
                    />
                  )}
                  {settings.siteName || 'Cockpit DS'}
                </Link>
              </div>
              <div className="px-4 pb-4">
                <NavTree nodes={pageTree} />
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/home" className="flex items-center gap-3 font-bold text-xl mr-6">
            {settings.brandIconSvg && (
              <div
                className="w-6 h-6 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
                style={{ width: '24px', height: '24px' }}
                dangerouslySetInnerHTML={{ __html: settings.brandIconSvg }}
              />
            )}
            {settings.siteName || 'Cockpit Design System'}
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              Search
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="md:hidden"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container flex-1">
        <div className="flex gap-6 md:gap-10">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-6">
              <NavTree nodes={pageTree} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 py-6">
            {children}
          </main>
        </div>
      </div>

      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
