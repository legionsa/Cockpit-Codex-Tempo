import React from 'react';
import { EditorRenderer } from '@/components/EditorRenderer';
import { EditorJSBlock, Page } from '@/types/page';
import { NavTree } from '@/components/NavTree';
import { storage } from '@/lib/storage';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { OnThisPage } from '@/components/OnThisPage';
import { useSettings } from '@/lib/settingsContext';
import { Link } from 'react-router-dom';
import { Search, Bell, HelpCircle, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { cn } from '@/lib/utils';

interface AtlassianLayoutProps {
    page: Page;
    contentRef: React.RefObject<HTMLDivElement>;
}

export function AtlassianLayout({ page, contentRef }: AtlassianLayoutProps) {
    const { settings } = useSettings();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const pageTree = storage.buildPageTree();
    const breadcrumbs = storage.getBreadcrumbs(page.id);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Top Navigation Bar */}
            <SiteHeader />

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <aside
                    className={cn(
                        "border-r border-border bg-muted/10 overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out relative group",
                        isSidebarOpen ? "w-64" : "w-0 border-r-0"
                    )}
                >
                    <div className={cn("p-4 w-64", !isSidebarOpen && "invisible")}>
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
                        <NavTree nodes={pageTree} activePageId={page.id} />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto min-w-0 relative">
                    <div className="max-w-[1200px] mx-auto px-8 py-8 flex gap-12">
                        <div className="flex-1 min-w-0" ref={contentRef}>
                            <div className="mb-6 flex items-center gap-4">
                                {!isSidebarOpen && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setIsSidebarOpen(true)}
                                        title="Open menu"
                                    >
                                        <PanelLeftOpen className="h-4 w-4" />
                                    </Button>
                                )}
                                <Breadcrumbs pages={breadcrumbs} />
                            </div>

                            {page.hero ? (
                                <div className="mb-12 -mx-8 px-8 py-12 bg-muted/30 border-b border-border">
                                    <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
                                        {page.hero.title || page.title}
                                    </h1>
                                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                                        {page.hero.subtitle || page.summary}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl font-bold mb-4 text-foreground tracking-tight">
                                        {page.title}
                                    </h1>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                                        <span>By Admin</span>
                                        <span>•</span>
                                        <span>{new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        {page.tags && page.tags.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <div className="flex gap-2">
                                                    {page.tags.map(tag => (
                                                        <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {page.summary && (
                                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                            {page.summary}
                                        </p>
                                    )}
                                </>
                            )}

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <EditorRenderer blocks={page.content.blocks} />
                            </div>
                        </div>

                        {/* Right Sidebar - On This Page */}
                        <div className="w-64 flex-shrink-0 hidden xl:block">
                            <div className="sticky top-8">
                                <OnThisPage contentRef={contentRef} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <SiteFooter />
        </div>
    );
}
