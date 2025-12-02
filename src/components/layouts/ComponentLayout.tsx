import React from 'react';
import { Page } from '@/types/page';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { storage } from '@/lib/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropsTable } from '@/components/component-docs/PropsTable';
import { ComponentPreview } from '@/components/component-docs/ComponentPreview';
import { EditorRenderer } from '@/components/EditorRenderer';
import { Badge } from '@/components/ui/badge';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Link } from 'react-router-dom';

interface ComponentLayoutProps {
    page: Page;
}

export function ComponentLayout({ page }: ComponentLayoutProps) {
    const breadcrumbs = storage.getBreadcrumbs(page.id);
    const componentData = page.componentData || {};

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
                            <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto mb-6">
                                {page.hero.subtitle || page.summary}
                            </p>
                            {page.tags && (
                                <div className="flex justify-center gap-2">
                                    {page.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="bg-background/20 text-current border-transparent">{tag}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-[1200px] mx-auto px-6 py-8">
                        <div className="mb-6">
                            <Breadcrumbs pages={breadcrumbs} />
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
                                {page.tags?.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                            {page.summary && (
                                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                                    {page.summary}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="max-w-[1200px] mx-auto px-6 pb-12">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="mb-8">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="props">Props</TabsTrigger>
                            <TabsTrigger value="examples">Examples</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-8">
                            {/* Main Content */}
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <EditorRenderer blocks={page.content.blocks} />
                            </div>
                        </TabsContent>

                        <TabsContent value="props">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Component Props</h2>
                                    <p className="text-muted-foreground mb-6">
                                        The following props are available for the {page.title} component.
                                    </p>
                                    <PropsTable props={componentData.props || []} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="examples">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
                                    <ComponentPreview
                                        examples={componentData.examples || []}
                                        importPath={componentData.importPath}
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <SiteFooter />
        </div>
    );
}
