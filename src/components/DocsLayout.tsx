import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { NavTree } from '@/components/NavTree';
import { Search } from '@/components/Search';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Menu, X, ChevronRight, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTree = storage.buildPageTree();
  const siteConfig = storage.getSiteConfig?.() || { siteName: 'Cockpit Design System' };

  // Get current page for conditional rendering
  const slugPath = location.pathname.split('/').filter(Boolean);
  const currentPage = storage.getPageBySlugPath(slugPath.length ? slugPath : ['home']);
  const isLandingPage = currentPage?.layout === 'landing';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          {/* Mobile menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-4 border-b border-border">
                <Link to="/home" className="font-bold text-lg" onClick={() => setSidebarOpen(false)}>
                  {siteConfig.siteName}
                </Link>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                <NavTree nodes={pageTree} onSelectPage={() => setSidebarOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 font-bold text-lg mr-6">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              C
            </div>
            <span className="hidden sm:inline">{siteConfig.siteName}</span>
          </Link>

          {/* Main nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {pageTree.slice(0, 5).map((node) => (
              <Link
                key={node.id}
                to={`/${node.slug}`}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  location.pathname.startsWith(`/${node.slug}`)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {node.title}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex h-9 w-64 justify-start text-muted-foreground"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              Search documentation...
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
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

      {/* Main layout */}
      {isLandingPage ? (
        // Full width for landing pages
        <main>{children}</main>
      ) : (
        // Standard layout with sidebar
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 border-r border-border">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-4">
              <NavTree nodes={pageTree} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.siteName}. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/home" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/admindash" className="text-muted-foreground hover:text-foreground transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <Search open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
