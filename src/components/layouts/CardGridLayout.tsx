import React from 'react';
import { Page } from '@/types/page';
import { storage } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

interface CardGridLayoutProps {
    page: Page;
}

export function CardGridLayout({ page }: CardGridLayoutProps) {
    const pageTree = storage.buildPageTree();
    const currentNode = findNode(pageTree, page.id);
    const childPages = currentNode?.children || [];
    const breadcrumbs = storage.getBreadcrumbs(page.id);

    // Use configured navigation cards or fall back to child pages
    const cards = page.navigationCards && page.navigationCards.length > 0
        ? page.navigationCards
        : childPages.map(child => ({
            title: child.title,
            description: child.summary,
            link: `/${child.slug}`,
            icon: null
        }));

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
                        className="relative py-16 px-6 text-center overflow-hidden mb-8"
                        style={heroStyle}
                    >
                        {page.hero.backgroundImage && (
                            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                        )}
                        <div className="relative z-10 max-w-[1200px] mx-auto">
                            <div className="mb-6 flex justify-center opacity-80">
                                <Breadcrumbs pages={breadcrumbs} />
                            </div>
                            <h1 className="text-4xl font-bold mb-4 tracking-tight">
                                {page.hero.title || page.title}
                            </h1>
                            <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                                {page.hero.subtitle || page.summary}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-[1200px] mx-auto px-6 py-8">
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

                <div className="max-w-[1200px] mx-auto px-6 pb-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map((card, index) => (
                            <Link
                                key={index}
                                to={card.link}
                                className="flex flex-col p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all group"
                            >
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                                {card.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {card.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}

function findNode(nodes: any[], id: string): any {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
}
