import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorRenderer } from '@/components/EditorRenderer';
import { PropsTable } from './PropsTable';
import { ComponentPreview } from './ComponentPreview';
import { Page } from '@/types/page';

interface TabbedContentEditorProps {
    page: Page;
}

export function TabbedContentEditor({ page }: TabbedContentEditorProps) {
    // For component pages, show Overview/Props/Examples/Guidelines tabs
    if (page.contentType === 'component' && page.componentData) {
        return (
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="props">Props</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <EditorRenderer blocks={page.content.blocks} />
                    </div>
                </TabsContent>

                <TabsContent value="props" className="mt-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Component API</h2>
                            <p className="text-muted-foreground">
                                Props and configuration options for this component.
                            </p>
                        </div>
                        <PropsTable props={page.componentData.props || []} />
                    </div>
                </TabsContent>

                <TabsContent value="examples" className="mt-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Code Examples</h2>
                            <p className="text-muted-foreground">
                                Learn how to use this component with practical examples.
                            </p>
                        </div>
                        <ComponentPreview
                            examples={page.componentData.examples || []}
                            importPath={page.componentData.importPath}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="guidelines" className="mt-6">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <h2>Usage Guidelines</h2>
                        <p>Best practices and guidelines for using this component.</p>
                        {/* This can be extended with additional content from page.content */}
                    </div>
                </TabsContent>
            </Tabs>
        );
    }

    // For regular pages, just show the content
    return (
        <div className="prose prose-slate dark:prose-invert max-w-none">
            <EditorRenderer blocks={page.content.blocks} />
        </div>
    );
}
