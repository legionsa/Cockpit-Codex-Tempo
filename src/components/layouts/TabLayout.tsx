import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorRenderer } from '@/components/EditorRenderer';
import { TabData } from '@/types/page';

interface TabLayoutProps {
    tabs: TabData[];
}

export function TabLayout({ tabs }: TabLayoutProps) {
    if (!tabs || tabs.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No tabs configured for this page.
            </div>
        );
    }

    return (
        <Tabs defaultValue="0" className="w-full">
            <TabsList>
                {tabs.map((tab, index) => (
                    <TabsTrigger key={index} value={index.toString()}>
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab, index) => (
                <TabsContent key={index} value={index.toString()} className="mt-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <EditorRenderer blocks={tab.content.blocks} />
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}
