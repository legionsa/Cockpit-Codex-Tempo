import React from 'react';
import { Page } from '@/types/page';
import { EditorRenderer } from '@/components/EditorRenderer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { storage } from '@/lib/storage';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

interface ArticleLayoutProps {
    page: Page;
}

export function ArticleLayout({ page }: ArticleLayoutProps) {
    const breadcrumbs = storage.getBreadcrumbs(page.id);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            <div className="flex-1">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="mb-8 flex justify-center">
                        <Breadcrumbs pages={breadcrumbs} />
                    </div>

                    <header className="text-center mb-12">
                        {page.hero ? (
                            <div
                                className="mb-8 py-16 px-6 -mx-6 rounded-xl overflow-hidden relative"
                                style={{
                                    backgroundColor: page.hero.backgroundColor || 'var(--muted)',
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
                                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                        {page.hero.title || page.title}
                                    </h1>
                                    <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
                                        {page.hero.subtitle || page.summary}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                    {page.title}
                                </h1>
                                {page.summary && (
                                    <p className="text-xl text-muted-foreground leading-relaxed">
                                        {page.summary}
                                    </p>
                                )}
                            </>
                        )}

                        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span>{new Date(page.lastUpdated).toLocaleDateString()}</span>
                            {page.tags && page.tags.length > 0 && (
                                <>
                                    <span>•</span>
                                    <div className="flex gap-2">
                                        {page.tags.map(tag => (
                                            <span key={tag} className="bg-secondary px-2 py-1 rounded-md text-xs font-medium text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </header>

                    <article className="prose prose-lg dark:prose-invert mx-auto">
                        <EditorRenderer blocks={page.content.blocks} />
                    </article>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}
