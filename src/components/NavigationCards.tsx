import React from 'react';
import { Page } from '@/types/page';
import { storage } from '@/lib/storage';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationCardsProps {
    page: Page;
    preview?: boolean;
}

export function NavigationCards({ page, preview = false }: NavigationCardsProps) {
    const pageTree = storage.buildPageTree();

    // Helper to find node in tree
    const findNode = (nodes: any[], id: string): any => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const currentNode = findNode(pageTree, page.id);
    const childPages = currentNode?.children || [];

    // Use configured navigation cards or fall back to child pages
    const cards = page.navigationCards && page.navigationCards.length > 0
        ? page.navigationCards
        : childPages.map((child: any) => ({
            title: child.title,
            description: child.summary,
            link: `/${child.slug}`,
            icon: null
        }));

    if (cards.length === 0) {
        if (preview) {
            return (
                <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground mb-6">
                    No navigation cards or child pages to display.
                </div>
            );
        }
        return null;
    }

    return (
        <div className={cn("max-w-[1200px] mx-auto", !preview && "px-6 py-16", preview && "py-6")}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card: any, index: number) => (
                    <Link
                        key={index}
                        to={card.link || '#'}
                        className={cn(
                            "group block p-8 bg-card border border-border rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1",
                            preview && "pointer-events-none"
                        )}
                    >
                        <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors flex items-center justify-between">
                            {card.title}
                            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                        </h3>
                        {card.description && (
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {card.description}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
