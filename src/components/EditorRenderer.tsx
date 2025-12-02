import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import { EditorJSBlock } from '@/types/page';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { CodeTabs } from '@/components/CodeTabs';
import { FigmaEmbed } from '@/components/FigmaEmbed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropsTable } from '@/components/component-docs/PropsTable';
import { ComponentPreview } from '@/components/component-docs/ComponentPreview';
import { IconGalleryTabs } from '@/components/icon-explorer/IconGalleryTabs';
import { CopyButton } from '@/components/CopyButton';
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
        const sanitizedParagraph = DOMPurify.sanitize(block.data.text, {
          ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'mark', 'code', 'em', 'strong'],
          ALLOWED_ATTR: ['href', 'target', 'rel']
        });
        return (
          <p key={index} className="mb-4 leading-7" dangerouslySetInnerHTML={{ __html: sanitizedParagraph }} />
        );

      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const listClass = block.data.style === 'ordered' ? 'list-decimal' : 'list-disc';
        return (
          <ListTag key={index} className={`${listClass} ml-6 mb-4 space-y-2`}>
            {block.data.items.map((item: string, i: number) => {
              const sanitizedItem = DOMPurify.sanitize(item, {
                ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'mark', 'code', 'em', 'strong'],
                ALLOWED_ATTR: ['href', 'target', 'rel']
              });
              return <li key={i} dangerouslySetInnerHTML={{ __html: sanitizedItem }} />;
            })}
          </ListTag>
        );

      case 'image':
      case 'imageUpload': // Handle imageUpload blocks same as image
      case 'imageUrl': // Handle imageUrl blocks same as image
        // If it's an imageUrl block without a file/url (e.g. just the placeholder button), don't render anything
        if (block.type === 'imageUrl' && !block.data.file?.url && !block.data.url) {
          return null;
        }
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
          <div key={index} className="my-4 relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={block.data.code} className="text-gray-400 hover:text-white" />
            </div>
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

      case 'componentProps':
        return (
          <div key={index} className="my-6">
            <PropsTable props={block.data.props || []} />
          </div>
        );

      case 'codeExample':
        return (
          <div key={index} className="my-6">
            <ComponentPreview
              examples={block.data.examples || []}
              importPath={block.data.importPath}
            />
          </div>
        );

      case 'gallery':
        return (
          <div key={index} className="my-6">
            <IconGalleryTabs
              tabs={block.data.items?.length > 0 ? [{
                label: 'All',
                filter: 'all',
                icons: block.data.items
              }] : []}
            />
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

      case 'pageLink':
        const { style = 'horizontal', title, summary, slug } = block.data;
        // Construct the path based on slug - assuming flat structure or need full path lookup
        // For now, we'll link to /docs/{slug} or just /{slug} depending on routing
        // The storage.getBreadcrumbs logic suggests paths are built from slugs
        const linkPath = `/${slug}`;

        if (style === 'vertical') {
          return (
            <a href={linkPath} key={index} className="block my-6 no-underline group">
              <div className="border border-border rounded-lg overflow-hidden bg-card hover:border-primary transition-colors">
                <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </div>
                <div className="p-4">
                  <div className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{summary || 'No description'}</div>
                </div>
              </div>
            </a>
          );
        }

        if (style === 'horizontal') {
          return (
            <a href={linkPath} key={index} className="block my-4 no-underline group">
              <div className="flex h-[100px] border border-border rounded-lg overflow-hidden bg-card hover:border-primary transition-colors">
                <div className="w-[100px] bg-muted flex items-center justify-center text-muted-foreground shrink-0 border-r border-border">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                </div>
                <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                  <div className="font-semibold text-base text-foreground mb-1 group-hover:text-primary transition-colors">{title}</div>
                  <div className="text-sm text-muted-foreground truncate">{summary || 'No description'}</div>
                </div>
              </div>
            </a>
          );
        }

        // Minimal style
        return (
          <a href={linkPath} key={index} className="block my-2 no-underline group">
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card hover:bg-accent/50 hover:border-primary transition-colors">
              <div className="flex items-center justify-center w-6 h-6 text-muted-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{title}</div>
                <div className="text-xs text-muted-foreground">/{slug}</div>
              </div>
            </div>
          </a>
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