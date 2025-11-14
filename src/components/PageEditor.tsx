import React, { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import Warning from '@editorjs/warning';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
// @ts-ignore
import RawTool from '@editorjs/raw';
import TabsTool from './editor-tools/TabsTool';
import IconTool from './editor-tools/IconTool';
import { IconLibraryModal } from './IconLibraryModal';
import { EditorJSContent } from '@/types/page';

interface PageEditorProps {
  content: EditorJSContent;
  onChange: (content: EditorJSContent) => void;
  readOnly?: boolean;
}

export function PageEditor({ content, onChange, readOnly = false }: PageEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const initialContentRef = useRef(content);
  const [showIconLibrary, setShowIconLibrary] = useState(false);
  const [iconCallback, setIconCallback] = useState<((icon: any) => void) | null>(null);

  useEffect(() => {
    const handleOpenIconLibrary = (e: any) => {
      setIconCallback(() => e.detail.callback);
      setShowIconLibrary(true);
    };

    window.addEventListener('openIconLibrary', handleOpenIconLibrary);
    return () => window.removeEventListener('openIconLibrary', handleOpenIconLibrary);
  }, []);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      readOnly,
      data: initialContentRef.current,
      placeholder: 'Start writing your documentation...',
      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2
          }
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            placeholder: 'Enter paragraph text'
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author'
          }
        },
        warning: {
          class: Warning,
          inlineToolbar: true,
          config: {
            titlePlaceholder: 'Title',
            messagePlaceholder: 'Message'
          }
        },
        delimiter: Delimiter,
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Enter code'
          }
        },
        raw: {
          class: RawTool,
          config: {
            placeholder: 'Enter HTML/Figma embed code'
          }
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              codesandbox: true,
              codepen: true,
              figma: {
                regex: /https?:\/\/(?:www\.)?figma\.com\/(file|proto)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/,
                embedUrl: 'https://www.figma.com/embed?embed_host=share&url=<%= remote_id %>',
                html: '<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" allowfullscreen></iframe>',
                height: 450,
                width: 800,
                id: (groups: string[]) => groups.join('/')
              }
            }
          }
        },
        image: {
          class: Image,
          config: {
            uploader: {
              uploadByFile(file: File) {
                return new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    resolve({
                      success: 1,
                      file: {
                        url: e.target?.result as string
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                });
              },
              uploadByUrl(url: string) {
                return Promise.resolve({
                  success: 1,
                  file: {
                    url
                  }
                });
              }
            },
            captionPlaceholder: 'Enter image caption',
            buttonContent: 'Select or paste image URL',
            types: 'image/*'
          }
        },
        tabs: {
          class: TabsTool
        },
        icon: {
          class: IconTool
        }
      },
      onChange: async () => {
        if (!readOnly && editorRef.current) {
          try {
            const outputData = await editorRef.current.save();
            onChange({
              time: Date.now(),
              blocks: outputData.blocks,
              version: outputData.version || '2.29.0'
            });
          } catch (error) {
            console.error('Error saving editor content:', error);
          }
        }
      },
      onReady: () => {
        setIsReady(true);
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        setIsReady(false);
      }
    };
  }, [readOnly]);

  return (
    <div className="bg-background">
      <div 
        ref={holderRef} 
        className="prose prose-slate dark:prose-invert max-w-none min-h-[400px] p-4 border border-border rounded-lg"
      />
      <IconLibraryModal
        open={showIconLibrary}
        onClose={() => setShowIconLibrary(false)}
        onSelectIcon={(icon) => {
          if (iconCallback) {
            iconCallback(icon);
          }
          setShowIconLibrary(false);
        }}
      />
    </div>
  );
}