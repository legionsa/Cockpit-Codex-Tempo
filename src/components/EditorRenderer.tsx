import React, { useEffect } from 'react';
import { EditorJSBlock } from '@/types/page';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { CodeTabs } from '@/components/CodeTabs';
import { FigmaEmbed } from '@/components/FigmaEmbed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

interface EditorRendererProps {
  blocks: EditorJSBlock[];
}

// Auto-detect language from code content
const detectLanguage = (code: string): string => {
  if (code.includes('import React') || code.includes('useState') || code.includes('useEffect')) return 'jsx';
  if (code.includes('interface ') || code.includes('type ') || code.includes(': string')) return 'typescript';
  if (code.includes('function') || code.includes('const ') || code.includes('let ')) return 'javascript';
  if (code.includes('def ') || code.includes('import ') && code.includes('from ')) return 'python';
  if (code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE')) return 'sql';
  if (code.includes('{') && code.includes('}') && code.includes(':')) return 'json';
  if (code.includes('class ') && code.includes('public ')) return 'java';
  if (code.includes('package ') || code.includes('func ')) return 'go';
  if (code.includes('fn ') || code.includes('let mut')) return 'rust';
  if (code.includes('.class') || code.includes('#id')) return 'css';
  if (code.includes('$') || code.includes('@include')) return 'scss';
  if (code.includes('npm ') || code.includes('git ')) return 'bash';
  return 'javascript';
};

export function EditorRenderer({ blocks }: EditorRendererProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [blocks]);

  const renderBlock = (block: EditorJSBlock, index: number) => {
    switch (block.type) {
      case 'header':
        const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        const headerClasses = {
          1: 'text-4xl font-bold mt-8 mb-4',
          2: 'text-3xl font-bold mt-6 mb-3',
          3: 'text-2xl font-semibold mt-5 mb-2',
          4: 'text-xl font-semibold mt-4 mb-2',
          5: 'text-lg font-semibold mt-3 mb-2',
          6: 'text-base font-semibold mt-2 mb-1'
        };
        return (
          <HeaderTag key={index} className={headerClasses[block.data.level as keyof typeof headerClasses]}>
            {block.data.text}
          </HeaderTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="mb-4 leading-7" dangerouslySetInnerHTML={{ __html: block.data.text }} />
        );

      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const listClass = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
        return (
          <ListTag key={index} className={`${listClass} ml-6 mb-4 space-y-2`}>
            {block.data.items.map((item: string, i: number) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ListTag>
        );

      case 'image':
        return (
          <figure key={index} className="my-6">
            <img 
              src={block.data.file?.url || block.data.url} 
              alt={block.data.caption || ''} 
              className="rounded-lg w-full"
            />
            {block.data.caption && (
              <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'code':
        const language = detectLanguage(block.data.code);
        return (
          <div key={index} className="my-4">
            <pre className="bg-[#2d2d2d] p-4 rounded-lg overflow-x-auto">
              <code className={`language-${language}`}>{block.data.code}</code>
            </pre>
          </div>
        );

      case 'raw':
        // HTML/Figma embed support
        return (
          <div key={index} className="my-6" dangerouslySetInnerHTML={{ __html: block.data.html }} />
        );

      case 'codeTabs':
        // Custom block for multi-language code examples
        return (
          <div key={index} className="my-6">
            <CodeTabs examples={block.data.examples || []} defaultLanguage={block.data.defaultLanguage} />
          </div>
        );

      case 'figmaEmbed':
        // Custom block for Figma embeds
        return (
          <FigmaEmbed
            key={index}
            url={block.data.url}
            title={block.data.title}
            height={block.data.height}
          />
        );

      case 'table':
        return (
          <div key={index} className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border">
              <tbody>
                {block.data.content?.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-border p-2" dangerouslySetInnerHTML={{ __html: cell }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'checklist':
        return (
          <ul key={index} className="space-y-2 mb-4">
            {block.data.items?.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  readOnly 
                  className="mt-1"
                />
                <span dangerouslySetInnerHTML={{ __html: item.text }} />
              </li>
            ))}
          </ul>
        );

      case 'quote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4">
            <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
            {block.data.caption && (
              <cite className="text-sm text-muted-foreground mt-2 block">— {block.data.caption}</cite>
            )}
          </blockquote>
        );

      case 'warning':
        return (
          <Alert key={index} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{block.data.title || 'Warning'}</strong>
              <p dangerouslySetInnerHTML={{ __html: block.data.message }} />
            </AlertDescription>
          </Alert>
        );

      case 'delimiter':
        return <hr key={index} className="my-8 border-border" />;

      case 'tabs':
        // Custom tabs block with theme-aware styling
        return (
          <div key={index} className="my-6">
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="bg-muted/50 border border-border">
                {block.data.tabs?.map((tab: any, tabIndex: number) => (
                  <TabsTrigger 
                    key={tabIndex} 
                    value={tabIndex.toString()}
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {block.data.tabs?.map((tab: any, tabIndex: number) => (
                <TabsContent key={tabIndex} value={tabIndex.toString()}>
                  <div 
                    className="p-4 border border-border rounded-lg bg-card text-card-foreground"
                    dangerouslySetInnerHTML={{ __html: tab.content }}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        );

      case 'icon':
        return (
          <div key={index} className="inline-flex items-center gap-2 my-2">
            <div 
              className="inline-block"
              style={{ 
                width: `${block.data.size || 24}px`, 
                height: `${block.data.size || 24}px`,
                color: block.data.color || 'currentColor'
              }}
              dangerouslySetInnerHTML={{ __html: block.data.svg }}
              aria-label={block.data.name}
              role={block.data.name ? 'img' : 'presentation'}
            />
            {block.data.name && (
              <span className="text-sm text-muted-foreground">
                {block.data.name}
              </span>
            )}
          </div>
        );

      case 'embed':
        if (block.data.service === 'figma' || block.data.source?.includes('figma.com')) {
          return (
            <FigmaEmbed
              key={index}
              url={block.data.embed || block.data.source}
              height={block.data.height || 450}
            />
          );
        }
        return (
          <div key={index} className="my-6 aspect-video">
            <iframe
              src={block.data.embed || block.data.source}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );

      default:
        return (
          <div key={index} className="bg-muted p-4 rounded mb-4">
            <p className="text-sm text-muted-foreground">Unsupported block type: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}