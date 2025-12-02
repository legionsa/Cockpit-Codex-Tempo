import React from 'react';
import { Page } from '@/types/page';
import { EditorRenderer } from '@/components/EditorRenderer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { storage } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

interface FullWidthLayoutProps {
    page: Page;
}

export function FullWidthLayout({ page }: FullWidthLayoutProps) {
    const breadcrumbs = storage.getBreadcrumbs(page.id);

    const heroStyle = page.hero ? {
        backgroundColor: page.hero.backgroundColor || 'var(--primary)',
        backgroundImage: page.hero.backgroundImage ? `url(${page.hero.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: page.hero.textColor === 'dark' ? '#172B4D' : '#FFFFFF'
    } : undefined;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />
            <div className="flex-1">
                {page.hero ? (
                    <div
                        className="relative py-20 px-6 text-center overflow-hidden"
                        style={heroStyle}
                    >
                        {page.hero.backgroundImage && (
                            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                        )}
                        <div className="relative z-10 max-w-[1200px] mx-auto">
                            <div className="mb-8 flex justify-center opacity-80">
                                <Breadcrumbs pages={breadcrumbs} />
                            </div>
                            <h1 className="text-5xl font-bold mb-6 tracking-tight">
                                {page.hero.title || page.title}
                            </h1>
                            <p className="text-xl md:text-2xl opacity-90 mb-10 leading-relaxed max-w-3xl mx-auto">
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
                    <div className="max-w-[1400px] mx-auto px-6 py-8">
                        <div className="mb-8">
                            <Breadcrumbs pages={breadcrumbs} />
                        </div>
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold mb-4 tracking-tight">{page.title}</h1>
                            {page.summary && (
                                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                                    {page.summary}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="max-w-[1400px] mx-auto px-6 py-12">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <EditorRenderer blocks={page.content.blocks} />
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}
