import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeExample {
  language: string;
  code: string;
  label?: string;
}

interface CodeTabsProps {
  examples: CodeExample[];
  defaultLanguage?: string;
}

export function CodeTabs({ examples, defaultLanguage }: CodeTabsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const defaultTab = defaultLanguage || examples[0]?.language || 'react';

  const handleCopy = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (examples.length === 0) {
    return null;
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <div className="flex items-center justify-between mb-2">
        <TabsList>
          {examples.map((example) => (
            <TabsTrigger key={example.language} value={example.language}>
              {example.label || example.language}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {examples.map((example, index) => (
        <TabsContent key={example.language} value={example.language} className="relative">
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-2 top-2 z-10"
              onClick={() => handleCopy(example.code, index)}
            >
              {copiedIndex === index ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{example.code}</code>
            </pre>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
