import React from 'react';
import { IconData } from './types';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface IconFilterPanelProps {
    icons: IconData[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
}

export function IconFilterPanel({
    icons,
    selectedCategory,
    onSelectCategory,
    selectedTags,
    onToggleTag
}: IconFilterPanelProps) {
    // Extract unique categories and tags
    const categories = ['all', ...Array.from(new Set(icons.map(icon => icon.category)))];
    const allTags = Array.from(new Set(icons.flatMap(icon => icon.tags)));

    return (
        <div className="space-y-6">
            <div>
                <Label className="text-xs font-semibold uppercase text-muted-foreground mb-3 block">Categories</Label>
                <div className="space-y-1">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className={`
                w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                ${selectedCategory === category
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'}
              `}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {allTags.length > 0 && (
                <>
                    <Separator />
                    <div>
                        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-3 block">Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => onToggleTag(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
