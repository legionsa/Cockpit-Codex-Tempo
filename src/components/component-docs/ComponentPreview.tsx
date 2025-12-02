import React, { useState } from 'react';
import { CodeExample } from '@/types/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check, Play, Code as CodeIcon } from 'lucide-react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { themes } from 'prism-react-renderer';
import * as RadixTabs from '@radix-ui/react-tabs';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Scope for LiveProvider - add components available in preview
const scope = {
    React,
    ...RadixTabs,
    ...LucideIcons,
    Button,
    Badge,
    Card,
    Switch,
    Label,
    Input,
    useState,
};

interface ComponentPreviewProps {
    examples: CodeExample[];
    importPath?: string;
}

export function ComponentPreview({ examples, importPath }: ComponentPreviewProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyCode = (code: string, index: number) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!examples || examples.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No examples available for this component.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Import Statement */}
            {importPath && (
                <div className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCode(importPath, -1)}
                        >
                            {copiedIndex === -1 ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto border border-border">
                        <code className="language-typescript text-sm text-gray-300">{importPath}</code>
                    </pre>
                </div>
            )}

            {/* Examples */}
            <Tabs defaultValue="0" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto">
                    {examples.map((example, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                            {example.title}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {examples.map((example, index) => (
                    <TabsContent key={index} value={index.toString()} className="mt-6 space-y-4">
                        {example.description && (
                            <p className="text-sm text-muted-foreground">
                                {example.description}
                            </p>
                        )}

                        <div className="border border-border rounded-lg overflow-hidden bg-card">
                            <LiveProvider
                                code={example.code}
                                scope={scope}
                                theme={themes.vsDark}
                                language={example.language === 'tsx' || example.language === 'jsx' ? 'tsx' : 'typescript'}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-border">
                                    {/* Preview Area */}
                                    <div className="p-6 flex items-center justify-center min-h-[200px] bg-background/50">
                                        <LivePreview />
                                        <LiveError className="text-destructive text-sm p-4 bg-destructive/10 rounded" />
                                    </div>

                                    {/* Editor Area */}
                                    <div className="relative group bg-[#1e1e1e]">
                                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-white"
                                                onClick={() => copyCode(example.code, index)}
                                            >
                                                {copiedIndex === index ? (
                                                    <Check className="h-4 w-4" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            <LiveEditor
                                                className="font-mono text-sm"
                                                style={{
                                                    fontFamily: '"Fira Code", monospace',
                                                    fontSize: 14,
                                                    backgroundColor: 'transparent',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </LiveProvider>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
