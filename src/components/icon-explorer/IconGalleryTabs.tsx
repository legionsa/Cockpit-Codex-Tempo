import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconGalleryTab, IconData } from './types';
import { IconGrid } from './IconGrid';
import { IconSearchBar } from './IconSearchBar';
import { IconFilterPanel } from './IconFilterPanel';
import { IconDetailDrawer } from './IconDetailDrawer';

interface IconGalleryTabsProps {
    tabs: IconGalleryTab[];
    enableSearch?: boolean;
    enableFilters?: boolean;
}

export function IconGalleryTabs({ tabs, enableSearch = true, enableFilters = true }: IconGalleryTabsProps) {
    const [activeTab, setActiveTab] = useState<string>(tabs[0]?.label || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedIcon, setSelectedIcon] = useState<IconData | null>(null);

    // Get current tab's icons
    const currentTabIcons = useMemo(() => {
        const tab = tabs.find(t => t.label === activeTab);
        return tab ? tab.icons : [];
    }, [activeTab, tabs]);

    // Filter icons
    const filteredIcons = useMemo(() => {
        return currentTabIcons.filter(icon => {
            // Search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    icon.name.toLowerCase().includes(query) ||
                    icon.tags.some(tag => tag.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // Category
            if (selectedCategory !== 'all' && icon.category !== selectedCategory) {
                return false;
            }

            // Tags
            if (selectedTags.length > 0) {
                const hasTag = selectedTags.every(tag => icon.tags.includes(tag));
                if (!hasTag) return false;
            }

            return true;
        });
    }, [currentTabIcons, searchQuery, selectedCategory, selectedTags]);

    const handleToggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    if (!tabs || tabs.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <TabsList>
                                {tabs.map((tab, index) => (
                                    <TabsTrigger key={index} value={tab.label}>
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {enableSearch && (
                                <div className="w-64">
                                    <IconSearchBar value={searchQuery} onChange={setSearchQuery} />
                                </div>
                            )}
                        </div>

                        {tabs.map((tab, index) => (
                            <TabsContent key={index} value={tab.label} className="mt-0">
                                <IconGrid icons={filteredIcons} onIconClick={setSelectedIcon} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Sidebar Filters */}
                {enableFilters && (
                    <div className="w-full md:w-64 shrink-0">
                        <IconFilterPanel
                            icons={currentTabIcons}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            selectedTags={selectedTags}
                            onToggleTag={handleToggleTag}
                        />
                    </div>
                )}
            </div>

            <IconDetailDrawer
                icon={selectedIcon}
                open={!!selectedIcon}
                onClose={() => setSelectedIcon(null)}
            />
        </div>
    );
}
