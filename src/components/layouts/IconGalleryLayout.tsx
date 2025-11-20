import React from 'react';
import { IconGalleryTabs } from '@/components/icon-explorer/IconGalleryTabs';
import { IconData } from '@/components/icon-explorer/types';

interface IconGalleryLayoutProps {
    icons: IconData[];
}

export function IconGalleryLayout({ icons }: IconGalleryLayoutProps) {
    if (!icons || icons.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No icons configured for this page.
            </div>
        );
    }

    // Group icons by category for tabs
    const categories = Array.from(new Set(icons.map(icon => icon.category)));
    const tabs = categories.map(category => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        filter: category,
        icons: icons.filter(icon => icon.category === category)
    }));

    return (
        <IconGalleryTabs
            tabs={tabs}
            enableSearch={true}
            enableFilters={true}
        />
    );
}
