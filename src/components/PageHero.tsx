import React from 'react';
import { Page } from '@/types/page';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeroProps {
    page: Page;
    preview?: boolean;
}

export function PageHero({ page, preview = false }: PageHeroProps) {
    if (!page.hero && !preview) return null;

    // Default hero style if not configured but in preview mode (to show something)
    // Actually, if page.hero is undefined, we might want to show a placeholder or nothing.
    // But most layouts use page.hero properties.

    const heroStyle = {
        backgroundColor: page.hero?.backgroundColor || 'var(--primary)',
        backgroundImage: page.hero?.backgroundImage ? `url(${page.hero.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: page.hero?.textColor === 'dark' ? '#172B4D' : '#FFFFFF'
    };

    const Wrapper = preview ? 'div' : React.Fragment;

    return (
        <div
            className={cn(
                "relative py-24 px-6 text-center overflow-hidden transition-all",
                preview && "rounded-lg border border-border mb-6"
            )}
            style={heroStyle}
        >
            {/* Overlay for readability if image is present */}
            {page.hero?.backgroundImage && (
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            )}

            <div className="relative z-10 max-w-[800px] mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                    {page.hero?.title || page.title}
                </h1>
                <p className="text-xl md:text-2xl opacity-90 mb-10 leading-relaxed max-w-2xl mx-auto">
                    {page.hero?.subtitle || page.summary}
                </p>

                {(page.hero?.primaryCta || page.hero?.secondaryCta) && (
                    <div className={cn("flex flex-wrap justify-center gap-4", preview && "pointer-events-none")}>
                        {page.hero?.primaryCta?.text && (
                            <Link
                                to={page.hero.primaryCta.link || '#'}
                                className="inline-flex items-center justify-center h-12 px-8 rounded-md bg-background text-foreground font-medium hover:bg-background/90 transition-colors"
                            >
                                {page.hero.primaryCta.text}
                            </Link>
                        )}
                        {page.hero?.secondaryCta?.text && (
                            <Link
                                to={page.hero.secondaryCta.link || '#'}
                                className="inline-flex items-center justify-center h-12 px-8 rounded-md border border-current font-medium hover:bg-white/10 transition-colors"
                            >
                                {page.hero.secondaryCta.text}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
