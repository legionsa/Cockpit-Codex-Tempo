import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/lib/settingsContext';
import { Search, Bell, HelpCircle, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavTree } from '@/components/NavTree';
import { storage } from '@/lib/storage';

import { Search as SearchDialog } from '@/components/Search';

export function SiteHeader() {
    const { settings } = useSettings();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pageTree = storage.buildPageTree();

    return (
        <>
            <header className="h-14 border-b border-border bg-card flex items-center px-4 sticky top-0 z-50">
                <div className="flex items-center gap-3 w-auto md:w-64">
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden mr-2">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-80 p-0">
                            <div className="p-6">
                                <Link to="/" className="flex items-center gap-3 font-bold text-xl" onClick={() => setSidebarOpen(false)}>
                                    {settings.brandIconSvg ? (
                                        <div
                                            className="w-8 h-8 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block text-primary"
                                            dangerouslySetInnerHTML={{ __html: settings.brandIconSvg }}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                                            C
                                        </div>
                                    )}
                                    {settings.siteName || 'Cockpit'}
                                </Link>
                            </div>
                            <div className="px-4 pb-4">
                                <NavTree nodes={pageTree} onNavigate={() => setSidebarOpen(false)} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        {settings.brandIconSvg ? (
                            <div
                                className="w-8 h-8 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block text-primary"
                                dangerouslySetInnerHTML={{ __html: settings.brandIconSvg }}
                            />
                        ) : (
                            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                                C
                            </div>
                        )}
                        <span className="font-semibold text-lg truncate hidden md:block">
                            {settings.siteName || 'Cockpit'}
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 ml-4 text-sm font-medium text-muted-foreground">
                    <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                    <Link to="/recent" className="hover:text-foreground transition-colors">Recent</Link>
                    <Link to="/spaces" className="hover:text-foreground transition-colors">Spaces</Link>
                    <Link to="/apps" className="hover:text-foreground transition-colors">Apps</Link>
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative w-48 lg:w-64 mr-2 hidden sm:block" onClick={() => setSearchOpen(true)}>
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search"
                            readOnly
                            className="w-full h-8 pl-8 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 sm:hidden" onClick={() => setSearchOpen(true)}>
                        <Search className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <HelpCircle className="w-4 h-4" />
                    </Button>
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                        <User className="w-4 h-4" />
                    </Button>
                </div>
            </header>
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </>
    );
}
