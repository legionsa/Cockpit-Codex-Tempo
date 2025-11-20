import React, { useState } from 'react';
import { CodeExample } from '@/types/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import Prism from 'prismjs';

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

    React.useEffect(() => {
        Prism.highlightAll();
    }, [examples]);

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
                <div className="relative">
                    <div className="absolute top-2 right-2">
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
                    <pre className="bg-[#2d2d2d] p-4 rounded-lg overflow-x-auto">
                        <code className="language-typescript">{importPath}</code>
                    </pre>
                </div>
            )}

            {/* Examples */}
            <Tabs defaultValue="0" className="w-full">
                <TabsList>
                    {examples.map((example, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                            {example.title}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {examples.map((example, index) => (
                    <TabsContent key={index} value={index.toString()} className="mt-4">
                        {example.description && (
                            <p className="text-sm text-muted-foreground mb-4">
                                {example.description}
                            </p>
                        )}

                        <div className="relative">
                            <div className="absolute top-2 right-2 z-10">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyCode(example.code, index)}
                                >
                                    {copiedIndex === index ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <pre className="bg-[#2d2d2d] p-4 rounded-lg overflow-x-auto">
                                <code className={`language-${example.language}`}>
                                    {example.code}
                                </code>
                            </pre>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
